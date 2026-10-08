# Tetris

Tetris en JavaScript puro con `<canvas>`, sin frameworks ni dependencias en tiempo de ejecución.

## Características

- Las 7 piezas con rotación SRS y wall kicks
- Generación de piezas con "7-bag"
- Puntuación, niveles y líneas; la velocidad aumenta cada 10 líneas
- Vista de la siguiente pieza, hold y pieza fantasma (ghost)
- Récord guardado en el navegador
- Pausa, game over y reinicio

## Controles

| Tecla     | Acción                           |
| --------- | -------------------------------- |
| ← →       | Mover                            |
| ↓         | Bajar (+1 punto por celda)       |
| ↑ / X     | Rotar en sentido horario         |
| Z         | Rotar en sentido antihorario     |
| Espacio   | Caída instantánea (+2 por celda) |
| C / Shift | Guardar pieza (hold)             |
| P / Esc   | Pausa                            |
| R         | Reiniciar                        |

## Cómo jugar en local

El juego usa módulos ES, así que no funciona abriendo `index.html` directamente
(`file://`); hace falta un servidor local:

```bash
npm start          # equivale a: npx serve .
```

Y abre la URL que aparezca (normalmente <http://localhost:3000>).
También sirve cualquier otro servidor estático, como la extensión Live Server de VS Code.

## Desarrollo

```bash
npm install        # dependencias de desarrollo (Vitest, ESLint, Prettier)
npm test           # tests de la lógica del tablero, las piezas y la puntuación
npm run lint       # ESLint
npm run format     # Prettier
```

## Estructura

```
index.html          Página del juego
style.css           Estilos
src/
  main.js           Bucle del juego, controles, puntuación y estado
  grid.js           Cuadrícula y dibujo de bloques en el canvas
  boardTetris.js    Tablero: colisiones y limpieza de líneas
  tetromino.js      Piezas, rotaciones y tablas de wall kicks
  scoring.js        Puntos, niveles y velocidad de caída
tests/              Tests con Vitest
```
