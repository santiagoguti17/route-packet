'use strict';

/** Detección de colisiones (AABB) entre jugador, cubos y paredes. */
const Collision = (() => {
  function overlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  /**
   * Devuelve null si no hay colisión, o un objeto
   * { type: 'wall' | 'cube', cube? } en caso contrario.
   */
  function check(player, field) {
    if (player.x <= 0 || player.x + player.size >= CONFIG.WIDTH) {
      return { type: 'wall' };
    }

    const pi = CONFIG.PLAYER.hitboxInset;
    const p = {
      x: player.x + pi,
      y: player.y + pi,
      w: player.size - pi * 2,
      h: player.size - pi * 2,
    };

    const ci = CONFIG.CUBE.hitboxInset;
    for (const row of field.rows) {
      // descarte rápido por fila
      if (row.y > p.y + p.h || row.y + row.size < p.y) continue;
      for (const c of row.cubes) {
        const r = { x: c.x + ci, y: row.y + ci, w: row.size - ci * 2, h: row.size - ci * 2 };
        if (overlap(p, r)) {
          return { type: 'cube', cube: { x: c.x, y: row.y, size: row.size } };
        }
      }
    }
    return null;
  }

  return Object.freeze({ check, overlap });
})();
