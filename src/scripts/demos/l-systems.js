// L-Systems Generator - Inline Demo
// Ported from public/assets/FULL/L-systems/

// ── Shapes Database ──────────────────────────────────────────────────

const SHAPES = {
  'Koch Line': {
    id: 1,
    axiom: 'F',
    rules: { F: 'F-F++F-F' },
    angle: Math.PI / 3,
    stepLength: 3,
    center: { x: 0, y: 10 },
    iterations: 5,
    closePath: false,
  },
  'Quadratic Snowflake': {
    id: 2,
    axiom: 'F',
    rules: { F: 'F-F+F+F-F' },
    angle: Math.PI / 2,
    stepLength: 3,
    center: { x: 0, y: 10 },
    iterations: 5,
    closePath: false,
  },
  'Box fractal': {
    id: 3,
    axiom: 'F-F-F-F',
    rules: { F: 'F-F+F+F-F' },
    angle: Math.PI / 2,
    stepLength: 11,
    center: { x: 3, y: 3 },
    iterations: 4,
  },
  'Koch snowflake': {
    id: 4,
    axiom: 'F++F++F',
    rules: { F: 'F-F++F-F' },
    angle: Math.PI / 3,
    stepLength: 2,
    centerFn: (w, h) => ({ x: w / 4, y: h / 1.6 }),
    iterations: 5,
  },
  'Bourke Triangle': {
    id: 5,
    axiom: 'F+F+F',
    rules: { F: 'F-F+F' },
    angle: (2 * Math.PI) / 3,
    stepLength: 15,
    centerFn: (w, h) => ({ x: w - 65, y: h / 1.85 }),
    iterations: 7,
  },
  Weed: {
    id: 6,
    axiom: 'F',
    rules: { F: 'F[+F]F[-F]F' },
    angle: Math.PI / 7,
    stepLength: 1,
    centerFn: (w, h) => ({ x: w / 2, y: h }),
    iterations: 6,
    initialAngle: -Math.PI / 2,
  },
  Stick: {
    id: 7,
    axiom: 'X',
    rules: { F: 'FF', X: 'F[+X]F[-X]+X' },
    angle: Math.PI / 9,
    stepLength: 3,
    centerFn: (w, h) => ({ x: w / 2, y: h }),
    iterations: 7,
    initialAngle: -Math.PI / 2,
    closePath: false,
  },
  Crystal: {
    id: 8,
    axiom: 'F+F+F+F',
    rules: { F: 'FF+F++F+F' },
    angle: Math.PI / 2,
    stepLength: 10,
    centerFn: (w, h) => ({ x: 50, y: h - 50 }),
    iterations: 4,
  },
  'Dragon Curve': {
    id: 9,
    axiom: 'FX',
    rules: { X: 'X+YF+', Y: '-FX-Y' },
    angle: Math.PI / 2,
    stepLength: 6,
    centerFn: (w, h) => ({ x: w / 2, y: h / 2 }),
    iterations: 12,
    closePath: false,
  },
  'Hexagonal Gosper': {
    id: 10,
    axiom: 'A',
    rules: { A: 'A+BF++BF-FA--FAFA-BF+', B: '-FA+BFBF++BF+FA--FA-B' },
    angle: Math.PI / 3,
    stepLength: 25,
    centerFn: (w, h) => ({ x: w / 2, y: h / 2 + 230 }),
    iterations: 3,
    closePath: false,
  },
  'Square Serpinsky': {
    id: 11,
    axiom: 'F+XF+F+XF',
    rules: { X: 'XF-F+F-XF+F+XF-F+F-X' },
    angle: Math.PI / 2,
    stepLength: 7,
    centerFn: (w, h) => ({ x: w / 2, y: h }),
    iterations: 5,
    closePath: false,
  },
  'Hilbert Curve': {
    id: 12,
    axiom: 'X',
    rules: { X: '-YF+XFX+FY-', Y: '+XF-YFY-FX+' },
    angle: Math.PI / 2,
    stepLength: 14,
    center: { x: 10, y: 10 },
    iterations: 6,
    closePath: false,
  },
  Board: {
    id: 13,
    axiom: 'F+F+F+F',
    rules: { F: 'FF+F+F+F+FF' },
    angle: Math.PI / 2,
    stepLength: 10,
    centerFn: (w, h) => ({ x: 50, y: h - 50 }),
    iterations: 4,
    closePath: false,
  },
  'Koch Curve': {
    id: 14,
    axiom: 'F+F+F+F',
    rules: { F: 'F+F-F-FF+F+F-F' },
    angle: Math.PI / 2,
    stepLength: 5,
    centerFn: (w, h) => ({ x: w / 2 - 150, y: h / 2 + 150 }),
    iterations: 3,
    closePath: false,
  },
  'Quadratic Koch Island': {
    id: 15,
    axiom: 'F+F+F+F',
    rules: { F: 'F+F-F-FFF+F+F-F' },
    angle: Math.PI / 2,
    stepLength: 5,
    centerFn: (w, h) => ({ x: w / 2 - 250, y: h / 2 }),
    iterations: 3,
    closePath: false,
  },
  'Quadratic Koch Island - 2': {
    id: 16,
    axiom: 'F+F+F+F',
    rules: { F: 'F-FF+FF+F+F-F-FF+F+F-F-FF-FF+F' },
    angle: Math.PI / 2,
    stepLength: 13,
    centerFn: (w, h) => ({ x: 200, y: h / 2 + 250 }),
    iterations: 2,
    closePath: false,
  },
  'Serpinsky ArrowHead': {
    id: 17,
    axiom: 'YF',
    rules: { X: 'YF+XF+Y', Y: 'XF-YF-X' },
    angle: Math.PI / 3,
    stepLength: 7,
    centerFn: (w, h) => ({ x: w - 10, y: h - 30 }),
    iterations: 7,
    initialAngle: Math.PI,
    closePath: false,
  },
  Cross: {
    id: 18,
    axiom: 'F+F+F+F',
    rules: { F: 'F+F-F+F+F' },
    angle: Math.PI / 2,
    stepLength: 10,
    centerFn: (w, h) => ({ x: 70, y: h / 2 + 120 }),
    iterations: 5,
    closePath: false,
  },
  Rings: {
    id: 19,
    axiom: 'F+F+F+F',
    rules: { F: 'FF+F+F+F+F+F-F' },
    angle: Math.PI / 2,
    stepLength: 6,
    centerFn: (w, h) => ({ x: w / 2 + 180, y: h - 100 }),
    iterations: 4,
    closePath: false,
  },
  'Another Bush': {
    id: 20,
    axiom: 'Y',
    rules: { X: 'X[-FFF][+FFF]FX', Y: 'YFX[+Y][-Y]' },
    angle: Math.PI / 7,
    stepLength: 6,
    centerFn: (w, h) => ({ x: w / 2, y: h }),
    iterations: 6,
    initialAngle: -Math.PI / 2,
    closePath: false,
  },
  'Another Bush - 2': {
    id: 21,
    axiom: 'F',
    rules: { F: 'FF+[+F-F-F]-[-F+F+F]' },
    angle: Math.PI / 8,
    stepLength: 8,
    centerFn: (w, h) => ({ x: w / 2, y: h }),
    iterations: 5,
    initialAngle: -Math.PI / 2,
    closePath: false,
  },
  'Another Bush - 3': {
    id: 22,
    axiom: 'F',
    rules: { F: 'F[+FF][-FF]F[-F][+F]F' },
    angle: Math.PI / 5,
    stepLength: 8,
    centerFn: (w, h) => ({ x: w / 2, y: h }),
    iterations: 4,
    initialAngle: -Math.PI / 2,
    closePath: false,
  },
  Hexagonal: {
    id: 23,
    axiom: 'FXF',
    rules: { F: 'FXF', X: '[-F+F+F]+F-F-F+' },
    angle: Math.PI / 3,
    stepLength: 3,
    centerFn: (w, h) => ({ x: 0, y: h / 2 }),
    iterations: 5,
    closePath: false,
  },
  'Serpinsky Triangle': {
    id: 24,
    axiom: 'FXF--FF--FF',
    rules: { F: 'FF', X: '--FXF++FXF++FXF--' },
    angle: Math.PI / 3,
    stepLength: 4,
    center: { x: 0, y: 0 },
    iterations: 7,
    closePath: false,
  },
  'Serpinsky Carpet': {
    id: 25,
    axiom: 'F',
    rules: { F: 'FFF[+FFF+FFF+FFF]' },
    angle: Math.PI / 2,
    stepLength: 3,
    centerFn: (w, h) => ({ x: 50, y: h - 50 }),
    iterations: 5,
    closePath: false,
  },
  Mosaic: {
    id: 26,
    axiom: 'F-F-F-F',
    rules: { F: 'F-b+FF-F-FF-Fb-FF+b-FF+F+FF+Fb+FFF', b: 'bbbbbb' },
    angle: Math.PI / 2,
    stepLength: 3,
    centerFn: (w, h) => ({ x: 300, y: 0 }),
    iterations: 3,
    closePath: false,
  },
  'Levy C Curve': {
    id: 27,
    axiom: 'F++F++F++F',
    rules: { F: '-F++F-' },
    angle: Math.PI / 4,
    stepLength: 5,
    centerFn: (w, h) => ({ x: w / 2 - 130, y: h / 2 + 150 }),
    iterations: 11,
    closePath: false,
  },
  Pentaplexity: {
    id: 28,
    axiom: 'F++F++F++F++F',
    rules: { F: 'F++F++F+++++F-F++F' },
    angle: Math.PI / 5,
    stepLength: 4,
    centerFn: (w, h) => ({ x: 200, y: h - 100 }),
    iterations: 5,
    closePath: false,
  },
  'William McWorter Terdragon': {
    id: 29,
    axiom: 'F',
    rules: { F: 'F+F-F' },
    angle: (2 * Math.PI) / 3,
    stepLength: 6,
    centerFn: (w, h) => ({ x: w / 2 + 100, y: h / 2 }),
    iterations: 8,
    initialAngle: Math.PI / 2,
    closePath: false,
  },
  'Sierpinski Carpet': {
    id: 30,
    axiom: 'F',
    rules: { F: 'F+F-F-F-b+F+F+F-F', b: 'bbb' },
    angle: Math.PI / 2,
    stepLength: 7,
    centerFn: (w, h) => ({ x: w / 2, y: h / 2 - 250 }),
    iterations: 4,
    initialAngle: Math.PI / 2,
    closePath: false,
  },
  Pentigree: {
    id: 31,
    axiom: 'F-F-F-F-F',
    rules: { F: 'F-F++F+F-F-F' },
    angle: (2 * Math.PI) / 5,
    stepLength: 7,
    centerFn: (w, h) => ({ x: w / 2, y: h - 200 }),
    iterations: 4,
    closePath: false,
  },
  'Hex-7-b': {
    id: 32,
    axiom: 'X',
    rules: {
      X: '-F++F-X-F--F+Y---F--F+Y+F++F-X+++F++F-X-F++F-X+++F--F+Y--',
      Y: '+F++F-X-F--F+Y+F--F+Y---F--F+Y---F++F-X+++F++F-X+++F--F+Y',
    },
    angle: Math.PI / 6,
    stepLength: 2,
    centerFn: (w, h) => ({ x: w / 2 + 150, y: 100 }),
    iterations: 5,
    closePath: false,
  },
  'Peano-c': {
    id: 33,
    axiom: 'FX',
    rules: { X: 'FX-FY-FX+FY+FX+FY+FX+FY+FX-FY-FX-FY-FX-FY-FX+FY+FX', Y: 'FY' },
    angle: Math.PI / 4,
    stepLength: 3,
    centerFn: (w, h) => ({ x: 0, y: h / 2 }),
    iterations: 4,
    closePath: false,
  },
  Border1: {
    id: 34,
    axiom: 'XYXYXYX+XYXYXYX+XYXYXYX+XYXYXYX',
    rules: { X: 'FX+FX+FXFY-FY-', Y: '+FX+FXFY-FY-FY' },
    angle: Math.PI / 2,
    stepLength: 10,
    centerFn: (w, h) => ({ x: 50, y: h / 2 + 100 }),
    iterations: 3,
    closePath: false,
  },
  Doily: {
    id: 35,
    axiom: 'F--F--F--F--F--F',
    rules: { F: '-F[--F--F]++F--F+' },
    angle: Math.PI / 6,
    stepLength: 8,
    centerFn: (w, h) => ({ x: w / 2 + 50, y: 100 }),
    iterations: 4,
  },
  Maze: {
    id: 36,
    axiom: 'F+F+F',
    rules: { F: 'F+FF-F' },
    angle: (2 * Math.PI) / 3,
    stepLength: 8,
    centerFn: (w, h) => ({ x: 200, y: h / 2 + 150 }),
    iterations: 6,
  },
  'Maze & Fractal': {
    id: 37,
    axiom: 'X',
    rules: { X: 'FY+FYFY-FY', Y: 'FX-FXFX+FX' },
    angle: (2 * Math.PI) / 3,
    stepLength: 2,
    centerFn: (w, h) => ({ x: 200, y: h / 2 + 150 }),
    iterations: 7,
  },
  Moore: {
    id: 38,
    axiom: 'X',
    rules: { X: 'FX+FX+FXFYFX+FXFY-FY-FY-', Y: '+FX+FX+FXFY-FYFXFY-FY-FY' },
    angle: Math.PI / 2,
    stepLength: 2,
    centerFn: (w, h) => ({ x: w / 2, y: h / 2 + 150 }),
    iterations: 5,
  },
  Pentan: {
    id: 39,
    axiom: 'X-X-X-X-X',
    rules: { X: 'FX-FX-FX+FY+FY+FX-FX', Y: 'FY+FY-FX-FX-FY+FY+FY' },
    angle: (2 * Math.PI) / 5,
    stepLength: 2,
    centerFn: (w, h) => ({ x: w / 2 + 200, y: h / 2 - 100 }),
    iterations: 4,
  },
  Pentl: {
    id: 40,
    axiom: 'F-F-F-F-F',
    rules: { F: 'F-F-F++F+F-F' },
    angle: (2 * Math.PI) / 5,
    stepLength: 2,
    centerFn: (w, h) => ({ x: w / 2, y: h / 2 - 300 }),
    iterations: 5,
  },
  Sierpinsk: {
    id: 41,
    axiom: 'L--F--L--F',
    rules: { L: '+R-F-R+', R: '-L+F+L-' },
    angle: Math.PI / 4,
    stepLength: 6,
    centerFn: (w, h) => ({ x: 0, y: h / 2 }),
    iterations: 12,
  },
  ADH231a: {
    id: 42,
    axiom: 'F++++F',
    rules: { F: 'F+F+F++++F+F+F' },
    angle: Math.PI / 4,
    stepLength: 6,
    centerFn: (w, h) => ({ x: 0, y: h / 2 }),
    iterations: 4,
  },
  ADH256a: {
    id: 43,
    axiom: 'F+F+F+F++F-F-F-F',
    rules: { F: 'F+F++F+FF' },
    angle: Math.PI / 2,
    stepLength: 6,
    centerFn: (w, h) => ({ x: w / 2 - 300, y: h / 2 + 200 }),
    iterations: 4,
  },
  ADH258a: {
    id: 44,
    axiom: 'F++F++F+++F--F--F',
    rules: { F: 'FF++F++F++FFF' },
    angle: Math.PI / 3,
    stepLength: 10,
    centerFn: (w, h) => ({ x: w / 2 - 300, y: h / 2 + 200 }),
    iterations: 3,
  },
  SaWeed: {
    id: 45,
    axiom: 'F',
    rules: { F: 'F[+FF-F]F[-FF]F' },
    angle: Math.PI / 7,
    stepLength: 3,
    centerFn: (w, h) => ({ x: w / 2, y: h }),
    iterations: 5,
    initialAngle: -Math.PI / 2,
  },
};

