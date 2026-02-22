function Vector(x, y) {
  this.x = x;
  this.y = y;
  this.length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
}

Vector.prototype.plus = function (other) {
  const x = this.x + other.x;
  const y = this.y + other.y;
  return new Vector(x, y);
};

Vector.prototype.multiply = function (factor) {
  const x = this.x * factor;
  const y = this.y * factor;
  return new Vector(x, y);
};

Vector.prototype.subtract = function (other) {
  const x = this.x - other.x;
  const y = this.y - other.y;
  return new Vector(x, y);
};

Vector.prototype.rotate = function (angle) {
  const x =
    Math.round(10000 * (this.x * Math.cos(angle) - this.y * Math.sin(angle))) /
    10000;
  const y =
    Math.round(10000 * (this.x * Math.sin(angle) + this.y * Math.cos(angle))) /
    10000;
  return new Vector(x, y);
};

Vector.prototype.setMagnitude = function (magnitude) {
  const x = (this.x * magnitude) / this.length;
  const y = (this.y * magnitude) / this.length;
  return new Vector(x, y);
};

function Hankin(a, v) {
  this.a = a;
  this.v = v;
  this.end = a.plus(v);
}

function Edge(a, b) {
  this.a = a;
  this.b = b;
  this.h1 = undefined;
  this.h2 = undefined;
  this.points = this.a;
  this.length = Math.sqrt(
    Math.pow(this.a.x - this.b.x, 2) + Math.pow(this.a.y - this.b.y, 2),
  );

  this.hankin = function (alpha) {
    const mid = this.a.plus(this.b).multiply(0.5);
    let v1 = this.a.subtract(mid);
    let v2 = this.b.subtract(mid);
    const halfLength = v1.length;
    let offset1 = mid;
    let offset2 = mid;

    if (delta > 0) {
      if (delta > this.length / 2) delta = this.length / 2;
      v1 = v1.setMagnitude(Math.abs(delta));
      v2 = v2.setMagnitude(Math.abs(delta));
      offset1 = mid.plus(v2);
      offset2 = mid.plus(v1);
    }

    v1 = v1.setMagnitude(1);
    v2 = v2.setMagnitude(1);

    const angleRad = (angle * Math.PI) / 180;

    v1 = v1.rotate(-angleRad);
    v2 = v2.rotate(angleRad);

    alpha = alpha / 2;
    const beta = Math.PI - alpha - angleRad;
    const len = Math.sin(alpha) * ((halfLength + delta) / Math.sin(beta));

    v1 = v1.setMagnitude(len);
    v2 = v2.setMagnitude(len);

    this.h1 = new Hankin(offset1, v1);
    this.h2 = new Hankin(offset2, v2);
  };
}

function arrayToPoints(array) {
  const points = [];
  for (const name in array) {
    points.push(array[name].x);
    points.push(' ');
    points.push(array[name].y);
    points.push(' ');
  }
  return points.join('');
}

function Polygon(sides) {
  this.interiorAngle = ((sides - 2) * Math.PI) / sides;
  this.vertices = [];
  this.edges = [];

  this.addVertex = function (x, y) {
    const a = new Vector(x, y);
    const total = this.vertices.length;
    if (total > 0) {
      const prev = this.vertices[total - 1];
      const edge = new Edge(prev, a);
      this.edges.push(edge);
    }
    this.vertices.push(a);
  };

  this.close = function () {
    const total = this.vertices.length;
    const last = this.vertices[total - 1];
    const first = this.vertices[0];
    const edge = new Edge(last, first);
    this.edges.push(edge);
  };

  this.getPolygonPoints = function () {
    const points = [];
    for (let i = 0; i < this.edges.length; i++) {
      points.push(this.edges[i].points);
    }
    return arrayToPoints(points);
  };

  this.getHankins = function () {
    const hankins = [];
    for (let i = 0; i < this.edges.length; i++) {
      this.edges[i].hankin(this.interiorAngle);
      const h1 = this.edges[i].h1;
      const h2 = this.edges[i].h2;
      hankins.push(h1.a.x);
      hankins.push(h1.a.y);
      hankins.push(h1.end.x);
      hankins.push(h1.end.y);
      hankins.push(h2.a.x);
      hankins.push(h2.a.y);
      hankins.push(h2.end.x);
      hankins.push(h2.end.y);
    }
    return hankins;
  };
}

