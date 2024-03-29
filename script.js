const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");
const displayedText = document.getElementById("displayedText");
const boardWidth = 700;
const boardHeight = 600;
const columnWidth = boardWidth / 7;
const figureSize = columnWidth * 0.3;

let boardState = [[2, 2, 2, 2, 2, 2], 
                    [2, 2, 2, 2, 2, 2], 
                    [2, 2, 2, 2, 2, 2], 
                    [2, 2, 2, 2, 2, 2], 
                    [2, 2, 2, 2, 2, 2], 
                    [2, 2, 2, 2, 2, 2], 
                    [2, 2, 2, 2, 2, 2]];
let boardColors = ["yellow", "red", "white"];
let playerTurn = 0;
let gameCount = 0;
let gameOver = false;

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawCircle(x, y, color) {
    ctx.moveTo(x + figureSize, y);
    ctx.beginPath();
    ctx.arc(x, y, figureSize, 0, 2 * Math.PI, true);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
}

function drawBoard() {
    drawLine(0, 0, boardWidth, 0);
    drawLine(boardWidth, 0, boardWidth, boardHeight);
    drawLine(boardWidth, boardHeight, 0, boardHeight);
    drawLine(0, boardHeight, 0, 0);
    for (let i = 1; i < 7; ++i) {
        drawLine(columnWidth * i, 0, columnWidth * i, boardHeight);    
    }
    for (let i = 0; i < 7; ++i) {
        for (let j = 0; j < 6; ++j) {
            drawCircle(i * columnWidth + columnWidth / 2, j * columnWidth + columnWidth / 2, boardColors[boardState[i][j]]);
        }
    }
}

function resetBoard() {
    for (let i = 0; i < 7; ++i) {
        for (let j = 0; j < 6; ++j) {
            boardState[i][j] = 2;
        }
    }
    playerTurn = 0;
    gameCount = 0;
}

function displayMessage(message) {
    displayedText.innerHTML = message;
}

function startGame() {
    gameCanvas.hidden = false;
    displayedText.hidden = false;
    playerTurn = 0;
    gameCount = 0;
    gameOver = false;
    displayMessage("Player " + (playerTurn + 1) + " to choose!");
    resetBoard();
    ctx.clearRect(0, 0, boardWidth, boardHeight);
    drawBoard();
}

//Check only the line where the last disk was added
function checkHorizontal(y) {
    for (let i = 0; i < 4; ++i) {
        if (boardState[i][y] != 2 && 
            boardState[i][y] === boardState[i + 1][y] &&
            boardState[i][y] === boardState[i + 2][y] &&
            boardState[i][y] === boardState[i + 3][y]) {
            return true;
        }
    }
    return false;
}

//Check only the column where the last disk was added
function checkVertical(x) {
    for (let i = 0; i < 3; ++i) {
        if (boardState[x][i] != 2 && 
            boardState[x][i] === boardState[x][i + 1] &&
            boardState[x][i] === boardState[x][i + 2] &&
            boardState[x][i] === boardState[x][i + 3]) {
            return true;
        }
    }
    return false;
}

function checkDiagonal() {
    //Check parallel to the main diagonal direction 
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 3; ++j) {
            if (boardState[i][j] != 2 &&
                boardState[i][j] === boardState[i + 1][j + 1] &&
                boardState[i][j] === boardState[i + 2][j + 2] &&
                boardState[i][j] === boardState[i + 3][j + 3]) {
                    return true;
            }
        }
    }
    //Check parallel to the secondary diagonal direction 
    for (let i = 6; i > 2; --i) {
        for (let j = 0; j < 3; ++j) {
            if (boardState[i][j] != 2 &&
                boardState[i][j] === boardState[i - 1][j + 1] &&
                boardState[i][j] === boardState[i - 2][j + 2] &&
                boardState[i][j] === boardState[i - 3][j + 3]) {
                    return true;
            }
        }
    }
    return false;
}

function checkWin(x, y) {
    return checkHorizontal(y) || checkVertical(x) || checkDiagonal();
}

function checkGame(event) {
    let rect = gameCanvas.getBoundingClientRect();
    let mx = Math.floor((event.clientX - rect.left) / 100);
    let nextInLine = 5;
    if (!gameOver) {
        //Look for the first empty cell in the line
        while (boardState[mx][nextInLine] != 2 && nextInLine >= 0) {
            --nextInLine;
        }
        boardState[mx][nextInLine] = playerTurn;
        drawBoard();
        if (checkWin(mx, nextInLine)) {
            displayMessage("Player " + (playerTurn + 1) + " wins!");
            gameOver = true;
        } else if (gameCount === 41) {
            displayMessage("The game is a draw!");
            gameOver = true;
        } else {
            if (nextInLine >= 0) {
                playerTurn = ++playerTurn % 2;
                ++gameCount;
                displayMessage("Player " + (playerTurn + 1) + " to choose!");
            }
        }
    }
}