// ── Helper Functions ─────────────────────────────────────────────────

const jsonToHTML = (rules) => {
  let res = '';
  const keys = Object.keys(rules);
  keys.forEach((key) => (res += `${key} => ${rules[key]}\n`));
  return res;
};

const htmlToJson = (html) => {
  const res = {};
  const stringsArr = html.trim().split('\n');
  stringsArr.forEach((str) => {
    const rule = str.split('=>');
    if (rule.length === 2) {
      res[rule[0].trim()] = rule[1].trim();
    }
  });
  return res;
};

const radToDeg = (rad = 0) => Math.round((180 * rad) / Math.PI);

// ── Lshape Class ─────────────────────────────────────────────────────

function Lshape(config, name) {
  this.name = name;
  this.axiom = config.axiom;
  this.rules = config.rules;
  this.angle = config.angle;
  this.stepLength = config.stepLength;
  this.center = config.center;
  this.centerFn = config.centerFn;
  this.iterations = config.iterations;
  this.initialAngle = config.initialAngle;
  this.closePath = config.closePath;
  this.currentState = config.axiom;
}

Lshape.prototype.step = function () {
  const arrState = this.currentState.split('');
  const nextStepArr = arrState.map((el) => {
    if (this.rules[el]) return this.rules[el];
    return el;
  });
  this.currentState = nextStepArr.join('');
};

