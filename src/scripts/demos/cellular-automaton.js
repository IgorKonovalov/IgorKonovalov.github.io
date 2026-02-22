// Rules for elementary cellular automaton
const RULES = [
  {
    rule: 18,
    ruleMap: [
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1],
      [1, 0, 0],
      [0, 1, 1],
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0],
    ],
    ruleValue: [false, false, false, true, false, false, true, false],
  },
  {
    rule: 22,
    ruleMap: [
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1],
      [1, 0, 0],
      [0, 1, 1],
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0],
    ],
    ruleValue: [false, false, false, true, false, true, true, false],
  },
  {
    rule: 30,
    ruleMap: [
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1],
      [1, 0, 0],
      [0, 1, 1],
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0],
    ],
    ruleValue: [false, false, false, true, true, true, true, false],
  },
  {
    rule: 45,
    ruleMap: [
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1],
      [1, 0, 0],
      [0, 1, 1],
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0],
    ],
    ruleValue: [false, false, true, false, true, true, false, true],
  },
  {
    rule: 54,
    ruleMap: [
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1],
      [1, 0, 0],
      [0, 1, 1],
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0],
    ],
    ruleValue: [false, false, true, true, false, true, true, false],
  },
  {
    rule: 57,
    ruleMap: [
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1],
      [1, 0, 0],
      [0, 1, 1],
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0],
    ],
    ruleValue: [false, false, true, true, true, false, false, true],
  },
  {
    rule: 73,
    ruleMap: [
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1],
      [1, 0, 0],
      [0, 1, 1],
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0],
    ],
    ruleValue: [false, true, false, false, true, false, false, true],
  },
  {
    rule: 105,
    ruleMap: [
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1],
      [1, 0, 0],
      [0, 1, 1],
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0],
    ],
    ruleValue: [false, true, true, false, true, false, false, true],
  },
  {
    rule: 110,
    ruleMap: [
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1],
      [1, 0, 0],
      [0, 1, 1],
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0],
    ],
    ruleValue: [false, true, true, false, true, true, true, false],
  },
  {
    rule: 225,
    ruleMap: [
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1],
      [1, 0, 0],
      [0, 1, 1],
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0],
    ],
    ruleValue: [true, true, true, false, false, false, false, true],
  },
];

const cx = document.getElementById('automata').getContext('2d');
let color;
const cellColor = document.getElementById('cellColor');
cellColor.addEventListener('change', function () {
  if (psychoOn.checked) {
    psychoOn.checked = false;
  }
  color = cellColor.value;
});

let canvasColor = 'black';
const canvasUserColor = document.getElementById('canvasColor');
canvasUserColor.addEventListener('change', function () {
  canvasColor = canvasUserColor.value;
  clearCanvas();
});

const scale = 4;
const rowCount = Math.floor(cx.canvas.height / scale);
const columnCount = Math.floor(cx.canvas.width / scale);

let randomColor;
function getRandomColor() {
  const max = 254;
  const red = Math.floor(Math.random() * max);
  const green = Math.floor(Math.random() * max);
  const blue = Math.floor(Math.random() * max);
  randomColor = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
  return randomColor;
}

function setRandomRow(row) {
  row.forEach((cell) => {
    cell.status = Math.round(Math.random());
  });
}

function setOneCellRow(row) {
  const posX = Math.round(columnCount / 2);
  row[posX].status = 1;
}

let cells = [];
function createStart() {
  for (let row = 0; row < rowCount; row++) {
    cells[row] = [];
    cells[row].color = getRandomColor() || color;
    for (let column = 0; column < columnCount; column++) {
      cells[row][column] = { x: 0, y: 0, status: 0 };
    }
  }
}

createStart();

function drawRow(index) {
  if (psychoOn.checked) {
    getRandomColor();
  }
  cells[index].forEach(function (cell, column) {
    cell.x = column * scale;
    cell.y = index * scale;
    if (cell.status === 1) {
      cx.beginPath();
      cx.rect(cell.x, cell.y, scale, scale);
      cx.fillStyle = color || randomColor;
      cx.fill();
      cx.closePath();
    }
  });
}

function drawAllRows(cells) {
  cells.forEach((_, index) => {
    drawRow(index);
  });
}

function setNextRowByRule(rule, prevRow, nextRow) {
  const length = prevRow.length;
  nextRow.forEach((cell, index) => {
    const target = cell;
    const leftSibling = prevRow[index - 1] || prevRow[length - 1];
    const prevSelf = prevRow[index];
    const rightSibling = prevRow[index + 1] || prevRow[0];
    for (let i = 0; i < 8; i++) {
      const matchesRule =
        leftSibling.status === rule.ruleMap[i][0] &&
        prevSelf.status === rule.ruleMap[i][1] &&
        rightSibling.status === rule.ruleMap[i][2];
      if (matchesRule) {
        target.status = rule.ruleValue[i] ? 1 : 0;
      }
    }
  });
}

function clearCanvas() {
  cx.beginPath();
  cx.rect(0, 0, cx.canvas.width, cx.canvas.height);
  cx.fillStyle = canvasColor;
  cx.fill();
}

const selectFirstRow = document.getElementById('selectFirstRow');
let firstRowState = 'Random';
selectFirstRow.addEventListener('change', function () {
  firstRowState = selectFirstRow.value;
});
['Random', 'One'].forEach((label) => {
  const option = document.createElement('option');
  option.innerHTML = label;
  selectFirstRow.appendChild(option);
});

const selectRule = document.getElementById('selectRule');
for (const item in RULES) {
  const option = document.createElement('option');
  option.innerHTML = RULES[item].rule;
  selectRule.appendChild(option);
}

function clearAllIntervals() {
  for (let i = 1; i < 99999; i++) window.clearInterval(i);
}

function updateCanvas(ruleNumber, first) {
  createStart();
  clearCanvas();
  clearAllIntervals();
  if (first === 'Random') {
    setRandomRow(cells[0]);
  } else if (first === 'One') {
    setOneCellRow(cells[0]);
  }
  let count = 0;
  const update = setInterval(function () {
    setNextRowByRule(RULES[ruleNumber], cells[count], cells[count + 1]);
    drawAllRows(cells);
    count++;
    if (count === rowCount - 1) {
      clearInterval(update);
    }
  }, 50);
}

document.getElementById('startPause').addEventListener('click', function () {
  for (const item in RULES) {
    if (RULES[item].rule == selectRule.value) {
      updateCanvas(item, firstRowState);
    }
  }
});

document.getElementById('clear').addEventListener('click', function () {
  clearAllIntervals();
  createStart();
  clearCanvas();
});

const psychoOn = document.getElementById('psychedelic');
psychoOn.addEventListener('change', function () {
  if (psychoOn.checked) {
    color = null;
  }
});
