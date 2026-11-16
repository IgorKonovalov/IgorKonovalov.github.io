// A 2D slice of how the voxel engine keeps a world around the camera: chunks
// near it at full detail, further ones only as coarser copies (mips), and
// nothing at all beyond. A mip cell stands for 2, 4 or 8 voxels a side; it is
// solid if any voxel under it is, and takes the most common material, as in
// crates/vxe-world/src/mips.rs. The reader moves the camera with the pointer
// or the arrow keys; the counter compares the cells kept with a world kept
// at full detail everywhere.
import { hash, noise, rgbOf } from './voxel-noise';

const W = 384; // voxels across
const H = 192; // voxels down
const CHUNK = 16; // voxels a chunk side in the slice (64 in the engine)
const CW = W / CHUNK;
const CH = H / CHUNK;
/** Outer radius, in chunks, of each detail level: full, then mips 1–3. */
const RINGS = [3, 4.5, 6, 7.5] as const;

interface Labels {
  kept: string;
  full: string;
}

function generate(): Uint8Array {
  const g = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const n = noise(x, y, 26) * 0.6 + noise(x + 999, y, 9) * 0.4;
      if (n > 0.5 || y >= H - 3) {
        const ore = noise(x, y + 500, 4) > 0.86;
        const crystal = !ore && hash(x >> 2, y >> 2) > 0.992;
        g[y * W + x] = crystal ? 4 : ore ? 3 : noise(x, y, 6) > 0.55 ? 2 : 1;
      }
    }
  }
  return g;
}

/** Mip level L of the whole world: cells of 2^L voxels, any-solid, majority material. */
function mip(g: Uint8Array, level: number): Uint8Array {
  const s = 1 << level;
  const mw = W / s;
  const out = new Uint8Array(mw * (H / s));
  const count = new Uint8Array(5);
  for (let my = 0; my < H / s; my++) {
    for (let mx = 0; mx < mw; mx++) {
      count.fill(0);
      for (let y = my * s; y < my * s + s; y++) {
        for (let x = mx * s; x < mx * s + s; x++) count[g[y * W + x]]++;
      }
      let best = 0;
      for (let m = 1; m < 5; m++)
        if (count[m] > count[best] || best === 0) best = count[m] ? m : best;
      out[my * mw + mx] = best;
    }
  }
  return out;
}

