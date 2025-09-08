import { Grid } from '/scripts/grid.js';

export class boardTetriz extends Grid {
    constructor(canvas, rows, cols, cellSize, space) {
        super(canvas, rows, cols, cellSize, space);
    }  
}