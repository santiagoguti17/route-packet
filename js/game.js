'use strict';

/**
 * Lógica principal y bucle del juego.
 * Estados: 'idle' | 'running' | 'over' | 'won'
 */
const Game = (() => {
  const W = CONFIG.WIDTH;
  const H = CONFIG.HEIGHT;
  const MAX_DT = 1 / 30;
  const END_SCREEN_DELAY = 550; // ms antes de mostrar la pantalla final

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  const player = { x: 0, y: 0, size: CONFIG.PLAYER.size };
  const field = new ObstacleField();
  const timer = new GameTimer(CONFIG.DURATION);

  let state = 'idle';
  let diff = Difficulty.at(0);
  let lastFrame = 0;
  let endTimeout = null;

  // ---------- Canvas ----------

  function setupCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ---------- Ciclo de partida ----------

  function resetPlayer() {
    player.x = (W - player.size) / 2;
    player.y = H - CONFIG.PLAYER.bottomOffset - player.size;
  }

  function start() {
    if (state === 'running') return;
    clearTimeout(endTimeout);

    resetPlayer();
    field.reset();
    timer.reset();
    Effects.reset();
    Input.reset();
    diff = Difficulty.at(0);

    UI.resetHud();
    UI.hideOverlays();
    UI.setStageState('');

    state = 'running';
    lastFrame = performance.now();
  }

  function lose(hit) {
    state = 'over';
    const cx = player.x + player.size / 2;
    const cy = player.y + player.size / 2;
    Effects.burst(cx, cy, CONFIG.COLORS.player, 36, 260);
    if (hit.cube) {
      Effects.burst(hit.cube.x + hit.cube.size / 2, hit.cube.y + hit.cube.size / 2, CONFIG.COLORS.cube, 18, 160);
    }
    Effects.flashScreen(CONFIG.COLORS.cube, 0.5, 2.2);
    Effects.shakeScreen(12, 0.45);
    UI.setStageState('lost');
    UI.setGameOverTime(timer.elapsed);
    endTimeout = setTimeout(() => UI.showOverlay('over'), END_SCREEN_DELAY);
  }

  function win() {
    state = 'won';
    const cx = player.x + player.size / 2;
    const cy = player.y + player.size / 2;
    Effects.burst(cx, cy, CONFIG.COLORS.player, 60, 320);
    Effects.flashScreen(CONFIG.COLORS.player, 0.4, 1.8);
    UI.setProgress(1);
    UI.setTime(CONFIG.DURATION);
    UI.setStageState('won');
    endTimeout = setTimeout(() => UI.showOverlay('win'), END_SCREEN_DELAY);
  }

  // ---------- Actualización ----------

  function update(dt) {
    // 1) temporizador y dificultad
    const finished = timer.update(dt);
    diff = Difficulty.at(timer.progress);

    // 2) jugador
    player.x += Input.axis() * CONFIG.PLAYER.speed * dt;

    // 3) obstáculos
    field.update(dt, diff, player);

    // 4) colisiones
    const hit = Collision.check(player, field);
    if (hit) {
      lose(hit);
      return;
    }

    // 5) victoria
    if (finished) {
      win();
      return;
    }

    // 6) HUD
    UI.setProgress(timer.progress);
    UI.setTime(timer.elapsed);
    UI.setStatus(Difficulty.label(timer.progress));
  }

  function frame(now) {
    const dt = Utils.clamp((now - lastFrame) / 1000, 0, MAX_DT);
    lastFrame = now;

    if (state === 'running') update(dt);
    Effects.update(dt);

    Renderer.render(ctx, {
      player,
      field,
      showPlayer: state !== 'over',
    });

    requestAnimationFrame(frame);
  }

  // ---------- Inicialización ----------

  function init() {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);

    resetPlayer();
    UI.resetHud();
    UI.showOverlay('start');

    field.onSpawn = () => Effects.pulseTop();

    UI.els.btnStart.addEventListener('click', start);
    UI.els.btnRetry.addEventListener('click', start);
    UI.els.btnAgain.addEventListener('click', start);
    Input.setActionHandler(() => { if (state !== 'running') start(); });

    Input.bindHold(UI.els.btnLeft, 'left');
    Input.bindHold(UI.els.btnRight, 'right');
    Input.bindTouchZone(UI.els.stage);

    lastFrame = performance.now();
    requestAnimationFrame(frame);
  }

  return Object.freeze({ init, start, get state() { return state; } });
})();

Game.init();
