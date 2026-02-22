const svgNS = 'http://www.w3.org/2000/svg';

function randomInteger(min, max) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

function arrayToPoints(array) {
  const points = [];
  for (const name in array) {
    points.push(array[name].x);
    points.push(',');
    points.push(array[name].y);
    points.push(' ');
  }
  return points.join('');
}

function randomPointsOnLine(a, b) {
  const dist = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  const rand = Math.random() * dist;
  const point = {};
  point.x = a.x - (rand * (a.x - b.x)) / dist;
  point.y = a.y - (rand * (a.y - b.y)) / dist;
  return point;
}

// Hex

function HexObject(center, size) {
  this.center = center;
  this.size = size;
  this.edgePoints = [];
}

HexObject.prototype.hexCornersFlat = function () {
  const corners = [];
  for (let i = 0; i <= 5; i++) {
    const corner = {};
    const angleDeg = 60 * i;
    const angleRad = (Math.PI / 180) * angleDeg;
    corner.x = this.center.x + this.size * Math.cos(angleRad);
    corner.y = this.center.y + this.size * Math.sin(angleRad);
    corners.push(corner);
  }
  this.corners = corners;
};

HexObject.prototype.getPointOnEdge = function (fn, idx) {
  this.i = idx;
  const points = [];
  const c = this.corners;
  for (let i = 0; i < 6; i++) {
    points.push(fn(c[i], c[i + 1] || c[0]));
  }
  this.edgePoints[idx] = points;
};

function drawHexSVG(size, offset, w, h, lines, bgColor, lineColor) {
  const figure = document.getElementById('Figure');
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttributeNS(null, 'width', w + 'px');
  svg.setAttributeNS(null, 'height', h + 'px');
  svg.setAttributeNS(null, 'id', 'svg_figure');

  const hex = new HexObject({ x: 20, y: 20 }, size);
  hex.hexCornersFlat();
  for (let c = 0; c < lines; c++) {
    hex.getPointOnEdge(randomPointsOnLine, c);
  }

  const d = Number(offset);
  const pts = arrayToPoints(hex.corners);
  const hexH = hex.size;
  const fullH = 2 * hexH;
  const rowH = (Math.sqrt(3) / 2) * fullH + d;
  const colW = 3 * (fullH / 4) + d;
  let row = 0;

  for (let x = fullH / 2; x < w - fullH / 2; x += colW) {
    const startY = row % 2 === 0 ? rowH : rowH / 2;
    for (let y = startY; y < h - 0.7 * rowH; y += rowH) {
      const g = document.createElementNS(svgNS, 'g');
      g.setAttribute('class', 'tile');
      g.setAttribute('transform', 'translate(' + x + ',' + y + ')');
      const poly = document.createElementNS(svgNS, 'polygon');
      poly.setAttribute('points', pts);
      poly.setAttribute('fill', bgColor);
      poly.setAttribute('stroke', lineColor);
      svg.appendChild(g);
      g.appendChild(poly);
      hex.edgePoints.forEach(function (ep) {
        for (let i = 0; i <= 5; i++) {
          const j = randomInteger(0, 5);
          const line = document.createElementNS(svgNS, 'line');
          line.setAttribute('x1', ep[i].x);
          line.setAttribute('y1', ep[i].y);
          line.setAttribute('x2', ep[j].x);
          line.setAttribute('y2', ep[j].y);
          line.setAttribute('stroke', lineColor);
          g.appendChild(line);
        }
      });
    }
    row++;
  }
  figure.appendChild(svg);
}

// Square

function SquareObject(center, size) {
  this.center = center;
  this.size = size;
  this.edgePoints = [];
}

SquareObject.prototype.squareCornersFlat = function () {
  const corners = [];
  for (let i = 0; i <= 3; i++) {
    const corner = {};
    const angleDeg = 90 * i + 45;
    const angleRad = (Math.PI / 180) * angleDeg;
    corner.x = this.center.x + this.size * Math.cos(angleRad);
    corner.y = this.center.y + this.size * Math.sin(angleRad);
    corners.push(corner);
  }
  this.corners = corners;
};

SquareObject.prototype.getPointOnEdge = function (fn, idx) {
  this.i = idx;
  const points = [];
  const c = this.corners;
  for (let i = 0; i < 4; i++) {
    points.push(fn(c[i], c[i + 1] || c[0]));
  }
  this.edgePoints[idx] = points;
};

