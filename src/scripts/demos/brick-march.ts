// A 2D slice of the voxel engine's ray walk (crates/vxe-render/src/shaders/
// walk.wgsl): a DDA over cells of several sizes, each skip aligned to its
// size. Empty 64-cells (a chunk), 16-cells (a group of 2×2 bricks), 8-cells
// (an all-air brick) and the 4- and 2-blocks inside a brick are crossed in
// one step each; only next to rock does the ray go voxel by voxel. The
// reader aims the rays and digs; the step counter compares the walk with
// skips against the same rays walked one voxel at a time.

import { hash, noise } from './voxel-noise';

const W = 128; // voxels across
const H = 80; // voxels down
const SIZES = [64, 16, 8, 4, 2] as const; // skip cells, largest first
const RAYS = 11;
const FOV = 0.9; // radians across the fan
const DIG_RADIUS = 5;

interface Labels {
  steps: string;
  perVoxel: string;
}

/** 0 air, 1 rock, 2 darker rock, 3 glowing ore. */
function generate(): Uint8Array {
  const g = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const n = noise(x, y, 18) * 0.65 + noise(x, y, 7) * 0.35;
      // A wide open hall on the right so whole chunks and brick groups are empty.
      const hall = Math.hypot((x - 80) / 40, (y - 40) / 26) < 1 ? -0.45 : 0;
      const edge = x < 2 || y < 2 || x >= W - 2 || y >= H - 2;
      if (edge || n + hall > 0.52) {
        const ore = hash(x >> 1, y >> 1) > 0.985;
        g[y * W + x] = ore ? 3 : noise(x, y, 5) > 0.5 ? 2 : 1;
      }
    }
  }
  // The camera's pocket and a tunnel from it into the hall.
  carve(g, 22, 40, 7);
  for (let x = 22; x <= 56; x += 2)
    carve(g, x, 40 + Math.round(Math.sin(x / 6) * 2), 4);
  return g;
}

function carve(g: Uint8Array, cx: number, cy: number, r: number): void {
  for (let y = Math.max(2, cy - r); y <= Math.min(H - 3, cy + r); y++) {
    for (let x = Math.max(2, cx - r); x <= Math.min(W - 3, cx + r); x++) {
      if (Math.hypot(x - cx, y - cy) <= r) g[y * W + x] = 0;
    }
  }
}

/** For each skip size, whether the aligned block at a voxel holds no rock. */
function emptiness(g: Uint8Array): Map<number, Uint8Array> {
  const out = new Map<number, Uint8Array>();
  for (const s of SIZES) {
    const bw = Math.ceil(W / s);
    const bh = Math.ceil(H / s);
    const e = new Uint8Array(bw * bh).fill(1);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (g[y * W + x]) e[Math.floor(y / s) * bw + Math.floor(x / s)] = 0;
      }
    }
    out.set(s, e);
  }
  return out;
}

interface Step {
  x: number;
  y: number;
  s: number;
}

/** Walk one ray; returns the cells stepped through and where it stopped. */
function walk(
  g: Uint8Array,
  empty: Map<number, Uint8Array>,
  ox: number,
  oy: number,
  dx: number,
  dy: number,
  skips: boolean,
): { steps: Step[]; hx: number; hy: number } {
  const steps: Step[] = [];
  let px = ox;
  let py = oy;
  for (let n = 0; n < 4096; n++) {
    const vx = Math.floor(px);
    const vy = Math.floor(py);
    if (vx < 0 || vy < 0 || vx >= W || vy >= H) break;
    if (g[vy * W + vx]) return { steps, hx: px, hy: py };
    let s = 1;
    if (skips) {
      for (const size of SIZES) {
        const bw = Math.ceil(W / size);
        if (
          empty.get(size)![Math.floor(vy / size) * bw + Math.floor(vx / size)]
        ) {
          s = size;
          break;
        }
      }
    }
    const x0 = Math.floor(vx / s) * s;
    const y0 = Math.floor(vy / s) * s;
    steps.push({ x: x0, y: y0, s });
    // Leave the aligned cell through its nearest wall along the ray.
    const tx = dx > 0 ? (x0 + s - px) / dx : dx < 0 ? (x0 - px) / dx : Infinity;
    const ty = dy > 0 ? (y0 + s - py) / dy : dy < 0 ? (y0 - py) / dy : Infinity;
    const t = Math.min(tx, ty) + 1e-4;
    px += dx * t;
    py += dy * t;
  }
  return { steps, hx: px, hy: py };
}

