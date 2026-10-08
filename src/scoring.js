// Puntuación según la guía oficial de Tetris.
const LINE_POINTS = [0, 100, 300, 500, 800];
export const SOFT_DROP_POINTS = 1;
export const HARD_DROP_POINTS = 2;
export const LINES_PER_LEVEL = 10;

export function lineClearPoints(lines, level) {
    return (LINE_POINTS[lines] ?? 0) * level;
}

export function levelForLines(lines) {
    return Math.floor(lines / LINES_PER_LEVEL) + 1;
}

// Milisegundos entre caídas automáticas: (0.8 - (nivel - 1) * 0.007) ^ (nivel - 1) segundos.
export function dropInterval(level) {
    const seconds = Math.pow(0.8 - (level - 1) * 0.007, level - 1);
    return Math.max(seconds * 1000, 16);
}
