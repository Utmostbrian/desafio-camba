# Desafío Camba! — Diseño

Fuente: prototipo de Figma "desafio-camba" (fileKey `5l5X0UniK5RRNS1UfG3Tfj`), 34 frames, revisado vía MCP de Figma (parcial, limitado por cuota) y PDF exportado del proyecto (`~/Downloads/desafio camba pdf.pdf`). Assets reales exportados manualmente por el usuario en `~/Downloads/Desafio Camba/`.

## Qué es

Web app de fiesta ("party game") con temática cruceña (Santa Cruz de la Sierra, Bolivia). Los jugadores giran una ruleta que los manda a uno de 6 tipos de desafío. Pensado para jugarse en grupo desde una laptop/tablet compartida — layout fijo tipo desktop/tablet (1440×1024 base, con escalado responsive razonable para pantallas grandes), sin adaptación mobile-first.

Tono: humor local boliviano/cruceño ("cunumi", "opa", "facilingo", "chicote", "cambanga"). Todo el copy va tal cual aparece en el diseño, sin traducir ni neutralizar.

## Stack

- **React + Vite**, sin backend — todo el contenido (preguntas, palabras, leyendas, canciones) vive en archivos JSON locales dentro del proyecto.
- React Router para las pantallas/flujos.
- CSS plano (o CSS Modules) recreando la identidad visual: tarjetas "papel rasgado", degradados verdes, tipografía bold redondeada (Poppins/Baloo 2 de Google Fonts).
- Sin persistencia entre sesiones — el estado del puntaje vive en memoria durante la sesión de juego.

## Assets reales disponibles

Ubicados en `~/Downloads/Desafio Camba/` (se copian a `src/assets/` del proyecto):
- `Ilustración Portada/portada.png` — mascota/personaje principal (corriendo con chicote en llamas), usado en el splash.
- `Fondos/Fondo Ruleta.png`, `Fondo Con Hoja.png`, `Fondo sin Hoja.png` — fondos de pantalla.
- `Hojas y leyendas/Hoja chica.png`, `fondo hoja2.png`, `leyendas.png` — texturas de tarjeta "papel rasgado".
- `Juego Leyendas/` — 4 ilustraciones reales de leyendas cruceñas: `guajojo.png`, `el carreton de la otra vida.png`, `el mojon con cara.png`, `la curiosa.png` (banco de imágenes para "Adivina la leyenda").
- `Chiquitano y pegi/` — `mascara chiquitana.png` (personaje que asoma en pantallas de intro), `Cola de pegi.png` + `Mano Chiquitana 1.png` + `Mano Chiquitana 2.png` (piezas del chicote animado, usado como ícono de "tiempo agotado").

No hay assets de audio — el usuario debe proveer los clips mp3 de "Escucha la canción"; mientras tanto se usan 2-3 placeholders libres de derecho.

## Estructura de pantallas / flujo

```
Splash "Desafío Camba!" (tap para continuar)
  → Ruleta (girar → selección de categoría → "Iniciar")
      → [categoría elegida]
          → Explicación + Instrucciones (si aplica) → ¡Inicia!
          → Pantalla(s) de juego (con timer)
          → Se acabó el tiempo! (overlay con chicote, si vence el timer)
          → Resultado / reveal
          → Cierre de ronda → "Ir a la ruleta"
      ← vuelve a Ruleta
```

## Las 6 categorías

### 1. No se dice (tabú cruceño)
- Intro: "No se dice... se dice..." + "Cuidado eh cunumi, demuestra que tan cambanga soj" + "Tienes 10s" + botón "¡Inicia!".
- Juego: tarjeta papel rasgado con frase objetivo ("No se dice está despeinado, se dice…") + barra de progreso de 10s.
- Tiempo agotado: overlay chicote.
- Contenido: banco de pares {frase, palabra estándar, palabra cruceña} en JSON.

### 2. Escucha la canción
- Intro: "Escucha y continua la canción — Presta mucha atención, ¡Solo tienes 3s!" → ¡Inicia!
- Reproduce 3s de audio (elemento `<audio>` real + indicador visual de barras/ecualizador), sin opción de repetir ("Ni cagando repetimos").
- Respuesta: "¿Apoco y te la sabes?" + barra de progreso + botón "¡Si la sé!" (acierto directo) + 5s límite.
- Contenido: `canciones.json` (nombre, archivo, artista) + placeholders de audio hasta que el usuario provea los reales.

### 3. Adivina la leyenda
- Intro: "Adivina la Leyenda!" + "La típicas de las típicas" → ¡Inicia!.
- Instrucciones (2 tarjetas): Explicación (un jugador ve la imagen y hace mímica sin hablar; el otro adivina) + Instrucciones (piedra/papel/tijera decide roles, "Tiempo para adivinar: 35s").
- Juego: imagen real de leyenda (aleatoria del banco de 4: guajojo, el carretón de la otra vida, el mojón con cara, la curiosa) + temporizador 35s (20s para memorizar/mimicar).

### 4. Trivia
- Intro: tarjetas Explicación (5 preguntas, opción múltiple, gana quien más puntaje) + Instrucciones (levantar la mano, 2pt por acierto, "Tiempo de cada pregunta: 15s").
- Juego: pregunta + 4 opciones (A-D) en pills verdes + barra de progreso de 15s. Si las opciones son largas, tipografía baja a 30pt y la barra se extiende.
- Reveal de respuesta correcta al contestar o agotar tiempo.
- Contenido: banco de preguntas en JSON (ejemplo real: "¿En qué año fue fundada Santa Cruz de la Sierra por Ñuflo de Chaves?" A)1559 B)1561 C)1678 D)1523), se eligen 5 aleatorias por ronda.

### 5. Enchoque (reto físico)
- Es el juego tradicional boliviano de la pelota y el tazo/enchoque, jugado fuera de pantalla.
- Pantalla de instrucciones: reto de agilidad, pasos del juego, "Tiempo: 3 minutos".
- La app solo corre un cronómetro de cuenta regresiva de 3 min con botón inicio/parada — sin verificación de aciertos en pantalla (los jugadores cuentan a ojo).

### 6. Pantallas compartidas
- **"¡Se acabó el Tiempo!"** — overlay tipo sticker con el chicote animado (assets de `Chiquitano y pegi/`), aparece al vencer cualquier timer. Botón contextual de continuar.
- **Cierre de ronda** — pantalla de fin con botón "Ir a la ruleta", vuelve al inicio del ciclo.

## Contenido / datos

Todo en `src/data/*.json`, editable sin tocar código:
- `noSeDice.json` — pares palabra/frase
- `trivia.json` — banco de preguntas
- `leyendas.json` — leyendas (nombre + descripción + referencia a imagen real)
- `canciones.json` — metadata de clips (nombre, archivo, artista)
- `enchoque.json` — texto de instrucciones, duración del cronómetro

## Paleta y estilo (de referencia, sobre los assets reales)

- Verde oscuro degradado (`#0d2b12` → `#1a4d24` aprox.), verde lima de acento (`#7ed321`/`#8bc53f` aprox.), blanco cálido para tarjetas (`#f4fdf4`).
- Tipografía bold redondeada (Poppins/Baloo 2, Google Fonts).
- Tarjetas con borde "papel rasgado" usando las texturas reales exportadas.
- Fondos con silueta de casco histórico cruceño (assets reales de `Fondos/`).

## Fuera de alcance (explícito)

- No hay backend, no hay multiplayer en red — todo es "pasa el dispositivo" en la misma sala.
- No hay guardado de puntajes entre sesiones.
- Audio de "Escucha la canción" queda con placeholders hasta que el usuario provea los clips reales.
