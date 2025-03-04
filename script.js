import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs';

const emotionEmojis = {
  happy: '🌿',    // Laurel (joy)
  sad: '🕯️',     // Candle (sorrow)
  angry: '⚔️',    // Sword (conflict)
  surprised: '📜',// Scroll (discovery)
  neutral: '🕊️',  // Dove (peace)
  fearful: '🕸️',  // Cobweb (fear)
  disgusted: '☠️' // Skull (disgust)
};

async function loadModel() {
  return await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
  );
}

async function startApp() {
  const video = document.getElementById('camera-feed');
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.play();
    video.classList.remove('hidden');

    const model = await loadModel();
    detectEmotions(video, model);
  } catch (error) {
    console.error(error);
  }
}

async function detectEmotions(video, model) {
  setInterval(async () => {
    const predictions = await model.estimateFaces({ input: video });
    
    if (predictions.length > 0) {
      const emotion = getDominantEmotion(predictions[0]);
      updateEmotionDisplay(emotion);
      showToast(`Current Mood: ${emotion}`);
    }
  }, 3000);
}

function getDominantEmotion(faceData) {
  // Placeholder function - Replace with a real emotion classification model
  const emotions = ['happy', 'sad', 'angry', 'surprised', 'neutral', 'fearful', 'disgusted'];
  return emotions[Math.floor(Math.random() * emotions.length)];
}

function updateEmotionDisplay(emotion) {
  const display = document.getElementById('emotion-display');
  display.innerHTML = `${emotionEmojis[emotion]} ${emotion}`;
  display.classList.remove('hidden');
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.getElementById('toast-container').appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

document.getElementById('start-btn').addEventListener('click', () => {
  document.getElementById('start-screen').classList.add('hidden');
  startApp();
});
