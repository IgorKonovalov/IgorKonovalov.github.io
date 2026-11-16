// Plays the voxel engine's spider walk clip from its keyframes, seen from
// above, as chunky pixels. The sampling mirrors the engine: keys are linear
// between them, the simulation samples whole ticks, and the display either
// shows the last whole tick or blends between two (DisplayPose::between).
import {
  SPIDER_LEGS,
  SPIDER_RATE,
  SPIDER_WALK_TICKS,
  type LegKey,
} from '../../data/voxelSpider';

interface Labels {
  play: string;
  resume: string;
  slow: string;
  fast: string;
}

/** Linear sample of a looping key list at a (possibly fractional) tick. */
function sample(keys: readonly LegKey[], tick: number): [number, number] {
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, z0, y0] = keys[i];
    const [t1, z1, y1] = keys[i + 1];
    if (tick >= t0 && tick <= t1) {
      const f = (tick - t0) / (t1 - t0);
      return [z0 + (z1 - z0) * f, y0 + (y1 - y0) * f];
    }
  }
  const last = keys[keys.length - 1];
  return [last[1], last[2]];
}

/** A thick pixel line: square dabs along the segment, on whole pixels. */
function line(
  g: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  w: number,
) {
  const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0));
  for (let i = 0; i <= n; i++) {
    const f = n === 0 ? 0 : i / n;
    const x = Math.round(x0 + (x1 - x0) * f - w / 2);
    const y = Math.round(y0 + (y1 - y0) * f - w / 2);
    g.fillRect(x, y, w, w);
  }
}

export function spiderWalk(root: HTMLElement): void {
  const canvas = root.querySelector('canvas');
  const readout = root.querySelector<HTMLElement>('.sw-readout');
  const playBtn = root.querySelector<HTMLButtonElement>('[data-act="play"]');
  const slowBtn = root.querySelector<HTMLButtonElement>('[data-act="slow"]');
  const blendBox = root.querySelector<HTMLInputElement>('[data-act="blend"]');
  const scrub = root.querySelector<HTMLInputElement>('[data-act="tick"]');
  const g = canvas?.getContext('2d');
  if (
    !canvas ||
    !g ||
    !readout ||
    !playBtn ||
    !slowBtn ||
    !blendBox ||
    !scrub
  ) {
    console.error('spider-walk: the figure is missing a part', root);
    return;
  }
  const labels = JSON.parse(root.dataset.labels ?? '{}') as Labels;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let playing = !reduced;
  let visible = false;
  let speed = 1;
  let tick = 0;
  let last = 0;
  let raf = 0;

  const css = (name: string) =>
    getComputedStyle(root).getPropertyValue(name).trim() || '#888';

  function draw() {
    const shown = blendBox!.checked ? tick : Math.floor(tick);
    const W = canvas!.width;
    const H = canvas!.height;
    const cx = W / 2;
    const cy = H / 2 + 6;
    const s = 1.1; // canvas pixels per model voxel
    const ground = css('--color-text-secondary');
    const lifted = css('--viz-2');
    const shadow = css('--color-border-hover');
    const body = css('--color-text-primary');
    const eye = css('--viz-4');
    g!.clearRect(0, 0, W, H);

    const lines: string[] = [];
    // Shadows first so every leg draws over every shadow.
    const legs = SPIDER_LEGS.map((leg) => {
      const [rz, ry] = sample(leg.keys, shown);
      lines.push(
        `${leg.name.slice(4)}  ${rz.toFixed(1).padStart(6)}  ${ry.toFixed(1).padStart(6)}`,
      );
      // Rest pose points the leg straight out to its side; rot z turns it
      // about the vertical axis. Front is up on the canvas.
      const a = (rz * Math.PI) / 180;
      const dx = leg.side * Math.cos(a);
      const dy = leg.side * Math.sin(a);
      const hx = cx + leg.hip[0] * s;
      const hy = cy + leg.hip[1] * s;
      const len = leg.length * s * Math.cos((ry * Math.PI) / 180);
      const lift = Math.abs(ry) / 14; // 0 planted .. 1 highest key in the clip
      return { hx, hy, fx: hx + dx * len, fy: hy + dy * len, lift };
    });
    g!.fillStyle = shadow;
    for (const l of legs) {
      if (l.lift > 0.05) {
        const o = 2 + l.lift * 5;
        line(g!, l.hx + o / 2, l.hy + o / 2, l.fx + o, l.fy + o, 3);
      }
    }
    for (const l of legs) {
      g!.fillStyle = l.lift > 0.05 ? lifted : ground;
      line(g!, l.hx, l.hy, l.fx, l.fy, 3);
      if (l.lift <= 0.05)
        g!.fillRect(Math.round(l.fx) - 2, Math.round(l.fy) - 2, 5, 5);
    }

    // Body (front) and abdomen (back) as pixel blobs.
    g!.fillStyle = body;
    for (const [bx, by, r] of [
      [0, -2, 11],
      [0, 20, 15],
    ]) {
      for (let y = -r; y <= r; y++) {
        const w = Math.round(Math.sqrt(r * r - y * y) * 0.8);
        g!.fillRect(Math.round(cx + bx - w), Math.round(cy + by + y), w * 2, 1);
      }
    }
    g!.fillStyle = eye;
    g!.fillRect(Math.round(cx - 4), Math.round(cy - 12), 2, 2);
    g!.fillRect(Math.round(cx + 2), Math.round(cy - 12), 2, 2);

    readout!.textContent = `tick ${shown.toFixed(2)} / ${SPIDER_WALK_TICKS}\n\nleg   rot z   rot y\n${lines.join('\n')}`;
    scrub!.value = String(tick);
  }

  function frame(now: number) {
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    tick = (tick + dt * SPIDER_RATE * speed) % SPIDER_WALK_TICKS;
    draw();
    raf = requestAnimationFrame(frame);
  }

  function sync() {
    cancelAnimationFrame(raf);
    last = 0;
    if (playing && visible) raf = requestAnimationFrame(frame);
    playBtn!.textContent = playing ? labels.play : labels.resume;
    playBtn!.setAttribute('aria-pressed', String(!playing));
  }

  playBtn.addEventListener('click', () => {
    playing = !playing;
    sync();
  });
  slowBtn.addEventListener('click', () => {
    speed = speed === 1 ? 0.25 : 1;
    slowBtn.textContent = speed === 1 ? labels.slow : labels.fast;
  });
  blendBox.addEventListener('change', draw);
  scrub.addEventListener('input', () => {
    playing = false;
    tick = Number(scrub.value) % SPIDER_WALK_TICKS;
    sync();
    draw();
  });

  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    sync();
  }).observe(root);
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', draw);
  new MutationObserver(draw).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class'],
  });
  window.addEventListener('pagehide', () => cancelAnimationFrame(raf));
  sync();
  draw();
}
