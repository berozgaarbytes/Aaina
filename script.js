// Load Face-API.js models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(() => {
  console.log('Models loaded successfully!');
}).catch(error => {
  console.error('Error loading models:', error);
});

// Emotion emoji mapping
const emotionEmojis = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  surprised: '😮',
  neutral: '😐',
  fearful: '😨',
  disgusted: '🤢'
};

// Show toast message
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000); // Remove toast after 3 seconds
}

// Update emotion display
function updateEmotionDisplay(emotion) {
  const emotionDisplay = document.getElementById('emotion-display');
  emotionDisplay.innerText = emotionEmojis[emotion] || '😐';
  emotionDisplay.classList.remove('hidden');
}

// Start video stream
function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      console.log('Camera access granted!');
      const video = document.getElementById('video');
      video.srcObject = stream;
      video.play();
      video.classList.remove('hidden'); // Show the video element
      detectEmotions(video);
    })
    .catch(error => {
      console.error('Error accessing camera:', error);
    });
}

// Detect emotions
function detectEmotions(video) {
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    if (detections.length > 0) {
      const emotions = detections[0].expressions;
      const dominantEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);
      console.log('Detected Emotion:', dominantEmotion);
      updateEmotionDisplay(dominantEmotion); // Update emotion display
      showToast(`Detected Emotion: ${dominantEmotion}`); // Show emotion as toast
    }
  }, 3000); // Update every 3 seconds
}

// Simple Rule-Based Chatbot
function chatWithBot(message, emotion) {
  const responses = {
    happy: "I'm so glad to see you happy! What’s making you smile today?",
    sad: "I’m here for you. Do you want to talk about what’s bothering you?",
    angry: "Take a deep breath. Let’s work through this together.",
    surprised: "Wow, something unexpected happened! Tell me more about it.",
    neutral: "How’s your day going so far?",
    fearful: "It’s okay to feel scared. You’re not alone.",
    disgusted: "Yuck! What’s causing that reaction?"
  };

  const botResponse = responses[emotion] || "I’m here to listen. How can I help you?";
  showToast(`Bot: ${botResponse}`); // Show bot response as toast
  return botResponse;
}

// Handle Start Button Click
document.getElementById('start-btn').addEventListener('click', () => {
  console.log('Start button clicked!');
  const character = document.getElementById('character').value;
  const customDescription = document.getElementById('custom-description').value;
  document.getElementById('chat').classList.remove('hidden');
  document.getElementById('chat-window').innerText = "Bot: Hi there! How can I help you today?";
  startVideo(); // Start the camera when the button is clicked
});

// Handle User Input
document.getElementById('user-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const userMessage = e.target.value;
    const emotion = 'happy'; // Replace with the detected emotion
    const botResponse = chatWithBot(userMessage, emotion);
    document.getElementById('chat-window').innerText += `\nYou: ${userMessage}\nBot: ${botResponse}`;
    e.target.value = ''; // Clear the input field
  }
});
