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

        drawLineBetween(selectedCard, cardElement);

        if (selectedCard.dataset.pairId === cardElement.dataset.pairId) {
            markAsMatched(selectedCard, cardElement);
        } else {
            markAsIncorrect(selectedCard, cardElement);
        }

        selectedCard = null;
    } else {
        selectedCard = cardElement;
    }
}

function drawLineBetween(card1, card2) {
    const rect1 = card1.getBoundingClientRect();
    const rect2 = card2.getBoundingClientRect();

    const lineLength = Math.hypot(rect2.left - rect1.left, rect2.top - rect1.top);
    const angle = Math.atan2(rect2.top - rect1.top, rect2.left - rect1.left) * (180 / Math.PI);

    const line = document.createElement('div');
    line.classList.add('line');
    document.body.appendChild(line);

    line.style.width = `${lineLength}px`;
    line.style.left = `${rect1.left + rect1.width / 2}px`;
    line.style.top = `${rect1.top + rect1.height / 2}px`;
    line.style.transform = `rotate(${angle}deg)`;

    setTimeout(() => line.remove(), 500);
}

function markAsMatched(card1, card2) {
    isAnimating = true;
    card1.classList.add('matched');
    card2.classList.add('matched');

    updateScore();
    document.getElementById('score').textContent = score;

    setTimeout(() => {
        isAnimating = false;
        checkGameCompletion(); // Verifica la finalización del juego después de que las tarjetas se marquen como "matched"
    }, 300);
}

function markAsIncorrect(card1, card2) {
    isAnimating = true;
    card1.classList.add('incorrect');
    card2.classList.add('incorrect');

    setTimeout(() => {
        card1.classList.remove('incorrect');
        card2.classList.remove('incorrect');
        isAnimating = false;
    }, 1000);
}

function updateScore() {
    const now = new Date();
    const elapsedTime = (now - startTime) / 1000;
    const timePenalty = Math.floor(elapsedTime / 10);
    score += Math.max(10 - timePenalty, 1); // Reducir puntuación según el tiempo transcurrido
}

function checkGameCompletion() {
    const matchedCards = document.querySelectorAll('.matched');
    if (matchedCards.length === cards.length) {
        clearInterval(timerInterval); // Detener el tiempo cuando todas las tarjetas se emparejan
        setTimeout(() => {
            alert(`¡Felicidades! Has completado el juego con una puntuación de ${score}`);
        }, 100); // Asegura que la alerta se muestre después de que las tarjetas se actualicen
    }
}

function initializeGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    cards.sort(() => Math.random() - 0.5);

    cards.forEach(card => {
        const cardElement = createCardElement(card);
        gameBoard.appendChild(cardElement);
    });

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