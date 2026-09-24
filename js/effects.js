'use strict';

/**
 * Efectos visuales: partículas, flash de pantalla, sacudida y pulso superior
 * al aparecer una fila.
 */
const Effects = (() => {
  const W = CONFIG.WIDTH;
  const H = CONFIG.HEIGHT;

  let particles = [];
  let flash = { color: '#fff', alpha: 0, decay: 2 };
  let shake = { mag: 0, time: 0, duration: 1 };
  let topPulse = 0;

  function burst(x, y, color, count = 30, speed = 240) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const v = speed * (0.35 + Math.random() * 0.85);
      const life = 0.5 + Math.random() * 0.6;
      particles.push({
        x, y,
        vx: Math.cos(angle) * v,
        vy: Math.sin(angle) * v,
        life, maxLife: life,
        size: 2 + Math.random() * 4,
        color,
      });
    }
  }

  function flashScreen(color, alpha = 0.45, decay = 2.5) {
    flash = { color, alpha, decay };
  }

  function shakeScreen(mag = 10, duration = 0.4) {
    shake = { mag, time: duration, duration };
  }

  function pulseTop() {
    topPulse = 1;
  }

  function update(dt) {
    for (const p of particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.life -= dt;
    }
    particles = particles.filter((p) => p.life > 0);

    if (flash.alpha > 0) flash.alpha = Math.max(0, flash.alpha - flash.decay * dt);
    if (shake.time > 0) shake.time = Math.max(0, shake.time - dt);
    if (topPulse > 0) topPulse = Math.max(0, topPulse - dt * 2.5);
  }

  function shakeOffset() {
    if (shake.time <= 0) return { x: 0, y: 0 };
    const k = shake.time / shake.duration;
    return {
      x: (Math.random() * 2 - 1) * shake.mag * k,
      y: (Math.random() * 2 - 1) * shake.mag * k,
    };
  }

  function drawParticles(ctx) {
    if (!particles.length) return;
    ctx.shadowBlur = 10;
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  function drawTopPulse(ctx) {
    if (topPulse <= 0) return;
    const g = ctx.createLinearGradient(0, 0, 0, 48);
    g.addColorStop(0, `rgba(255, 77, 77, ${0.35 * topPulse})`);
    g.addColorStop(1, 'rgba(255, 77, 77, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, 48);
  }

  function drawFlash(ctx) {
    if (flash.alpha <= 0) return;
    ctx.globalAlpha = flash.alpha;
    ctx.fillStyle = flash.color;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }

  function reset() {
    particles = [];
    flash.alpha = 0;
    shake.time = 0;
    topPulse = 0;
  }

  return Object.freeze({
    burst, flashScreen, shakeScreen, pulseTop,
    update, shakeOffset, drawParticles, drawTopPulse, drawFlash, reset,
  });
})();
