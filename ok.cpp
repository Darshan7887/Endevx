<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Webcam Emotion Detector</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #1a1a2e;
            color: #e0e0e0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 1rem;
        }

        .container {
            width: 100%;
            max-width: 800px;
            background-color: #2a2a4a;
            border-radius: 1.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
            padding: 2rem;
            text-align: center;
        }

        h1 {
            color: #925dff;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .subtitle {
            font-size: 1rem;
            color: #b3b3b3;
            margin-bottom: 2rem;
        }
        
        #video-container {
            position: relative;
            margin: 0 auto;
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
            background-color: #000;
        }

        #video {
            width: 100%;
            height: auto;
            border-radius: 1rem;
        }

        #overlay-canvas {
            position: absolute;
            top: 0;
            left: 0;
        }
        
        .status-box {
            background-color: #1e1e3f;
            color: #dcdcdc;
            padding: 1rem;
            margin-top: 2rem;
            border-radius: 1rem;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
            min-height: 4rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .emotion-display {
            font-size: 1.5rem;
            font-weight: 600;
            color: #ffffff;
            letter-spacing: 1px;
        }

        .loading-text {
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }

    </style>
</head>
<body class="bg-gray-900 text-gray-100 p-4 flex items-center justify-center min-h-screen">

    <div class="container mx-auto p-8 rounded-3xl bg-gray-800 shadow-xl max-w-2xl">
        <h1 class="text-white text-4xl font-bold mb-2">Emotion Detector</h1>
        <p class="text-gray-400 mb-6">Powered by your webcam and `face-api.js`.</p>

        <div id="video-container" class="relative rounded-2xl overflow-hidden shadow-lg">
            <video id="video" width="640" height="480" autoplay muted class="rounded-2xl"></video>
            <canvas id="overlay-canvas" class="absolute top-0 left-0"></canvas>
        </div>

        <div id="status-box" class="mt-8 p-4 bg-gray-700 rounded-xl shadow-inner min-h-24 flex items-center justify-center">
            <p id="status-text" class="text-xl text-gray-300 loading-text">Loading models...</p>
        </div>
    </div>

    <script>
        const video = document.getElementById('video');
        const canvas = document.getElementById('overlay-canvas');
        const statusText = document.getElementById('status-text');
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
        const expressions = ['angry', 'disgusted', 'fearful', 'happy', 'neutral', 'sad', 'surprised'];

        // Helper function for a custom message box instead of alert()
        function showMessage(message) {
            statusText.textContent = message;
        }

        // Set up the webcam stream
        async function startVideo() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
            } catch (err) {
                showMessage(`Error accessing webcam: ${err.message}. Please allow camera access.`);
                console.error(err);
            }
        }

        // Load the face detection and expression models
        async function loadModels() {
            showMessage("Loading models...");
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
                await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
                await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
                showMessage("Models loaded successfully. Starting detection...");
            } catch (error) {
                showMessage("Failed to load models. Please check your internet connection.");
                console.error(error);
            }
        }

        // Main function to run the detection loop
        async function runDetection() {
            const displaySize = { width: video.width, height: video.height };
            faceapi.matchDimensions(canvas, displaySize);

            // Continuously detect faces and expressions every 100ms
            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

                if (detections && detections.length > 0) {
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);
                    
                    // Clear canvas before drawing
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                    
                    // Draw bounding boxes
                    faceapi.draw.drawDetections(canvas, resizedDetections);
                    
                    resizedDetections.forEach(detection => {
                        const box = detection.detection.box;
                        const expressions = detection.expressions;
                        const sortedExpressions = Object.keys(expressions).sort((a, b) => expressions[b] - expressions[a]);
                        const dominantEmotion = sortedExpressions[0];
                        const dominantScore = expressions[dominantEmotion];

                        // Display the dominant emotion
                        const text = `${dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)} (${Math.round(dominantScore * 100)}%)`;
                        statusText.textContent = `You look: ${text}`;
                        
                        // Draw emotion text on the canvas
                        const drawBox = new faceapi.draw.DrawBox(box, { label: text, boxColor: '#925dff', lineWidth: 2 });
                        drawBox.draw(canvas);
                    });

                } else {
                    // No face detected
                    statusText.textContent = "Waiting for face...";
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                }
            }, 100);
        }

        // Start the application on video load
        video.addEventListener('loadeddata', () => {
            runDetection();
        });

        // Run the setup when the page loads
        window.onload = async () => {
            await loadModels();
            startVideo();
        };

    </script>
</body>
</html>