export function brickMarch(root: HTMLElement): void {
  const canvas = root.querySelector('canvas');
  const counter = root.querySelector<HTMLElement>('.bm-counter');
  const skipBox = root.querySelector<HTMLInputElement>('[data-act="skips"]');
  const digBtn = root.querySelector<HTMLButtonElement>('[data-act="dig"]');
  const resetBtn = root.querySelector<HTMLButtonElement>('[data-act="reset"]');
  const g2 = canvas?.getContext('2d');
  if (!canvas || !g2 || !counter || !skipBox || !digBtn || !resetBtn) {
    console.error('brick-march: the figure is missing a part', root);
    return;
  }
  const labels = JSON.parse(root.dataset.labels ?? '{}') as Labels;
  const px = canvas.width / W; // canvas pixels per voxel

  let grid = generate();
  let empty = emptiness(grid);
  const eye = { x: 22.5, y: 40.5 };
  let aim = 0;
  let pointer: { x: number; y: number } | null = null;
  let digging = false;
  let visible = false;
  let raf = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = (n: string) =>
    getComputedStyle(root).getPropertyValue(n).trim() || '#888';

  function rays(skips: boolean) {
    const out = [];
    for (let i = 0; i < RAYS; i++) {
      const a = aim + (i / (RAYS - 1) - 0.5) * FOV;
      out.push(
        walk(grid, empty, eye.x, eye.y, Math.cos(a), Math.sin(a), skips),
      );
    }
    return out;
  }

  function draw() {
    const skips = skipBox!.checked;
    const c = g2!;
    const rock = [
      css('--color-text-muted'),
      css('--color-text-secondary'),
      css('--viz-4'),
    ];
    c.fillStyle = css('--color-bg-secondary');
    c.fillRect(0, 0, canvas!.width, canvas!.height);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const m = grid[y * W + x];
        if (m) {
          c.fillStyle = rock[m - 1];
          c.fillRect(x * px, y * px, px, px);
        }
      }
    }
    // Brick lines every 8 voxels, chunk lines every 64.
    c.fillStyle = css('--viz-grid');
    for (let x = 8; x < W; x += 8)
      c.fillRect(x * px, 0, x % 64 ? 1 : 2, canvas!.height);
    for (let y = 8; y < H; y += 8)
      c.fillRect(0, y * px, canvas!.width, y % 64 ? 1 : 2);

    const fan = rays(skips);
    const ramp: Record<number, string> = {
      64: css('--viz-step-4'),
      16: css('--viz-step-3'),
      8: css('--viz-step-2'),
      4: css('--viz-step-1'),
      2: css('--viz-step-1'),
      1: css('--viz-2'),
    };
    c.lineWidth = 1;
    for (const r of fan) {
      for (const st of r.steps) {
        c.strokeStyle = ramp[st.s];
        c.strokeRect(
          st.x * px + 0.5,
          st.y * px + 0.5,
          st.s * px - 1,
          st.s * px - 1,
        );
      }
    }
    c.strokeStyle = css('--color-text-primary');
    c.lineWidth = 1.5;
    for (const r of fan) {
      c.beginPath();
      c.moveTo(eye.x * px, eye.y * px);
      c.lineTo(r.hx * px, r.hy * px);
      c.stroke();
      c.fillStyle = css('--viz-2');
      c.fillRect(r.hx * px - 3, r.hy * px - 3, 6, 6);
    }
    c.fillStyle = css('--color-text-primary');
    c.beginPath();
    c.arc(eye.x * px, eye.y * px, 5, 0, Math.PI * 2);
    c.fill();

    const n = fan.reduce((a, r) => a + r.steps.length, 0);
    const n1 = rays(false).reduce((a, r) => a + r.steps.length, 0);
    counter!.textContent = `${labels.steps}: ${n} · ${labels.perVoxel}: ${n1}`;
  }

  function digAt(x: number, y: number) {
    carve(grid, Math.round(x), Math.round(y), DIG_RADIUS);
    empty = emptiness(grid);
  }

  function toVoxel(e: PointerEvent) {
    const r = canvas!.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * W,
      y: ((e.clientY - r.top) / r.height) * H,
    };
  }

  function tick(now: number) {
    if (pointer) aim = Math.atan2(pointer.y - eye.y, pointer.x - eye.x);
    else if (!reduced) aim = Math.sin(now / 2600) * 0.75;
    draw();
    raf = requestAnimationFrame(tick);
  }

  function sync() {
    cancelAnimationFrame(raf);
    if (visible) raf = requestAnimationFrame(tick);
  }

  canvas.addEventListener('pointermove', (e) => {
    pointer = toVoxel(e);
    if (digging) digAt(pointer.x, pointer.y);
  });
  canvas.addEventListener('pointerleave', () => {
    pointer = null;
    digging = false;
  });
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    digging = true;
    pointer = toVoxel(e);
    digAt(pointer.x, pointer.y);
  });
  canvas.addEventListener('pointerup', () => (digging = false));
  canvas.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') aim -= 0.08;
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') aim += 0.08;
    else return;
    e.preventDefault();
    draw();
  });
  digBtn.addEventListener('click', () => {
    const mid = walk(
      grid,
      empty,
      eye.x,
      eye.y,
      Math.cos(aim),
      Math.sin(aim),
      true,
    );
    digAt(mid.hx, mid.hy);
    draw();
  });
  resetBtn.addEventListener('click', () => {
    grid = generate();
    empty = emptiness(grid);
    draw();
  });
  skipBox.addEventListener('change', draw);

  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    sync();
  }).observe(root);
  window.addEventListener('pagehide', () => cancelAnimationFrame(raf));
  draw();
}
