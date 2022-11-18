import dinoStationary from '../assets/dino-stationary.png';
import dinoRun0 from '../assets/dino-run-0.png';
import dinoRun1 from '../assets/dino-run-1.png';

const JUMP_SPEED = 0.45;
const GRAVITY = 0.011;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100; // every frame last 100 milliseconds
const FRAME = [dinoRun0, dinoRun1];

let isJumping;
let dinoFrame;
let currentFrameTime;

export function setupDino() {
  isJumping = false;
  dinoFrame = 0;
  currentFrameTime = 0;
}

export function updateDino(delta, speedScale) {
  const dinoElem = document.querySelector('[data-dino]');
  handleRun(delta, speedScale);
  handleJump(delta);
}

function handleRun(delta, speedScale) {
  const dinoElem = document.querySelector('[data-dino]');

  if (isJumping) {
    dinoElem.src = dinoStationary;
    return;
  }

  if (currentFrameTime >= FRAME_TIME) {
    // alternating the frame
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
    dinoElem.src = FRAME[dinoFrame];
    currentFrameTime -= FRAME_TIME; // reset currentFrameTime
  }
  currentFrameTime += delta * speedScale; // increase animation speed
}

function handleJump(delta) {}
