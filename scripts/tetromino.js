class position {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }
}

class Tetromino {
    constructor(canvas, cellSize, shapes, initPosition, id) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = cellSize;
        this.shape = shapes;
        this.rotation = 0;
        this.initPosition = initPosition;
        this.position = new position(this.initPosition.row, this.initPosition.column);
        this.id = id;
    }

    drawSquare(x, y, size, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, size, size);
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

    getColorPalette(id) {
        const palette = {
            1: {
                rightTriangle: '#b5193b',
                leftTriangle: '#ffffff',
                square: '#ee1b2e'
            },
            2: {
                rightTriangle: '#fe5e02',
                leftTriangle: '#ffffff',
                square: '#fe8602'
            },
            3: {
                rightTriangle: '#fe8601',
                leftTriangle: '#ffffff',
                square: '#ffdb01'
            },
            4: {
                rightTriangle: '#22974c',
                leftTriangle: '#ffffff',
                square: '#24dc4f'
            },
            5: {
                rightTriangle: '#49bdff',
                leftTriangle: '#ffffff',
                square: '#2d97f7'
            },
            6: {
                rightTriangle: '#0000c9',
                leftTriangle: '#ffffff',
                square: '#0101f0'
            },
            7: {
                rightTriangle: '#8500d3',
                leftTriangle: '#ffffff',
                square: '#a000f1'
            }
        }
        return palette[id] || palette[1]
    }

    drawBlock(x, y, id) {
        const margin = this.cellSize / 8;
        const palette = this.getColorPalette(id);

        this.drawTriangle(
            x,y,
            x+this.cellSize, y,
            x, y+this.cellSize,
            palette.leftTriangle
        );
        
        this.drawTriangle(
            x+this.cellSize, y,
            x+this.cellSize, y+this.cellSize,
            x, y+this.cellSize,
            palette.rightTriangle
        );
        
        this.drawSquare(
            x+margin,
            y+margin,
            this.cellSize - (margin*2),
            palette.square
        );
    }

    currentShape() {
        return this.shapes[this.rotation];
    }

    draw(grid) {
        const shape = this.currentShape();
        for (let i = 0; i < shape.length; i++) {
            const position = grid.getCoordinates(
                this.position.column + shape[i].column,
                this.position.row + shape[i].row
            );
            this.drawBlock(position.x, position.y, this.id);
        }
    }

    currentPositions() {
        const shape = this.currentShape();
        const positions = [];  
        for (let i = 0; i < shape.length; i++) {
            positions.push(new position(
                this.position.row + shape[i].row,
                this.position.column + shape[i].column
            ));
        }
        return positions;
    }

    move(row) {
        this.position.row += row;
        this.position.column += column;
    }

    reset() {
        this.rotation = 0;
        this.position = new position(this.initPosition.row, this.initPosition.column);   
    }
}

const TetrominoTypes = {
    T: {
        id:1,
        initPosition: new position(0,3),
        shapes: [  
            [new position(0,1), new position(1,0), new position(1,1), new position(1,2)],
            [new position(0,1), new position(1,0), new position(1,2), new position(2,1)],
            [new position(1,0), new position(1,1), new position(1,2), new position(2,1)],
            [new position(0,1), new position(1,0), new position(1,1), new position(2,1)]
        ]
    },
    O: {
        id: 2,
        initPosition: new position(0,4),
        shapes: [
            [new position(0,0), new position(0,1), new position(1,0), new position(1,1)]
        ]
    },
    I: {
        id: 3,
        initPosition: new position(-1,3),
        shapes: [
            [new position(1,0), new position(1,1), new position(1,2), new position(1,3)],
            [new position(0,2), new position(1,2), new position(2,2), new position(3,2)],
            [new position(2,0), new position(2,1), new position(2,2), new position(2,3)],
            [new position(0,1), new position(1,1), new position(2,1), new position(3,1)]
        ]
    },
    S: {
        id: 4,
        initPosition: new position(0,3),
        shapes: [
            [new position(0,1), new position(0,2), new position(1,0), new position(1,1)],
            [new position(0,1), new position(1,1), new position(1,2), new position(2,2)],
            [new position(1,1), new position(1,2), new position(2,0), new position(2,1)],
            [new position(0,0), new position(1,0), new position(1,1), new position(2,1)]
        ]
    },
    Z: {
        id: 5,
        initPosition: new position(0,3),
        shapes: [
            [new position(0,0), new position(0,1), new position(1,1), new position(1,2)],
            [new position(0,2), new position(1,1), new position(1,2), new position(2,1)],
            [new position(1,0), new position(1,1), new position(2,1), new position(2,2)],
            [new position(0,1), new position(1,0), new position(1,1), new position(2,0)]
        ]
    },
    J: {
        id: 6,
        initPosition: new position(0,3),
        shapes: [
            [new position(0,0), new position(1,0), new position(1,1), new position(1,2)],
            [new position(0,1), new position(0,2), new position(1,1), new position(2,1)],
            [new position(1,0), new position(1,1), new position(1,2), new position(2,2)],
            [new position(0,1), new position(1,1), new position(2,0), new position(2,1)]
        ]
    },
    L: {
        id: 7,
        initPosition: new position(0,3),
        shapes: [
            [new position(0,2), new position(1,0), new position(1,1), new position(1,2)],
            [new position(0,1), new position(1,1), new position(2,1), new position(2,2)],
            [new position(1,0), new position(1,1), new position(1,2), new position(2,0)],
            [new position(0,0), new position(0,1), new position(1,1), new position(2,1)]
        ]
    }

}

export { Tetromino, TetrominoTypes, position };
