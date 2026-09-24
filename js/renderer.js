'use strict';

/** Dibujo del área de juego en el canvas. */
const Renderer = (() => {
  const W = CONFIG.WIDTH;
  const H = CONFIG.HEIGHT;
  const C = CONFIG.COLORS;
  const GRID = 40;

  function background(ctx) {
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = C.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = GRID; x < W; x += GRID) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, H);
    }
    for (let y = GRID; y < H; y += GRID) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(W, y + 0.5);
    }
    ctx.stroke();
  }

  /** Aviso rojo en la pared cuando el jugador se acerca a ella. */
  function wallWarnings(ctx, p) {
    const RANGE = 70;
    const left = p.x;
    const right = W - (p.x + p.size);
    const draw = (x0, x1, k) => {
      const g = ctx.createLinearGradient(x0, 0, x1, 0);
      g.addColorStop(0, `rgba(255, 77, 77, ${0.45 * k})`);
      g.addColorStop(1, 'rgba(255, 77, 77, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(Math.min(x0, x1), 0, Math.abs(x1 - x0), H);
    };
    if (left < RANGE) draw(0, 40, 1 - left / RANGE);
    if (right < RANGE) draw(W, W - 40, 1 - right / RANGE);
  }

  function rows(ctx, list) {
    ctx.shadowColor = C.cube;
    for (const row of list) {
      // pop-in al aparecer
      const k = Math.min(1, row.age / 0.18);
      const s = row.size * (0.6 + 0.4 * k);
      const off = (row.size - s) / 2;
      ctx.globalAlpha = 0.4 + 0.6 * k;

      ctx.shadowBlur = 16;
      ctx.fillStyle = C.cube;
      for (const c of row.cubes) ctx.fillRect(c.x + off, row.y + off, s, s);

      ctx.shadowBlur = 0;
      ctx.fillStyle = C.cubeCore;
      const m = s * 0.3;
      for (const c of row.cubes) ctx.fillRect(c.x + off + m, row.y + off + m, s - 2 * m, s - 2 * m);
    }
    ctx.globalAlpha = 1;
  }

  function player(ctx, p) {
    ctx.shadowColor = C.player;
    ctx.shadowBlur = 22;
    ctx.fillStyle = C.player;
    ctx.fillRect(p.x, p.y, p.size, p.size);
    ctx.shadowBlur = 0;
    ctx.fillStyle = C.playerCore;
    ctx.fillRect(p.x + 5, p.y + 5, p.size - 10, p.size - 10);
  }

  function border(ctx) {
    ctx.strokeStyle = C.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);
  }

  /**
   * scene = { player, field, showPlayer }
   */
  function render(ctx, scene) {
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);

    const o = Effects.shakeOffset();
    ctx.save();
    ctx.translate(o.x, o.y);

    background(ctx);
    if (scene.showPlayer) wallWarnings(ctx, scene.player);
    rows(ctx, scene.field.rows);
    if (scene.showPlayer) player(ctx, scene.player);
    Effects.drawParticles(ctx);
    Effects.drawTopPulse(ctx);
    border(ctx);

    ctx.restore();
    Effects.drawFlash(ctx);
  }

  return Object.freeze({ render });
})();
