// Multiplayer Memory Game - Dynamic Version

let allEmojis = ['🍎', '🍌', '🐶', '🐱', '🎈', '⚽', '🚗', '🌈', '🎮', '🎲', '🍕', '🌟', '🐸', '🎃'];
let cards = [];

let firstCard, secondCard;
let lockBoard = false;
let matchedPairs = 0;
let moves = 0;
let seconds = 0;
let timer;

let currentPlayer = 1;
let scores = { 1: 0, 2: 0 };

const board = document.querySelector('.game-board');
const moveCounter = document.getElementById('move-counter');
const timerDisplay = document.getElementById('timer');
const winMessage = document.getElementById('win-message');
const flipSound = document.getElementById('flip-sound');
const matchSound = document.getElementById('match-sound');
const turnIndicator = document.getElementById('turn-indicator');
const scoreBoard = document.getElementById('score-board');
const difficultySelect = document.getElementById('difficulty');

const player1Name = document.getElementById('player1-name');
const player2Name = document.getElementById('player2-name');
const player1Pic = document.getElementById('player1-pic');
const player2Pic = document.getElementById('player2-pic');

const multiplayerUsers = JSON.parse(localStorage.getItem('multiplayerUsers')) || {
  player1: { name: "Guest", email: "", avatar: "https://www.gravatar.com/avatar/?d=mp" },
  player2: { name: "Guest", email: "", avatar: "https://www.gravatar.com/avatar/?d=mp" }
};

const user1 = {
  name: multiplayerUsers.player1.name || "Guest",
  email: multiplayerUsers.player1.email || "",
  avatar: multiplayerUsers.player1.avatar || `https://www.gravatar.com/avatar/?d=mp`
};

const user2 = {
  name: multiplayerUsers.player2.name || "Guest",
  email: multiplayerUsers.player2.email || "",
  avatar: multiplayerUsers.player2.avatar || `https://www.gravatar.com/avatar/?d=mp`
};

player1Name.textContent = `Player 1: ${user1.name}`;
player2Name.textContent = `Player 2: ${user2.name}`;
player1Pic.src = user1.avatar;
player2Pic.src = user2.avatar;

const turnSound = new Audio("https://www.fesliyanstudios.com/play-mp3/6827");

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  const difficulty = difficultySelect.value;
  let cols = 4;

  if (difficulty === 'easy') {
    cards = [...allEmojis.slice(0, 4), ...allEmojis.slice(0, 4)]; // 8 cards → 4x2
    cols = 4;
  } else if (difficulty === 'medium') {
    cards = [...allEmojis.slice(0, 8), ...allEmojis.slice(0, 8)]; // 16 cards → 4x4
    cols = 4;
  } else if (difficulty === 'hard') {
    cards = [...allEmojis.slice(0, 18), ...allEmojis.slice(0, 18)]; // 36 cards → 6x6
    cols = 6;
  }

  shuffle(cards);

  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  resetBoard();
  matchedPairs = 0;
  moves = 0;
  seconds = 0;
  currentPlayer = 1;
  scores = { 1: 0, 2: 0 };
  moveCounter.textContent = moves;
  timerDisplay.textContent = seconds;
  winMessage.textContent = '';
  updateTurnUI();

  clearInterval(timer);
  timer = setInterval(() => {
    seconds++;
    timerDisplay.textContent = seconds;
  }, 1000);

  cards.forEach(emoji => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.textContent = '❓';
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard || this === firstCard || this.classList.contains('flipped')) return;

  this.textContent = this.dataset.emoji;
  this.classList.add('flipped');
  flipSound.play();

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  moves++;
  moveCounter.textContent = moves;

  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

  if (isMatch) {
    disableCards();
  } else {
    setTimeout(() => switchPlayer(), 1200);
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');
  matchSound.play();

  scores[currentPlayer]++;
  scoreBoard.textContent = `🎯 Scores - Player 1: ${scores[1]} | Player 2: ${scores[2]}`;
  matchedPairs++;

  if (matchedPairs === cards.length / 2) {
    clearInterval(timer);
    const winner = scores[1] > scores[2] ? user1.name : scores[2] > scores[1] ? user2.name : "Draw";

    winMessage.textContent = `🎉 ${winner === "Draw" ? "It's a Draw!" : winner + " Wins!"} Moves: ${moves}, Time: ${seconds} sec`;

    const score = {
      player1: { name: user1.name, email: user1.email, score: scores[1] },
      player2: { name: user2.name, email: user2.email, score: scores[2] },
      winner: winner,
      date: new Date().toLocaleString(),
      winnerScore: Math.max(scores[1], scores[2])
    };

    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push(score);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  }

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.textContent = '❓';
    secondCard.textContent = '❓';
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 1000);
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  turnSound.play();
  updateTurnUI();
}

function updateTurnUI() {
  turnIndicator.innerHTML = `🧭 Turn: Player ${currentPlayer}`;
  scoreBoard.innerHTML = `🎯 Scores - Player 1: ${scores[1]} | Player 2: ${scores[2]}`;

  const player1Container = document.getElementById('player1-container');
  const player2Container = document.getElementById('player2-container');

  if (player1Container && player2Container) {
    player1Container.classList.remove('active-turn');
    player2Container.classList.remove('active-turn');

    if (currentPlayer === 1) {
      player1Container.classList.add('active-turn');
    } else {
      player2Container.classList.add('active-turn');
    }
  }
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

document.getElementById('restart-btn').addEventListener('click', createBoard);
difficultySelect.addEventListener('change', createBoard);

// Start game on page load
document.addEventListener("DOMContentLoaded", createBoard);
