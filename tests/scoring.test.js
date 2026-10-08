import { describe, it, expect } from 'vitest';
import { lineClearPoints, levelForLines, dropInterval } from '../src/scoring.js';

describe('scoring', () => {
    it('puntúa las líneas según el nivel', () => {
        expect(lineClearPoints(1, 1)).toBe(100);
        expect(lineClearPoints(4, 1)).toBe(800);
        expect(lineClearPoints(2, 3)).toBe(900);
        expect(lineClearPoints(0, 5)).toBe(0);
    });

    it('sube de nivel cada 10 líneas', () => {
        expect(levelForLines(0)).toBe(1);
        expect(levelForLines(9)).toBe(1);
        expect(levelForLines(10)).toBe(2);
    });

    it('la caída se acelera con el nivel', () => {
        expect(dropInterval(1)).toBe(1000);
        expect(dropInterval(2)).toBeLessThan(dropInterval(1));
        expect(dropInterval(20)).toBeGreaterThan(0);
    });
});
