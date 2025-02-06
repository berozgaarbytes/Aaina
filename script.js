// Load Face-API.js models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startApp).catch(console.error);

// Emotion Emojis (Dark Academia Style)
const emotionEmojis = {
  happy: '🌿',    // Laurel (joy)
  sad: '🕯️',     // Candle (sorrow)
  angry: '⚔️',    // Sword (conflict)
  surprised: '📜',// Scroll (discovery)
  neutral: '🕊️',  // Dove (peace)
  fearful: '🕸️',  // Cobweb (fear)
  disgusted: '☠️' // Skull (disgust)
};

// Start Camera & Detection
function startApp() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      const video = document.getElementById('camera-feed');
      video.srcObject = stream;
      video.play();
      video.classList.remove('hidden');
      detectEmotions(video);
    })
    .catch(console.error);
}

// Detect Emotions Every 3 Seconds
function detectEmotions(video) {
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, 
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceExpressions();

    if (detections.length > 0) {
      const emotions = detections[0].expressions;
      const dominantEmotion = Object.keys(emotions).reduce((a, b) => 
        emotions[a] > emotions[b] ? a : b
      );
      
      // Update UI
      updateEmotionDisplay(dominantEmotion);
      showToast(`Current Mood: ${dominantEmotion}`);
    }
  }, 3000);
}

// Update Emotion Display
function updateEmotionDisplay(emotion) {
  const display = document.getElementById('emotion-display');
  display.innerHTML = `${emotionEmojis[emotion]} ${emotion}`;
  display.classList.remove('hidden');
}

// Show Toast Message
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.getElementById('toast-container').appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
