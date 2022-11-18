import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from './updateCustomerProperty';

const SPEED = 0.05;

export function setupGround() {
  const groundElems = document.querySelectorAll('[data-ground]');
  setCustomProperty(groundElems[0], '--left', 0);
  // 300 is because --left is based on % and set the width is 300% in the CSS
  // so the groundElems[1] will be right after groundElems[0]
  setCustomProperty(groundElems[1], '--left', 300);
}

// move the ground by modifying the CSS
export function updateGround(delta, speedScale) {
  const groundElems = document.querySelectorAll('[data-ground]');
  groundElems.forEach((ground) => {
    // -1 means backwards
    incrementCustomProperty(ground, '--left', delta * speedScale * SPEED * -1);

    // if ground image moved to the end of the screen
    if (getCustomProperty(ground, '--left') <= -300) {
      incrementCustomProperty(ground, '--left', 300 * 2);
    }
  });
}
