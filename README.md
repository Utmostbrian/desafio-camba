# ¡Desafío Camba!

Party game web con temática cruceña (Santa Cruz de la Sierra, Bolivia). Creado y pensado para estudiantes donde giran una ruleta que los manda a uno de 6 minijuegos con humor y jerga local ("cunumi", "opa", "facilingo", "chicote", "cambanga"). Pensada para jugarse en grupo desde una sola pantalla compartida (laptop/tablet/TV) — sin cuentas, sin backend, sin persistencia entre partidas.

Implementación fiel a un prototipo de Figma, construida sin librerías de UI: todo el look "papel rasgado" (torn paper), las máscaras de chiquitano, las animaciones y el audio están hechos a mano con CSS/SVG/Web Audio API.

## Cómo jugar

1. Pantalla de portada → tocar para continuar (arranca la música de fondo).
2. Girar la ruleta → cae en una de 6 categorías.
3. Pantalla de explicación/instrucciones de la categoría → "¡Inicia!".
4. Se juega la ronda (con temporizador cuando aplica).
5. Si se acaba el tiempo, aparece el overlay "¡Se acabó el Tiempo!" con el chicote.
6. Pantalla de resultado/revelación → "Ir a la ruleta" para volver al ciclo.

### Las 6 categorías

| Categoría | De qué se trata |
|---|---|
| **No se dice** | Adivinar la palabra/frase "cruceña" equivalente a una estándar, contrarreloj (10s). |
| **Escucha la canción** | Se reproducen 3s de una canción cruceña real; hay que reconocerla antes de que se acabe el tiempo. |
| **Adivina la leyenda** | Un jugador ve una ilustración de una leyenda cruceña (Guajojo, El Carretón de la Otra Vida, El Mojón con Cara, La Curiosa) y la actúa en mímica; el otro adivina (35s). |
| **Trivia** | 5 preguntas de opción múltiple sobre cultura general cruceña, 15s por pregunta. |
| **Enchoque** | Reto físico con el juego tradicional boliviano de la pelota y el tazo — la app solo corre un cronómetro de 3 minutos, el juego pasa fuera de pantalla. |
| **Menciona 3 lugares** | Decir 3 lugares que empiecen con una letra al azar, contrarreloj (15s). |

## Stack técnico

- **React 19 + Vite** — sin backend; todo el contenido (preguntas, frases, leyendas, canciones) vive en JSON local bajo `src/data/`.
- **Sin React Router** — cada pantalla es una máquina de estados con `useState` (`App.jsx` para el flujo global, un `STEPS` local por categoría en `CategoryRouter.jsx`).
- **CSS plano**, sin frameworks de UI — recrea la identidad visual del Figma: tarjetas "papel rasgado" (`clip-path` con dientes finos + `drop-shadow`), degradados verdes, tipografía Baloo 2 (Google Fonts).
- **Web Audio API** para la música de fondo — loop realmente sin corte (`decodeAudioData` + `AudioBufferSourceNode.loop`), evitando el click audible que produce `<audio loop>` al reiniciar.
- **Canvas de escenario fijo** de 1440×1024 (`.stage`), escalado a cualquier viewport vía un hook (`useStageScale`) con `transform: scale()`.
- **Vitest + @testing-library/react** para las pruebas de cada componente/categoría (timers simulados con `vi.useFakeTimers()`).

## Estructura del proyecto

```
src/
  App.jsx                  # Máquina de estados de alto nivel: splash → ruleta → categoría
  CategoryRouter.jsx        # Enruta el categoryId elegido a su carpeta en screens/categories
  main.jsx                  # Bootstrap de React + listener de primer gesto para audio

  screens/
    SplashScreen.jsx/.css    # Portada con logo, mascota y tap-to-continue
    WheelScreen.jsx/.css     # Ruleta con efecto "tragamonedas" (reel) y selección de categoría
    categories/
      NoSeDice/
      EscuchaCancion/
      AdivinaLeyenda/
      Trivia/
      Enchoque/
      MencionaLugares/
      # cada carpeta: Intro/Title, Instructions (si aplica), Game, index.jsx (state machine local)

  components/               # Piezas compartidas entre categorías
    TornCard.jsx/.css         # Tarjeta "papel rasgado" con máscara y manos del chiquitano opcionales
    PillButton.jsx/.css       # Botón pastilla primario/ghost
    ProgressTimerBar.jsx/.css # Barra de progreso de cuenta regresiva
    TimeUpOverlay.jsx/.css    # Overlay "¡Se acabó el Tiempo!" con el chicote
    RoundEndScreen.jsx/.css   # Pantalla de cierre de ronda ("¡Mioj! Facilingo")
    MusicToggle.jsx/.css      # Botón flotante de silenciar/activar música

  hooks/
    useCountdown.js          # Cuenta regresiva reutilizable (segundos restantes + onExpire)
    useStageScale.js          # Escala el stage de 1440×1024 al viewport disponible

  lib/
    backgroundMusic.js        # Singleton de Web Audio API para el loop de música de fondo
    random.js                  # pickRandom / pickRandomN / angleForCategory (lógica de la ruleta)

  data/                      # Contenido del juego, editable sin tocar código
    categorias.json            # Las 6 categorías de la ruleta (id, nombre, duración, color)
    noSeDice.json               # Pares {frase, respuesta}
    canciones.json               # {nombre, archivo, artista}
    leyendas.json                  # Leyendas + imagen asociada
    trivia.json                     # Banco de preguntas de opción múltiple
    enchoque.json                    # Copy e instrucciones del reto físico

  styles/
    tokens.css                # Variables de diseño (colores, radios, fuentes)
    global.css                 # Estilos compartidos (stage, category-intro/game, títulos)

public/
  audio/                     # Clips de 3s reales para "Escucha la canción" + versiones completas
  favicon.png                 # Recortado de la máscara chiquitana

docs/
  specs/                     # Spec de diseño derivada del prototipo de Figma
  superpowers/plans/          # Plan de implementación por tareas
```

## Desarrollo local

Requiere Node.js 18+.

```bash
npm install
npm run dev       # levanta el servidor de desarrollo (Vite)
npm run build      # build de producción a dist/
npm run preview     # sirve el build de producción localmente
npm run test          # corre la suite de Vitest
npm run lint            # oxlint
```

## Notas de implementación

- **Sin persistencia**: el estado (categoría elegida, puntajes, progreso) vive solo en memoria durante la sesión del navegador; refrescar la página reinicia el flujo desde la portada.
- **Contenido editable sin tocar código**: agregar/quitar preguntas, frases, canciones o leyendas es cuestión de editar los JSON en `src/data/`.
- **Assets reales**: todas las imágenes e ilustraciones (personaje de portada, máscara y manos del chiquitano, fondos, leyendas, personajes de la ruleta) y los clips de audio son los provistos para el proyecto, no placeholders.
- **Fidelidad al Figma**: el copy (incluyendo jerga y frases coloquiales) se mantiene tal cual aparece en el diseño original; la spec completa está en `docs/specs/`.

---
