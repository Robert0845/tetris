// Colores estándar de Tetris, indexados por el id de cada pieza (ver TetrominoTypes).
const PALETTE = {
    // T: morada
    1: {
        rightTriangle: '#8500d3',
        leftTriangle: '#ffffff',
        square: '#a000f1',
    },
    // O: amarilla
    2: {
        rightTriangle: '#fe8601',
        leftTriangle: '#ffffff',
        square: '#ffdb01',
    },
    // I: cian
    3: {
        rightTriangle: '#00a3c4',
        leftTriangle: '#ffffff',
        square: '#00e0ff',
    },
    // S: verde
    4: {
        rightTriangle: '#22974c',
        leftTriangle: '#ffffff',
        square: '#24dc4f',
    },
    // Z: roja
    5: {
        rightTriangle: '#b5193b',
        leftTriangle: '#ffffff',
        square: '#ee1b2e',
    },
    // J: azul
    6: {
        rightTriangle: '#0000c9',
        leftTriangle: '#ffffff',
        square: '#0101f0',
    },
    // L: naranja
    7: {
        rightTriangle: '#fe5e02',
        leftTriangle: '#ffffff',
        square: '#fe8602',
    },
};

export class Grid {
    constructor(canvas, rows, cols, cellSize, space) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
        this.space = space;
        this.matrix = [];
        this.debug = false;
        this.resetMatrix();

        // Tamaño en píxeles CSS; el canvas interno se escala con devicePixelRatio
        // para que se vea nítido en pantallas de alta densidad.
        this.width = this.cols * this.cellSize + this.space * (this.cols - 1);
        this.height = this.rows * this.cellSize + this.space * (this.rows - 1);
        const dpr = globalThis.devicePixelRatio || 1;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        if (this.canvas.style) {
            this.canvas.style.width = `${this.width}px`;
            this.canvas.style.height = `${this.height}px`;
        }
        this.ctx.scale(dpr, dpr);
    }

    resetMatrix() {
        for (let r = 0; r < this.rows; r++) {
            this.matrix[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.matrix[r][c] = 0;
            }
        }
    }

    drawSquare(x, y, side, color, borderColor) {
        const borderSize = side / 10;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, side, side);

        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = borderSize;
        this.ctx.strokeRect(x + borderSize / 2, y + borderSize / 2, side - borderSize, side - borderSize);
    }

    drawTriangle(x1, y1, x2, y2, x3, y3, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    drawBlock(x, y, id) {
        const size = this.cellSize;
        const margin = size / 8;
        const palette = PALETTE[id] || PALETTE[1];

        this.drawTriangle(x, y, x + size, y, x, y + size, palette.leftTriangle);

        this.drawTriangle(x + size, y, x + size, y + size, x, y + size, palette.rightTriangle);

        this.ctx.fillStyle = palette.square;
        this.ctx.fillRect(x + margin, y + margin, size - margin * 2, size - margin * 2);
    }

    getCoordinates(col, row) {
        return { x: col * (this.cellSize + this.space), y: row * (this.cellSize + this.space) };
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    draw() {
        this.clear();
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const coords = this.getCoordinates(c, r);
                if (this.matrix[r][c] !== 0) {
                    this.drawBlock(coords.x, coords.y, this.matrix[r][c]);
                } else {
                    this.drawSquare(coords.x, coords.y, this.cellSize, '#000', '#303030');
                }
            }
        }
        if (this.debug) this.printMatrix();
    }

    // Dibuja una pieza en su rotación inicial, centrada en el canvas
    // (para los paneles de "siguiente" y "hold").
    drawCentered(shape, id) {
        this.clear();
        const step = this.cellSize + this.space;
        const rows = shape.map((p) => p.row);
        const cols = shape.map((p) => p.column);
        const minRow = Math.min(...rows);
        const minCol = Math.min(...cols);
        const shapeWidth = (Math.max(...cols) - minCol + 1) * step - this.space;
        const shapeHeight = (Math.max(...rows) - minRow + 1) * step - this.space;
        const offsetX = (this.width - shapeWidth) / 2;
        const offsetY = (this.height - shapeHeight) / 2;
        for (const p of shape) {
            this.drawBlock(offsetX + (p.column - minCol) * step, offsetY + (p.row - minRow) * step, id);
        }
    }

    printMatrix() {
        let text = '';
        this.matrix.forEach((row) => {
            text += row.join(' ') + '\n';
        });
        console.log(text);
    }
}
