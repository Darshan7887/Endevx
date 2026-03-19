// Sentences with blanks
const questions = [
  { sentence: "I say ____ when I hurt someone. (Thank you , Please ,Sorry)", answer: "sorry" },
  { sentence: "I say ____ when I recive a gift. (Thank you , Please ,Sorry)", answer: "Thnak you" },
  { sentence: "I say ____ when I want a Choclate. (Thank you , Please ,Sorry)", answer: "Please" },
  { sentence: "Is it good to Disrespect Elder's and Teacher's ?(Yes/No)", answer: "No" },
  { sentence: "When you meet your teacher or elders in the morning, what do you say? (Good Morning,Good Nigth,Good Bye)", answer: "Good Morning" },
  { sentence: "When you leave someone, what do you say? (Good Morning,Good Nigth,Good Bye)", answer: "Good Bye" },
  { sentence: "If someone helps you, what do you say? (Thank you , Please ,Sorry)", answer: "Thank you" },
]

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const scoreEl = document.getElementById("score");
const feedbackEl = document.getElementById("feedback");
const badgeEl = document.getElementById("badge");
const speakIcon = document.getElementById("speakIcon");
const micIcon = document.getElementById("micIcon");

// Start lesson
document.getElementById("startBtn").addEventListener("click", () => {
  score = 0;
  currentQuestion = 0;
  badgeEl.classList.remove("show");
  showQuestion();
});

// Show next question
function showQuestion() {
  if (currentQuestion < questions.length) {
    const q = questions[currentQuestion];
    questionEl.innerText = q.sentence;
    answerInput.value = "";

    // Highlight speaker icon
    speakIcon.style.opacity = "1";
    micIcon.style.opacity = "0.4";

    // System speaks question
    const utterance = new SpeechSynthesisUtterance(q.sentence);
    speechSynthesis.speak(utterance);
  } else {
    questionEl.innerText = "🎉 Lesson complete!";
    badgeEl.classList.add("show");
  }
}

// Check answer
document.getElementById("checkBtn").addEventListener("click", () => {
  const userAnswer = answerInput.value.trim().toLowerCase();
  const correctAnswer = questions[currentQuestion].answer.toLowerCase();

  if (userAnswer === correctAnswer) {
    feedbackEl.innerText = "✅ Correct!";
    score++;
  } else {
    feedbackEl.innerText = `❌ Oops! Correct answer: "${correctAnswer}"`;
  }

  scoreEl.innerText = `Score: ${score}/${questions.length}`;
  currentQuestion++;
  setTimeout(showQuestion, 1500);
});

// 🎤 Speech recognition
if ("webkitSpeechRecognition" in window) {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;

  micIcon.addEventListener("click", () => {
    recognition.start();
    micIcon.style.opacity = "1";
    speakIcon.style.opacity = "0.4";
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    answerInput.value = transcript;
  };
} else {
  feedbackEl.innerText = "Speech recognition not supported in this browser.";
}
function launchConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      startVelocity: 25,
      spread: 360,
      ticks: 60,
      origin: { x: Math.random(), y: Math.random() - 0.2 }
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}