// Load Face-API.js models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo);

// Start video stream
function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      const video = document.createElement('video');
      document.body.append(video);
      video.srcObject = stream;
      video.play();
      detectEmotions(video);
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
      // Use this emotion to guide the bot's responses
      document.getElementById('chat-window').innerText = `Detected Emotion: ${dominantEmotion}`;
    }
  }, 1000);
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

  return responses[emotion] || "I’m here to listen. How can I help you?";
}

// Handle Start Button Click
document.getElementById('start-btn').addEventListener('click', () => {
  const character = document.getElementById('character').value;
  const customDescription = document.getElementById('custom-description').value;
  document.getElementById('chat').classList.remove('hidden');
  document.getElementById('chat-window').innerText = "Bot: Hi there! How can I help you today?";
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