Lshape.prototype.iterate = function () {
  for (let i = 0; i < this.iterations; i++) {
    this.step();
  }
};

// ── DOM Setup ────────────────────────────────────────────────────────

const canvas = document.getElementById('lsys-canvas');
const cx = canvas.getContext('2d');
const container = canvas.parentElement;
const demoEl = canvas.closest('.lsys-demo');

// Controls
const nameEl = document.getElementById('lsys-name');
const axiomEl = document.getElementById('lsys-axiom');
const angleEl = document.getElementById('lsys-angle');
const angleDegEl = document.getElementById('lsys-angle-deg');
const rulesEl = document.getElementById('lsys-rules');
const centerXEl = document.getElementById('lsys-x');
const centerYEl = document.getElementById('lsys-y');
const iterationsEl = document.getElementById('lsys-iterations');
const stepLengthEl = document.getElementById('lsys-step');
const initialAngleEl = document.getElementById('lsys-initial-angle');
const canvasColorEl = document.getElementById('lsys-canvas-color');
const colorizeEl = document.getElementById('lsys-colorize');
const warningEl = document.getElementById('lsys-warning');
const statsEl = document.getElementById('lsys-stats');
const downloadEl = document.getElementById('lsys-download');
const generateEl = document.getElementById('lsys-generate');
const presetsContainer = document.getElementById('lsys-presets');

