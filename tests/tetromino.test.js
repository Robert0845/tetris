import { describe, it, expect } from 'vitest';
import { Tetromino, TetrominoTypes } from '../src/tetromino.js';

describe('Tetromino', () => {
    it('todas las piezas tienen 4 celdas en cada rotación', () => {
        for (const type of Object.values(TetrominoTypes)) {
            for (const shape of type.shapes) expect(shape).toHaveLength(4);
        }
    });

    it('rota en ambos sentidos y vuelve al inicio', () => {
        const t = new Tetromino(TetrominoTypes.T);
        t.rotate(1);
        expect(t.rotation).toBe(1);
        t.rotate(-1);
        t.rotate(-1);
        expect(t.rotation).toBe(3);
        t.rotate(1);
        expect(t.rotation).toBe(0);
    });

    it('la O no tiene kicks y el resto tiene 5 desplazamientos por transición', () => {
        expect(new Tetromino(TetrominoTypes.O).kicksFor(1)).toEqual([[0, 0]]);
        for (const name of ['T', 'I', 'S', 'Z', 'J', 'L']) {
            const t = new Tetromino(TetrominoTypes[name]);
            expect(t.kicksFor(1)).toHaveLength(5);
            expect(t.kicksFor(-1)).toHaveLength(5);
        }
    });

    it('no comparte la posición inicial entre instancias', () => {
        const a = new Tetromino(TetrominoTypes.L);
        a.move(5, 2);
        const b = new Tetromino(TetrominoTypes.L);
        expect(b.position).toEqual(TetrominoTypes.L.initPosition);
    });
});
