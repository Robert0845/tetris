export class Grid {
    constructor(canvas, rows, cols, cellSize, space) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
        this.space = space;
        this.matriz = [];
        this.restarMatriz();

        this.canvas.width = this.cols * this.cellSize + (this.space*this.cols);
        this.canvas.height = this.rows * this.cellSize + (this.space*this.rows); 
    }

    restarMatriz() {
        for (let r = 0; r < this.rows; r++) {
            this.matriz[r] = [];
            for (let c = 0; c < this.cols; c++) {
            this.matriz[r][c] = 0;
            }
        }
    }

    drawSquere(x,y,side,color,borderColor) {
        const bordeSize = side / 10;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x,y,side,side);

        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = bordeSize;
        this.ctx.strokeRect(x+bordeSize/2, y+bordeSize/2, side - bordeSize, side - bordeSize);
    }

    getCoordinates(col, row) {
        return { x: col * (this.cellSize+this.space), y: row * (this.cellSize+this.space)};
    }

    draw() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const position = this.getCoordinates(c, r);
                this.drawSquere(position.x, position.y, this.cellSize, '#000', '#303030');
            }
        }
        this.printMatriz();
    }
    printMatriz() {
        let text = '';
        this.matriz.forEach((row)=>{
                text += row.join(" ") + "\n";
            });
            console.log(text);
    }

}