let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const winnerPopup = document.createElement('div');

winnerPopup.id = 'winner-popup';
winnerPopup.innerHTML = `
    <p id="winner-message"></p>
    <button onclick="resetGame()">Reset Game</button>
`;
document.body.appendChild(winnerPopup);

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[cellIndex] !== '' || !gameActive) {
        return;
    }

    board[cellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkResult();
    if (gameActive) {
        switchPlayer();
    }
}

function checkResult() {
    let roundWon = false;
    let winningCombination = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winningCombination = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        highlightWinningCells(winningCombination);
        displayWinner(currentPlayer);
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        displayWinner('No one');
        gameActive = false;
        return;
    }
}

function highlightWinningCells(winningCombination) {
    winningCombination.forEach(index => {
        cells[index].classList.add('winning-cell');
    });
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusDisplay.textContent = `Player X's turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'winning-cell');
    });
    winnerPopup.style.display = 'none';
}

function displayWinner(winner) {
    const winnerMessage = document.getElementById('winner-message');
    winnerMessage.textContent = `${winner} wins!`;
    winnerPopup.style.display = 'flex';

    setTimeout(() => {
        winnerPopup.style.display = 'none';
    }, 3000);
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
