// Canvas falso: la lógica del tablero no necesita dibujar.
export function fakeCanvas() {
    return { style: {}, getContext: () => ({ scale() {} }) };
}
