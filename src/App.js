import React, { useEffect, useRef } from 'react';
// import * as tf from '@tensorflow/tfjs';
// import * as posenet from '@tensorflow-models/posenet';
import './App.css';

function App() {
  // camera: {targetFPS: 60, sizeOption: '640 X 480'},
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const videoWidth = 640;
  const videoHeight = 480;

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
        width: videoWidth,
        height: videoHeight,
      },
    });

    let video = videoRef.current;
    video.srcObject = stream;
    video.play();
  };

  return (
    <div className="App">
      <header className="App-header">
          <div>
            <h1>hi</h1>
            <video ref={videoRef} />
          </div>
      </header>
    </div>
  );
}

export default App;
