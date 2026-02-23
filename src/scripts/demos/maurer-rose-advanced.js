// Maurer Rose Advanced - Inline Demo
// Ported from CodePen version with dat.GUI replaced by native controls

import { GIFEncoder, quantize, applyPalette } from 'gifenc';

const canvas = document.getElementById('mra-canvas');
const cx = canvas.getContext('2d');
const container = canvas.parentElement;
const demoEl = canvas.closest('.mra-demo');

const settings = {
  n: 2,
  d: 20,
  maurer: 71,
  size: 250,
  rotate: 0,
  gg: 0,
  drawMaurer: true,
  colorize: false,
  drawRose: false,
};

let xStart, yStart;
let animationId = null;
let isPlaying = false;

// Pan & zoom state
let panX = 0;
let panY = 0;
let zoom = 1;

// ── Controls ─────────────────────────────────────────────────────────

const controls = {
  n: document.getElementById('mra-n'),
  d: document.getElementById('mra-d'),
  maurer: document.getElementById('mra-maurer'),
  size: document.getElementById('mra-size'),
  rotate: document.getElementById('mra-rotate'),
  gg: document.getElementById('mra-gg'),
  drawMaurer: document.getElementById('mra-draw-maurer'),
  colorize: document.getElementById('mra-colorize'),
  drawRose: document.getElementById('mra-draw-rose'),
  playPause: document.getElementById('mra-play-pause'),
  randomize: document.getElementById('mra-randomize'),
  save: document.getElementById('mra-save'),
  resetView: document.getElementById('mra-reset-view'),
  fullscreen: document.getElementById('mra-fullscreen'),
};

// Value display elements
const valueEls = {
  n: document.getElementById('mra-n-val'),
  d: document.getElementById('mra-d-val'),
  maurer: document.getElementById('mra-maurer-val'),
  size: document.getElementById('mra-size-val'),
  rotate: document.getElementById('mra-rotate-val'),
  gg: document.getElementById('mra-gg-val'),
};

// ── Canvas Sizing ────────────────────────────────────────────────────

function resizeCanvas() {
  const w = container.clientWidth;
  const isFs = document.fullscreenElement === demoEl;
  const h = isFs ? container.clientHeight : w;
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  xStart = w / 2;
  yStart = h / 2;

  // Scale size setting based on canvas
  const minDim = Math.min(w, h);
  if (settings.size > minDim / 2) {
    settings.size = Math.floor(minDim / 2.5);
    controls.size.value = settings.size;
  }

  draw();
}

// ── Draw ─────────────────────────────────────────────────────────────

