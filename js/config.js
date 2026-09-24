'use strict';

/**
 * Configuración central del juego.
 * Todos los valores ajustables viven aquí.
 */
const CONFIG = Object.freeze({
  // Dimensiones lógicas del área de juego (el canvas se escala vía CSS).
  WIDTH: 480,
  HEIGHT: 640,

  // Duración de la partida en segundos.
  DURATION: 30,

  // Número de posiciones horizontales (carriles) en las que puede haber cubos.
  LANES: 8,

  PLAYER: Object.freeze({
    size: 18,          // lado del cuadrado del jugador
    speed: 350,        // píxeles lógicos por segundo
    bottomOffset: 64,  // distancia del jugador al borde inferior
    hitboxInset: 1,    // margen interno de la hitbox
  }),

  CUBE: Object.freeze({
    hitboxInset: 1,
  }),

  // Cada parámetro se interpola de "start" (0 s) a "end" (30 s).
  DIFFICULTY: Object.freeze({
    fallSpeed:       Object.freeze({ start: 165,  end: 430  }), // px/s de caída
    spawnInterval:   Object.freeze({ start: 1.25, end: 0.55 }), // s entre filas
    cubeFill:        Object.freeze({ start: 0.66, end: 0.90 }), // % del carril que ocupa el cubo
    minCubes:        Object.freeze({ start: 3,    end: 5    }), // cubos mínimos por fila
    maxCubes:        Object.freeze({ start: 4,    end: 6    }), // cubos máximos por fila
    doubleGapChance: Object.freeze({ start: 0.75, end: 0.10 }), // prob. de hueco doble
    reachFactor: 0.85,  // margen de seguridad al calcular huecos alcanzables
    firstSpawnDelay: 0.8,
  }),

  COLORS: Object.freeze({
    bg: '#020403',
    grid: '#06170b',
    border: '#0f3d1c',
    player: '#3dff7a',
    playerCore: '#d8ffe6',
    cube: '#ff4d4d',
    cubeCore: '#ff8a7a',
    wallWarn: 'rgba(255, 77, 77, 0.35)',
  }),
});
