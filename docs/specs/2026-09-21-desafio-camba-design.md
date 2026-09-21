# Desafío Camba! — Diseño

Fuente: prototipo de Figma "desafio-camba" (fileKey `5l5X0UniK5RRNS1UfG3Tfj`), revisado vía MCP de Figma (parcial) y PDF exportado del proyecto (`~/Downloads/desafio camba pdf.pdf`), que cubrió los 34 frames del canvas.

## Qué es

Web app de fiesta ("party game") con temática cruceña (Santa Cruz de la Sierra, Bolivia). Los jugadores giran una ruleta que los manda a uno de 6 tipos de desafío. Pensado para jugarse en grupo desde una laptop/tablet compartida (no mobile-first — se respeta el layout de Figma, 1440×1024, con escalado responsive razonable para pantallas grandes).

Tono: humor local boliviano/cruceño ("cunumi", "opa", "facilingo", "chicote"). Todo el copy va en español rioplatense/boliviano tal cual aparece en el diseño, sin traducir ni neutralizar.

## Stack

- **React + Vite**, sin backend — todo el contenido (preguntas, palabras, leyendas, canciones) vive en archivos JSON locales dentro del proyecto.
- React Router para las pantallas/flujos.
- CSS plano (o CSS Modules) recreando la identidad visual — sin librería de UI, dado que el diseño tiene una identidad muy propia (tarjetas "papel rasgado", degradados verdes, tipografía bold redondeada).
- Sin persistencia entre sesiones (no hay login, no hay base de datos) — el estado del puntaje vive en memoria durante la sesión de juego.

## Estructura de pantallas / flujo

```
Splash "Desafío Camba!" (tap para continuar)
  → Ruleta (girar → selección de categoría → "Iniciar")
      → [categoría elegida]
          → Explicación + Instrucciones (si aplica) → ¡Inicia!
          → Pantalla(s) de juego (con timer)
          → Se acabó el tiempo! (si vence el timer) — vuelve a mostrar la respuesta
          → Resultado / reveal
          → ¡Mioj! Facilingo (fin de ronda) → "Ir a la ruleta"
      ← vuelve a Ruleta
```

## Las 6 categorías

### 1. No se dice (taboo / adivina la palabra)
- Muestra una frase con una palabra "prohibida" tachada por su sinónimo cruceño: *"No se dice despeinado, se dice..."* con barra de progreso de tiempo.
- Reveal: *"¡Esta Clinudo!"* con botón "siguiente".
- Variante con silueta de imagen (animal, objeto) + pregunta *"¿Sabes cual es no?"* + botón "Ya adivinó".
- Contenido: lista de pares {frase, palabra_estandar, palabra_cruceña} y {silueta, respuesta} en JSON.

### 2. Escucha la canción
- Pantalla previa: *"Escucha y continua la canción — Presta mucha atención, ¡Solo tienes 3s!"* → ¡Inicia!
- Reproduce 3s de un clip de audio (aleatorio de la colección).
- 5s para responder + botón de acierto directo.
- Requiere carpeta `assets/audio/canciones/` con archivos mp3 (el usuario los provee). Placeholder con 2-3 clips libres de derecho mientras tanto.

### 3. Adivina la leyenda
- Tarjetas "Explicación" + "Instrucciones": un jugador ve la imagen de la leyenda en pantalla y hace mímica sin hablar; el otro adivina. Piedra/papel/tijera decide roles. 35s para adivinar.
- Imagen de la leyenda elegida al azar de una colección (ilustraciones libres/recreadas, no assets exactos de Figma).
- Botón ¡Inicia!, luego pantalla de juego con imagen + temporizador.

### 4. Trivia
- Tarjetas "Explicación" (cultura general cruceña, 5 preguntas, opción múltiple, gana quien más puntaje) + "Instrucciones" (levantar la mano, 2pt por acierto) + "Tiempo de cada pregunta: 15s".
- 5 preguntas aleatorias (de un banco mayor) con 4 opciones (A-D), barra de progreso de 15s.
- Si las opciones son largas, la tipografía baja a 30pt y la barra se extiende (regla de estilo).
- Reveal de respuesta correcta al contestar o al agotarse el tiempo.
- Banco de preguntas en JSON (ejemplo real capturado: *"¿En qué año fue fundada Santa Cruz de la Sierra por Ñuflo de Chaves?"* A)1559 B)1561 C)1678 D)1523).

### 5. Enchoque (reto físico)
- Es un desafío del mundo real (el juego tradicional de meter la pelota en el tazo con el "enchoque"), no una mecánica en pantalla.
- Pantalla de instrucciones: *"¡Esto es un reto de agilidad! Compite contra tu rival... ¡Vamos Cunumi!"* + pasos + "Tiempo: 3 minutos".
- La app solo corre un cronómetro de cuenta regresiva de 3 min con botón de inicio/parada; no hay verificación de aciertos en pantalla (los jugadores cuentan a ojo).

### 6. Pantallas compartidas
- **"¡Se acabó el Tiempo!"** — overlay tipo sticker con ícono de chicote, aparece cuando vence cualquier timer. Botón contextual ("Sí la sé!" / continuar).
- **"¡Mioj! Facilingo — ¡Volvamos de una vez!"** — pantalla de cierre de ronda con botón "Ir a la ruleta", vuelve al inicio del ciclo.

## Contenido / datos

Todo el contenido vive en `src/data/*.json`, editable sin tocar código:
- `noSeDice.json` — pares palabra/frase y siluetas
- `trivia.json` — banco de preguntas
- `leyendas.json` — leyendas (nombre + descripción + referencia a imagen)
- `canciones.json` — metadata de clips (nombre, archivo, artista si aplica)
- `enchoque.json` (o config inline) — texto de instrucciones, tiempo

## Assets visuales

No se pudo exportar el archivo Figma real por límite de cuota del MCP (plan Starter). Se recrea la identidad visual con CSS puro:
- Paleta: verde oscuro degradado (`#0d2b12` → `#1a4d24` aprox.), verde lima de acento (`#7ed321`/`#8bc53f` aprox.), blanco cálido para tarjetas (`#f4fdf4`).
- Tipografía bold redondeada (Poppins/Baloo 2 o similar de Google Fonts, gratuita).
- Tarjetas con borde "papel rasgado" vía SVG filter o `clip-path` irregular.
- Ilustraciones (silueta de pájaro, el payaso "facilingo", el chicote, el incendio del logo) recreadas como SVG simples con licencia propia — no calcadas del Figma, aproximando la sensación general.
- Fondo con silueta de casco histórico cruceño (iglesia, balcones) repetido en cada pantalla — recreado como SVG/CSS simple.

## Fuera de alcance (explícito)

- No hay backend, no hay multiplayer en red — todo es "pasa el dispositivo" en la misma sala.
- No hay guardado de puntajes entre sesiones.
- No hay pixel-perfect de cada ilustración del Figma (assets no exportables por cuota); se prioriza fidelidad de estructura, copy exacto y mecánica de juego.