function renderFrame(ctx, width, height, params) {
  const {
    n,
    d,
    maurer,
    size,
    rotate,
    gg,
    drawMaurer,
    colorize,
    drawRose,
    panX: px,
    panY: py,
    zoom: z,
  } = params;

  const k = n / d;
  ctx.clearRect(0, 0, width, height);

  const cx0 = width / 2 + px;
  const cy0 = height / 2 + py;
  const scaledSize = size * z;

  let xPrev, yPrev;

  // Draw Maurer lines
  if (drawMaurer) {
    for (let i = 0; i <= 3600; i++) {
      if (colorize) {
        ctx.strokeStyle = `hsl(${i / 10}, 100%, 50%)`;
      } else {
        ctx.strokeStyle = 'white';
      }
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      const fi = (maurer * i * Math.PI) / 180;
      const r = Math.sin(-k * fi - rotate) * scaledSize + Math.round(gg) * z;
      const x = cx0 + r * Math.cos(fi);
      const y = cy0 + r * Math.sin(fi);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.moveTo(xPrev, yPrev);
      }
      xPrev = x;
      yPrev = y;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }

  // Draw rose
  if (drawRose) {
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 0.1;
    for (let a = 0; a < 3600 * Math.ceil(d); a++) {
      const deg = (a * Math.PI) / 180;
      const r = Math.sin(-k * deg - rotate) * scaledSize + Math.round(gg) * z;
      const x = cx0 + r * Math.cos(deg);
      const y = cy0 + r * Math.sin(deg);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function draw() {
  renderFrame(cx, canvas.width, canvas.height, {
    ...settings,
    panX,
    panY,
    zoom,
  });
}

// ── Sync Controls ←→ Settings ────────────────────────────────────────

function syncFromControls() {
  settings.n = parseFloat(controls.n.value);
  settings.d = parseFloat(controls.d.value);
  settings.maurer = parseFloat(controls.maurer.value);
  settings.size = parseFloat(controls.size.value);
  settings.rotate = parseFloat(controls.rotate.value);
  settings.gg = parseFloat(controls.gg.value);
  settings.drawMaurer = controls.drawMaurer.checked;
  settings.colorize = controls.colorize.checked;
  settings.drawRose = controls.drawRose.checked;
  updateValueDisplays();
  draw();
}

function syncToControls() {
  controls.n.value = settings.n;
  controls.d.value = settings.d;
  controls.maurer.value = settings.maurer;
  controls.size.value = settings.size;
  controls.rotate.value = settings.rotate;
  controls.gg.value = settings.gg;
  controls.drawMaurer.checked = settings.drawMaurer;
  controls.colorize.checked = settings.colorize;
  controls.drawRose.checked = settings.drawRose;
  updateValueDisplays();
}

function updateValueDisplays() {
  valueEls.n.textContent = parseFloat(controls.n.value).toFixed(2);
  valueEls.d.textContent = parseFloat(controls.d.value).toFixed(2);
  valueEls.maurer.textContent = Math.round(parseFloat(controls.maurer.value));
  valueEls.size.textContent = Math.round(parseFloat(controls.size.value));
  valueEls.rotate.textContent = parseFloat(controls.rotate.value).toFixed(2);
  valueEls.gg.textContent = Math.round(parseFloat(controls.gg.value));
}

// Bind range slider events
const rangeControls = ['n', 'd', 'maurer', 'size', 'rotate', 'gg'];
rangeControls.forEach((key) => {
  controls[key].addEventListener('input', syncFromControls);
});

// Bind checkbox events
['drawMaurer', 'colorize', 'drawRose'].forEach((key) => {
  controls[key].addEventListener('change', syncFromControls);
});

// ── Parameter History (for GIF recording) ───────────────────────────

const HISTORY_SECONDS = 10;
const HISTORY_MAX = HISTORY_SECONDS * 60; // ~600 frames at 60fps
const paramHistory = [];
let historyIdx = 0;

function recordParams() {
  const snapshot = {
    n: settings.n,
    d: settings.d,
    maurer: settings.maurer,
    size: settings.size,
    rotate: settings.rotate,
    gg: settings.gg,
    drawMaurer: settings.drawMaurer,
    colorize: settings.colorize,
    drawRose: settings.drawRose,
    panX,
    panY,
    zoom,
  };
  if (paramHistory.length < HISTORY_MAX) {
    paramHistory.push(snapshot);
  } else {
    paramHistory[historyIdx] = snapshot;
  }
  historyIdx = (historyIdx + 1) % HISTORY_MAX;
}

// ── Animation ────────────────────────────────────────────────────────

function animate() {
  recordParams();

  settings.n += 0.000005;
  settings.d += 0.000005;
  settings.maurer += 0.000005;

  if (settings.n > 20) {
    settings.n = 0;
    settings.d = 0;
    settings.maurer = 0;
  }

  syncToControls();
  draw();
  animationId = requestAnimationFrame(animate);
}

controls.playPause.addEventListener('click', () => {
  if (isPlaying) {
    cancelAnimationFrame(animationId);
    isPlaying = false;
    controls.playPause.textContent = 'Play';
  } else {
    isPlaying = true;
    controls.playPause.textContent = 'Pause';
    animate();
  }
});

// ── Randomize ────────────────────────────────────────────────────────

controls.randomize.addEventListener('click', () => {
  const maxSize = Math.floor(canvas.width / 2);
  Object.assign(settings, {
    n: Math.random() * 20,
    d: Math.random() * 30,
    maurer: Math.random() * 360,
    size: Math.random() * maxSize,
    gg: Math.random() * Math.floor(maxSize / 2),
  });
  panX = 0;
  panY = 0;
  zoom = 1;
  syncToControls();
  draw();
});

// ── Save PNG ─────────────────────────────────────────────────────────

controls.save.addEventListener('click', () => {
  const link = document.createElement('a');
  const now = new Date();
  const timeString = now.toISOString().replace(/[:.]/g, '-');
  link.download = `Maurer_Rose_${timeString}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// ── Save GIF ────────────────────────────────────────────────────────

const GIF_FPS = 15;
const GIF_SIZE = 480;
const GIF_DELAY = Math.round(1000 / GIF_FPS);
const SUBSAMPLE = Math.round(60 / GIF_FPS); // every 4th frame

const saveGifBtn = document.getElementById('mra-save-gif');
const gifProgressEl = document.getElementById('mra-gif-progress');
const gifProgressText = document.getElementById('mra-gif-progress-text');
const gifProgressBar = document.getElementById('mra-gif-progress-bar');

let isEncodingGif = false;

saveGifBtn.addEventListener('click', () => {
  if (isEncodingGif || paramHistory.length === 0) return;
  encodeGif();
});

async function encodeGif() {
  isEncodingGif = true;
  saveGifBtn.disabled = true;
  saveGifBtn.textContent = 'Encoding...';
  gifProgressEl.hidden = false;

  try {
    // Extract frames in chronological order, subsampled
    const frames = [];
    const total = paramHistory.length;
    if (total < HISTORY_MAX) {
      for (let i = 0; i < total; i += SUBSAMPLE) frames.push(paramHistory[i]);
    } else {
      for (let i = 0; i < HISTORY_MAX; i += SUBSAMPLE) {
        frames.push(paramHistory[(historyIdx + i) % HISTORY_MAX]);
      }
    }

    // Offscreen canvas
    const offCanvas = document.createElement('canvas');
    offCanvas.width = GIF_SIZE;
    offCanvas.height = GIF_SIZE;
    const offCtx = offCanvas.getContext('2d');
    offCtx.lineCap = 'round';

    // Scale factor for spatial params
    const liveDim = Math.min(canvas.width, canvas.height);
    const scale = GIF_SIZE / liveDim;

    const gif = GIFEncoder();

    for (let i = 0; i < frames.length; i++) {
      const p = frames[i];

      // Scale spatial params to GIF dimensions
      const scaled = {
        ...p,
        size: p.size * scale,
        gg: p.gg * scale,
        panX: p.panX * scale,
        panY: p.panY * scale,
      };

      // Black background + render
      offCtx.fillStyle = '#000';
      offCtx.fillRect(0, 0, GIF_SIZE, GIF_SIZE);
      renderFrame(offCtx, GIF_SIZE, GIF_SIZE, scaled);

      const { data } = offCtx.getImageData(0, 0, GIF_SIZE, GIF_SIZE);
      const palette = quantize(data, 256, { format: 'rgb444' });
      const index = applyPalette(data, palette, 'rgb444');

      gif.writeFrame(index, GIF_SIZE, GIF_SIZE, {
        palette,
        delay: GIF_DELAY,
        repeat: 0,
      });

      const pct = Math.round(((i + 1) / frames.length) * 100);
      gifProgressBar.value = pct;
      gifProgressText.textContent = `Encoding GIF... ${pct}%`;

      if (i % 5 === 0) await new Promise((r) => setTimeout(r, 0));
    }

    gif.finish();
    const blob = new Blob([gif.bytes()], { type: 'image/gif' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    const timeString = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `Maurer_Rose_${timeString}.gif`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('GIF encoding failed:', err);
  }

  // Clear history so next GIF starts fresh
  paramHistory.length = 0;
  historyIdx = 0;

  isEncodingGif = false;
  saveGifBtn.disabled = false;
  saveGifBtn.textContent = 'Save GIF';
  gifProgressEl.hidden = true;
  gifProgressBar.value = 0;
}

// ── Reset View ───────────────────────────────────────────────────────

controls.resetView.addEventListener('click', () => {
  panX = 0;
  panY = 0;
  zoom = 1;
  draw();
});

// ── Fullscreen ──────────────────────────────────────────────────────

controls.fullscreen.addEventListener('click', () => {
  if (document.fullscreenElement === demoEl) {
    document.exitFullscreen();
  } else {
    demoEl.requestFullscreen();
  }
});

const toggleControlsBtn = document.getElementById('mra-toggle-controls');

toggleControlsBtn.addEventListener('click', () => {
  demoEl.classList.toggle('mra-controls-hidden');
});

document.addEventListener('fullscreenchange', () => {
  const isFs = document.fullscreenElement === demoEl;
  controls.fullscreen.textContent = isFs ? 'Exit Fullscreen' : 'Fullscreen';
  if (!isFs) {
    demoEl.classList.remove('mra-controls-hidden');
  }
});

// ── Mouse Drag (Pan) ─────────────────────────────────────────────────

let dragging = false;
const dragStart = { x: 0, y: 0 };

canvas.addEventListener('mousedown', (e) => {
  dragging = true;
  canvas.style.cursor = 'grabbing';
  dragStart.x = e.clientX;
  dragStart.y = e.clientY;
});

window.addEventListener('mouseup', () => {
  if (dragging) {
    dragging = false;
    canvas.style.cursor = 'grab';
  }
});

window.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  panX += e.clientX - dragStart.x;
  panY += e.clientY - dragStart.y;
  dragStart.x = e.clientX;
  dragStart.y = e.clientY;
  draw();
});

// ── Mouse Wheel (Zoom) ──────────────────────────────────────────────

canvas.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.95 : 1.05;
    zoom *= zoomFactor;
    zoom = Math.max(0.1, Math.min(zoom, 20));
    draw();
  },
  { passive: false },
);

// ── Touch Drag (Pan) ────────────────────────────────────────────────

let touchDragId = null;

canvas.addEventListener(
  'touchstart',
  (e) => {
    if (e.touches.length === 1) {
      touchDragId = e.touches[0].identifier;
      dragStart.x = e.touches[0].clientX;
      dragStart.y = e.touches[0].clientY;
      e.preventDefault();
    }
  },
  { passive: false },
);

canvas.addEventListener(
  'touchmove',
  (e) => {
    if (e.touches.length === 1 && touchDragId !== null) {
      const t = e.touches[0];
      panX += t.clientX - dragStart.x;
      panY += t.clientY - dragStart.y;
      dragStart.x = t.clientX;
      dragStart.y = t.clientY;
      draw();
      e.preventDefault();
    }
  },
  { passive: false },
);

canvas.addEventListener('touchend', () => {
  touchDragId = null;
});

// ── Pinch to Zoom ───────────────────────────────────────────────────

let lastPinchDist = 0;

canvas.addEventListener(
  'touchstart',
  (e) => {
    if (e.touches.length === 2) {
      touchDragId = null; // cancel single-finger drag
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist = Math.sqrt(dx * dx + dy * dy);
      e.preventDefault();
    }
  },
  { passive: false },
);

canvas.addEventListener(
  'touchmove',
  (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastPinchDist > 0) {
        const scale = dist / lastPinchDist;
        zoom *= scale;
        zoom = Math.max(0.1, Math.min(zoom, 20));
        draw();
      }
      lastPinchDist = dist;
      e.preventDefault();
    }
  },
  { passive: false },
);

canvas.addEventListener('touchend', (e) => {
  if (e.touches.length < 2) {
    lastPinchDist = 0;
  }
});

// ── Resize Observer ──────────────────────────────────────────────────

const resizeObserver = new ResizeObserver(() => resizeCanvas());
resizeObserver.observe(container);

// ── Init ─────────────────────────────────────────────────────────────

cx.lineCap = 'round';
canvas.style.cursor = 'grab';
syncToControls();
resizeCanvas();
