import { BoardTetris } from './boardTetris.js';
import { Grid } from './grid.js';
import { Tetromino, TetrominoTypes } from './tetromino.js';
import {
    lineClearPoints,
    levelForLines,
    dropInterval,
    SOFT_DROP_POINTS,
    HARD_DROP_POINTS,
} from './scoring.js';

const rows = 20;
const cols = 10;
const cellSize = 26;
const space = 2;
const previewCellSize = 20;
const HIGH_SCORE_KEY = 'tetris-high-score';

const boardTetris = new BoardTetris(document.getElementById('canvas-tetris'), rows, cols, cellSize, space);
const nextGrid = new Grid(document.getElementById('canvas-next'), 3, 5, previewCellSize, space);
const holdGrid = new Grid(document.getElementById('canvas-hold'), 3, 5, previewCellSize, space);

const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayText = document.getElementById('overlay-text');

let bag = [];
let tetromino;
let nextType;
let heldType;
let canHold;
let score;
let lines;
let level;
let highScore = loadHighScore();
let paused;
let gameOver;
let lastDrop = 0;

function loadHighScore() {
    try {
        return Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
    } catch {
        return 0;
    }
}

function saveHighScore() {
    try {
        localStorage.setItem(HIGH_SCORE_KEY, String(highScore));
    } catch {
        // Sin acceso a localStorage (modo privado, etc.): el récord solo dura esta sesión.
    }
}

// 7-bag: las 7 piezas barajadas, para evitar rachas largas sin una pieza concreta.
function takeFromBag() {
    if (bag.length === 0) {
        bag = Object.values(TetrominoTypes);
        for (let i = bag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [bag[i], bag[j]] = [bag[j], bag[i]];
        }
    }
    return bag.pop();
}

function spawn(type) {
    tetromino = new Tetromino(type);
    lastDrop = performance.now();
    if (!boardTetris.fits(tetromino.currentPositions())) endGame();
}

function spawnNext() {
    spawn(nextType);
    nextType = takeFromBag();
}

function fits() {
    return boardTetris.fits(tetromino.currentPositions());
}

function tryMove(row, column) {
    tetromino.move(row, column);
    if (!fits()) {
        tetromino.move(-row, -column);
        return false;
    }
    return true;
}

// Rotación SRS: se prueba cada desplazamiento de la tabla de kicks hasta que uno encaje.
function tryRotate(direction) {
    const kicks = tetromino.kicksFor(direction);
    tetromino.rotate(direction);
    for (const [row, column] of kicks) {
        if (tryMove(row, column)) return;
    }
    tetromino.rotate(-direction);
}

function ghostOffset() {
    let offset = 0;
    const positions = tetromino.currentPositions();
    while (boardTetris.fits(positions.map((p) => ({ row: p.row + offset + 1, column: p.column })))) {
        offset++;
    }
    return offset;
}

function addScore(points) {
    score += points;
    if (score > highScore) {
        highScore = score;
        saveHighScore();
    }
    updateStats();
}

function lockTetromino() {
    if (!boardTetris.place(tetromino.currentPositions(), tetromino.id)) {
        endGame();
        return;
    }
    const cleared = boardTetris.clearFullRows();
    if (cleared > 0) {
        lines += cleared;
        addScore(lineClearPoints(cleared, level));
        level = levelForLines(lines);
        updateStats();
    }
    canHold = true;
    spawnNext();
}

function softDrop() {
    if (tryMove(1, 0)) {
        addScore(SOFT_DROP_POINTS);
    } else {
        lockTetromino();
    }
    lastDrop = performance.now();
}

function hardDrop() {
    const distance = ghostOffset();
    tetromino.move(distance, 0);
    addScore(distance * HARD_DROP_POINTS);
    lockTetromino();
}

function hold() {
    if (!canHold) return;
    canHold = false;
    if (heldType) {
        const current = tetromino.type;
        spawn(heldType);
        heldType = current;
    } else {
        heldType = tetromino.type;
        spawnNext();
    }
}

function updateStats() {
    scoreElement.textContent = score;
    highScoreElement.textContent = highScore;
    levelElement.textContent = level;
    linesElement.textContent = lines;
}

function showOverlay(title, text) {
    overlayTitle.textContent = title;
    overlayText.textContent = text;
    overlay.hidden = false;
}

function togglePause() {
    if (gameOver) return;
    paused = !paused;
    if (paused) {
        showOverlay('Pausa', 'Pulsa P para continuar');
    } else {
        overlay.hidden = true;
        lastDrop = performance.now();
    }
}

function endGame() {
    gameOver = true;
    showOverlay('Fin de la partida', 'Pulsa R para jugar otra vez');
}

function newGame() {
    boardTetris.resetMatrix();
    bag = [];
    heldType = null;
    canHold = true;
    score = 0;
    lines = 0;
    level = 1;
    paused = false;
    gameOver = false;
    overlay.hidden = true;
    nextType = takeFromBag();
    spawnNext();
    updateStats();
}

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'r') {
        newGame();
    } else if (key === 'p' || key === 'escape') {
        togglePause();
    } else if (paused || gameOver) {
        return;
    } else {
        switch (key) {
            case 'arrowleft':
                tryMove(0, -1);
                break;
            case 'arrowright':
                tryMove(0, 1);
                break;
            case 'arrowdown':
                softDrop();
                break;
            case 'arrowup':
            case 'x':
                tryRotate(1);
                break;
            case 'z':
                tryRotate(-1);
                break;
            case ' ':
                hardDrop();
                break;
            case 'c':
            case 'shift':
                hold();
                break;
            default:
                return;
        }
    }
    event.preventDefault();
});

function update(time) {
    if (!paused && !gameOver && time - lastDrop > dropInterval(level)) {
        if (!tryMove(1, 0)) lockTetromino();
        lastDrop = time;
    }

    boardTetris.draw();
    if (!gameOver) {
        tetromino.draw(boardTetris, ghostOffset(), 0.25);
        tetromino.draw(boardTetris);
    }
    nextGrid.drawCentered(nextType.shapes[0], nextType.id);
    if (heldType) {
        holdGrid.drawCentered(heldType.shapes[0], heldType.id);
    } else {
        holdGrid.clear();
    }
    requestAnimationFrame(update);
}

newGame();
requestAnimationFrame(update);
