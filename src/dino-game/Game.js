import React, { useState, useEffect, useRef } from 'react';
import styles from './game.module.css';
import ground from '../assets/ground.png';
import dinoStationary from '../assets/dino-stationary.png';
import { setupGround, updateGround } from './ground';
import { setupDino, updateDino } from './dino';
import { setupCactus, updateCactus } from './cactus';

function Game() {
  const worldRef = useRef(null);
  const scoreElem = useRef(null);
  const WORLD_WIDTH = 100;
  const WORLD_HEIGHT = 30;
  const SPEED_SCALE_INCREASE = 0.00001;
  const [start, setStart] = useState(false);

  let lastTime;
  let score = 0;
  let speedScale = 1;

  // Initialize things that runs the first time
  useEffect(() => {
    setPixelToWorldScale();
    window.addEventListener('resize', setPixelToWorldScale);
    document.addEventListener('keydown', handleStart, { once: true });
  }, []);

  function handleStart() {
    lastTime = null;
    speedScale = 1;
    score = 0;
    setupGround();
    setupDino();
    setStart(true);
    setupCactus();

    requestAnimationFrame(update);
  }

  function updateScore(delta) {
    // 1 point every 100 milliseconds
    score += delta * 0.01;
    scoreElem.current.textContent = Math.floor(score);
  }

  function update(time) {
    if (lastTime == null) {
      // This minimize the time takes to load for the first time
      lastTime = time;
      requestAnimationFrame(update);
      return;
    }
    const delta = time - lastTime;
    // console.log(delta);

    updateGround(delta, speedScale);
    updateDino(delta, speedScale);
    updateCactus(delta, speedScale);
    updateSpeedScale(delta);
    updateScore(delta);

    lastTime = time;
    requestAnimationFrame(update);
  }

  function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE;
  }

  function setPixelToWorldScale() {
    let worldToPixelScale;
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
      worldToPixelScale = window.innerWidth / WORLD_WIDTH;
    } else {
      worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
    }

    worldRef.current.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
    worldRef.current.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
  }

  return (
    <div className={styles.world} ref={worldRef} data-world>
      <div className={styles.score} ref={scoreElem}>
        0
      </div>
      <div
        className={styles.startScreen}
        style={{ display: start ? 'none' : '' }}
      >
        Press Any Key To Start
      </div>
      <img
        src={ground}
        alt="ground"
        className={styles.ground}
        data-ground
      ></img>
      <img
        src={ground}
        alt="ground"
        className={styles.ground}
        data-ground
      ></img>
      <img src={dinoStationary} alt="dino" className={styles.dino} data-dino />
    </div>
  );
}

export default Game;