cx.strokeStyle = 'blue';
cx.globalAlpha = 1;

const state = {
  canvasColor: '#ffffff',
  shapeColor: false,
};

let tempObject = null;

// ── Canvas Sizing ────────────────────────────────────────────────────

function resizeCanvas() {
  const width = container.clientWidth;
  const isFs = document.fullscreenElement === demoEl;
  let height;
  if (isFs) {
    height = container.clientHeight;
  } else {
    height = Math.min(width, 600);
  }
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  if (tempObject) {
    if (tempObject.centerFn) {
      tempObject.center = tempObject.centerFn(canvas.width, canvas.height);
    }
    draw(tempObject, state);
  }
}

// ── Draw ─────────────────────────────────────────────────────────────

function draw(shape, drawState, dragState) {
  const now = Date.now();
  const center =
    shape.center ||
    (shape.centerFn
      ? shape.centerFn(canvas.width, canvas.height)
      : { x: 0, y: 0 });
  const stepLength = shape.stepLength;

  cx.resetTransform();
  cx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.backgroundColor = drawState.canvasColor;

  cx.translate(center.x, center.y);
  if (typeof dragState === 'undefined') {
    cx.moveTo(stepLength, 0);
  } else {
    cx.translate(stepLength - dragState.x, -dragState.y);
  }

  if (shape.initialAngle) {
    cx.rotate(shape.initialAngle);
  }

  const stepsArr = shape.currentState.split('');
  stepsArr.forEach((step, i) => {
    switch (step) {
      case '+':
        cx.rotate(-shape.angle);
        break;
      case '-':
        cx.rotate(shape.angle);
        break;
      case '[':
        cx.save();
        break;
      case ']':
        cx.restore();
        break;
      case 'F':
        cx.beginPath();
        cx.strokeStyle = drawState.shapeColor
          ? `hsl(${i / 30}, 100%, 50%)`
          : 'blue';
        cx.moveTo(0, 0);
        cx.lineTo(stepLength, 0);
        cx.translate(stepLength, 0);
        cx.stroke();
        break;
      case 'f':
      case 'b':
        cx.moveTo(stepLength, 0);
        cx.translate(stepLength, 0);
        break;
    }
  });

  if (typeof shape.closePath === 'undefined') {
    cx.closePath();
  }
  cx.stroke();

  updateControls(shape, now);
}

