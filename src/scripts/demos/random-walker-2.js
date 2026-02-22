const canvas = document.getElementById('rw2-canvas');
const cx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.plus = function (other) {
  return new Vector(this.x + other.x, this.y + other.y);
};

Vector.prototype.random = function (length) {
  const x = randomNumber(-length, length);
  const y = Math.sqrt(Math.pow(length, 2) - Math.pow(x, 2)) * randomSign();
  return new Vector(x, y);
};

function randomNumber(min, max) {
  if (min > 0) return (max - min) * Math.random();
  else return (max - min) * Math.random() + min;
}

function randomSign() {
  const test = Math.round(Math.random() * 2);
  if (test === 1) return -1;
  else return 1;
}

let centerV = new Vector(width / 2, height / 2);

cx.strokeStyle = 'white';

function draw() {
  const rVector = new Vector(0, 0);
  let length = 4;
  const randomChance = randomNumber(1, 100);
  if (randomChance < 10) {
    length = randomNumber(150, 300);
  }
  cx.beginPath();
  cx.moveTo(centerV.x, centerV.y);
  if (centerV.x > width) centerV.x += -100;
  if (centerV.x < 0) centerV.x += 100;
  if (centerV.y > height) centerV.y += -100;
  if (centerV.y < 0) centerV.y += 100;
  const newCenter = centerV.plus(rVector.random(length));
  cx.lineTo(newCenter.x, newCenter.y);
  cx.closePath();
  cx.stroke();
  centerV = newCenter;
}

const timer = setInterval(() => {
  draw();
}, 200);

const stopB = document.getElementById('rw2-stop');
stopB.addEventListener('click', () => {
  clearInterval(timer);
});
