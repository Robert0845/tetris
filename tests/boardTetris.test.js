import { describe, it, expect } from 'vitest';
import { BoardTetris } from '../src/boardTetris.js';
import { fakeCanvas } from './helpers.js';

function board(rows = 4, cols = 3) {
    return new BoardTetris(fakeCanvas(), rows, cols, 26, 2);
}

describe('BoardTetris', () => {
    it('calcula el tamaño sin hueco sobrante', () => {
        const b = board(4, 3);
        expect(b.width).toBe(3 * 26 + 2 * 2);
        expect(b.height).toBe(4 * 26 + 3 * 2);
    });

    it('acepta filas por encima del tablero pero no fuera de los lados ni del fondo', () => {
        const b = board();
        expect(b.isEmpty(-1, 0)).toBe(true);
        expect(b.isEmpty(4, 0)).toBe(false);
        expect(b.isEmpty(0, -1)).toBe(false);
        expect(b.isEmpty(0, 3)).toBe(false);
    });

    it('detecta celdas ocupadas', () => {
        const b = board();
        b.matrix[2][1] = 5;
        expect(b.fits([{ row: 2, column: 0 }])).toBe(true);
        expect(
            b.fits([
                { row: 2, column: 0 },
                { row: 2, column: 1 },
            ]),
        ).toBe(false);
    });

    it('limpia filas completas y baja las de encima', () => {
        const b = board();
        b.matrix = [
            [0, 0, 0],
            [1, 0, 0],
            [2, 2, 2],
            [3, 3, 3],
        ];
        expect(b.clearFullRows()).toBe(2);
        expect(b.matrix).toEqual([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [1, 0, 0],
        ]);
    });

    it('limpia filas completas no consecutivas', () => {
        const b = board();
        b.matrix = [
            [4, 4, 4],
            [1, 0, 0],
            [2, 2, 2],
            [0, 3, 0],
        ];
        expect(b.clearFullRows()).toBe(2);
        expect(b.matrix).toEqual([
            [0, 0, 0],
            [0, 0, 0],
            [1, 0, 0],
            [0, 3, 0],
        ]);
    });

    it('place indica game over si una celda queda por encima', () => {
        const b = board();
        expect(b.place([{ row: 3, column: 0 }], 7)).toBe(true);
        expect(b.matrix[3][0]).toBe(7);
        expect(
            b.place(
                [
                    { row: -1, column: 1 },
                    { row: 0, column: 1 },
                ],
                7,
            ),
        ).toBe(false);
    });
});