function HexagonalTiling(r) {
  this.polys = [];

  this.buildCell = function (x, y) {
    const p = new Polygon(6);
    for (let i = 0; i < 6; i++) {
      const point = {};
      const angleDeg = 60 * i;
      const angleRad = (Math.PI / 180) * angleDeg;
      point.x = x + r * Math.cos(angleRad);
      point.y = y + r * Math.sin(angleRad);
      p.addVertex(point.x, point.y);
    }
    p.close();
    this.polys.push(p);
  };

  this.buildGrid = function () {
    const h = r * 2;
    const w = (Math.sqrt(3) / 2) * h;
    const inc = 3 * (h / 4);
    let row = 0;
    for (let x = -h / 2; x < 700 + h / 2; x += inc) {
      const startY = row % 2 === 0 ? -w : -w / 2;
      for (let y = startY; y < 540; y += w) {
        this.buildCell(x, y);
      }
      row++;
    }
  };
}

// SVG setup

const width = '700';
const height = '500';
const svgNS = 'http://www.w3.org/2000/svg';

const container = document.getElementById('svgContainer');
const svg = document.createElementNS(svgNS, 'svg');
svg.setAttributeNS(null, 'width', width + 'px');
svg.setAttributeNS(null, 'height', height + 'px');
svg.setAttributeNS(null, 'id', 'starPattern');

// Blur filter
const defs = document.createElementNS(svgNS, 'defs');
const filter = document.createElementNS(svgNS, 'filter');
filter.setAttribute('id', 'f1');
const blur = document.createElementNS(svgNS, 'feGaussianBlur');
blur.setAttribute('stdDeviation', '1');
filter.appendChild(blur);
svg.appendChild(filter);

// Controls
const deltaR = document.getElementById('delta');
const angleR = document.getElementById('angle');
const deltaRInc = document.getElementById('deltaInc');
const angleRInc = document.getElementById('angleInc');
const selectTiling = document.getElementById('tiling');
const elementArray = [deltaR, angleR, deltaRInc, angleRInc];

let angle, delta;
let polygons = [];

function squareTiling() {
  polygons = [];
  const inc = 100;
  for (let x = 0; x < width; x += inc) {
    for (let y = 0; y < height; y += inc) {
      const poly = new Polygon(4);
      poly.addVertex(x, y);
      poly.addVertex(x + inc, y);
      poly.addVertex(x + inc, y + inc);
      poly.addVertex(x, y + inc);
      poly.close();
      polygons.push(poly);
    }
  }
}

squareTiling();

function hexTiling() {
  const hexTiles = new HexagonalTiling(60);
  hexTiles.buildGrid();
  polygons = hexTiles.polys;
}

elementArray.forEach((elem) => {
  elem.addEventListener('mousemove', () => {
    drawSVGhankins();
  });
});

elementArray.forEach((elem) => {
  elem.addEventListener('touchmove', () => {
    drawSVGhankins();
  });
});

selectTiling.addEventListener('change', () => {
  if (selectTiling.value === 'square') squareTiling();
  else if (selectTiling.value === 'hex') hexTiling();
  const elements = Array.prototype.slice.call(svg.childNodes);
  for (let i = 0; i < elements.length; i++) {
    elements[i].remove();
  }
  drawSVGGrid();
  drawSVGhankins();
});

function drawSVGGrid() {
  polygons.forEach((poly) => {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', 'tile');
    const cell = document.createElementNS(svgNS, 'polygon');
    cell.setAttribute('points', poly.getPolygonPoints());
    g.appendChild(cell);
    for (let i = 0; i < poly.edges.length * 2; i++) {
      const line = document.createElementNS(svgNS, 'line');
      g.appendChild(line);
    }
    svg.appendChild(g);
  });
  container.appendChild(svg);
}

drawSVGGrid();

function drawSVGhankins() {
  let deltainc = 0;
  let angleinc = 0;
  polygons.forEach((poly, i) => {
    delta = Number(deltaR.value) + deltainc;
    angle = Number(angleR.value) + angleinc;
    const g = document.getElementsByTagName('g')[i];
    const lines = Array.prototype.slice.call(g.childNodes).slice(1);
    const hankinsCoord = poly.getHankins();
    let count = 4;
    for (let j = 0; j < lines.length; j++) {
      lines[j].setAttribute('x1', hankinsCoord[count - 4]);
      lines[j].setAttribute('y1', hankinsCoord[count - 3]);
      lines[j].setAttribute('x2', hankinsCoord[count - 2]);
      lines[j].setAttribute('y2', hankinsCoord[count - 1]);
      count += 4;
    }
    deltainc += Number(deltaRInc.value);
    angleinc += Number(angleRInc.value);
  });
}

drawSVGhankins();
