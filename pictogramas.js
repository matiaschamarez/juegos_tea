const cards = [
    { id: 1, image: 'hambre.jpg', pairId: 1 },
    { id: 2, image: 'comida.png', pairId: 1 },
    { id: 3, image: 'sucio.jpg', pairId: 2 },
    { id: 4, image: 'baño.png', pairId: 2 },
    { id: 5, image: 'tristeza.jpg', pairId: 3 },
    { id: 6, image: 'llorar.png', pairId: 3 }
];

let selectedCard = null;

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
    if (selectedCard) {
        drawLineBetween(selectedCard, cardElement);
        
        if (selectedCard.dataset.pairId === cardElement.dataset.pairId) {
            selectedCard.classList.add('matched');
            cardElement.classList.add('matched');
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

    setTimeout(() => line.remove(), 1000);
}

function initializeGame() {
    const gameBoard = document.getElementById('game-board');
    cards.sort(() => Math.random() - 0.5);

    cards.forEach(card => {
        const cardElement = createCardElement(card);
        gameBoard.appendChild(cardElement);
    });
}

document.addEventListener('DOMContentLoaded', initializeGame);
