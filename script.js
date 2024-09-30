let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let isAIPlaying = false;

const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const homePage = document.getElementById('home-page');
const gameWindow = document.getElementById('game-window');
const winnerPopup = document.getElementById('winner-popup');
const winnerMessage = document.getElementById('winner-message');

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
        if (isAIPlaying) {
            switchPlayer();
            setTimeout(aiMove, 500); // Delay AI move for better experience
        } else {
            switchPlayer();
        }
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
    statusDisplay.textContent = isAIPlaying ? 'Player X\'s turn' : 'Player X\'s turn';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'winning-cell');
    });
    winnerPopup.style.display = 'none';
    resetButton.style.display = 'none';
    homePage.style.display = 'block';
    gameWindow.style.display = 'none';
    isAIPlaying = false;
}

function displayWinner(winner) {
    winnerMessage.textContent = `${winner} wins!`;
    winnerPopup.style.display = 'flex';

    setTimeout(() => {
        winnerPopup.style.display = 'none';
        resetButton.style.display = 'block';
    }, 3000);
}

function aiMove() {
    if (!gameActive) return;

    const bestMove = minimax(board, true);
    board[bestMove.index] = currentPlayer;
    cells[bestMove.index].textContent = currentPlayer;

    checkResult();

    if (gameActive) {
        switchPlayer();
    }
}

function minimax(newBoard, isMaximizing) {
    const emptyCells = newBoard.map((value, index) => value === '' ? index : null).filter(index => index !== null);

    if (checkWin(newBoard, 'X')) {
        return { score: -10 };
    } else if (checkWin(newBoard, 'O')) {
        return { score: 10 };
    } else if (emptyCells.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < emptyCells.length; i++) {
        const move = {};
        move.index = emptyCells[i];
        newBoard[emptyCells[i]] = isMaximizing ? 'O' : 'X';

        if (isMaximizing) {
            const result = minimax(newBoard, false);
            move.score = result.score;
        } else {
            const result = minimax(newBoard, true);
            move.score = result.score;
        }

        newBoard[emptyCells[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWin(board, player) {
    return winningConditions.some(condition => 
        condition.every(index => board[index] === player)
    );
}

function startMultiplayer() {
    isAIPlaying = false;
    homePage.style.display = 'none';
    gameWindow.style.display = 'block';
    statusDisplay.textContent = `Player X's turn`;
    resetButton.style.display = 'block';
}

function startAIvsPlayer() {
    isAIPlaying = true;
    homePage.style.display = 'none';
    gameWindow.style.display = 'block';
    statusDisplay.textContent = `Player X's turn`;
    resetButton.style.display = 'block';
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
