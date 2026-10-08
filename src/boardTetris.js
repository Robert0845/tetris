import { Grid } from './grid.js';

export class BoardTetris extends Grid {
    constructor(canvas, rows, cols, cellSize, space) {
        super(canvas, rows, cols, cellSize, space);
    }

    // Las filas negativas (por encima del tablero) se consideran válidas
    // para que piezas como la I puedan aparecer parcialmente ocultas.
    isInside(row, col) {
        return row < this.rows && col >= 0 && col < this.cols;
    }

    isEmpty(row, col) {
        if (!this.isInside(row, col)) return false;
        return row < 0 || this.matrix[row][col] === 0;
    }

    fits(positions) {
        return positions.every((p) => this.isEmpty(p.row, p.column));
    }

    // Fija las celdas en el tablero. Devuelve false si alguna queda por encima
    // del tablero (la pila ha llegado arriba: game over).
    place(positions, id) {
        let inside = true;
        for (const p of positions) {
            if (p.row < 0) {
                inside = false;
            } else {
                this.matrix[p.row][p.column] = id;
            }
        }
        return inside;
    }

    isRowFull(row) {
        return this.matrix[row].every((cell) => cell !== 0);
    }

    clearRow(row) {
        this.matrix[row].fill(0);
    }

    moveRowDown(row, numRows) {
        this.matrix[row + numRows] = [...this.matrix[row]];
        this.clearRow(row);
    }

    clearFullRows() {
        let cleared = 0;
        for (let r = this.rows - 1; r >= 0; r--) {
            if (this.isRowFull(r)) {
                this.clearRow(r);
                cleared++;
            } else if (cleared > 0) {
                this.moveRowDown(r, cleared);
            }
        }
        return cleared;
    }
}
