import React, { useState, useEffect, useRef } from 'react';
import '@tensorflow/tfjs-backend-webgl';
import * as mpPose from '@mediapipe/pose'; // eslint-disable-line no-unused-vars
import * as posedetection from '@tensorflow-models/pose-detection';
import './App.css';
import Game from './dino-game/Game';
import Dino from './dino-game2/dino';

function App() {
  // camera: {targetFPS: 60, sizeOption: '640 X 480'},
  let detector;
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [jumpCount, setJumpCount] = useState(0);
  const [isSquat, setIsSquat] = useState(false);
  const [isJump, setIsJump] = useState(false);
  const [squatCount, setSquatCount] = useState(0);
  let ctx = null;

  const width = 640;
  const height = 480;

  // useEffect(() => {
  //   init();
  // }, [videoRef]);

  // // When isSquat changed, this will triggered
  // useEffect(() => {
  //   if (isSquat) {
  //     setSquatCount(function (prevCount) {
  //       return prevCount + 1;
  //     });
  //   }
  // }, [isSquat]);

  // useEffect(() => {
  //   if (isJump) {
  //     setJumpCount(function (prevCount) {
  //       return prevCount + 1;
  //     });
  //   }
  // }, [isJump]);

  // const init = async () => {
  //   setupCamera();
  //   detector = await createDetector();
  //   // setInterval(() => {
  //   //   renderResult()
  //   // }, 5000);
  //   renderResult();
  // };

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
    ctx = canvas.getContext('2d');
    // see canvas size to avoid zoomed in
    canvas.width = width;
    canvas.height = height;
    // Because the image from camera is mirrored, need to flip horizontally.
    ctx.translate(video.videoWidth, 0);
    ctx.scale(-1, 1);

    // return setInterval(() => {
    //   ctx.drawImage(video, 0, 0, width, height);
    // }, 200);
    ctx.drawImage(video, 0, 0, width, height);
  };

  const createDetector = async () => {
    const model = posedetection.SupportedModels.MoveNet;
    const detector = await posedetection.createDetector(model, {
      quantBytes: 4,
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: { width: 500, height: 500 },
      multiplier: 0.75,
    });
    return detector;
    // const poses = await detector.estimatePoses(image);
  };

  const renderResult = async () => {
    let video = videoRef.current;
    if (video.readyState < 2) {
      await new Promise((resolve) => {
        video.onloadeddata = () => {
          resolve(video);
        };
      });
    }

    let poses = null;

    // Detector can be null if initialization failed (for example when loading
    // from a URL that does not exist).
    if (detector != null) {
      // Detectors can throw errors, for example when using custom URLs that
      // contain a model that doesn't provide the expected output.
      try {
        poses = await detector.estimatePoses(videoRef.current, {
          maxPoses: 1,
          flipHorizontal: false,
        });
        console.log(poses);
      } catch (error) {
        detector.dispose();
        detector = null;
        alert(error);
      }
    }
    drawCanvas();
    drawResults(poses);
    if (poses.length > 0) {
      // only one person so get the first pose
      processResult(poses[0].keypoints);
    }
    // requestAnimationFrame(renderResult);
  };

  const processResult = (keypoints) => {
    // processSquat(keypoints);
    processJump(keypoints);
  };

  const processJump = (keypoints) => {
    let leftHip = keypoints[11];
    let rightHip = keypoints[12];
    let hip;
    if (leftHip && !rightHip) {
      hip = leftHip;
    } else if (rightHip && !leftHip) {
      hip = rightHip;
    } else {
      if (leftHip.score > rightHip.score) {
        hip = leftHip;
      } else {
        hip = rightHip;
      }
    }

    if (!hip || hip.scale < 0.6) {
      // no hip found
      return;
    }

    let height = videoRef.current.height
    let position = height - hip.y;

    if (position > height * 0.5) {
      console.log("HOHOHOHOHOHOHOHOHOHOHOHOHOHOH")
    }
  };

  const processSquat = (keypoints) => {
    // 11 and 13 are based on COCO Keypoints
    let leftHip = keypoints[11];
    let leftKnee = keypoints[13];
    if (leftKnee.score > 0.6 && leftHip.score > 0.6) {
      // 80 is just an arbitrary threshold
      if (leftKnee.y - leftHip.y < 80) {
        setIsSquat(true);
      } else {
        setIsSquat(false);
      }
    }
  };

  /**
   * Draw the keypoints and skeleton on the video.
   * @param poses A list of poses to render.
   */
  const drawResults = (poses) => {
    for (const pose of poses) {
      drawResult(pose);
    }
  };

  /**
   * Draw the keypoints and skeleton on the video.
   * @param pose A pose with keypoints to render.
   */
  const drawResult = (pose) => {
    if (pose.keypoints != null) {
      drawKeypoints(pose.keypoints);
      drawSkeleton(pose.keypoints);
    }
  };

  const drawKeypoints = (keypoints) => {
    // It returns left, middle, and right of the COCO Keypoints
    // Ref: https://github.com/tensorflow/tfjs-models/tree/master/pose-detection#example-code-and-demos
    const keypointInd = posedetection.util.getKeypointIndexBySide(
      posedetection.SupportedModels.MoveNet
    );
    ctx.fillStyle = 'Red';
    ctx.strokeStyle = 'White';
    ctx.lineWidth = 2;

    for (const i of keypointInd.middle) {
      drawKeypoint(keypoints[i]);
    }

    ctx.fillStyle = 'Green';
    for (const i of keypointInd.left) {
      drawKeypoint(keypoints[i]);
    }

    ctx.fillStyle = 'Orange';
    for (const i of keypointInd.right) {
      drawKeypoint(keypoints[i]);
    }
  };

  const drawKeypoint = (keypoint) => {
    // If score is null, just show the keypoint.
    const score = keypoint.score != null ? keypoint.score : 1;
    const scoreThreshold = 0.3 || 0;

    if (score >= scoreThreshold) {
      const circle = new Path2D();
      circle.arc(keypoint.x, keypoint.y, 4, 0, 2 * Math.PI);
      ctx.fill(circle);
      ctx.stroke(circle);
    }
  };

  /**
   * Draw the skeleton of a body on the video.
   * @param keypoints A list of keypoints.
   */
  const drawSkeleton = (keypoints) => {
    const color = 'White';
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    posedetection.util
      .getAdjacentPairs(posedetection.SupportedModels.MoveNet)
      .forEach(([i, j]) => {
        const kp1 = keypoints[i];
        const kp2 = keypoints[j];

        // If score is null, just show the keypoint.
        const score1 = kp1.score != null ? kp1.score : 1;
        const score2 = kp2.score != null ? kp2.score : 1;
        const scoreThreshold = 0.3 || 0;

        if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
          ctx.beginPath();
          ctx.moveTo(kp1.x, kp1.y);
          ctx.lineTo(kp2.x, kp2.y);
          ctx.stroke();
        }
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <Dino/>
        {/* <Game/> */}
        {/* <div
          className="canvas-wrapper"
          style={{ width: '640px', height: '480px' }}
        >
          <h1>
            Is Jump? {isJump ? 'True' : 'False'}, Total: {jumpCount}
          </h1>
          <button onClick={() => setSquatCount(squatCount + 1)}>Switch</button>
          <canvas ref={canvasRef} />
          <video
            // onCanPlay={() => drawCanvas()}
            ref={videoRef}
            style={{
              WebkitTransform: 'scaleX(-1)',
              transform: 'scaleX(-1)',
              visibility: 'hidden',
              width: 'auto',
              height: '0',
            }}
          />
        </div> */}
      </header>
    </div>
  );
}

export default App;