export function mipRing(root: HTMLElement): void {
  const canvas = root.querySelector('canvas');
  const counter = root.querySelector<HTMLElement>('.mr-counter');
  const ringsBox = root.querySelector<HTMLInputElement>('[data-act="rings"]');
  const g2 = canvas?.getContext('2d');
  if (!canvas || !g2 || !counter || !ringsBox) {
    console.error('mip-ring: the figure is missing a part', root);
    return;
  }
  const labels = JSON.parse(root.dataset.labels ?? '{}') as Labels;
  const world = generate();
  const levels = [world, mip(world, 1), mip(world, 2), mip(world, 3)];
  const off = document.createElement('canvas');
  off.width = W;
  off.height = H;
  const oc = off.getContext('2d')!;
  const img = oc.createImageData(W, H);
  const cam = { x: W / 2, y: H / 2 };
  let pointer = false;
  let visible = false;
  let raf = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = (n: string) =>
    getComputedStyle(root).getPropertyValue(n).trim() || '#888';

  /** Detail level of a chunk by its distance from the camera; -1 not kept. */
  function levelOf(cx: number, cy: number): number {
    const d = Math.hypot(cx + 0.5 - cam.x / CHUNK, cy + 0.5 - cam.y / CHUNK);
    return RINGS.findIndex((r) => d <= r);
  }

  // Theme colours, read once and again when the theme changes, not per frame.
  let pal: [number, number, number][] = [];
  let gone: [number, number, number] = [0, 0, 0];
  let ramp: string[] = [];
  let ink = '#000';
  function readTheme() {
    pal = [
      '--color-bg-secondary',
      '--color-text-muted',
      '--color-text-secondary',
      '--viz-4',
      '--viz-3',
    ].map((n) => rgbOf(css(n)));
    gone = rgbOf(css('--color-bg-primary'));
    ramp = ['--viz-2', '--viz-step-3', '--viz-step-2', '--viz-step-1'].map(css);
    ink = css('--color-text-primary');
  }

  function draw() {
    let kept = 0;
    const d = img.data;
    const lv: number[] = [];
    for (let cy = 0; cy < CH; cy++) {
      for (let cx = 0; cx < CW; cx++) {
        const L = levelOf(cx, cy);
        lv.push(L);
        if (L >= 0) kept += (CHUNK >> L) ** 2;
      }
    }
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const L = lv[Math.floor(y / CHUNK) * CW + Math.floor(x / CHUNK)];
        let c = gone;
        if (L >= 0) {
          const m = levels[L][(y >> L) * (W >> L) + (x >> L)];
          c = pal[m];
        }
        const i = (y * W + x) * 4;
        d[i] = c[0];
        d[i + 1] = c[1];
        d[i + 2] = c[2];
        d[i + 3] = 255;
      }
    }
    oc.putImageData(img, 0, 0);
    const c = g2!;
    const k = canvas!.width / W;
    c.imageSmoothingEnabled = false;
    c.drawImage(off, 0, 0, canvas!.width, canvas!.height);
    if (ringsBox!.checked) {
      c.lineWidth = 2;
      for (let cy = 0; cy < CH; cy++) {
        for (let cx = 0; cx < CW; cx++) {
          const L = lv[cy * CW + cx];
          if (L < 0) continue;
          c.strokeStyle = ramp[L];
          c.strokeRect(
            cx * CHUNK * k + 2,
            cy * CHUNK * k + 2,
            CHUNK * k - 4,
            CHUNK * k - 4,
          );
        }
      }
    }
    c.fillStyle = ink;
    c.beginPath();
    c.arc(cam.x * k, cam.y * k, 7, 0, Math.PI * 2);
    c.fill();
    const fmt = (n: number) =>
      n.toLocaleString(root.dataset.lang === 'ru' ? 'ru-RU' : 'en-US');
    const near = lv.filter((L) => L >= 0).length * CHUNK * CHUNK;
    counter!.textContent = `${labels.kept}: ${fmt(kept)} · ${labels.full}: ${fmt(near)}`;
  }

  function tick(now: number) {
    if (!pointer && !reduced) {
      cam.x = W / 2 + Math.sin(now / 5200) * W * 0.3;
      cam.y = H / 2 + Math.sin(now / 3700) * H * 0.22;
    }
    draw();
    raf = requestAnimationFrame(tick);
  }

  function sync() {
    cancelAnimationFrame(raf);
    if (visible) raf = requestAnimationFrame(tick);
  }

  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    pointer = true;
    cam.x = ((e.clientX - r.left) / r.width) * W;
    cam.y = ((e.clientY - r.top) / r.height) * H;
  });
  canvas.addEventListener('pointerleave', () => (pointer = false));
  canvas.addEventListener('keydown', (e) => {
    const step = CHUNK / 2;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const m = moves[e.key];
    if (!m) return;
    e.preventDefault();
    pointer = true;
    cam.x = Math.min(W, Math.max(0, cam.x + m[0]));
    cam.y = Math.min(H, Math.max(0, cam.y + m[1]));
    draw();
  });
  canvas.addEventListener('blur', () => (pointer = false));
  ringsBox.addEventListener('change', draw);
  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    sync();
  }).observe(root);
  const retheme = () => {
    readTheme();
    draw();
  };
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', retheme);
  new MutationObserver(retheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class'],
  });
  window.addEventListener('pagehide', () => cancelAnimationFrame(raf));
  readTheme();
  draw();
}
