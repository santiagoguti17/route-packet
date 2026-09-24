'use strict';

/**
 * Generación y movimiento de filas de cubos rojos.
 *
 * Cada fila divide el ancho en CONFIG.LANES carriles y elige aleatoriamente
 * cuáles contienen cubo. Siempre queda al menos un carril libre, y ese carril
 * es alcanzable desde los huecos de la fila anterior y desde la posición
 * actual del jugador (dado el tiempo disponible).
 */
class ObstacleField {
  constructor() {
    this.onSpawn = null;
    this.reset();
  }

  reset() {
    this.rows = [];
    this.lastRow = null;
    this.spawnTimer = CONFIG.DIFFICULTY.firstSpawnDelay;
  }

  update(dt, diff, player) {
    for (const row of this.rows) {
      row.y += diff.fallSpeed * dt;
      row.age += dt;
    }
    this.rows = this.rows.filter((r) => r.y < CONFIG.HEIGHT + r.size);

    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      const row = this.generateRow(diff, player);
      this.rows.push(row);
      this.lastRow = row;
      this.spawnTimer = diff.spawnInterval;
      if (this.onSpawn) this.onSpawn(row);
    }
  }

  generateRow(diff, player) {
    const L = CONFIG.LANES;
    const laneW = CONFIG.WIDTH / L;
    const size = laneW * diff.cubeFill;
    const reachFactor = CONFIG.DIFFICULTY.reachFactor;
    const all = Utils.range(L);

    // 1) Carriles alcanzables desde los huecos de la fila anterior
    //    en el tiempo que separa ambas filas.
    let fromLast = all;
    if (this.lastRow) {
      const travel = CONFIG.PLAYER.speed * diff.spawnInterval * reachFactor;
      const reach = Math.max(1, Math.floor(travel / laneW));
      fromLast = all.filter((i) => this.lastRow.open.some((p) => Math.abs(p - i) <= reach));
    }

    // 2) Carriles alcanzables desde donde está el jugador antes de que
    //    esta fila llegue a su altura.
    let candidates = fromLast;
    if (player) {
      const playerLane = Utils.clamp(Math.floor((player.x + player.size / 2) / laneW), 0, L - 1);
      const arrival = (player.y + size) / diff.fallSpeed;
      const reachP = Math.max(1, Math.floor((CONFIG.PLAYER.speed * arrival * reachFactor) / laneW));
      const both = fromLast.filter((i) => Math.abs(i - playerLane) <= reachP);
      if (both.length) candidates = both;
    }
    if (!candidates.length) candidates = all;

    // 3) Hueco garantizado (+ posible hueco doble, más frecuente al inicio).
    const anchor = Utils.pick(candidates);
    const open = new Set([anchor]);
    if (Math.random() < diff.doubleGapChance) {
      const n = anchor + (Math.random() < 0.5 ? -1 : 1);
      if (n >= 0 && n < L) open.add(n);
    }

    // 4) Resto de carriles: se rellenan aleatoriamente con "count" cubos.
    const count = Math.min(Utils.randInt(diff.minCubes, diff.maxCubes), L - open.size);
    const pool = Utils.shuffle(all.filter((i) => !open.has(i)));
    const filled = pool.slice(0, count).sort((a, b) => a - b);

    const cubes = filled.map((lane) => ({ lane, x: lane * laneW + (laneW - size) / 2 }));
    const openLanes = all.filter((i) => !filled.includes(i));

    return { y: -size, size, cubes, open: openLanes, age: 0 };
  }
}
