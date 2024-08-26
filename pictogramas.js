const cards = [
    { id: 1, image: 'hambre.jpg', pairId: 1 },
    { id: 2, image: 'comida.png', pairId: 1 },
    { id: 3, image: 'sucio.jpg', pairId: 2 },
    { id: 4, image: 'baño.png', pairId: 2 },
    { id: 5, image: 'tristeza.jpg', pairId: 3 },
    { id: 6, image: 'llorar.png', pairId: 3 }
];

let selectedCard = null;
let score = 0;
let startTime;
let timerInterval;
let isAnimating = false;

function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('col-4', 'card');
    cardElement.dataset.id = card.id;
    cardElement.dataset.pairId = card.pairId;

    const imgElement = document.createElement('img');
    imgElement.src = card.image;
    cardElement.appendChild(imgElement);

    cardElement.addEventListener('click', () => onCardClick(cardElement));
    return cardElement;
}

function onCardClick(cardElement) {
    if (isAnimating || cardElement.classList.contains('matched')) {
        return;
    }

    if (selectedCard) {
        if (selectedCard === cardElement) {
            return;  // Evitar que la misma tarjeta se seleccione dos veces
        }

        if (selectedCard.dataset.pairId === cardElement.dataset.pairId) {
            markAsMatched(selectedCard, cardElement);
            selectedCard = null;
        } else {
            markAsIncorrect(selectedCard, cardElement);
        }
    } else {
        selectedCard = cardElement;
    }
}

function markAsMatched(card1, card2) {
    card1.classList.add('matched');
    card2.classList.add('matched');

    if (checkGameCompletion()) {
        calculateFinalScore();
    }
}

function markAsIncorrect(card1, card2) {
    card1.classList.add('incorrect');
    card2.classList.add('incorrect');

    card1.classList.remove('incorrect');
    card2.classList.remove('incorrect');
    selectedCard = null;
}

function checkGameCompletion() {
    const matchedCards = document.querySelectorAll('.matched');
    return matchedCards.length === cards.length;
}

function calculateFinalScore() {
    const now = new Date();
    const elapsedTime = (now - startTime) / 1000;

    if (elapsedTime <= 5) {
        score = 100;
    } else if (elapsedTime <= 7) {
        score = 95;
    } else if (elapsedTime <= 10) {
        score = 90;
    } else if (elapsedTime <= 13) {
        score = 85;
    } else if (elapsedTime <= 16) {
        score = 80;
    } else if (elapsedTime <= 20) {
        score = 75;
    } else if (elapsedTime <= 30) {
        score = 70;
    } else if (elapsedTime <= 40) {
        score = 65;
    } else if (elapsedTime <= 50) {
        score = 60;
    } else if (elapsedTime <= 60) {
        score = 50;
    } else if (elapsedTime <= 80) {
        score = 40;
    } else if (elapsedTime <= 90) {
        score = 30;
    } else if (elapsedTime <= 100) {
        score = 20;
    } else {
        score = 10;
    }

    document.getElementById('score').textContent = score;
    
    // Esperar un momento para asegurarse de que las últimas tarjetas se marquen como correctas antes de mostrar la alerta
    setTimeout(() => {
        alert(`¡Felicidades! Has completado el juego con una puntuación de ${score}`);
    }, 100);
}

function initializeGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    cards.sort(() => Math.random() - 0.5);

    cards.forEach(card => {
        const cardElement = createCardElement(card);
        gameBoard.appendChild(cardElement);
    });

    selectedCard = null;
    isAnimating = false;
    score = 0;
    document.getElementById('score').textContent = score;

    startTime = new Date();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const now = new Date();
    const elapsedTime = Math.floor((now - startTime) / 1000);
    const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
    const seconds = String(elapsedTime % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

document.getElementById('restart-btn').addEventListener('click', initializeGame);

document.addEventListener('DOMContentLoaded', initializeGame);
