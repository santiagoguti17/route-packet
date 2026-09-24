'use strict';

/** Temporizador de la partida. */
class GameTimer {
  constructor(duration) {
    this.duration = duration;
    this.elapsed = 0;
  }

  reset() {
    this.elapsed = 0;
  }

  /** Avanza el tiempo. Devuelve true cuando se alcanza la duración. */
  update(dt) {
    this.elapsed = Math.min(this.duration, this.elapsed + dt);
    return this.elapsed >= this.duration;
  }

  get progress() {
    return this.elapsed / this.duration;
  }

  get remaining() {
    return this.duration - this.elapsed;
  }
}