function drawSquareSVG(size, offset, w, h, lines, bgColor, lineColor) {
  const figure = document.getElementById('Figure');
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttributeNS(null, 'width', w + 'px');
  svg.setAttributeNS(null, 'height', h + 'px');
  svg.setAttributeNS(null, 'id', 'svg_figure');

  const sq = new SquareObject({ x: 20, y: 20 }, size);
  sq.squareCornersFlat();
  for (let c = 0; c < lines; c++) {
    sq.getPointOnEdge(randomPointsOnLine, c);
  }

  const d = Number(offset);
  const pts = arrayToPoints(sq.corners);
  const sideLen = (sq.size / Math.sqrt(2)) * 2;

  for (let x = sideLen / 2; x < w - sideLen / 2; x += sideLen + d) {
    for (let y = sideLen / 2; y < h - sideLen / 2; y += sideLen + d) {
      const g = document.createElementNS(svgNS, 'g');
      g.setAttribute('class', 'tile');
      g.setAttribute('transform', 'translate(' + x + ',' + y + ')');
      const poly = document.createElementNS(svgNS, 'polygon');
      poly.setAttribute('points', pts);
      poly.setAttribute('fill', bgColor);
      poly.setAttribute('stroke', lineColor);
      svg.appendChild(g);
      g.appendChild(poly);
      sq.edgePoints.forEach(function (ep) {
        for (let i = 0; i <= 3; i++) {
          const j = randomInteger(0, 3);
          const line = document.createElementNS(svgNS, 'line');
          line.setAttribute('x1', ep[i].x);
          line.setAttribute('y1', ep[i].y);
          line.setAttribute('x2', ep[j].x);
          line.setAttribute('y2', ep[j].y);
          line.setAttribute('stroke', lineColor);
          g.appendChild(line);
        }
      });
    }
  }
  figure.appendChild(svg);
}

// Triangle

function TriangleObject(center, size) {
  this.center = center;
  this.size = size;
  this.edgePoints = [];
}

TriangleObject.prototype.triangleCornersFlat = function () {
  const corners = [];
  for (let i = 0; i <= 2; i++) {
    const corner = {};
    const angleDeg = 120 * i + 30;
    const angleRad = (Math.PI / 180) * angleDeg;
    corner.x = this.center.x + this.size * Math.cos(angleRad);
    corner.y = this.center.y + this.size * Math.sin(angleRad);
    corners.push(corner);
  }
  this.corners = corners;
};

TriangleObject.prototype.getPointOnEdge = function (fn, idx) {
  this.i = idx;
  const points = [];
  const c = this.corners;
  for (let i = 0; i < 3; i++) {
    points.push(fn(c[i], c[i + 1] || c[0]));
  }
  this.edgePoints[idx] = points;
};

function drawTriangleSVG(size, offset, w, h, lines, bgColor, lineColor) {
  const figure = document.getElementById('Figure');
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttributeNS(null, 'width', w + 'px');
  svg.setAttributeNS(null, 'height', h + 'px');
  svg.setAttributeNS(null, 'id', 'svg_figure');

  const tri = new TriangleObject({ x: 20, y: 20 }, size);
  tri.triangleCornersFlat();
  for (let c = 0; c < lines; c++) {
    tri.getPointOnEdge(randomPointsOnLine, c);
  }

  const d = Number(offset);
  const pts = arrayToPoints(tri.corners);
  const triH = tri.size;
  const colW = Math.cos(Math.PI / 6) * triH * 2;
  const rowH = Math.sin(Math.PI / 6) * triH + triH;

  for (let x = colW / 2; x < w - colW; x += colW + d) {
    for (let y = 2 * rowH; y < h - rowH / 2; y += colW + d) {
      const g = document.createElementNS(svgNS, 'g');
      g.setAttribute('class', 'tile');
      g.setAttribute('transform', 'translate(' + x + ',' + y + ')');
      const poly = document.createElementNS(svgNS, 'polygon');
      poly.setAttribute('points', pts);
      poly.setAttribute('fill', bgColor);
      poly.setAttribute('stroke', lineColor);
      svg.appendChild(g);
      g.appendChild(poly);
      tri.edgePoints.forEach(function (ep) {
        for (let i = 0; i <= 2; i++) {
          const j = randomInteger(0, 2);
          const line = document.createElementNS(svgNS, 'line');
          line.setAttribute('x1', ep[i].x);
          line.setAttribute('y1', ep[i].y);
          line.setAttribute('x2', ep[j].x);
          line.setAttribute('y2', ep[j].y);
          line.setAttribute('stroke', lineColor);
          g.appendChild(line);
        }
      });
    }
  }
  figure.appendChild(svg);
}

// SVG Download

const doctype =
  '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

const prefix = {
  xmlns: 'http://www.w3.org/2000/xmlns/',
  xlink: 'http://www.w3.org/1999/xlink',
  svg: 'http://www.w3.org/2000/svg',
};

let SVGSources = [];
const body = document.body;

const emptySvg = window.document.createElementNS(prefix.svg, 'svg');
emptySvg.setAttribute('class', 'displaynone');
window.document.body.appendChild(emptySvg);
const emptySvgDeclarationComputed = getComputedStyle(emptySvg);

