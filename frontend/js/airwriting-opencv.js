const videoElement = document.getElementById("inputVideo");
const cameraCanvas = document.getElementById("cameraCanvas");
const traceCanvas = document.getElementById("traceCanvas");
const camCtx = cameraCanvas.getContext("2d");
const traceCtx = traceCanvas.getContext("2d");

cameraCanvas.width = 400;
cameraCanvas.height = 300;
traceCanvas.width = 400;
traceCanvas.height = 300;

let fingerPath = [];

// Mediapipe Hands
const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
  maxNumHands: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
});

hands.onResults((results) => {
  // Clear overlays
  camCtx.clearRect(0, 0, cameraCanvas.width, cameraCanvas.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const indexFinger = landmarks[8];

    // Draw finger landmark on video canvas
    camCtx.beginPath();
    camCtx.arc(indexFinger.x * cameraCanvas.width, indexFinger.y * cameraCanvas.height, 8, 0, 2 * Math.PI);
    camCtx.fillStyle = "rgba(0,255,0,0.7)";
    camCtx.fill();

    // Map finger to trace canvas
    const x = indexFinger.x * traceCanvas.width;
    const y = indexFinger.y * traceCanvas.height;

    fingerPath.push({ x, y });

    // Draw glowing path on trace canvas
    traceCtx.clearRect(0, 0, traceCanvas.width, traceCanvas.height);
    traceCtx.beginPath();
    for (let i = 0; i < fingerPath.length; i++) {
      let p = fingerPath[i];
      if (i === 0) traceCtx.moveTo(p.x, p.y);
      else traceCtx.lineTo(p.x, p.y);
    }
    traceCtx.strokeStyle = "rgba(0,255,255,0.9)";
    traceCtx.shadowColor = "cyan";
    traceCtx.shadowBlur = 20;
    traceCtx.lineWidth = 5;
    traceCtx.stroke();
  }
});

// Camera setup
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 400,
  height: 300,
});
camera.start();
