import { boardTetris } from '/scripts/boardTetris.js';
import { Tetromino, TetrominoTypes } from '/scripts/tetromino.js';

const canvasTetris = document.getElementById("canvas-tetris");
const rows = 20;
const cols = 10;
const cellSize = 26;
const space = 2;

const boardTetris = new boardTetris(canvasTetris, rows, cols, cellSize, space);

const TetrominoType = TetrominoTypes.O;
const tetromino = new Tetromino(canvasTetris, cellSize,TetrominoType.shapes, TetrominoType.initPosition, TetrominoType.id);

function update() {
    
    boardTetris.draw();
    tetromino.draw(boardTetris);
    requestAnimationFrame(update);
}

update();