'use strict';

/** Utilidades numéricas y de aleatoriedad. */
const Utils = Object.freeze({
  clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  },

  lerp(a, b, t) {
    return a + (b - a) * t;
  },

  /** Entero aleatorio en [min, max] inclusive. */
  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /** Elemento aleatorio de un array. */
  pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  /** [0, 1, ..., n-1] */
  range(n) {
    return Array.from({ length: n }, (_, i) => i);
  },

  /** Fisher–Yates (devuelve una copia). */
  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
});
