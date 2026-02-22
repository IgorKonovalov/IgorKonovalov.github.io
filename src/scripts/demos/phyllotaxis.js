const canvas = document.getElementById('phyllotaxis-canvas');
const cx = canvas.getContext('2d');
const button = document.getElementById('phyllotaxis-start');
const angleInput = document.getElementById('phyllotaxis-angle');

function degreeToRad(degree) {
  return (degree / 180) * Math.PI;
}

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let drawingInterval;
let n = 0;
const c = 10;
let running = false;
let angle = Number(angleInput.value);

cx.fillStyle = 'white';

function draw(angle) {
  const a = degreeToRad(n * angle);
  const rad = c * Math.sqrt(n);
  const x = rad * Math.cos(a) + centerX;
  const y = rad * Math.sin(a) + centerY;
  cx.beginPath();
  cx.arc(x, y, 5, 0, 2 * Math.PI);
  cx.fillStyle = `hsl(${n * 0.6}, 100%, 50%)`;
  cx.fill();
  if (rad > canvas.width / 2 - 20) {
    clearInterval(drawingInterval);
  }
  n++;
}

button.addEventListener('click', () => {
  if (running) {
    clearInterval(drawingInterval);
    button.innerHTML = 'START';
    running = false;
  } else {
    cx.clearRect(0, 0, canvas.width, canvas.height);
    angle = angleInput.value;
    n = 0;
    drawingInterval = setInterval(() => {
      draw(angle);
    }, 10);
    button.innerHTML = 'STOP';
    running = true;
  }
});
