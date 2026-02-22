const cx = document.getElementById('game').getContext('2d');
const scale = 20;
const rowCount = Math.floor(cx.canvas.height / scale);
const columnCount = Math.floor(cx.canvas.width / scale);
const color = '#0095DD';

let boxes = [];
for (let c = 0; c < columnCount; c++) {
  boxes[c] = [];
  for (let r = 0; r < rowCount; r++) {
    boxes[c][r] = { x: 0, y: 0, status: 0 };
  }
}

function boxRandomize() {
  boxes.forEach(function (boxColumn) {
    boxColumn.forEach(function (box) {
      box.status = Math.round(Math.random());
    });
  });
}

function clickOnBox(p, box) {
  return !(
    p.x < box.x ||
    p.y < box.y ||
    p.x > box.x + scale ||
    p.y > box.y + scale
  );
}

document.getElementById('game').addEventListener('click', function (e) {
  const p = { x: e.offsetX, y: e.offsetY };
  boxes.forEach(function (boxColumn) {
    boxColumn.forEach(function (box) {
      if (clickOnBox(p, box)) {
        box.status = box.status === 0 ? 1 : 0;
        updateField();
      }
    });
  });
});

function drawBoxes(boxes) {
  for (let c = 0; c < columnCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      const boxX = c * scale;
      const boxY = r * scale;
      boxes[c][r].x = boxX;
      boxes[c][r].y = boxY;
      if (boxes[c][r].status === 1) {
        cx.beginPath();
        cx.rect(boxX, boxY, scale, scale);
        cx.fillStyle = color;
        cx.fill();
        cx.closePath();
      }
    }
  }
}

function drawGrid() {
  cx.beginPath();
  cx.strokeStyle = 'white';
  cx.lineWidth = 0.7;
  for (let i = 0; i < cx.canvas.height / scale; i++) {
    cx.moveTo(0, scale + scale * i);
    cx.lineTo(cx.canvas.width, scale + scale * i);
  }
  for (let i = 0; i < cx.canvas.width / scale; i++) {
    cx.moveTo(scale + scale * i, 0);
    cx.lineTo(scale + scale * i, cx.canvas.height);
  }
  cx.stroke();
}

let step = 0;

function drawStep() {
  cx.font = '16px Arial';
  cx.fillStyle = '#000';
  cx.fillText('Step: ' + step, 3, 15);
}

function updateField() {
  cx.clearRect(0, 0, cx.canvas.width, cx.canvas.height);
  drawBoxes(boxes);
  drawGrid();
  drawStep();
}

let boxesNextStep = [];
for (let c = 0; c < columnCount; c++) {
  boxesNextStep[c] = [];
  for (let r = 0; r < rowCount; r++) {
    boxesNextStep[c][r] = { x: 0, y: 0, status: 0 };
  }
}

function getNextStep(boxes) {
  boxes.forEach(function (_, column) {
    _.forEach(function (_box, row) {
      boxesNextStep[column][row].status = isAlive(boxes, column, row);
    });
  });
  return boxesNextStep;
}

function boxCopy(boxes, boxesNextStep) {
  boxes.forEach(function (_, column) {
    _.forEach(function (_box, row) {
      boxes[column][row] = boxesNextStep[column][row];
    });
  });
  return boxes;
}

function cleanNextStep(arr) {
  for (let c = 0; c < columnCount; c++) {
    arr[c] = [];
    for (let r = 0; r < rowCount; r++) {
      arr[c][r] = { x: 0, y: 0, status: 0 };
    }
  }
  return arr;
}