// ── Update Controls ──────────────────────────────────────────────────

function updateControls(shape, now) {
  statsEl.textContent = `${shape.name} rendered in ${Date.now() - now}ms`;
  downloadEl.setAttribute('download', `${shape.name.replace(/ /g, '_')}.png`);
  nameEl.textContent = shape.name;
  axiomEl.value = shape.axiom;
  angleEl.value = shape.angle;
  rulesEl.value = jsonToHTML(shape.rules);
  centerXEl.value = shape.center ? shape.center.x : '';
  centerYEl.value = shape.center ? shape.center.y : '';
  iterationsEl.value = shape.iterations;
  initialAngleEl.value = shape.initialAngle || '';
  stepLengthEl.value = Math.round(shape.stepLength * 10) / 10;
  angleDegEl.textContent = `(${radToDeg(shape.angle)}°)`;
}

// ── Presets Gallery ──────────────────────────────────────────────────

const shapeNames = Object.keys(SHAPES);

shapeNames.forEach((name) => {
  const img = document.createElement('img');
  const shape = SHAPES[name];
  img.src = `/assets/FULL/L-systems/src/img/${shape.id}.png`;
  img.alt = name;
  img.title = name;
  img.className = 'lsys-preset';
  img.setAttribute('data-name', name);
  presetsContainer.appendChild(img);
});

