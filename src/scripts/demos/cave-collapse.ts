// A 2D slice of digging in the voxel engine: a dig removes a disc of voxels
// and reports how many of each material it took (the engine's edit result),
// then every piece of rock no longer connected to the floor or the walls
// drops as one rigid body until it lands. The reader digs with the pointer,
// or moves a cursor with the arrow keys and digs with Enter or Space.
import { hash, noise, rgbOf } from './voxel-noise';

const W = 160;
const H = 100;
const RADIUS = 4;
const FALL_MS = 28; // one voxel of fall per step

interface Labels {
  last: string;
  fell: string;
  materials: string[];
  none: string;
}

/** 0 air, 1 rock, 2 dark rock, 3 ore, 4 crystal. */
function generate(): Uint8Array {
  const g = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const n = noise(x, y, 16) * 0.6 + noise(x + 300, y, 6) * 0.4;
      const open = y > 12 && y < H - 14 && n < 0.56;
      if (!open || x < 3 || x >= W - 3 || y >= H - 4) {
        const ore = noise(x + 77, y, 5) > 0.9;
        const crystal = !ore && hash(x >> 1, y >> 1) > 0.985;
        g[y * W + x] = crystal ? 4 : ore ? 3 : noise(x, y, 7) > 0.55 ? 2 : 1;
      }
    }
  }
  return g;
}

/** Solid voxels that reach the floor or a side wall through solid neighbours. */
function supported(g: Uint8Array): Uint8Array {
  const s = new Uint8Array(W * H);
  const stack: number[] = [];
  for (let i = 0; i < W * H; i++) {
    const x = i % W;
    const y = (i / W) | 0;
    if (g[i] && (y === H - 1 || x === 0 || x === W - 1)) {
      s[i] = 1;
      stack.push(i);
    }
  }
  while (stack.length) {
    const i = stack.pop()!;
    const x = i % W;
    for (const j of [
      i - W,
      i + W,
      x > 0 ? i - 1 : -1,
      x < W - 1 ? i + 1 : -1,
    ]) {
      if (j >= 0 && j < W * H && g[j] && !s[j]) {
        s[j] = 1;
        stack.push(j);
      }
    }
  }
  return s;
}

/** Unsupported voxels split into connected bodies, each a list of indices. */
function bodies(g: Uint8Array): number[][] {
  const s = supported(g);
  const seen = new Uint8Array(W * H);
  const out: number[][] = [];
  for (let i = 0; i < W * H; i++) {
    if (!g[i] || s[i] || seen[i]) continue;
    const body: number[] = [];
    const stack = [i];
    seen[i] = 1;
    while (stack.length) {
      const k = stack.pop()!;
      body.push(k);
      const x = k % W;
      for (const j of [
        k - W,
        k + W,
        x > 0 ? k - 1 : -1,
        x < W - 1 ? k + 1 : -1,
      ]) {
        if (j >= 0 && j < W * H && g[j] && !s[j] && !seen[j]) {
          seen[j] = 1;
          stack.push(j);
        }
      }
    }
    out.push(body);
  }
  return out;
}