function isAlive(boxes, column, row) {
  let around = [];
  if (
    column !== 0 &&
    column !== columnCount - 1 &&
    row !== 0 &&
    row !== rowCount - 1
  ) {
    around = [
      boxes[column][row - 1].status,
      boxes[column + 1][row - 1].status,
      boxes[column + 1][row].status,
      boxes[column + 1][row + 1].status,
      boxes[column][row + 1].status,
      boxes[column - 1][row + 1].status,
      boxes[column - 1][row].status,
      boxes[column - 1][row - 1].status,
    ];
  } else if (column === 0 && row === 0) {
    around = [
      boxes[column][rowCount - 1].status,
      boxes[column + 1][rowCount - 1].status,
      boxes[column + 1][row].status,
      boxes[column + 1][row + 1].status,
      boxes[column][row + 1].status,
      boxes[columnCount - 1][row + 1].status,
      boxes[columnCount - 1][row].status,
      boxes[columnCount - 1][rowCount - 1].status,
    ];
  } else if (column === columnCount - 1 && row === rowCount - 1) {
    around = [
      boxes[column][row - 1].status,
      boxes[0][row - 1].status,
      boxes[0][row].status,
      boxes[0][0].status,
      boxes[column][0].status,
      boxes[column - 1][0].status,
      boxes[column - 1][row].status,
      boxes[column - 1][row - 1].status,
    ];
  } else if (column === 0 && row === rowCount - 1) {
    around = [
      boxes[column][row - 1].status,
      boxes[column + 1][row - 1].status,
      boxes[column + 1][row].status,
      boxes[column + 1][0].status,
      boxes[column][0].status,
      boxes[columnCount - 1][0].status,
      boxes[columnCount - 1][row].status,
      boxes[columnCount - 1][row - 1].status,
    ];
  } else if (column === columnCount - 1 && row === 0) {
    around = [
      boxes[column][rowCount - 1].status,
      boxes[0][rowCount - 1].status,
      boxes[0][row].status,
      boxes[0][row + 1].status,
      boxes[column][row + 1].status,
      boxes[column - 1][row + 1].status,
      boxes[column - 1][row].status,
      boxes[column - 1][rowCount - 1].status,
    ];
  } else if (row === 0) {
    around = [
      boxes[column][rowCount - 1].status,
      boxes[column + 1][rowCount - 1].status,
      boxes[column + 1][row].status,
      boxes[column + 1][row + 1].status,
      boxes[column][row + 1].status,
      boxes[column - 1][row + 1].status,
      boxes[column - 1][row].status,
      boxes[column - 1][rowCount - 1].status,
    ];
  } else if (column === 0) {
    around = [
      boxes[column][row - 1].status,
      boxes[column + 1][row - 1].status,
      boxes[column + 1][row].status,
      boxes[column + 1][row + 1].status,
      boxes[column][row + 1].status,
      boxes[columnCount - 1][row + 1].status,
      boxes[columnCount - 1][row].status,
      boxes[columnCount - 1][row - 1].status,
    ];
  } else if (row === rowCount - 1) {
    around = [
      boxes[column][row - 1].status,
      boxes[column + 1][row - 1].status,
      boxes[column + 1][row].status,
      boxes[column + 1][0].status,
      boxes[column][0].status,
      boxes[column - 1][0].status,
      boxes[column - 1][row].status,
      boxes[column - 1][row - 1].status,
    ];
  } else if (column === columnCount - 1) {
    around = [
      boxes[column][row - 1].status,
      boxes[0][row - 1].status,
      boxes[0][row].status,
      boxes[0][row + 1].status,
      boxes[column][row + 1].status,
      boxes[column - 1][row + 1].status,
      boxes[column - 1][row].status,
      boxes[column - 1][row - 1].status,
    ];
  }
  const livecount = around.reduce((a, b) => a + b, 0);
  if (boxes[column][row].status === 1 && livecount === 2) return 1;
  else if (livecount <= 2) return 0;
  else if (boxes[column][row].status === 1 && livecount === 3) return 1;
  else if (livecount > 3) return 0;
  else if (boxes[column][row].status === 0 && livecount === 3) return 1;
  return 0;
}

let timer;
let isTimerOn = false;

document.getElementById('step').addEventListener('click', function () {
  getNextStep(boxes);
  boxCopy(boxes, boxesNextStep);
  step++;
  updateField();
  cleanNextStep(boxesNextStep);
});

document.getElementById('random').addEventListener('click', function () {
  boxRandomize();
  updateField();
});

document.getElementById('start').addEventListener('click', function () {
  if (!isTimerOn) {
    const speedValue = document.getElementById('speed').value;
    timer = setInterval(function () {
      getNextStep(boxes);
      boxCopy(boxes, boxesNextStep);
      step++;
      updateField();
      cleanNextStep(boxesNextStep);
    }, speedValue * 100);
    isTimerOn = true;
  } else {
    clearInterval(timer);
    isTimerOn = false;
  }
});

document.getElementById('pause').addEventListener('click', function () {
  if (isTimerOn) {
    clearInterval(timer);
    isTimerOn = false;
  }
});

document.getElementById('clear').addEventListener('click', function () {
  step = 0;
  cleanNextStep(boxesNextStep);
  cleanNextStep(boxes);
  updateField();
  clearInterval(timer);
  isTimerOn = false;
});

updateField();