const presetImages = presetsContainer.querySelectorAll('.lsys-preset');

function drawFromPreset(shapeName) {
  const config = SHAPES[shapeName];
  if (!config) return;
  const shape = new Lshape(config, shapeName);
  shape.iterate();

  if (shape.centerFn) {
    shape.center = shape.centerFn(canvas.width, canvas.height);
  }

  tempObject = shape;
  draw(shape, state);

  presetImages.forEach((el) => el.classList.remove('active'));
  presetsContainer
    .querySelector(`[data-name="${shapeName}"]`)
    ?.classList.add('active');
}

presetsContainer.addEventListener('click', (e) => {
  const img = e.target.closest('.lsys-preset');
  if (!img) return;
  drawFromPreset(img.getAttribute('data-name'));
});

// ── Custom Shape from Controls ───────────────────────────────────────

function drawFromControls() {
  warningEl.textContent = '';

  if (Number(iterationsEl.value) > 10) {
    warningEl.textContent = 'Too many iterations, please use < 10';
    return;
  }
  if (stepLengthEl.value === '') {
    warningEl.textContent = 'Please provide a step length';
    return;
  }

  const newRules = htmlToJson(rulesEl.value);
  const config = {
    axiom: axiomEl.value,
    rules: newRules,
    angle: Number(angleEl.value),
    stepLength: Number(stepLengthEl.value),
    center: { x: Number(centerXEl.value), y: Number(centerYEl.value) },
    initialAngle: Number(initialAngleEl.value) || 0,
    iterations: Number(iterationsEl.value),
  };

  Object.assign(state, {
    canvasColor: canvasColorEl.value,
    shapeColor: colorizeEl.checked,
  });

  const shape = new Lshape(config, 'Custom');
  shape.iterate();
  tempObject = shape;

  presetImages.forEach((el) => el.classList.remove('active'));
  draw(shape, state);
}

generateEl.addEventListener('click', drawFromControls);

// Listen to colorize and canvas color changes
canvasColorEl.addEventListener('input', () => {
  state.canvasColor = canvasColorEl.value;
  if (tempObject) draw(tempObject, state);
});

colorizeEl.addEventListener('change', () => {
  state.shapeColor = colorizeEl.checked;
  if (tempObject) draw(tempObject, state);
});

// ── Drag Support (Mouse + Touch) ─────────────────────────────────────

