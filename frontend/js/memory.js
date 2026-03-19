const memoryGrid = document.getElementById("memoryGrid");
const turnsDisplay = document.getElementById("turns");

const cardImages = ["🍎", "🍌", "🚗", "🐱", "🐶", "⭐"];
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let turns = 0;

function startGame() {
  cards = [...cardImages, ...cardImages]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({ id: index, emoji, matched: false }));

  memoryGrid.innerHTML = "";
  turns = 0;
  turnsDisplay.textContent = turns;

  cards.forEach(card => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.id = card.id;

    cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">${card.emoji}</div>
      </div>
    `;

    cardElement.addEventListener("click", flipCard);
    memoryGrid.appendChild(cardElement);
  });
}

function flipCard() {
  if (lockBoard) return;
  const clicked = this;
  const cardId = clicked.dataset.id;
  const card = cards[cardId];

  if (clicked === firstCard) return;

  clicked.classList.add("flipped");

  if (!firstCard) {
    firstCard = clicked;
    return;
  }

  secondCard = clicked;
  lockBoard = true;

  turns++;
  turnsDisplay.textContent = turns;

  checkForMatch();
}

function checkForMatch() {
  const isMatch =
    firstCard.querySelector(".card-back").textContent ===
    secondCard.querySelector(".card-back").textContent;

  if (isMatch) {
    resetTurn();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

window.onload = startGame;
