class Position {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }
}

// Tablas de wall kicks de SRS, por transición "origen>destino" (0 = inicial, 1 = R, 2 = 2, 3 = L).
// Cada desplazamiento es [filas, columnas] (filas hacia abajo positivas).
const KICKS_JLSTZ = {
    '0>1': [
        [0, 0],
        [0, -1],
        [-1, -1],
        [2, 0],
        [2, -1],
    ],
    '1>0': [
        [0, 0],
        [0, 1],
        [1, 1],
        [-2, 0],
        [-2, 1],
    ],
    '1>2': [
        [0, 0],
        [0, 1],
        [1, 1],
        [-2, 0],
        [-2, 1],
    ],
    '2>1': [
        [0, 0],
        [0, -1],
        [-1, -1],
        [2, 0],
        [2, -1],
    ],
    '2>3': [
        [0, 0],
        [0, 1],
        [-1, 1],
        [2, 0],
        [2, 1],
    ],
    '3>2': [
        [0, 0],
        [0, -1],
        [1, -1],
        [-2, 0],
        [-2, -1],
    ],
    '3>0': [
        [0, 0],
        [0, -1],
        [1, -1],
        [-2, 0],
        [-2, -1],
    ],
    '0>3': [
        [0, 0],
        [0, 1],
        [-1, 1],
        [2, 0],
        [2, 1],
    ],
};

const KICKS_I = {
    '0>1': [
        [0, 0],
        [0, -2],
        [0, 1],
        [1, -2],
        [-2, 1],
    ],
    '1>0': [
        [0, 0],
        [0, 2],
        [0, -1],
        [-1, 2],
        [2, -1],
    ],
    '1>2': [
        [0, 0],
        [0, -1],
        [0, 2],
        [-2, -1],
        [1, 2],
    ],
    '2>1': [
        [0, 0],
        [0, 1],
        [0, -2],
        [2, 1],
        [-1, -2],
    ],
    '2>3': [
        [0, 0],
        [0, 2],
        [0, -1],
        [-1, 2],
        [2, -1],
    ],
    '3>2': [
        [0, 0],
        [0, -2],
        [0, 1],
        [1, -2],
        [-2, 1],
    ],
    '3>0': [
        [0, 0],
        [0, 1],
        [0, -2],
        [2, 1],
        [-1, -2],
    ],
    '0>3': [
        [0, 0],
        [0, -1],
        [0, 2],
        [-2, -1],
        [1, 2],
    ],
};

class Tetromino {
    constructor(type) {
        this.type = type;
        this.shapes = type.shapes;
        this.rotation = 0;
        this.initPosition = type.initPosition;
        this.position = new Position(this.initPosition.row, this.initPosition.column);
        this.id = type.id;
    }

    // Desplazamientos a probar al rotar en la dirección indicada (1 = horario, -1 = antihorario).
    kicksFor(direction) {
        if (!this.type.kicks) return [[0, 0]];
        const to = (this.rotation + direction + this.shapes.length) % this.shapes.length;
        return this.type.kicks[`${this.rotation}>${to}`];
    }

    currentShape() {
        return this.shapes[this.rotation];
    }

    // rowOffset y alpha permiten dibujar la pieza fantasma (ghost) más abajo y semitransparente.
    draw(grid, rowOffset = 0, alpha = 1) {
        grid.ctx.globalAlpha = alpha;
        for (const cell of this.currentPositions()) {
            const row = cell.row + rowOffset;
            if (row < 0) continue;
            const coords = grid.getCoordinates(cell.column, row);
            grid.drawBlock(coords.x, coords.y, this.id);
        }
        grid.ctx.globalAlpha = 1;
    }

    currentPositions() {
        const positions = [];
        const shape = this.currentShape();
        for (let i = 0; i < shape.length; i++) {
            positions.push(
                new Position(this.position.row + shape[i].row, this.position.column + shape[i].column),
            );
        }
        return positions;
    }

    move(row, column) {
        this.position.row += row;
        this.position.column += column;
    }

    rotate(direction = 1) {
        this.rotation = (this.rotation + direction + this.shapes.length) % this.shapes.length;
    }

    reset() {
        this.rotation = 0;
        this.position = new Position(this.initPosition.row, this.initPosition.column);
    }
}

const TetrominoTypes = {
    T: {
        id: 1,
        kicks: KICKS_JLSTZ,
        initPosition: new Position(0, 3),
        shapes: [
            [new Position(0, 1), new Position(1, 0), new Position(1, 1), new Position(1, 2)],
            [new Position(0, 1), new Position(1, 1), new Position(1, 2), new Position(2, 1)],
            [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(2, 1)],
            [new Position(0, 1), new Position(1, 0), new Position(1, 1), new Position(2, 1)],
        ],
    },
    O: {
        id: 2,
        initPosition: new Position(0, 4),
        shapes: [[new Position(0, 0), new Position(0, 1), new Position(1, 0), new Position(1, 1)]],
    },
    I: {
        id: 3,
        kicks: KICKS_I,
        initPosition: new Position(-1, 3),
        shapes: [
            [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(1, 3)],
            [new Position(0, 2), new Position(1, 2), new Position(2, 2), new Position(3, 2)],
            [new Position(2, 0), new Position(2, 1), new Position(2, 2), new Position(2, 3)],
            [new Position(0, 1), new Position(1, 1), new Position(2, 1), new Position(3, 1)],
        ],
    },
    S: {
        id: 4,
        kicks: KICKS_JLSTZ,
        initPosition: new Position(0, 3),
        shapes: [
            [new Position(0, 1), new Position(0, 2), new Position(1, 0), new Position(1, 1)],
            [new Position(0, 1), new Position(1, 1), new Position(1, 2), new Position(2, 2)],
            [new Position(1, 1), new Position(1, 2), new Position(2, 0), new Position(2, 1)],
            [new Position(0, 0), new Position(1, 0), new Position(1, 1), new Position(2, 1)],
        ],
    },
    Z: {
        id: 5,
        kicks: KICKS_JLSTZ,
        initPosition: new Position(0, 3),
        shapes: [
            [new Position(0, 0), new Position(0, 1), new Position(1, 1), new Position(1, 2)],
            [new Position(0, 2), new Position(1, 1), new Position(1, 2), new Position(2, 1)],
            [new Position(1, 0), new Position(1, 1), new Position(2, 1), new Position(2, 2)],
            [new Position(0, 1), new Position(1, 0), new Position(1, 1), new Position(2, 0)],
        ],
    },
    J: {
        id: 6,
        kicks: KICKS_JLSTZ,
        initPosition: new Position(0, 3),
        shapes: [
            [new Position(0, 0), new Position(1, 0), new Position(1, 1), new Position(1, 2)],
            [new Position(0, 1), new Position(0, 2), new Position(1, 1), new Position(2, 1)],
            [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(2, 2)],
            [new Position(0, 1), new Position(1, 1), new Position(2, 0), new Position(2, 1)],
        ],
    },
    L: {
        id: 7,
        kicks: KICKS_JLSTZ,
        initPosition: new Position(0, 3),
        shapes: [
            [new Position(0, 2), new Position(1, 0), new Position(1, 1), new Position(1, 2)],
            [new Position(0, 1), new Position(1, 1), new Position(2, 1), new Position(2, 2)],
            [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(2, 0)],
            [new Position(0, 0), new Position(0, 1), new Position(1, 1), new Position(2, 1)],
        ],
    },
};

export { Position, Tetromino, TetrominoTypes };
