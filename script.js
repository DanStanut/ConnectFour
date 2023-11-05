const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");
const displayedText = document.getElementById("displayedText");
const figureSize = 30;

let boardState = [[2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2]];
let boardColors = ["yellow", "red", "white"];
let playerTurn = 0;
let gameCount = 0;

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
    drawLine(0, 0, 700, 0);
    drawLine(700, 0, 700, 600);
    drawLine(700, 600, 0, 600);
    drawLine(0, 600, 0, 0);
    for (let i = 1; i < 7; ++i) {
        drawLine(100 * i, 0, 100 * i, 600);    
    }
    console.log(boardState);
    for (let i = 0; i < 7; ++i) {
        for (let j = 0; j < 6; ++j) {
            drawCircle(i * 100 + 50, j * 100 + 50, boardColors[boardState[i][j]]);
        }
    }
}

function startGame() {
    gameCanvas.hidden = false;
    displayedText.hidden = false;
    playerTurn = 0;
    gameCount = 0;
    displayedText.innerHTML = "Player " + (playerTurn + 1) + " to choose!";
    //resetBoard();
    ctx.clearRect(0, 0, 300, 300);
    drawBoard();
}

function checkHorizontal(x, y) {

}

function checkWin(x, y) {
    return checkHorizontal(x, y);
}

function checkGame(event) {
    let rect = gameCanvas.getBoundingClientRect();
    let mx = Math.floor((event.clientX - rect.left) / 100);
    let nextInLine = 5;
    while (boardState[mx][nextInLine] != 2 && nextInLine >= 0) {
        --nextInLine;
    }
    boardState[mx][nextInLine] = playerTurn;
    drawBoard();
    console.log(mx, nextInLine);
    if (checkWin(mx, nextInLine)) {
        displayedText.innerHTML = "Player " + (playerTurn + 1) + " wins!";
    } else {
        playerTurn = ++playerTurn % 2;
        console.log(playerTurn);
        displayedText.innerHTML = "Player " + (playerTurn + 1) + " to choose!";
    }
}