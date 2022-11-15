import React, { useEffect, useRef } from 'react';
// import * as tf from '@tensorflow/tfjs';
// import * as posenet from '@tensorflow-models/posenet';
import './App.css';

function App() {
  // camera: {targetFPS: 60, sizeOption: '640 X 480'},
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const width = 640;
  const height = 480;

  useEffect(() => {
    setupCamera();
  }, [videoRef]);

  const setupCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available'
      );
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width: width,
        height: height,
      },
    });

    let video = videoRef.current;
    video.srcObject = stream;

    // Add this to properly handled Promise
    await new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });

    video.play();
  };

  const drawCanvas = () => {
    let video = videoRef.current;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    // Must set below two lines, otherwise video element doesn't show.
    video.width = videoWidth;
    video.height = videoHeight;

    let canvas = canvasRef.current;
    let ctx = canvas.getContext("2d");
    // see canvas size to avoid zoomed in
    canvas.width = width;
    canvas.height = height;
    // Because the image from camera is mirrored, need to flip horizontally.
    ctx.translate(video.videoWidth, 0);
    ctx.scale(-1, 1);

    return setInterval(() => {
      ctx.drawImage(video, 0, 0, width, height);
    }, 200);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="canvas-wrapper" style={{ width: '640px', height: '480px' }}>
          <h1>hi</h1>
          <canvas ref={canvasRef} />
          <video onCanPlay={() => drawCanvas()} ref={videoRef} style={{
          WebkitTransform: "scaleX(-1)",
          transform: "scaleX(-1)",
          visibility: "hidden",
          width: "auto",
          height: "0",
          }}/>
        </div>
      </header>
    </div>
  );
}

export default App;