function setInlineStyles(el, emptyComputed) {
  function applyStyles(node) {
    const computed = getComputedStyle(node);
    let styleStr = '';
    for (let i = 0; i < computed.length; i++) {
      const prop = computed[i];
      const val = computed.getPropertyValue(prop);
      if (val !== emptyComputed.getPropertyValue(prop)) {
        styleStr += prop + ':' + val + ';';
      }
    }
    node.setAttribute('style', styleStr);
  }

  function getNodes(root) {
    const nodes = [];
    nodes.push(root);
    if (root && root.hasChildNodes()) {
      let child = root.firstChild;
      while (child) {
        if (child.nodeType === 1 && child.nodeName !== 'SCRIPT') {
          nodes.push(child);
          // recurse
          const childNodes = getNodes(child);
          childNodes.shift(); // remove duplicate root
          nodes.push(...childNodes);
        }
        child = child.nextSibling;
      }
    }
    return nodes;
  }

  const nodes = getNodes(el);
  for (let i = nodes.length; i--; ) {
    applyStyles(nodes[i]);
  }
}

function getSources(doc, emptyComputed) {
  const sources = [];
  const svgs = doc.querySelectorAll('svg');
  [].forEach.call(svgs, function (svgEl) {
    svgEl.setAttribute('version', '1.1');
    svgEl.removeAttribute('xmlns');
    svgEl.removeAttribute('xlink');
    if (!svgEl.hasAttributeNS(prefix.xmlns, 'xmlns')) {
      svgEl.setAttributeNS(prefix.xmlns, 'xmlns', prefix.svg);
    }
    if (!svgEl.hasAttributeNS(prefix.xmlns, 'xmlns:xlink')) {
      svgEl.setAttributeNS(prefix.xmlns, 'xmlns:xlink', prefix.xlink);
    }
    setInlineStyles(svgEl, emptyComputed);
    const serialized = new XMLSerializer().serializeToString(svgEl);
    const rect = svgEl.getBoundingClientRect();
    sources.push({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      class: svgEl.getAttribute('class'),
      id: svgEl.getAttribute('id'),
      childElementCount: svgEl.childElementCount,
      source: [doctype + serialized],
    });
  });
  return sources;
}

function initiateDownload() {
  const docs = [window.document];
  docs.forEach(function (doc) {
    const sources = getSources(doc, emptySvgDeclarationComputed);
    SVGSources = [];
    for (let i = 0; i < sources.length; i++) {
      SVGSources.push(sources[i]);
    }
  });
}

function download(source) {
  let filename = 'untitled';
  if (source.id) filename = source.id;
  else if (source.class) filename = source.class;
  else if (window.document.title)
    filename = window.document.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();

  const url = window.URL.createObjectURL(
    new Blob(source.source, { type: 'text/xml' }),
  );
  const existing = document.getElementsByClassName('svg-crowbar')[0];
  if (existing) existing.remove();
  const a = document.createElement('a');
  body.appendChild(a);
  a.setAttribute('class', 'svg-crowbar');
  a.setAttribute('download', filename + '.svg');
  a.setAttribute('href', url);
  a.style.display = 'none';
  a.click();
  setTimeout(function () {
    window.URL.revokeObjectURL(url);
  }, 10);
}

// Init prototypes for test objects
const hex = new HexObject({ x: 300, y: 100 }, 80);
hex.hexCornersFlat();
for (let i = 0; i < 3; i++) hex.getPointOnEdge(randomPointsOnLine, i);

const squareTest = new SquareObject({ x: 100, y: 100 }, 100);
squareTest.squareCornersFlat();
for (let i = 0; i < 3; i++) squareTest.getPointOnEdge(randomPointsOnLine, i);

const triangleTest = new TriangleObject({ x: 490, y: 125 }, 90);
triangleTest.triangleCornersFlat();
for (let i = 0; i < 2; i++) triangleTest.getPointOnEdge(randomPointsOnLine, i);

// Controls

const selectFigure = document.getElementById('figure_select');
const sizeValue = document.getElementById('sizeValue');
const offsetValue = document.getElementById('offsetValue');
const svgWidth = document.getElementById('svgWidth');
const svgHeight = document.getElementById('svgHeight');
const svgLines = document.getElementById('lines');
const bgColor = document.getElementById('bgColor');
const lineColor = document.getElementById('lineColor');

const buttonDraw = document.getElementById('generate');
buttonDraw.addEventListener('click', function () {
  const existing = document.getElementById('svg_figure');
  if (existing) existing.remove();
  switch (selectFigure.value) {
    case 'HEX':
      drawHexSVG(
        sizeValue.value,
        offsetValue.value,
        svgWidth.value,
        svgHeight.value,
        svgLines.value,
        bgColor.value,
        lineColor.value,
      );
      break;
    case 'Triangle':
      drawTriangleSVG(
        sizeValue.value,
        offsetValue.value,
        svgWidth.value,
        svgHeight.value,
        svgLines.value,
        bgColor.value,
        lineColor.value,
      );
      break;
    case 'Square':
      drawSquareSVG(
        sizeValue.value,
        offsetValue.value,
        svgWidth.value,
        svgHeight.value,
        svgLines.value,
        bgColor.value,
        lineColor.value,
      );
      break;
  }
});

const buttonDownload = document.getElementById('download');
buttonDownload.addEventListener('click', function () {
  initiateDownload();
  download(SVGSources[1]);
});
