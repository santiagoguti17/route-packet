# ROUTE PACKET

Juego arcade 2D de reflejos: sobrevive 30 segundos esquivando filas de cubos rojos.
Sin dependencias ni backend: abre `index.html` en cualquier navegador moderno.

**Jugar online:** https://santiagoguti17.github.io/route-packet/

## Controles

- `A` / `←` — izquierda
- `D` / `→` — derecha
- `Enter` / `Espacio` — START / TRY AGAIN / PLAY AGAIN
- En pantallas táctiles: botones `←` `→` bajo el área de juego, o tocar la mitad izquierda/derecha del área.

Se pierde al tocar un cubo rojo o cualquiera de las paredes laterales.

## Estructura

```
index.html          Marcado: HUD, área de juego (canvas), overlays, pie
css/style.css       Estética terminal arcade, layout responsive
js/config.js        Todos los parámetros ajustables (tamaños, velocidades, colores, curva de dificultad)
js/utils.js         Utilidades numéricas y de aleatoriedad
js/difficulty.js    Interpolación gradual de parámetros según el progreso (0..1)
js/timer.js         Temporizador de la partida
js/input.js         Teclado, botones táctiles y zonas táctiles
js/obstacles.js     Generación procedural de filas y su movimiento
js/collision.js     Colisiones AABB jugador/cubos/paredes
js/effects.js       Partículas, flash, sacudida, pulso al aparecer una fila
js/renderer.js      Dibujo del canvas (rejilla, cubos, jugador, glow)
js/ui.js            HUD y overlays (DOM)
js/game.js          Máquina de estados y bucle principal (requestAnimationFrame)
```

## Generación de filas

El ancho se divide en `CONFIG.LANES` carriles (8 por defecto). Cada fila elige al azar
qué carriles llevan cubo, garantizando:

1. Al menos un carril libre.
2. Que ese carril sea alcanzable desde los huecos de la fila anterior con la velocidad
   del jugador y el intervalo entre filas.
3. Que sea alcanzable desde la posición actual del jugador antes de que la fila llegue a su altura.

Al inicio es frecuente un hueco doble; con el tiempo los cubos crecen, caen más rápido,
aparecen más a menudo y hay más cubos por fila. Todo se ajusta en `CONFIG.DIFFICULTY`.
