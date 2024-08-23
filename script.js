const symbols = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍓', '🍍', '🥭'];
let board = [...symbols, ...symbols];
let flippedCards = [];
let matchedCards = [];
let lockBoard = false;
let score = 0;
let startTime;
let timer;

document.addEventListener('DOMContentLoaded', () => {
    shuffle(board);
    createBoard();
    document.getElementById('reset-button').addEventListener('click', resetGame);
    startGame();
});

function startGame() {
    score = 0;
    updateScore();
    startTime = Date.now();
    startTimer();
}

function createBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    board.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard || this.classList.contains('flipped') || matchedCards.includes(this)) return;

    this.classList.add('flipped');
    this.textContent = this.dataset.symbol;
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.symbol === card2.dataset.symbol) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards.push(card1, card2);
        calculateScore();
        if (matchedCards.length === board.length) {
            endGame();
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
            lockBoard = false;
        }, 1000);
    }
    flippedCards = [];
}

function calculateScore() {
    const timeTaken = (Date.now() - startTime) / 1000; // Time in seconds
    const points = Math.max(100 - Math.floor(timeTaken), 10); // At least 10 points per match
    score += points;
    updateScore();
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('time').textContent = timeElapsed;
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    alert(`¡Juego terminado! Tu puntaje final es: ${score}`);
}

function resetGame() {
    clearInterval(timer);
    board = [...symbols, ...symbols];
    flippedCards = [];
    matchedCards = [];
    lockBoard = false;
    shuffle(board);
    createBoard();
    startGame();
}
