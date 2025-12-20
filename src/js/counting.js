let score = 0;
let currentNumber = 0;

// Generate random number between 1–20
function getRandomNumber() {
  return Math.floor(Math.random() * 20) + 1;
}

// Generate objects
function generateObjects(num) {
  let objDiv = document.getElementById("objects");
  if (objDiv) objDiv.innerHTML = "🍎 ".repeat(num);
}

// Ask new question with random number
function askQuestion() {
  currentNumber = getRandomNumber();
  let q = document.getElementById("question");
  if (q) q.innerText = `How many apples are there?`;
  generateObjects(currentNumber);
}

// Check answer
function checkAnswer() {
  let input = document.getElementById("answerBox");
  if (!input) return;
  let userAnswer = input.value.trim().toLowerCase();
  let correctAnswer = numberWords[currentNumber];

  if (userAnswer === correctAnswer || userAnswer == currentNumber) {
    score++;
    let sc = document.getElementById("score");
    if (sc) sc.innerText = "Score: " + score;
    launchConfetti();
    askQuestion();
  } else {
    alert("Try again! ❌");
  }
}

// Speak number (cross-browser safe)
function speakNumber() {
  if ("speechSynthesis" in window) {
    let msg = new SpeechSynthesisUtterance(numberWords[currentNumber]);
    msg.lang = "en-US";
    window.speechSynthesis.speak(msg);
  } else {
    console.log("Speech synthesis not supported in this browser.");
  }
}

// Confetti (safe fallback)
function launchConfetti() {
  if (typeof confetti === "function") {
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        startVelocity: 30,
        spread: 360,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  } else {
    console.log("Confetti library not loaded.");
  }
}

// Number words
const numberWords = {
  1: "one", 2: "two", 3: "three", 4: "four", 5: "five",
  6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten",
  11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen", 15: "fifteen",
  16: "sixteen", 17: "seventeen", 18: "eighteen", 19: "nineteen", 20: "twenty"
};

// Start game (cross-browser safe load)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", askQuestion);
} else {
  askQuestion();
}