let dragging = false;
const mouseCoord = { x: 0, y: 0 };

function getPointerPos(e) {
  if (e.touches && e.touches.length > 0) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  }
  return { x: e.offsetX, y: e.offsetY };
}

function onPointerDown(e) {
  dragging = true;
  canvas.style.cursor = 'move';
  const pos = getPointerPos(e);
  Object.assign(mouseCoord, pos);
  if (e.touches) e.preventDefault();
}

function onPointerUp(e) {
  if (!dragging) return;
  dragging = false;
  canvas.style.cursor = 'grab';
  const pos = e.changedTouches
    ? {
        x: e.changedTouches[0].clientX - canvas.getBoundingClientRect().left,
        y: e.changedTouches[0].clientY - canvas.getBoundingClientRect().top,
      }
    : { x: e.offsetX, y: e.offsetY };

  if (tempObject) {
    tempObject.center = {
      x: Number(tempObject.center.x - (mouseCoord.x - pos.x)),
      y: Number(tempObject.center.y - (mouseCoord.y - pos.y)),
    };
  }
  Object.assign(mouseCoord, { x: 0, y: 0 });
}

function onPointerMove(e) {
  if (!dragging || !tempObject) return;
  const pos = getPointerPos(e);
  draw(tempObject, state, {
    x: mouseCoord.x - pos.x,
    y: mouseCoord.y - pos.y,
  });
  centerXEl.value = tempObject.center.x - (mouseCoord.x - pos.x);
  centerYEl.value = tempObject.center.y - (mouseCoord.y - pos.y);
  if (e.touches) e.preventDefault();
}

canvas.addEventListener('mousedown', onPointerDown);
canvas.addEventListener('mouseup', onPointerUp);
canvas.addEventListener('mousemove', onPointerMove);
canvas.addEventListener('touchstart', onPointerDown, { passive: false });
canvas.addEventListener('touchend', onPointerUp);
canvas.addEventListener('touchmove', onPointerMove, { passive: false });

// Zoom helpers
function zoomIn() {
  if (!tempObject) return;
  tempObject.stepLength = Number(tempObject.stepLength) + 0.1;
  stepLengthEl.value = Math.round(tempObject.stepLength * 10) / 10;
  draw(tempObject, state);
}

function zoomOut() {
  if (!tempObject) return;
  tempObject.stepLength = Math.max(0.1, Number(tempObject.stepLength) - 0.1);
  stepLengthEl.value = Math.round(tempObject.stepLength * 10) / 10;
  draw(tempObject, state);
}

// Zoom via wheel
canvas.addEventListener(
  'wheel',
  (e) => {
    if (!tempObject) return;
    e.preventDefault();
    if (e.deltaY > 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  },
  { passive: false },
);

// Zoom via buttons
const zoomInBtn = document.getElementById('lsys-zoom-in');
const zoomOutBtn = document.getElementById('lsys-zoom-out');
if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);

// ── Fullscreen ──────────────────────────────────────────────────────

const fullscreenBtn = document.getElementById('lsys-fullscreen');

if (fullscreenBtn) {
  fullscreenBtn.addEventListener('click', () => {
    if (document.fullscreenElement === demoEl) {
      document.exitFullscreen();
    } else {
      demoEl.requestFullscreen();
    }
  });
}

document.addEventListener('fullscreenchange', () => {
  if (fullscreenBtn) {
    fullscreenBtn.title =
      document.fullscreenElement === demoEl ? 'Exit fullscreen' : 'Fullscreen';
  }
});

// ── Download ─────────────────────────────────────────────────────────

downloadEl.addEventListener('click', () => {
  const image = canvas
    .toDataURL('image/png')
    .replace('image/png', 'image/octet-stream');
  downloadEl.setAttribute('href', image);
});

// ── Resize Observer ──────────────────────────────────────────────────

const resizeObserver = new ResizeObserver(() => resizeCanvas());
resizeObserver.observe(container);

// ── Initial Render ───────────────────────────────────────────────────

resizeCanvas();
const randomIdx = Math.floor(Math.random() * shapeNames.length);
drawFromPreset(shapeNames[randomIdx]);
