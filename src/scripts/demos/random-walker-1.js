const canvas = document.getElementById('rw1-canvas');
const cx = canvas.getContext('2d');

function randomStep() {
  const random = randomInteger(1, 4);
  const step = {};
  switch (random) {
    case 1:
      step.x = 1;
      step.y = 0;
      break;
    case 2:
      step.x = 0;
      step.y = 1;
      break;
    case 3:
      step.x = -1;
      step.y = 0;
      break;
    case 4:
      step.x = 0;
      step.y = -1;
      break;
  }
  return step;
}

function randomInteger(min, max) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

function getRandomColor() {
  const max = 254;
  const red = Math.floor(Math.random() * max);
  const green = Math.floor(Math.random() * max);
  const blue = Math.floor(Math.random() * max);
  return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
}

const position = {};
position.x = canvas.width / 2;
position.y = canvas.height / 2;
const radius = 1;

setInterval(() => {
  const step = randomStep();
  position.x += step.x * 3;
  position.y += step.y * 3;
  cx.beginPath();
  cx.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
  cx.fillStyle = getRandomColor();
  cx.fill();
  cx.closePath();
}, 5);