export function caveCollapse(root: HTMLElement): void {
  const canvas = root.querySelector('canvas');
  const counter = root.querySelector<HTMLElement>('.cc-counter');
  const resetBtn = root.querySelector<HTMLButtonElement>('[data-act="reset"]');
  const g2 = canvas?.getContext('2d');
  if (!canvas || !g2 || !counter || !resetBtn) {
    console.error('cave-collapse: the figure is missing a part', root);
    return;
  }
  const labels = JSON.parse(root.dataset.labels ?? '{}') as Labels;
  const off = document.createElement('canvas');
  off.width = W;
  off.height = H;
  const oc = off.getContext('2d')!;
  const img = oc.createImageData(W, H);
  let grid = generate();
  let falling: number[][] = [];
  let fellTotal = 0;
  let cursor: { x: number; y: number } | null = null;
  let digging = false;
  let last = 0;
  // What the current stroke (a click or one drag) has taken, per material.
  let taken = [0, 0, 0, 0, 0];
  let raf = 0;
  let pal: [number, number, number][] = [];
  const css = (n: string) =>
    getComputedStyle(root).getPropertyValue(n).trim() || '#888';
  const readTheme = () => {
    pal = [
      '--color-bg-secondary',
      '--color-text-muted',
      '--color-text-secondary',
      '--viz-4',
      '--viz-3',
    ].map((n) => rgbOf(css(n)));
  };

  // The generated cave has loose pieces of its own; settle them first.
  function settleNow() {
    for (let guard = 0; guard < H; guard++) {
      falling = bodies(grid);
      if (!falling.length) break;
      while (falling.length) step();
    }
    fellTotal = 0;
  }

  /** Move every falling body down one voxel, lowest first; a blocked one lands. */
  function step() {
    falling.sort((a, b) => Math.max(...b) - Math.max(...a));
    const still: number[][] = [];
    for (const body of falling) {
      const mats = body.map((i) => grid[i]);
      for (const i of body) grid[i] = 0;
      const free = body.every((i) => i + W < W * H && !grid[i + W]);
      const moved = free ? body.map((i) => i + W) : body;
      moved.forEach((i, k) => (grid[i] = mats[k]));
      if (free) {
        fellTotal += body.length;
        still.push(moved);
      }
    }
    falling = still;
  }

  /** Start a new stroke: the counter then sums everything until the next one. */
  function newStroke() {
    taken = [0, 0, 0, 0, 0];
    fellTotal = 0;
  }

  function dig(cx: number, cy: number) {
    for (
      let y = Math.max(0, cy - RADIUS);
      y <= Math.min(H - 2, cy + RADIUS);
      y++
    ) {
      for (
        let x = Math.max(1, cx - RADIUS);
        x <= Math.min(W - 2, cx + RADIUS);
        x++
      ) {
        const i = y * W + x;
        if (grid[i] && Math.hypot(x - cx, y - cy) <= RADIUS) {
          taken[grid[i]]++;
          grid[i] = 0;
        }
      }
    }
    falling = bodies(grid);
    const parts = taken
      .map((n, m) => (m && n ? `${labels.materials[m - 1]} ${n}` : ''))
      .filter(Boolean);
    counter!.dataset.taken = parts.length ? parts.join(' · ') : labels.none;
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function draw() {
    const d = img.data;
    for (let i = 0; i < W * H; i++) {
      const c = pal[grid[i]];
      d[i * 4] = c[0];
      d[i * 4 + 1] = c[1];
      d[i * 4 + 2] = c[2];
      d[i * 4 + 3] = 255;
    }
    oc.putImageData(img, 0, 0);
    const k = canvas!.width / W;
    g2!.imageSmoothingEnabled = false;
    g2!.drawImage(off, 0, 0, canvas!.width, canvas!.height);
    if (cursor) {
      g2!.strokeStyle = css('--viz-2');
      g2!.lineWidth = 2;
      g2!.beginPath();
      g2!.arc(
        (cursor.x + 0.5) * k,
        (cursor.y + 0.5) * k,
        RADIUS * k,
        0,
        Math.PI * 2,
      );
      g2!.stroke();
    }
    counter!.textContent = `${labels.last}: ${counter!.dataset.taken ?? labels.none} · ${labels.fell}: ${fellTotal}`;
  }

  function frame(now: number) {
    if (now - last >= FALL_MS && falling.length) {
      last = now;
      step();
    }
    draw();
    raf = falling.length || digging ? requestAnimationFrame(frame) : 0;
  }

  function toVoxel(e: PointerEvent) {
    const r = canvas!.getBoundingClientRect();
    return {
      x: Math.floor(((e.clientX - r.left) / r.width) * W),
      y: Math.floor(((e.clientY - r.top) / r.height) * H),
    };
  }

  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    digging = true;
    cursor = toVoxel(e);
    newStroke();
    dig(cursor.x, cursor.y);
  });
  canvas.addEventListener('pointermove', (e) => {
    cursor = toVoxel(e);
    if (digging) dig(cursor.x, cursor.y);
    else if (!raf) draw();
  });
  canvas.addEventListener('pointerup', () => (digging = false));
  canvas.addEventListener('pointerleave', () => {
    digging = false;
    cursor = null;
    if (!raf) draw();
  });
  canvas.addEventListener('keydown', (e) => {
    cursor ??= { x: W >> 1, y: H >> 1 };
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-2, 0],
      ArrowRight: [2, 0],
      ArrowUp: [0, -2],
      ArrowDown: [0, 2],
    };
    if (moves[e.key]) {
      cursor.x = Math.min(W - 1, Math.max(0, cursor.x + moves[e.key][0]));
      cursor.y = Math.min(H - 1, Math.max(0, cursor.y + moves[e.key][1]));
    } else if (e.key === 'Enter' || e.key === ' ') {
      newStroke();
      dig(cursor.x, cursor.y);
    } else return;
    e.preventDefault();
    if (!raf) draw();
  });
  resetBtn.addEventListener('click', () => {
    grid = generate();
    settleNow();
    delete counter.dataset.taken;
    draw();
  });
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
  settleNow();
  draw();
}
