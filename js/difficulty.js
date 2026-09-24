'use strict';

/**
 * Sistema de dificultad.
 * Recibe el progreso de la partida (0..1) y devuelve los parámetros
 * actuales interpolados de forma gradual.
 */
const Difficulty = (() => {
  const D = CONFIG.DIFFICULTY;

  /** Curva suave y monótona: mezcla de smoothstep y lineal. */
  function curve(p) {
    p = Utils.clamp(p, 0, 1);
    const smooth = p * p * (3 - 2 * p);
    return smooth * 0.5 + p * 0.5;
  }

  function at(progress) {
    const t = curve(progress);
    const r = (key) => Utils.lerp(D[key].start, D[key].end, t);

    return {
      t,
      fallSpeed: r('fallSpeed'),
      spawnInterval: r('spawnInterval'),
      cubeFill: r('cubeFill'),
      minCubes: Math.round(r('minCubes')),
      maxCubes: Math.round(r('maxCubes')),
      doubleGapChance: r('doubleGapChance'),
    };
  }

  function label(progress) {
    if (progress < 0.25) return 'THREAT: LOW';
    if (progress < 0.5) return 'THREAT: ELEVATED';
    if (progress < 0.75) return 'THREAT: HIGH';
    return 'THREAT: CRITICAL';
  }

  return Object.freeze({ at, label });
})();
