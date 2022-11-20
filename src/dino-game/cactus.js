import cactusImg from "../assets/cactus.png";

import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from "./updateCustomerProperty.js";

const SPEED = 0.05;
const CACTUS_INTERVAL_MIN = 500;
const CACTUS_INTERVAL_MAX = 2000;

let nextCactusTime;
export function setupCactus() {
  nextCactusTime = CACTUS_INTERVAL_MIN;
  document.querySelectorAll("[data-cactus]").forEach((cactus) => {
    cactus.remove();
  });
}

export function updateCactus(delta, speedScale) {
  document.querySelectorAll("[data-cactus]").forEach((cactus) => {
    incrementCustomProperty(cactus, "--left", delta * speedScale * SPEED * -1);
    if (getCustomProperty(cactus, "--left") <= -100) {
      cactus.remove();
    }
  });

  if (nextCactusTime <= 0) {
    createCactus();
    nextCactusTime =
      randomNumberBetween(CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX) /
      speedScale;
  }
  nextCactusTime -= delta;
}

export function getCactusRects() {
  return [...document.querySelectorAll("[data-cactus]")].map((cactus) => {
    return cactus.getBoundingClientRect();
  });
}

function createCactus() {
  const worldElem = document.querySelector("[data-world]");
  const cactus = document.createElement("img");
  cactus.dataset.cactus = true;
  cactus.src = cactusImg;

  //   position: absolute;
  //   left: calc(var(--left) * 1%);
  //   height: 30%;
  //   bottom: 0;
    // cactus.classList.add("cactus");
  
  cactus.style.position = "absolute";
  cactus.style.left = "calc(var(--left) * 1%)"
  cactus.style.height = "30%"
  cactus.style.bottom = 0;
  console.log(cactus);
  setCustomProperty(cactus, "--left", 100);
  worldElem.append(cactus);
  console.log(worldElem);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
