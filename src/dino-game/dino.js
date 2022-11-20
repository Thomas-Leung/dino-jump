import dinoStationary from "../assets/dino-stationary.png";
import dinoRun0 from "../assets/dino-run-0.png";
import dinoRun1 from "../assets/dino-run-1.png";
import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomerProperty";

const JUMP_SPEED = 0.45;
const GRAVITY = 0.001;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100; // every frame last 100 milliseconds
const FRAME = [dinoRun0, dinoRun1];

let isJumping;
let dinoFrame;
let currentFrameTime;
let yVelocity;

export function setupDino() {
  const dinoElem = document.querySelector("[data-dino]");

  isJumping = false;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;

  setCustomProperty(dinoElem, "--bottom", 0); // make sure we start on the ground
  document.removeEventListener("keydown", onJump); // remove first incase we already have a listener
  document.addEventListener("keydown", onJump);
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
}

function handleRun(delta, speedScale) {
  const dinoElem = document.querySelector("[data-dino]");

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

function handleJump(delta) {
  const dinoElem = document.querySelector("[data-dino]");

  // only handle jump when we are jumping
  if (!isJumping) return;

  // yVelocity will get lower and lower to move the dino down
  incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta);

  if (getCustomProperty(dinoElem, "--bottom") <= 0) {
    // dino already back or even lower than ground level, so we set to 0 and false
    setCustomProperty(dinoElem, "--bottom", 0);
    isJumping = false;
  }
  yVelocity -= GRAVITY * delta;
}

function onJump(event) {
  // don't do anything user is not pressing space and when dino is already jumping
  if (event.code !== "Space" || isJumping) return;

  yVelocity = JUMP_SPEED;
  isJumping = true;
}
