'use strict';

/** Interfaz: HUD, overlays y botones. */
const UI = (() => {
  const $ = (id) => document.getElementById(id);

  const els = {
    barFill: $('bar-fill'),
    time: $('hud-time'),
    status: $('hud-status'),
    stage: $('stage'),
    overlays: {
      start: $('overlay-start'),
      over: $('overlay-over'),
      win: $('overlay-win'),
    },
    overTime: $('over-time'),
    btnStart: $('btn-start'),
    btnRetry: $('btn-retry'),
    btnAgain: $('btn-again'),
    btnLeft: $('btn-left'),
    btnRight: $('btn-right'),
  };

  function setProgress(p) {
    els.barFill.style.width = `${(Utils.clamp(p, 0, 1) * 100).toFixed(1)}%`;
  }

  function setTime(elapsed) {
    els.time.textContent = `TIME: ${elapsed.toFixed(1)} / ${CONFIG.DURATION.toFixed(1)}`;
  }

  function setStatus(text) {
    if (els.status.textContent !== text) els.status.textContent = text;
  }

  function setGameOverTime(seconds) {
    els.overTime.textContent = `SURVIVED ${seconds.toFixed(2)}s`;
  }

  function showOverlay(name) {
    for (const [key, el] of Object.entries(els.overlays)) {
      el.classList.toggle('hidden', key !== name);
    }
    const btn = { start: els.btnStart, over: els.btnRetry, win: els.btnAgain }[name];
    if (btn) btn.focus({ preventScroll: true });
  }

  function hideOverlays() {
    for (const el of Object.values(els.overlays)) el.classList.add('hidden');
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }

  /** 'lost' | 'won' | '' */
  function setStageState(cls) {
    els.stage.classList.remove('lost', 'won');
    if (cls) els.stage.classList.add(cls);
  }

  function resetHud() {
    setProgress(0);
    setTime(0);
    setStatus(Difficulty.label(0));
  }

  return Object.freeze({
    els, setProgress, setTime, setStatus, setGameOverTime,
    showOverlay, hideOverlays, setStageState, resetHud,
  });
})();
