'use strict';

/**
 * Controles: teclado (A/D, flechas), botones táctiles y zonas táctiles.
 * Expone axis() → -1, 0 o 1.
 */
const Input = (() => {
  const state = { left: false, right: false };
  const touchLeft = new Set();   // ids de punteros manteniendo izquierda
  const touchRight = new Set();  // ids de punteros manteniendo derecha
  let onAction = null;
  let lastActionAt = 0;

  const LEFT_KEYS = new Set(['a', 'A', 'ArrowLeft', 'KeyA']);
  const RIGHT_KEYS = new Set(['d', 'D', 'ArrowRight', 'KeyD']);

  function fireAction() {
    const now = performance.now();
    if (now - lastActionAt < 250) return; // evita doble disparo (tecla + click)
    lastActionAt = now;
    if (onAction) onAction();
  }

  function handleKey(e, down) {
    if (LEFT_KEYS.has(e.key) || LEFT_KEYS.has(e.code)) {
      state.left = down;
      e.preventDefault();
    } else if (RIGHT_KEYS.has(e.key) || RIGHT_KEYS.has(e.code)) {
      state.right = down;
      e.preventDefault();
    } else if (down && !e.repeat && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      fireAction();
    }
  }

  window.addEventListener('keydown', (e) => handleKey(e, true));
  window.addEventListener('keyup', (e) => handleKey(e, false));
  window.addEventListener('blur', reset);

  function syncTouch() {
    state.left = state.left || touchLeft.size > 0;
    state.right = state.right || touchRight.size > 0;
  }

  /** Botón que mantiene una dirección mientras se presiona. */
  function bindHold(el, dir) {
    const set = dir === 'left' ? touchLeft : touchRight;
    const press = (e) => { e.preventDefault(); set.add(e.pointerId); state[dir] = true; };
    const release = (e) => { set.delete(e.pointerId); state[dir] = set.size > 0; };
    el.addEventListener('pointerdown', press);
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
    el.addEventListener('pointerleave', release);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /** Tocar la mitad izquierda/derecha del área de juego también mueve. */
  function bindTouchZone(el) {
    const dirFor = (e) => {
      const rect = el.getBoundingClientRect();
      return e.clientX - rect.left < rect.width / 2 ? 'left' : 'right';
    };
    const press = (e) => {
      if (e.pointerType === 'mouse') return;
      const dir = dirFor(e);
      (dir === 'left' ? touchLeft : touchRight).add(e.pointerId);
      state[dir] = true;
    };
    const release = (e) => {
      touchLeft.delete(e.pointerId);
      touchRight.delete(e.pointerId);
      state.left = touchLeft.size > 0;
      state.right = touchRight.size > 0;
    };
    el.addEventListener('pointerdown', press);
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
  }

  function axis() {
    return (state.right ? 1 : 0) - (state.left ? 1 : 0);
  }

  function reset() {
    state.left = false;
    state.right = false;
    touchLeft.clear();
    touchRight.clear();
  }

  function setActionHandler(fn) {
    onAction = fn;
  }

  return Object.freeze({ axis, reset, bindHold, bindTouchZone, setActionHandler, syncTouch });
})();
