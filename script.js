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
    }
  }, 1000);
}

// Chat with the bot
const OPENAI_API_KEY = 'your-api-key-here';

async function chatWithBot(message, emotion) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `You are a ${character} who is emotionally intelligent. Respond to the user based on their emotion: ${emotion}.` },
        { role: 'user', content: message }
      ]
    })
  });
  const data = await response.json();
  return data.choices[0].message.content;
}
