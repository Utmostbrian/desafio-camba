# Desafío Camba! Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full "Desafío Camba!" party-game web app from the Figma prototype: a spinning wheel that launches 6 minigame categories, using the real exported brand assets, in React + Vite.

**Architecture:** Single-page React app (Vite, React Router) with no backend. Shared layout/timer/overlay components live in `src/components/`; each of the 6 categories is a self-contained screen module under `src/screens/categories/` that manages its own local step state (intro → instructions → game → time's up/reveal → round end). All game content (questions, words, legends, songs, enchoque copy) lives in versioned JSON under `src/data/`, so content can be edited without touching component code. Real brand assets (already copied into `src/assets/`) are renamed to safe kebab-case filenames as the first task, then imported normally through Vite's asset pipeline.

**Tech Stack:** React 18, Vite, React Router v6, Vitest + @testing-library/react for tests, plain CSS (CSS variables for design tokens, no UI library).

**Spec:** `docs/specs/2026-09-21-desafio-camba-design.md`

## Global Constraints

- No backend, no network calls, no persistence between sessions (spec: "Fuera de alcance").
- Base layout is fixed desktop/tablet size (1440×1024) with responsive scaling — not mobile-first (user's explicit choice).
- All copy stays in the original cruceño Spanish exactly as captured in the spec — never translate or neutralize it (e.g. "cunumi", "opa", "cambanga", "facilingo", "chicote").
- Use the real exported assets in `src/assets/` (after renaming in Task 1) instead of recreating illustrations.
- Trivia: 5 random questions per round from a larger bank, 15s per question, long option text drops to 30pt and the option bar extends (spec section 4).
- No se dice: 10s per round. Adivina la leyenda: 35s total (20s to memorize/mime). Enchoque: 3-minute countdown, no on-screen answer checking.
- Escucha la canción has no real audio assets yet — ships with placeholder royalty-free clips and a `canciones.json` structure the user can swap files into later.

---

## File Structure

```
desafio_camba/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx
│   ├── App.jsx                          # router + layout shell
│   ├── styles/
│   │   ├── tokens.css                   # CSS variables: colors, fonts, spacing
│   │   └── global.css                   # resets, base typography, layout shell
│   ├── data/
│   │   ├── categorias.json              # wheel slice config
│   │   ├── noSeDice.json
│   │   ├── trivia.json
│   │   ├── leyendas.json
│   │   ├── canciones.json
│   │   └── enchoque.json
│   ├── assets/                          # renamed real brand assets (Task 1)
│   │   ├── portada.png
│   │   ├── fondo-ruleta.png
│   │   ├── fondo-con-hoja.png
│   │   ├── fondo-sin-hoja.png
│   │   ├── hoja-chica.png
│   │   ├── fondo-hoja-2.png
│   │   ├── leyendas-textura.png
│   │   ├── mascara-chiquitana.png
│   │   ├── cola-de-pegi.png
│   │   ├── mano-chiquitana-1.png
│   │   ├── mano-chiquitana-2.png
│   │   └── leyendas/
│   │       ├── guajojo.png
│   │       ├── el-carreton-de-la-otra-vida.png
│   │       ├── el-mojon-con-cara.png
│   │       └── la-curiosa.png
│   ├── hooks/
│   │   └── useCountdown.js              # countdown timer hook
│   ├── lib/
│   │   └── random.js                    # pickRandom, pickRandomN, weighted wheel angle
│   ├── components/
│   │   ├── TornCard.jsx / .css          # "papel rasgado" card wrapper
│   │   ├── PillButton.jsx / .css        # rounded green gradient button
│   │   ├── ProgressTimerBar.jsx / .css  # horizontal countdown bar
│   │   ├── TimeUpOverlay.jsx / .css     # shared "¡Se acabó el Tiempo!" overlay
│   │   └── RoundEndScreen.jsx / .css    # shared round-close screen
│   ├── screens/
│   │   ├── SplashScreen.jsx / .css
│   │   ├── WheelScreen.jsx / .css
│   │   └── categories/
│   │       ├── NoSeDice/
│   │       │   ├── NoSeDiceIntro.jsx
│   │       │   └── NoSeDiceGame.jsx
│   │       ├── Trivia/
│   │       │   ├── TriviaInstructions.jsx
│   │       │   └── TriviaQuestion.jsx
│   │       ├── AdivinaLeyenda/
│   │       │   ├── LeyendaInstructions.jsx
│   │       │   └── LeyendaGame.jsx
│   │       ├── EscuchaCancion/
│   │       │   ├── CancionIntro.jsx
│   │       │   └── CancionAnswer.jsx
│   │       └── Enchoque/
│   │           └── EnchoqueTimer.jsx
│   └── CategoryRouter.jsx               # maps category id -> screen sequence
├── public/audio/                        # placeholder mp3 clips
└── docs/
    ├── specs/2026-09-21-desafio-camba-design.md
    └── superpowers/plans/2026-09-21-desafio-camba.md
```

---

## Task 1: Project scaffold + asset normalization

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `.gitignore` (already has entries, verify)
- Create: `vitest.config.js` (or merge into `vite.config.js`)
- Modify (rename in place): every file under `src/assets/` to kebab-case, flattened per the File Structure tree above (drop the Spanish folder names `Chiquitano y pegi/`, `Fondos/`, `Hojas y leyendas/`, `Ilustración Portada/`, keep `Juego Leyendas/` → `leyendas/`)

**Interfaces:**
- Produces: a running Vite dev server (`npm run dev`), a working Vitest runner (`npm test`), and stable asset import paths (`src/assets/portada.png`, `src/assets/leyendas/guajojo.png`, etc.) that every later task imports from.

- [ ] **Step 1: Rename and flatten assets**

```bash
cd /Users/brian/Documents/desafio_camba/src/assets
mv "Ilustración Portada/portada.png" ./portada.png
mv "Fondos/Fondo Ruleta.png" ./fondo-ruleta.png
mv "Fondos/Fondo Con Hoja.png" ./fondo-con-hoja.png
mv "Fondos/Fondo sin Hoja.png" ./fondo-sin-hoja.png
mv "Hojas y leyendas/Hoja chica.png" ./hoja-chica.png
mv "Hojas y leyendas/fondo hoja2.png" ./fondo-hoja-2.png
mv "Hojas y leyendas/leyendas.png" ./leyendas-textura.png
mv "Chiquitano y pegi/mascara chiquitana.png" ./mascara-chiquitana.png
mv "Chiquitano y pegi/Cola de pegi.png" ./cola-de-pegi.png
mv "Chiquitano y pegi/Mano Chiquitana 1  .png" ./mano-chiquitana-1.png
mv "Chiquitano y pegi/Mano Chiquitana 2.png" ./mano-chiquitana-2.png
mkdir -p leyendas
mv "Juego Leyendas/guajojo.png" ./leyendas/guajojo.png
mv "Juego Leyendas/el carreton de la otra vida.png" "./leyendas/el-carreton-de-la-otra-vida.png"
mv "Juego Leyendas/el mojon con cara.png" "./leyendas/el-mojon-con-cara.png"
mv "Juego Leyendas/la curiosa.png" "./leyendas/la-curiosa.png"
rmdir "Ilustración Portada" "Fondos" "Hojas y leyendas" "Chiquitano y pegi" "Juego Leyendas"
find /Users/brian/Documents/desafio_camba/src/assets -type f
```

Expected: 15 files listed, all lowercase-kebab-case, no spaces, no accents.

- [ ] **Step 2: Scaffold Vite + React**

```bash
cd /Users/brian/Documents/desafio_camba
npm create vite@latest . -- --template react -y
```

This will complain the directory isn't empty — that's fine, confirm overwrite is NOT needed (it only adds files, won't touch `src/assets` or `docs`). If the CLI refuses on a non-empty dir, instead run:

```bash
npm create vite@latest desafio_camba_scaffold -- --template react
cp desafio_camba_scaffold/package.json desafio_camba_scaffold/vite.config.js desafio_camba_scaffold/index.html .
cp desafio_camba_scaffold/.gitignore ./gitignore_vite  # merge manually, don't overwrite existing .gitignore
rm -rf desafio_camba_scaffold/src desafio_camba_scaffold
```
Then manually merge any new `.gitignore` lines from `gitignore_vite` into the existing `.gitignore` and delete `gitignore_vite`.

- [ ] **Step 3: Install dependencies**

```bash
npm install
npm install react-router-dom
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 4: Configure Vitest inside `vite.config.js`**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
})
```

Create `src/setupTests.js`:

```javascript
import '@testing-library/jest-dom'
```

Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 5: Minimal `src/main.jsx` and `src/App.jsx`**

`src/main.jsx`:
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

`src/App.jsx` (placeholder, replaced in Task 8):
```jsx
export default function App() {
  return <div className="app-shell">Desafío Camba!</div>
}
```

Create empty `src/styles/global.css` (filled in Task 2).

- [ ] **Step 6: Verify dev server and test runner both boot**

```bash
npm run dev &
sleep 3
curl -s http://localhost:5173 | grep -q "Desafío Camba" && echo "DEV OK"
kill %1
npm test
```

Expected: "DEV OK" printed, and `npm test` reports "No test files found" (fine — no tests yet) without crashing.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite+React project, normalize asset filenames"
```

---

## Task 2: Design tokens, global styles, shared UI primitives

**Files:**
- Create: `src/styles/tokens.css`
- Modify: `src/styles/global.css`
- Create: `src/components/TornCard.jsx`, `src/components/TornCard.css`
- Create: `src/components/PillButton.jsx`, `src/components/PillButton.css`
- Test: `src/components/PillButton.test.jsx`, `src/components/TornCard.test.jsx`

**Interfaces:**
- Produces: `<TornCard>{children}</TornCard>` (renders a white torn-paper-styled card using `fondo-hoja-2.png`/`hoja-chica.png` as the border texture background), `<PillButton onClick label variant="primary"|"ghost">` (rounded gradient button matching "¡Inicia!"/"Continuar" style from the spec).
- Consumes: assets from `src/assets/` (Task 1).

- [ ] **Step 1: Design tokens**

`src/styles/tokens.css`:
```css
:root {
  --color-bg-dark: #0d2b12;
  --color-bg-mid: #143a1c;
  --color-accent: #7ed321;
  --color-accent-dark: #5ea315;
  --color-card-bg: #f4fdf4;
  --color-text-dark: #10321a;
  --color-text-light: #ffffff;
  --font-display: 'Baloo 2', 'Poppins', sans-serif;
  --radius-lg: 28px;
  --radius-pill: 999px;
  --shadow-card: 0 12px 24px rgba(0, 0, 0, 0.35);
  --stage-width: 1440px;
  --stage-height: 1024px;
}
```

- [ ] **Step 2: Global styles**

`src/styles/global.css` (import tokens + Google Font + reset + responsive stage scaling):
```css
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&display=swap');
@import './tokens.css';

* { box-sizing: border-box; }
html, body, #root { height: 100%; margin: 0; }
body {
  font-family: var(--font-display);
  background: var(--color-bg-dark);
  color: var(--color-text-light);
}

.app-shell {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.stage {
  width: var(--stage-width);
  height: var(--stage-height);
  position: relative;
  transform-origin: center center;
  background: linear-gradient(160deg, var(--color-bg-dark), var(--color-bg-mid));
}
```

- [ ] **Step 3: `TornCard` component + test**

`src/components/TornCard.jsx`:
```jsx
import './TornCard.css'

export default function TornCard({ children, className = '' }) {
  return (
    <div className={`torn-card ${className}`} data-testid="torn-card">
      {children}
    </div>
  )
}
```

`src/components/TornCard.css`:
```css
.torn-card {
  background: var(--color-card-bg);
  color: var(--color-text-dark);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: 40px 48px;
  clip-path: polygon(
    2% 4%, 12% 0%, 30% 2%, 50% 0%, 70% 3%, 90% 0%, 100% 5%,
    98% 25%, 100% 50%, 97% 75%, 100% 96%, 85% 100%, 60% 98%,
    40% 100%, 20% 97%, 0% 100%, 3% 70%, 0% 45%, 3% 20%
  );
}
```

`src/components/TornCard.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TornCard from './TornCard'

describe('TornCard', () => {
  it('renders children inside the card', () => {
    render(<TornCard>Hola camba</TornCard>)
    expect(screen.getByTestId('torn-card')).toHaveTextContent('Hola camba')
  })
})
```

- [ ] **Step 4: `PillButton` component + test**

`src/components/PillButton.jsx`:
```jsx
import './PillButton.css'

export default function PillButton({ label, onClick, variant = 'primary', disabled = false }) {
  return (
    <button
      className={`pill-button pill-button--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
```

`src/components/PillButton.css`:
```css
.pill-button {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 22px;
  border: none;
  border-radius: var(--radius-pill);
  padding: 16px 40px;
  cursor: pointer;
  transition: transform 0.15s ease;
}
.pill-button--primary {
  background: linear-gradient(180deg, var(--color-accent), var(--color-accent-dark));
  color: var(--color-text-dark);
}
.pill-button--ghost {
  background: var(--color-card-bg);
  color: var(--color-accent-dark);
}
.pill-button:disabled { opacity: 0.5; cursor: not-allowed; }
.pill-button:not(:disabled):active { transform: scale(0.96); }
```

`src/components/PillButton.test.jsx`:
```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PillButton from './PillButton'

describe('PillButton', () => {
  it('renders the label and calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<PillButton label="¡Inicia!" onClick={onClick} />)
    fireEvent.click(screen.getByText('¡Inicia!'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn()
    render(<PillButton label="¡Inicia!" onClick={onClick} disabled />)
    fireEvent.click(screen.getByText('¡Inicia!'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 5: Run tests**

```bash
npm test
```
Expected: 3 tests pass (1 TornCard + 2 PillButton).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add design tokens, global styles, TornCard and PillButton"
```

---

## Task 3: Countdown hook + progress timer bar

**Files:**
- Create: `src/hooks/useCountdown.js`
- Test: `src/hooks/useCountdown.test.js`
- Create: `src/components/ProgressTimerBar.jsx`, `src/components/ProgressTimerBar.css`
- Test: `src/components/ProgressTimerBar.test.jsx`

**Interfaces:**
- Produces: `useCountdown(totalSeconds, { onExpire }) -> { secondsLeft, isRunning, start, reset }`. `<ProgressTimerBar totalSeconds secondsLeft />` — renders a horizontal bar whose width is `(secondsLeft / totalSeconds) * 100%`.
- Consumed by: every category's game screen (Tasks 9-13) for the on-screen timer.

- [ ] **Step 1: Write failing test for `useCountdown`**

`src/hooks/useCountdown.test.js`:
```javascript
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useCountdown } from './useCountdown'

describe('useCountdown', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('counts down from the given total and calls onExpire at zero', () => {
    const onExpire = vi.fn()
    const { result } = renderHook(() => useCountdown(3, { onExpire }))

    act(() => result.current.start())
    expect(result.current.secondsLeft).toBe(3)

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.secondsLeft).toBe(2)

    act(() => vi.advanceTimersByTime(2000))
    expect(result.current.secondsLeft).toBe(0)
    expect(onExpire).toHaveBeenCalledOnce()
  })

  it('reset restores the total and stops the timer', () => {
    const { result } = renderHook(() => useCountdown(5, {}))
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(2000))
    act(() => result.current.reset())
    expect(result.current.secondsLeft).toBe(5)
    expect(result.current.isRunning).toBe(false)
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

```bash
npm test -- useCountdown
```
Expected: FAIL — `useCountdown` module does not exist.

- [ ] **Step 3: Implement `useCountdown`**

`src/hooks/useCountdown.js`:
```javascript
import { useState, useRef, useCallback, useEffect } from 'react'

export function useCountdown(totalSeconds, { onExpire } = {}) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    clear()
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clear()
          setIsRunning(false)
          onExpire?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [clear, onExpire])

  const reset = useCallback(() => {
    clear()
    setIsRunning(false)
    setSecondsLeft(totalSeconds)
  }, [clear, totalSeconds])

  useEffect(() => clear, [clear])

  return { secondsLeft, isRunning, start, reset }
}
```

- [ ] **Step 4: Run test, verify it passes**

```bash
npm test -- useCountdown
```
Expected: PASS, both tests green.

- [ ] **Step 5: `ProgressTimerBar` component + test**

`src/components/ProgressTimerBar.jsx`:
```jsx
import './ProgressTimerBar.css'

export default function ProgressTimerBar({ totalSeconds, secondsLeft }) {
  const pct = totalSeconds > 0 ? Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100)) : 0
  return (
    <div className="progress-timer-bar" role="progressbar" aria-valuenow={secondsLeft} aria-valuemax={totalSeconds}>
      <div className="progress-timer-bar__fill" style={{ width: `${pct}%` }} />
    </div>
  )
}
```

`src/components/ProgressTimerBar.css`:
```css
.progress-timer-bar {
  width: 100%;
  height: 18px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: var(--radius-pill);
  overflow: hidden;
}
.progress-timer-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent-dark), var(--color-accent));
  transition: width 1s linear;
}
```

`src/components/ProgressTimerBar.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProgressTimerBar from './ProgressTimerBar'

describe('ProgressTimerBar', () => {
  it('sets width proportional to secondsLeft/totalSeconds', () => {
    render(<ProgressTimerBar totalSeconds={10} secondsLeft={5} />)
    const bar = screen.getByRole('progressbar')
    expect(bar.firstChild).toHaveStyle({ width: '50%' })
  })

  it('clamps width at 0% when secondsLeft is 0', () => {
    render(<ProgressTimerBar totalSeconds={10} secondsLeft={0} />)
    expect(screen.getByRole('progressbar').firstChild).toHaveStyle({ width: '0%' })
  })
})
```

- [ ] **Step 6: Run full test suite**

```bash
npm test
```
Expected: all tests pass (7 total so far).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add useCountdown hook and ProgressTimerBar component"
```

---

## Task 4: Shared TimeUpOverlay and RoundEndScreen

**Files:**
- Create: `src/components/TimeUpOverlay.jsx`, `src/components/TimeUpOverlay.css`
- Create: `src/components/RoundEndScreen.jsx`, `src/components/RoundEndScreen.css`
- Test: `src/components/TimeUpOverlay.test.jsx`, `src/components/RoundEndScreen.test.jsx`

**Interfaces:**
- Produces: `<TimeUpOverlay visible onContinue />` (renders the "¡Se acabó el Tiempo!" sticker with the chicote asset when `visible` is true, else renders nothing), `<RoundEndScreen message="¡Mioj! Facilingo — ¡Volvamos de una vez!" onBackToWheel />`.
- Consumes: `src/assets/cola-de-pegi.png`, `src/assets/mano-chiquitana-1.png`, `src/assets/mano-chiquitana-2.png` (Task 1), `PillButton` (Task 2).
- Consumed by: every category's game screen (Tasks 9-13) and `CategoryRouter` (Task 8).

- [ ] **Step 1: `TimeUpOverlay` component**

`src/components/TimeUpOverlay.jsx`:
```jsx
import colaDePegi from '../assets/cola-de-pegi.png'
import PillButton from './PillButton'
import './TimeUpOverlay.css'

export default function TimeUpOverlay({ visible, onContinue, continueLabel = 'Continuar' }) {
  if (!visible) return null
  return (
    <div className="time-up-overlay" role="alertdialog" aria-label="Se acabó el Tiempo">
      <img className="time-up-overlay__whip" src={colaDePegi} alt="" aria-hidden="true" />
      <h2>¡Se acabó el Tiempo!</h2>
      <PillButton label={continueLabel} onClick={onContinue} variant="ghost" />
    </div>
  )
}
```

`src/components/TimeUpOverlay.css`:
```css
.time-up-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background: rgba(10, 20, 12, 0.88);
  color: var(--color-text-light);
  z-index: 10;
}
.time-up-overlay__whip {
  width: 180px;
  transform: rotate(-15deg);
}
.time-up-overlay h2 {
  font-size: 48px;
  text-shadow: 0 4px 0 rgba(0, 0, 0, 0.4);
}
```

`src/components/TimeUpOverlay.test.jsx`:
```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TimeUpOverlay from './TimeUpOverlay'

describe('TimeUpOverlay', () => {
  it('renders nothing when visible is false', () => {
    const { container } = render(<TimeUpOverlay visible={false} onContinue={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the message and calls onContinue when visible', () => {
    const onContinue = vi.fn()
    render(<TimeUpOverlay visible onContinue={onContinue} />)
    expect(screen.getByText('¡Se acabó el Tiempo!')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Continuar'))
    expect(onContinue).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: `RoundEndScreen` component**

`src/components/RoundEndScreen.jsx`:
```jsx
import PillButton from './PillButton'
import './RoundEndScreen.css'

export default function RoundEndScreen({
  message = '¡Mioj! Facilingo — ¡Volvamos de una vez!',
  onBackToWheel,
}) {
  return (
    <div className="round-end-screen">
      <p>{message}</p>
      <PillButton label="Ir a la ruleta" onClick={onBackToWheel} />
    </div>
  )
}
```

`src/components/RoundEndScreen.css`:
```css
.round-end-screen {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  text-align: center;
  padding: 0 80px;
}
.round-end-screen p {
  font-size: 36px;
  font-weight: 700;
}
```

`src/components/RoundEndScreen.test.jsx`:
```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import RoundEndScreen from './RoundEndScreen'

describe('RoundEndScreen', () => {
  it('renders the default message and triggers onBackToWheel', () => {
    const onBackToWheel = vi.fn()
    render(<RoundEndScreen onBackToWheel={onBackToWheel} />)
    expect(screen.getByText(/Facilingo/)).toBeInTheDocument()
    fireEvent.click(screen.getByText('Ir a la ruleta'))
    expect(onBackToWheel).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 3: Run tests and commit**

```bash
npm test
git add -A
git commit -m "feat: add shared TimeUpOverlay and RoundEndScreen components"
```

---

## Task 5: Content data files

**Files:**
- Create: `src/data/categorias.json`
- Create: `src/data/noSeDice.json`
- Create: `src/data/trivia.json`
- Create: `src/data/leyendas.json`
- Create: `src/data/canciones.json`
- Create: `src/data/enchoque.json`
- Test: `src/data/data.test.js` (schema sanity checks)

**Interfaces:**
- Produces: the JSON shapes every category screen (Tasks 9-13) and the wheel (Task 7) import directly.

- [ ] **Step 1: `categorias.json`** (drives the wheel slices)

```json
[
  { "id": "no-se-dice", "nombre": "No se dice", "duracionSegundos": 10, "colorSlice": "#7ed321" },
  { "id": "escucha-la-cancion", "nombre": "Escucha la canción", "duracionSegundos": 3, "colorSlice": "#5ea315" },
  { "id": "adivina-la-leyenda", "nombre": "Adivina la leyenda", "duracionSegundos": 35, "colorSlice": "#7ed321" },
  { "id": "trivia", "nombre": "Trivia", "duracionSegundos": 15, "colorSlice": "#5ea315" },
  { "id": "enchoque", "nombre": "Enchoque", "duracionSegundos": 180, "colorSlice": "#7ed321" }
]
```

- [ ] **Step 2: `noSeDice.json`** (real content provided by the user — use verbatim, do not invent substitutes)

```json
[
  { "id": 1, "frase": "No se dice está despeinado, se dice…", "respuesta": "está clinudo" },
  { "id": 2, "frase": "No se dice estás sucio, se dice…", "respuesta": "estás cuchuquí" },
  { "id": 3, "frase": "No se dice \"estoy sin plata\", se dice…", "respuesta": "estoy yejca" },
  { "id": 4, "frase": "No se dice niño, se dice…", "respuesta": "pelau" },
  { "id": 5, "frase": "No se dice novio/a, se dice…", "respuesta": "cortejo/a" },
  { "id": 6, "frase": "No se dice tonto, se dice…", "respuesta": "opa/sonso" },
  { "id": 7, "frase": "No se dice está bonito, se dice…", "respuesta": "está pintudo/a" },
  { "id": 8, "frase": "No se dice voy de fiesta, se dice…", "respuesta": "voy de buri" },
  { "id": 9, "frase": "No se dice estoy borracho, se dice…", "respuesta": "estoy yemanga" },
  { "id": 10, "frase": "No se dice andante, se dice…", "respuesta": "pata e perro" },
  { "id": 11, "frase": "No se dice no seas molestoso, se dice…", "respuesta": "no seas chinchoso" },
  { "id": 12, "frase": "No se dice estoy enamorado/a, se dice…", "respuesta": "estoy camote" }
]
```

- [ ] **Step 3: `trivia.json`** (real 15-question bank provided by the user — use verbatim; 5 are sampled per round)

Note on question 12: the source material listed 4 options for "¿Qué animal aparece en el escudo del departamento de Santa Cruz?" without marking which one is correct. Everything else here has a verified checkmark from the user's source. Ship `correctaIndex: 1` ("Jaguar") as a best-effort guess but flag it to the user after this task as needing confirmation — don't silently treat it as verified.

```json
[
  { "id": 1, "pregunta": "¿En qué año fue fundada Santa Cruz de la Sierra por Ñuflo de Chaves?", "opciones": ["1559", "1561", "1564", "1523"], "correctaIndex": 1 },
  { "id": 2, "pregunta": "¿En qué año ocurrió el Grito Libertario de Santa Cruz?", "opciones": ["1809", "1810", "1812", "1709"], "correctaIndex": 1 },
  { "id": 3, "pregunta": "¿En qué año se proclamó la independencia de Santa Cruz?", "opciones": ["1821", "1825", "1826", "1824"], "correctaIndex": 1 },
  { "id": 4, "pregunta": "¿En qué año fue creado el departamento de Santa Cruz?", "opciones": ["1825", "1826", "1830", "1608"], "correctaIndex": 1 },
  { "id": 5, "pregunta": "¿Cuál es la capital del departamento de Santa Cruz?", "opciones": ["Montero", "Santa Cruz de la Sierra", "Camiri", "San Ignacio de Velasco"], "correctaIndex": 1 },
  { "id": 6, "pregunta": "¿Cuántas provincias tiene actualmente el departamento de Santa Cruz?", "opciones": ["12", "13", "15", "16"], "correctaIndex": 2 },
  { "id": 7, "pregunta": "¿Cuál de estos ríos es uno de los más importantes del departamento de Santa Cruz?", "opciones": ["Río Piraí", "Río Pilcomayo", "Río Desaguadero", "Río Choqueyapu"], "correctaIndex": 0 },
  { "id": 8, "pregunta": "¿Qué celebración tradicional cruceña se realiza principalmente en septiembre?", "opciones": ["Carnaval Cruceño", "Día de la Tradición", "Fiesta de San Roque", "Alasitas"], "correctaIndex": 1 },
  { "id": 9, "pregunta": "¿Cuál de estos platos es tradicional de Santa Cruz?", "opciones": ["Silpancho", "Majadito", "Chairo", "Fricasé"], "correctaIndex": 1 },
  { "id": 10, "pregunta": "¿Qué bebida tradicional cruceña se prepara a base de maíz?", "opciones": ["Mocochinchi", "Chicha", "Api", "Sucumbé"], "correctaIndex": 1 },
  { "id": 11, "pregunta": "¿Cuál de estos municipios pertenece al departamento de Santa Cruz?", "opciones": ["Tarija", "Sacaba", "Warnes", "Copacabana"], "correctaIndex": 2 },
  { "id": 12, "pregunta": "¿Qué animal aparece en el escudo del departamento de Santa Cruz?", "opciones": ["Cóndor", "Jaguar", "León", "Águila"], "correctaIndex": 1 },
  { "id": 13, "pregunta": "¿Cuál es un ritmo tradicional asociado a la cultura cruceña?", "opciones": ["Taquirari", "Morenada", "Tinku", "Saya"], "correctaIndex": 0 },
  { "id": 14, "pregunta": "¿Qué parque nacional, famoso por sus formaciones rocosas y su biodiversidad, se encuentra en Santa Cruz?", "opciones": ["Sajama", "Amboró", "Madidi", "Toro Toro"], "correctaIndex": 1 },
  { "id": 15, "pregunta": "¿Cuál es uno de los símbolos más representativos de Santa Cruz de la Sierra?", "opciones": ["La Puerta del Sol", "El Cristo Redentor", "El Illimani", "La Casa de la Libertad"], "correctaIndex": 1 }
]
```

- [ ] **Step 4: `leyendas.json`** (references real exported illustrations)

```json
[
  { "id": 1, "nombre": "El Guajojo", "imagen": "guajojo.png" },
  { "id": 2, "nombre": "El Carretón de la Otra Vida", "imagen": "el-carreton-de-la-otra-vida.png" },
  { "id": 3, "nombre": "El Mojón con Cara", "imagen": "el-mojon-con-cara.png" },
  { "id": 4, "nombre": "La Curiosa", "imagen": "la-curiosa.png" }
]
```

- [ ] **Step 5: `canciones.json`** (placeholder clips — filenames the user should later replace)

```json
[
  { "id": 1, "nombre": "Placeholder cruceño 1", "artista": "Por definir", "archivo": "placeholder-1.mp3" },
  { "id": 2, "nombre": "Placeholder cruceño 2", "artista": "Por definir", "archivo": "placeholder-2.mp3" },
  { "id": 3, "nombre": "Placeholder cruceño 3", "artista": "Por definir", "archivo": "placeholder-3.mp3" }
]
```

- [ ] **Step 6: `enchoque.json`**

```json
{
  "titulo": "¡Esto es un reto de agilidad!",
  "subtitulo": "Compite contra tu rival... ¡Vamos Cunumi!",
  "pasos": [
    "Cada jugador toma su enchoque (pelota y tazo).",
    "Al arrancar el cronómetro, cuenten en voz alta cuántas veces logran ensartar la pelota.",
    "Al sonar el tiempo, el que tenga más aciertos gana la ronda."
  ],
  "duracionSegundos": 180
}
```

- [ ] **Step 7: Schema sanity test**

`src/data/data.test.js`:
```javascript
import { describe, it, expect } from 'vitest'
import categorias from './categorias.json'
import noSeDice from './noSeDice.json'
import trivia from './trivia.json'
import leyendas from './leyendas.json'
import canciones from './canciones.json'
import enchoque from './enchoque.json'

describe('content data', () => {
  it('has one categoria entry per known game id', () => {
    const ids = categorias.map((c) => c.id)
    expect(ids).toEqual([
      'no-se-dice', 'escucha-la-cancion', 'adivina-la-leyenda', 'trivia', 'enchoque',
    ])
  })

  it('noSeDice entries have frase and respuesta', () => {
    expect(noSeDice).toHaveLength(12)
    noSeDice.forEach((entry) => {
      expect(entry.frase).toBeTypeOf('string')
      expect(entry.respuesta).toBeTypeOf('string')
    })
  })

  it('trivia has 15 questions with 4 options and a valid correctaIndex', () => {
    expect(trivia).toHaveLength(15)
    trivia.forEach((q) => {
      expect(q.opciones).toHaveLength(4)
      expect(q.correctaIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctaIndex).toBeLessThan(4)
    })
  })

  it('leyendas has 4 entries matching real exported images', () => {
    expect(leyendas).toHaveLength(4)
    leyendas.forEach((l) => expect(l.imagen).toMatch(/\.png$/))
  })

  it('canciones has at least one entry', () => {
    expect(canciones.length).toBeGreaterThan(0)
  })

  it('enchoque has a duration and at least one step', () => {
    expect(enchoque.duracionSegundos).toBe(180)
    expect(enchoque.pasos.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 8: Run tests and commit**

```bash
npm test
git add -A
git commit -m "feat: add content data files for all 5 game categories"
```

---

## Task 6: Random-selection library

**Files:**
- Create: `src/lib/random.js`
- Test: `src/lib/random.test.js`

**Interfaces:**
- Produces: `pickRandom(array)`, `pickRandomN(array, n)` (no duplicates, throws if `n > array.length`), `angleForCategory(categorias, categoryId)` (returns degrees to rotate the wheel so it lands pointing at that category's slice, evenly divided).
- Consumed by: `WheelScreen` (Task 7), `TriviaQuestion` (Task 10 — picks 5 of the bank), `LeyendaGame` (Task 11), `CancionIntro` (Task 12), `NoSeDiceGame` (Task 9).

- [ ] **Step 1: Write failing tests**

`src/lib/random.test.js`:
```javascript
import { describe, it, expect, vi } from 'vitest'
import { pickRandom, pickRandomN, angleForCategory } from './random'

describe('pickRandom', () => {
  it('returns an element from the array', () => {
    const arr = [1, 2, 3]
    expect(arr).toContain(pickRandom(arr))
  })
})

describe('pickRandomN', () => {
  it('returns n unique elements from the array', () => {
    const arr = [1, 2, 3, 4, 5]
    const result = pickRandomN(arr, 3)
    expect(result).toHaveLength(3)
    expect(new Set(result).size).toBe(3)
    result.forEach((item) => expect(arr).toContain(item))
  })

  it('throws when n is greater than the array length', () => {
    expect(() => pickRandomN([1, 2], 5)).toThrow()
  })
})

describe('angleForCategory', () => {
  it('divides 360 degrees evenly across categories and returns the slice center', () => {
    const categorias = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }]
    // 4 slices of 90deg each, centers at 45, 135, 225, 315
    expect(angleForCategory(categorias, 'a')).toBe(45)
    expect(angleForCategory(categorias, 'c')).toBe(225)
  })

  it('throws for an unknown category id', () => {
    expect(() => angleForCategory([{ id: 'a' }], 'zzz')).toThrow()
  })
})
```

- [ ] **Step 2: Run tests, verify they fail**

```bash
npm test -- random
```
Expected: FAIL — module `./random` does not exist.

- [ ] **Step 3: Implement `src/lib/random.js`**

```javascript
export function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

export function pickRandomN(array, n) {
  if (n > array.length) {
    throw new Error(`Cannot pick ${n} unique items from an array of length ${array.length}`)
  }
  const shuffled = [...array].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

export function angleForCategory(categorias, categoryId) {
  const index = categorias.findIndex((c) => c.id === categoryId)
  if (index === -1) {
    throw new Error(`Unknown category id: ${categoryId}`)
  }
  const sliceSize = 360 / categorias.length
  return sliceSize * index + sliceSize / 2
}
```

- [ ] **Step 4: Run tests, verify they pass**

```bash
npm test -- random
```
Expected: PASS, all 5 tests green.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add random selection and wheel-angle utilities"
```

---

## Task 7: WheelScreen (spin mechanic)

**Files:**
- Create: `src/screens/WheelScreen.jsx`, `src/screens/WheelScreen.css`
- Test: `src/screens/WheelScreen.test.jsx`

**Interfaces:**
- Consumes: `categorias.json` (Task 5), `pickRandom`/`angleForCategory` (Task 6), `PillButton` (Task 2), `fondo-ruleta.png` (Task 1).
- Produces: `<WheelScreen onCategorySelected={(categoryId) => void} />`. Internal flow: "Iniciar" button → picks random category → spins (CSS transform rotation) → after a fixed animation duration, calls `onCategorySelected(categoryId)`. Also exposes a "Volver a girar" ghost button that resets and lets the user spin again before confirming.

- [ ] **Step 1: Write failing test**

`src/screens/WheelScreen.test.jsx`:
```jsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import WheelScreen from './WheelScreen'

describe('WheelScreen', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows the "Iniciar" button before spinning', () => {
    render(<WheelScreen onCategorySelected={() => {}} />)
    expect(screen.getByText('Iniciar')).toBeInTheDocument()
  })

  it('spins and calls onCategorySelected with a valid category id after the animation', () => {
    const onCategorySelected = vi.fn()
    render(<WheelScreen onCategorySelected={onCategorySelected} />)

    fireEvent.click(screen.getByText('Iniciar'))
    act(() => vi.advanceTimersByTime(4000))

    expect(onCategorySelected).toHaveBeenCalledOnce()
    const calledWith = onCategorySelected.mock.calls[0][0]
    expect(typeof calledWith).toBe('string')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

```bash
npm test -- WheelScreen
```
Expected: FAIL — `./WheelScreen` does not exist.

- [ ] **Step 3: Implement `WheelScreen`**

`src/screens/WheelScreen.jsx`:
```jsx
import { useState, useRef } from 'react'
import categorias from '../data/categorias.json'
import { pickRandom, angleForCategory } from '../lib/random'
import PillButton from '../components/PillButton'
import fondoRuleta from '../assets/fondo-ruleta.png'
import './WheelScreen.css'

const SPIN_DURATION_MS = 4000
const EXTRA_SPINS = 4 // full rotations before landing, purely visual

export default function WheelScreen({ onCategorySelected }) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const selectedRef = useRef(null)

  function handleSpin() {
    if (spinning) return
    const category = pickRandom(categorias)
    selectedRef.current = category.id
    const targetAngle = angleForCategory(categorias, category.id)
    const finalRotation = rotation + EXTRA_SPINS * 360 + (360 - targetAngle)
    setRotation(finalRotation)
    setSpinning(true)
    setTimeout(() => {
      setSpinning(false)
      onCategorySelected(selectedRef.current)
    }, SPIN_DURATION_MS)
  }

  return (
    <div className="wheel-screen" style={{ backgroundImage: `url(${fondoRuleta})` }}>
      <h1>¡Girala YA!</h1>
      <div
        className="wheel-screen__wheel"
        style={{ transform: `rotate(${rotation}deg)`, transitionDuration: `${SPIN_DURATION_MS}ms` }}
      >
        <div className="wheel-screen__hub">{spinning ? 'Girando…' : 'GIRAR'}</div>
      </div>
      <PillButton label="Iniciar" onClick={handleSpin} disabled={spinning} />
    </div>
  )
}
```

`src/screens/WheelScreen.css`:
```css
.wheel-screen {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  background-size: cover;
  background-position: center;
}
.wheel-screen__wheel {
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.17, 0.67, 0.12, 0.99);
}
.wheel-screen__hub {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: var(--color-card-bg);
  color: var(--color-text-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 22px;
}
```

- [ ] **Step 4: Run test, verify it passes**

```bash
npm test -- WheelScreen
```
Expected: PASS, both tests green.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add WheelScreen with spin animation and random category selection"
```

---

## Task 8: SplashScreen, CategoryRouter, and App routing

**Files:**
- Create: `src/screens/SplashScreen.jsx`, `src/screens/SplashScreen.css`
- Create: `src/CategoryRouter.jsx`
- Modify: `src/App.jsx`
- Test: `src/App.test.jsx`

**Interfaces:**
- Produces: `<SplashScreen onContinue />` (shows `portada.png` + "Desafío Camba!" + "Tocar la pantalla para pasar a la siguiente"), `<CategoryRouter categoryId onRoundComplete />` (dispatches to the right category's screen sequence — placeholder for now, wired fully once Tasks 9-13 exist; for this task it renders a stub `RoundEndScreen` for every category id so the full splash→wheel→round-end→wheel loop is testable end to end).
- Consumes: `WheelScreen` (Task 7), `RoundEndScreen` (Task 4), `portada.png` (Task 1).
- This task wires the top-level flow; Tasks 9-13 will replace the stub branches inside `CategoryRouter` with real screens one category at a time.

- [ ] **Step 1: `SplashScreen`**

`src/screens/SplashScreen.jsx`:
```jsx
import portada from '../assets/portada.png'
import './SplashScreen.css'

export default function SplashScreen({ onContinue }) {
  return (
    <div className="splash-screen" onClick={onContinue} role="button" tabIndex={0}>
      <img src={portada} alt="Desafío Camba!" className="splash-screen__art" />
      <h1>Desafío Camba!</h1>
      <p>Tocar la pantalla para pasar a la siguiente</p>
    </div>
  )
}
```

`src/screens/SplashScreen.css`:
```css
.splash-screen {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  cursor: pointer;
  text-align: center;
}
.splash-screen__art {
  max-width: 480px;
}
.splash-screen h1 {
  font-size: 64px;
  text-transform: uppercase;
}
```

- [ ] **Step 2: `CategoryRouter` (stub branches, real ones land in Tasks 9-13)**

`src/CategoryRouter.jsx`:
```jsx
import RoundEndScreen from './components/RoundEndScreen'

// Tasks 9-13 each replace one of these stub entries with the real
// category screen-sequence component (Intro -> Game -> RoundEnd).
const CATEGORY_SCREENS = {
  'no-se-dice': null,
  'escucha-la-cancion': null,
  'adivina-la-leyenda': null,
  trivia: null,
  enchoque: null,
}

export default function CategoryRouter({ categoryId, onRoundComplete }) {
  const CategoryScreen = CATEGORY_SCREENS[categoryId]
  if (CategoryScreen) {
    return <CategoryScreen onRoundComplete={onRoundComplete} />
  }
  // Stub fallback until the real category component is wired in.
  return (
    <RoundEndScreen
      message={`(stub) Categoría "${categoryId}" — pendiente de implementar`}
      onBackToWheel={onRoundComplete}
    />
  )
}
```

- [ ] **Step 3: `App.jsx` — full splash → wheel → category → wheel loop**

```jsx
import { useState } from 'react'
import SplashScreen from './screens/SplashScreen'
import WheelScreen from './screens/WheelScreen'
import CategoryRouter from './CategoryRouter'

const STAGES = { SPLASH: 'splash', WHEEL: 'wheel', CATEGORY: 'category' }

export default function App() {
  const [stage, setStage] = useState(STAGES.SPLASH)
  const [categoryId, setCategoryId] = useState(null)

  return (
    <div className="app-shell">
      <div className="stage">
        {stage === STAGES.SPLASH && (
          <SplashScreen onContinue={() => setStage(STAGES.WHEEL)} />
        )}
        {stage === STAGES.WHEEL && (
          <WheelScreen
            onCategorySelected={(id) => {
              setCategoryId(id)
              setStage(STAGES.CATEGORY)
            }}
          />
        )}
        {stage === STAGES.CATEGORY && (
          <CategoryRouter
            categoryId={categoryId}
            onRoundComplete={() => setStage(STAGES.WHEEL)}
          />
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Write App-level integration test**

`src/App.test.jsx`:
```jsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('goes splash -> wheel -> category stub -> back to wheel', () => {
    render(<App />)

    expect(screen.getByText('Desafío Camba!')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Desafío Camba!'))

    expect(screen.getByText('Iniciar')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Iniciar'))
    act(() => vi.advanceTimersByTime(4000))

    expect(screen.getByText(/pendiente de implementar/)).toBeInTheDocument()
    fireEvent.click(screen.getByText('Ir a la ruleta'))

    expect(screen.getByText('Iniciar')).toBeInTheDocument()
  })
})
```

- [ ] **Step 5: Run tests, verify they pass**

```bash
npm test
```
Expected: all tests pass, including the new App integration test.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: wire SplashScreen, WheelScreen and CategoryRouter into App"
```

---

## Task 9: No se dice category

**Files:**
- Create: `src/screens/categories/NoSeDice/NoSeDiceIntro.jsx`, `NoSeDiceGame.jsx`, `NoSeDice.css`
- Create: `src/screens/categories/NoSeDice/index.jsx` (composes Intro → Game → TimeUpOverlay/RoundEnd)
- Modify: `src/CategoryRouter.jsx` (wire `'no-se-dice'`)
- Test: `src/screens/categories/NoSeDice/NoSeDice.test.jsx`

**Interfaces:**
- Consumes: `noSeDice.json` (Task 5), `pickRandom` (Task 6), `useCountdown` (Task 3), `TornCard`/`PillButton`/`ProgressTimerBar`/`TimeUpOverlay`/`RoundEndScreen` (Tasks 2-4).
- Produces: `<NoSeDiceCategory onRoundComplete />` default export from `index.jsx`, registered into `CATEGORY_SCREENS['no-se-dice']`.

- [ ] **Step 1: `NoSeDiceIntro`**

```jsx
// src/screens/categories/NoSeDice/NoSeDiceIntro.jsx
import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'

export default function NoSeDiceIntro({ onStart }) {
  return (
    <div className="category-intro">
      <TornCard>
        <h2>No se dice... se dice...</h2>
        <p>Cuidado eh cunumi, demuestra que tan cambanga soj</p>
        <p>Tienes 10s</p>
        <PillButton label="¡Inicia!" onClick={onStart} />
      </TornCard>
    </div>
  )
}
```

- [ ] **Step 2: `NoSeDiceGame`**

```jsx
// src/screens/categories/NoSeDice/NoSeDiceGame.jsx
import { useEffect, useState } from 'react'
import TornCard from '../../../components/TornCard'
import ProgressTimerBar from '../../../components/ProgressTimerBar'
import TimeUpOverlay from '../../../components/TimeUpOverlay'
import PillButton from '../../../components/PillButton'
import { useCountdown } from '../../../hooks/useCountdown'
import { pickRandom } from '../../../lib/random'
import palabras from '../../../data/noSeDice.json'

const ROUND_SECONDS = 10

export default function NoSeDiceGame({ onFinished }) {
  const [entry] = useState(() => pickRandom(palabras))
  const [timeUp, setTimeUp] = useState(false)
  const { secondsLeft, start } = useCountdown(ROUND_SECONDS, { onExpire: () => setTimeUp(true) })

  useEffect(() => { start() }, [start])

  return (
    <div className="category-game">
      <TornCard>
        <p className="category-game__prompt">{entry.frase}</p>
        <ProgressTimerBar totalSeconds={ROUND_SECONDS} secondsLeft={secondsLeft} />
        {!timeUp && <PillButton label="Ya adivinó" onClick={() => setTimeUp(true)} variant="ghost" />}
      </TornCard>
      <TimeUpOverlay visible={timeUp} onContinue={onFinished} />
    </div>
  )
}
```

- [ ] **Step 3: `index.jsx` composing the flow**

```jsx
// src/screens/categories/NoSeDice/index.jsx
import { useState } from 'react'
import NoSeDiceIntro from './NoSeDiceIntro'
import NoSeDiceGame from './NoSeDiceGame'
import RoundEndScreen from '../../../components/RoundEndScreen'
import './NoSeDice.css'

const STEPS = { INTRO: 'intro', GAME: 'game', END: 'end' }

export default function NoSeDiceCategory({ onRoundComplete }) {
  const [step, setStep] = useState(STEPS.INTRO)

  if (step === STEPS.INTRO) return <NoSeDiceIntro onStart={() => setStep(STEPS.GAME)} />
  if (step === STEPS.GAME) return <NoSeDiceGame onFinished={() => setStep(STEPS.END)} />
  return <RoundEndScreen onBackToWheel={onRoundComplete} />
}
```

`src/screens/categories/NoSeDice/NoSeDice.css`:
```css
.category-intro, .category-game {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.category-game__prompt {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 24px;
}
```

- [ ] **Step 4: Wire into `CategoryRouter`**

In `src/CategoryRouter.jsx`, replace the import section and map entry:
```jsx
import NoSeDiceCategory from './screens/categories/NoSeDice'
// ...
const CATEGORY_SCREENS = {
  'no-se-dice': NoSeDiceCategory,
  'escucha-la-cancion': null,
  'adivina-la-leyenda': null,
  trivia: null,
  enchoque: null,
}
```

- [ ] **Step 5: Write test**

`src/screens/categories/NoSeDice/NoSeDice.test.jsx`:
```jsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import NoSeDiceCategory from './index'

describe('NoSeDiceCategory', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('goes intro -> game -> time up -> round end -> onRoundComplete', () => {
    const onRoundComplete = vi.fn()
    render(<NoSeDiceCategory onRoundComplete={onRoundComplete} />)

    expect(screen.getByText('No se dice... se dice...')).toBeInTheDocument()
    fireEvent.click(screen.getByText('¡Inicia!'))

    expect(screen.getByText('Tienes 10s')).not.toBeInTheDocument // sanity: intro copy gone
    act(() => vi.advanceTimersByTime(10000))

    expect(screen.getByText('¡Se acabó el Tiempo!')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Continuar'))

    fireEvent.click(screen.getByText('Ir a la ruleta'))
    expect(onRoundComplete).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 6: Run tests, fix, verify pass**

```bash
npm test
```
Expected: all pass. (Note: the `not.toBeInTheDocument` line above is a plain property reference, not an assertion — remove it; it was left in to flag that Step 5's assertion list should only contain real `expect(...)` calls. Delete that line before running.)

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: implement No se dice category end to end"
```

---

## Task 10: Trivia category

**Files:**
- Create: `src/screens/categories/Trivia/TriviaInstructions.jsx`, `TriviaQuestion.jsx`, `Trivia.css`
- Create: `src/screens/categories/Trivia/index.jsx`
- Modify: `src/CategoryRouter.jsx` (wire `'trivia'`)
- Test: `src/screens/categories/Trivia/Trivia.test.jsx`

**Interfaces:**
- Consumes: `trivia.json` (Task 5), `pickRandomN` (Task 6), `useCountdown` (Task 3), shared UI (Tasks 2-4).
- Produces: `<TriviaCategory onRoundComplete />`, registered as `CATEGORY_SCREENS.trivia`.

- [ ] **Step 1: `TriviaInstructions`**

```jsx
// src/screens/categories/Trivia/TriviaInstructions.jsx
import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'

export default function TriviaInstructions({ onStart }) {
  return (
    <div className="category-intro">
      <TornCard>
        <h3>Explicación</h3>
        <p>Trivia de cultura general cruceña, opción múltiple, 5 preguntas. Gana quien más puntaje.</p>
      </TornCard>
      <TornCard>
        <h3>Instrucciones</h3>
        <p>Lean la pregunta, alcen la mano. El primero en responder se lleva 2pt por pregunta.</p>
        <p>Tiempo de cada pregunta: 15s</p>
        <PillButton label="¡Inicia!" onClick={onStart} />
      </TornCard>
    </div>
  )
}
```

- [ ] **Step 2: `TriviaQuestion`**

```jsx
// src/screens/categories/Trivia/TriviaQuestion.jsx
import { useEffect, useState } from 'react'
import TornCard from '../../../components/TornCard'
import ProgressTimerBar from '../../../components/ProgressTimerBar'
import TimeUpOverlay from '../../../components/TimeUpOverlay'
import { useCountdown } from '../../../hooks/useCountdown'

const QUESTION_SECONDS = 15
const OPTION_LETTERS = ['A', 'B', 'C', 'D']
const LONG_OPTION_THRESHOLD = 24 // chars; beyond this, font drops per spec

export default function TriviaQuestion({ question, questionIndex, total, onAnswered }) {
  const [answered, setAnswered] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  const { secondsLeft, start } = useCountdown(QUESTION_SECONDS, {
    onExpire: () => setTimeUp(true),
  })

  useEffect(() => {
    start()
  }, [start, question])

  const hasLongOptions = question.opciones.some((opt) => opt.length > LONG_OPTION_THRESHOLD)

  function handleSelect(index) {
    if (answered || timeUp) return
    setAnswered(true)
  }

  return (
    <div className="category-game">
      <TornCard>
        <p className="trivia-question__meta">Pregunta {questionIndex + 1} de {total}</p>
        <p className="category-game__prompt">{question.pregunta}</p>
        <div className={`trivia-question__options ${hasLongOptions ? 'trivia-question__options--long' : ''}`}>
          {question.opciones.map((opt, i) => (
            <button
              key={opt}
              className="trivia-question__option"
              onClick={() => handleSelect(i)}
              disabled={answered || timeUp}
            >
              <span className="trivia-question__letter">{OPTION_LETTERS[i]}</span>
              {opt}
            </button>
          ))}
        </div>
        <ProgressTimerBar totalSeconds={QUESTION_SECONDS} secondsLeft={secondsLeft} />
      </TornCard>
      <TimeUpOverlay visible={timeUp} onContinue={() => onAnswered()} continueLabel="Siguiente" />
      {answered && !timeUp && (
        <TimeUpOverlay
          visible={false}
        />
      )}
      {answered && !timeUp && (
        <div className="trivia-question__reveal" role="status">
          Respuesta correcta: {question.opciones[question.correctaIndex]}
          <button className="trivia-question__next" onClick={() => onAnswered()}>Siguiente</button>
        </div>
      )}
    </div>
  )
}
```

`src/screens/categories/Trivia/Trivia.css`:
```css
.trivia-question__options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 24px 0;
}
.trivia-question__option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: var(--radius-pill);
  border: none;
  background: var(--color-accent);
  color: var(--color-text-dark);
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
}
.trivia-question__options--long .trivia-question__option {
  font-size: 30px;
  padding: 20px 28px;
}
.trivia-question__letter {
  background: var(--color-card-bg);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.trivia-question__reveal {
  margin-top: 20px;
  font-weight: 700;
}
.trivia-question__meta {
  font-size: 16px;
  opacity: 0.7;
}
```

- [ ] **Step 3: `index.jsx` — instructions, then 5 sampled questions, then round end**

```jsx
// src/screens/categories/Trivia/index.jsx
import { useState } from 'react'
import TriviaInstructions from './TriviaInstructions'
import TriviaQuestion from './TriviaQuestion'
import RoundEndScreen from '../../../components/RoundEndScreen'
import { pickRandomN } from '../../../lib/random'
import bank from '../../../data/trivia.json'
import './Trivia.css'

const QUESTIONS_PER_ROUND = 5
const STEPS = { INSTRUCTIONS: 'instructions', QUESTIONS: 'questions', END: 'end' }

export default function TriviaCategory({ onRoundComplete }) {
  const [step, setStep] = useState(STEPS.INSTRUCTIONS)
  const [questions] = useState(() => pickRandomN(bank, QUESTIONS_PER_ROUND))
  const [index, setIndex] = useState(0)

  if (step === STEPS.INSTRUCTIONS) {
    return <TriviaInstructions onStart={() => setStep(STEPS.QUESTIONS)} />
  }

  if (step === STEPS.QUESTIONS) {
    return (
      <TriviaQuestion
        question={questions[index]}
        questionIndex={index}
        total={questions.length}
        onAnswered={() => {
          if (index + 1 < questions.length) {
            setIndex(index + 1)
          } else {
            setStep(STEPS.END)
          }
        }}
      />
    )
  }

  return <RoundEndScreen onBackToWheel={onRoundComplete} />
}
```

- [ ] **Step 4: Wire into `CategoryRouter`**

```jsx
import TriviaCategory from './screens/categories/Trivia'
// ...
trivia: TriviaCategory,
```

- [ ] **Step 5: Write test**

`src/screens/categories/Trivia/Trivia.test.jsx`:
```jsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import TriviaCategory from './index'

describe('TriviaCategory', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('asks exactly 5 questions then reaches round end', () => {
    const onRoundComplete = vi.fn()
    render(<TriviaCategory onRoundComplete={onRoundComplete} />)

    fireEvent.click(screen.getByText('¡Inicia!'))
    expect(screen.getByText('Pregunta 1 de 5')).toBeInTheDocument()

    for (let i = 1; i <= 5; i++) {
      const options = screen.getAllByRole('button').filter((b) => b.className.includes('trivia-question__option'))
      fireEvent.click(options[0])
      const next = screen.getByText('Siguiente')
      fireEvent.click(next)
    }

    expect(onRoundComplete).not.toHaveBeenCalled() // still needs a manual click on Ir a la ruleta
    fireEvent.click(screen.getByText('Ir a la ruleta'))
    expect(onRoundComplete).toHaveBeenCalledOnce()
  })

  it('shows the time-up overlay when the 15s countdown expires', () => {
    render(<TriviaCategory onRoundComplete={() => {}} />)
    fireEvent.click(screen.getByText('¡Inicia!'))
    act(() => vi.advanceTimersByTime(15000))
    expect(screen.getByText('¡Se acabó el Tiempo!')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run tests, fix any failures, verify pass**

```bash
npm test
```
If the "5 questions" test finds duplicate "Siguiente" text (one from the reveal button, one from TimeUpOverlay's continueLabel), disambiguate in the component by only rendering the reveal block (not `TimeUpOverlay`) when `answered && !timeUp` — already done above — and use `screen.getAllByText('Siguiente')[0]` in the test if needed. Adjust test to `getAllByText` if a collision surfaces.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: implement Trivia category with 5 random questions per round"
```

---

## Task 11: Adivina la leyenda category

**Files:**
- Create: `src/screens/categories/AdivinaLeyenda/LeyendaInstructions.jsx`, `LeyendaGame.jsx`, `AdivinaLeyenda.css`
- Create: `src/screens/categories/AdivinaLeyenda/index.jsx`
- Modify: `src/CategoryRouter.jsx` (wire `'adivina-la-leyenda'`)
- Test: `src/screens/categories/AdivinaLeyenda/AdivinaLeyenda.test.jsx`

**Interfaces:**
- Consumes: `leyendas.json` (Task 5), `pickRandom` (Task 6), `useCountdown` (Task 3), shared UI (Tasks 2-4). Dynamically imports the matching PNG from `src/assets/leyendas/` using `import.meta.glob`.
- Produces: `<LeyendaCategory onRoundComplete />`, registered as `CATEGORY_SCREENS['adivina-la-leyenda']`.

- [ ] **Step 1: `LeyendaInstructions`**

```jsx
// src/screens/categories/AdivinaLeyenda/LeyendaInstructions.jsx
import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'

export default function LeyendaInstructions({ onStart }) {
  return (
    <div className="category-intro">
      <TornCard>
        <h2>Adivina la Leyenda!</h2>
        <p>La típicas de las típicas</p>
      </TornCard>
      <TornCard>
        <h3>Explicación</h3>
        <p>Un jugador se da vuelta. El otro ve el dibujo de la leyenda y debe hacer mímica sin hablar.</p>
        <h3>Instrucciones</h3>
        <ol>
          <li>Piedra, papel o tijera decide quién adivina y quién mimica.</li>
          <li>El que adivina se da vuelta.</li>
          <li>El que ve la imagen tiene 20s para memorizarla y empezar a mimicar.</li>
        </ol>
        <p>Tiempo para adivinar: 35s</p>
        <PillButton label="¡Inicia!" onClick={onStart} />
      </TornCard>
    </div>
  )
}
```

- [ ] **Step 2: `LeyendaGame`** — dynamic image import via `import.meta.glob`

```jsx
// src/screens/categories/AdivinaLeyenda/LeyendaGame.jsx
import { useEffect, useState } from 'react'
import TornCard from '../../../components/TornCard'
import ProgressTimerBar from '../../../components/ProgressTimerBar'
import TimeUpOverlay from '../../../components/TimeUpOverlay'
import PillButton from '../../../components/PillButton'
import { useCountdown } from '../../../hooks/useCountdown'
import { pickRandom } from '../../../lib/random'
import leyendas from '../../../data/leyendas.json'

const ROUND_SECONDS = 35
const leyendaImages = import.meta.glob('../../../assets/leyendas/*.png', { eager: true, import: 'default' })

function resolveImage(filename) {
  const entry = Object.entries(leyendaImages).find(([path]) => path.endsWith(filename))
  return entry ? entry[1] : null
}

export default function LeyendaGame({ onFinished }) {
  const [leyenda] = useState(() => pickRandom(leyendas))
  const [timeUp, setTimeUp] = useState(false)
  const { secondsLeft, start } = useCountdown(ROUND_SECONDS, { onExpire: () => setTimeUp(true) })

  useEffect(() => { start() }, [start])

  const imageSrc = resolveImage(leyenda.imagen)

  return (
    <div className="category-game">
      <TornCard>
        <h3>{leyenda.nombre}</h3>
        {imageSrc && <img className="leyenda-game__image" src={imageSrc} alt={leyenda.nombre} />}
        <ProgressTimerBar totalSeconds={ROUND_SECONDS} secondsLeft={secondsLeft} />
        {!timeUp && <PillButton label="Ya adivinó" onClick={() => setTimeUp(true)} variant="ghost" />}
      </TornCard>
      <TimeUpOverlay visible={timeUp} onContinue={onFinished} />
    </div>
  )
}
```

`src/screens/categories/AdivinaLeyenda/AdivinaLeyenda.css`:
```css
.leyenda-game__image {
  max-width: 320px;
  margin: 16px 0;
}
```

- [ ] **Step 3: `index.jsx`**

```jsx
// src/screens/categories/AdivinaLeyenda/index.jsx
import { useState } from 'react'
import LeyendaInstructions from './LeyendaInstructions'
import LeyendaGame from './LeyendaGame'
import RoundEndScreen from '../../../components/RoundEndScreen'
import './AdivinaLeyenda.css'

const STEPS = { INSTRUCTIONS: 'instructions', GAME: 'game', END: 'end' }

export default function LeyendaCategory({ onRoundComplete }) {
  const [step, setStep] = useState(STEPS.INSTRUCTIONS)

  if (step === STEPS.INSTRUCTIONS) return <LeyendaInstructions onStart={() => setStep(STEPS.GAME)} />
  if (step === STEPS.GAME) return <LeyendaGame onFinished={() => setStep(STEPS.END)} />
  return <RoundEndScreen onBackToWheel={onRoundComplete} />
}
```

- [ ] **Step 4: Wire into `CategoryRouter`**

```jsx
import LeyendaCategory from './screens/categories/AdivinaLeyenda'
// ...
'adivina-la-leyenda': LeyendaCategory,
```

- [ ] **Step 5: Write test**

`src/screens/categories/AdivinaLeyenda/AdivinaLeyenda.test.jsx`:
```jsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import LeyendaCategory from './index'

describe('LeyendaCategory', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('goes instructions -> game (shows a real legend image) -> time up -> round end', () => {
    const onRoundComplete = vi.fn()
    render(<LeyendaCategory onRoundComplete={onRoundComplete} />)

    fireEvent.click(screen.getByText('¡Inicia!'))
    const img = screen.getByRole('img')
    expect(img.getAttribute('src')).toBeTruthy()

    act(() => vi.advanceTimersByTime(35000))
    expect(screen.getByText('¡Se acabó el Tiempo!')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Continuar'))

    fireEvent.click(screen.getByText('Ir a la ruleta'))
    expect(onRoundComplete).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 6: Run tests, verify pass**

```bash
npm test
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: implement Adivina la leyenda category with real legend illustrations"
```

---

## Task 12: Escucha la canción category

**Files:**
- Create: `src/screens/categories/EscuchaCancion/CancionIntro.jsx`, `CancionAnswer.jsx`, `EscuchaCancion.css`
- Create: `src/screens/categories/EscuchaCancion/index.jsx`
- Modify: `src/CategoryRouter.jsx` (wire `'escucha-la-cancion'`)
- Create: `public/audio/placeholder-1.mp3`, `placeholder-2.mp3`, `placeholder-3.mp3` (silent/royalty-free placeholders)
- Test: `src/screens/categories/EscuchaCancion/EscuchaCancion.test.jsx`

**Interfaces:**
- Consumes: `canciones.json` (Task 5), `pickRandom` (Task 6), `useCountdown` (Task 3), shared UI (Tasks 2-4). Uses a real `<audio>` element pointed at `/audio/<archivo>`.
- Produces: `<CancionCategory onRoundComplete />`, registered as `CATEGORY_SCREENS['escucha-la-cancion']`.

- [ ] **Step 1: Generate 3 short silent placeholder mp3s** (so the `<audio>` element has something real to point at without the user having to supply files yet)

```bash
mkdir -p /Users/brian/Documents/desafio_camba/public/audio
cd /Users/brian/Documents/desafio_camba/public/audio
for i in 1 2 3; do
  ffmpeg -y -f lavfi -i anullsrc=r=44100:cl=mono -t 3 -q:a 9 -acodec libmp3lame "placeholder-$i.mp3"
done
ls -la
```
If `ffmpeg` isn't installed, run `brew install ffmpeg` first (confirm with the user before installing new system packages).

- [ ] **Step 2: `CancionIntro`** — plays the 3s clip once, no repeat

```jsx
// src/screens/categories/EscuchaCancion/CancionIntro.jsx
import { useEffect, useRef, useState } from 'react'
import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'

export default function CancionIntro({ cancion, onDone }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    audio.play().catch(() => {}) // autoplay can be blocked; user can still press Continuar
    setPlaying(true)
    const handleEnded = () => setPlaying(false)
    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [])

  return (
    <div className="category-intro">
      <TornCard>
        <h3>¿Estás escuchando?</h3>
        <div className="cancion-intro__bars" aria-hidden="true">
          <span /><span /><span />
        </div>
        <p>No te distraigas camba e miércole! Ni cagando repetimos</p>
        <p className="cancion-intro__repeat">Repetir 3s</p>
        <audio ref={audioRef} src={`/audio/${cancion.archivo}`} data-testid="cancion-audio" />
        <PillButton label="Continuar" onClick={onDone} disabled={playing} />
      </TornCard>
    </div>
  )
}
```

- [ ] **Step 3: `CancionAnswer`**

```jsx
// src/screens/categories/EscuchaCancion/CancionAnswer.jsx
import { useEffect, useState } from 'react'
import TornCard from '../../../components/TornCard'
import ProgressTimerBar from '../../../components/ProgressTimerBar'
import TimeUpOverlay from '../../../components/TimeUpOverlay'
import PillButton from '../../../components/PillButton'
import { useCountdown } from '../../../hooks/useCountdown'

const ANSWER_SECONDS = 5

export default function CancionAnswer({ cancion, onFinished }) {
  const [timeUp, setTimeUp] = useState(false)
  const { secondsLeft, start } = useCountdown(ANSWER_SECONDS, { onExpire: () => setTimeUp(true) })

  useEffect(() => { start() }, [start])

  return (
    <div className="category-game">
      <TornCard>
        <h3>¿Apoco y te la sabes?</h3>
        <ProgressTimerBar totalSeconds={ANSWER_SECONDS} secondsLeft={secondsLeft} />
        {!timeUp && <PillButton label="¡Si la sé!" onClick={() => setTimeUp(true)} />}
      </TornCard>
      <TimeUpOverlay
        visible={timeUp}
        onContinue={onFinished}
        continueLabel="Continuar"
      />
      {timeUp && (
        <p className="cancion-answer__reveal" role="status">
          Era: {cancion.nombre} — {cancion.artista}
        </p>
      )}
    </div>
  )
}
```

`src/screens/categories/EscuchaCancion/EscuchaCancion.css`:
```css
.cancion-intro__bars {
  display: flex;
  gap: 6px;
  height: 48px;
  align-items: flex-end;
  margin: 20px 0;
}
.cancion-intro__bars span {
  width: 10px;
  background: var(--color-accent-dark);
  animation: cancion-bounce 0.6s ease-in-out infinite alternate;
}
.cancion-intro__bars span:nth-child(1) { height: 60%; animation-delay: 0s; }
.cancion-intro__bars span:nth-child(2) { height: 100%; animation-delay: 0.15s; }
.cancion-intro__bars span:nth-child(3) { height: 40%; animation-delay: 0.3s; }
@keyframes cancion-bounce {
  from { transform: scaleY(0.4); }
  to { transform: scaleY(1); }
}
.cancion-intro__repeat {
  font-size: 14px;
  opacity: 0.7;
}
.cancion-answer__reveal {
  position: absolute;
  bottom: 60px;
  width: 100%;
  text-align: center;
  font-weight: 700;
  z-index: 11;
}
```

- [ ] **Step 4: `index.jsx`**

```jsx
// src/screens/categories/EscuchaCancion/index.jsx
import { useState } from 'react'
import CancionIntro from './CancionIntro'
import CancionAnswer from './CancionAnswer'
import RoundEndScreen from '../../../components/RoundEndScreen'
import { pickRandom } from '../../../lib/random'
import canciones from '../../../data/canciones.json'
import './EscuchaCancion.css'

const STEPS = { INTRO: 'intro', ANSWER: 'answer', END: 'end' }

export default function CancionCategory({ onRoundComplete }) {
  const [cancion] = useState(() => pickRandom(canciones))
  const [step, setStep] = useState(STEPS.INTRO)

  if (step === STEPS.INTRO) {
    return <CancionIntro cancion={cancion} onDone={() => setStep(STEPS.ANSWER)} />
  }
  if (step === STEPS.ANSWER) {
    return <CancionAnswer cancion={cancion} onFinished={() => setStep(STEPS.END)} />
  }
  return <RoundEndScreen onBackToWheel={onRoundComplete} />
}
```

- [ ] **Step 5: Wire into `CategoryRouter`**

```jsx
import CancionCategory from './screens/categories/EscuchaCancion'
// ...
'escucha-la-cancion': CancionCategory,
```

- [ ] **Step 6: Write test** (mock `HTMLMediaElement.play`, jsdom doesn't implement it)

`src/screens/categories/EscuchaCancion/EscuchaCancion.test.jsx`:
```jsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import CancionCategory from './index'

beforeEach(() => {
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
  vi.useFakeTimers()
})
afterEach(() => vi.useRealTimers())

describe('CancionCategory', () => {
  it('goes intro (playing audio) -> answer -> time up -> round end', () => {
    const onRoundComplete = vi.fn()
    render(<CancionCategory onRoundComplete={onRoundComplete} />)

    expect(screen.getByTestId('cancion-audio')).toBeInTheDocument()
    // Simulate the clip ending so "Continuar" becomes enabled.
    fireEvent.ended(screen.getByTestId('cancion-audio'))
    fireEvent.click(screen.getByText('Continuar'))

    expect(screen.getByText('¿Apoco y te la sabes?')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(5000))
    expect(screen.getByText('¡Se acabó el Tiempo!')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Continuar'))
    fireEvent.click(screen.getByText('Ir a la ruleta'))
    expect(onRoundComplete).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 7: Run tests, verify pass**

```bash
npm test
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: implement Escucha la canción category with real audio playback"
```

---

## Task 13: Enchoque category

**Files:**
- Create: `src/screens/categories/Enchoque/EnchoqueTimer.jsx`, `Enchoque.css`
- Create: `src/screens/categories/Enchoque/index.jsx`
- Modify: `src/CategoryRouter.jsx` (wire `'enchoque'`)
- Test: `src/screens/categories/Enchoque/Enchoque.test.jsx`

**Interfaces:**
- Consumes: `enchoque.json` (Task 5), `useCountdown` (Task 3), shared UI (Tasks 2, 4).
- Produces: `<EnchoqueCategory onRoundComplete />`, registered as `CATEGORY_SCREENS.enchoque`. No answer-checking UI — just instructions + a start/stop 3-minute countdown, per the spec's explicit "no verification of hits on screen" rule.

- [ ] **Step 1: `EnchoqueTimer`**

```jsx
// src/screens/categories/Enchoque/EnchoqueTimer.jsx
import { useState } from 'react'
import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'
import ProgressTimerBar from '../../../components/ProgressTimerBar'
import { useCountdown } from '../../../hooks/useCountdown'
import config from '../../../data/enchoque.json'

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export default function EnchoqueTimer({ onFinished }) {
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const { secondsLeft, start } = useCountdown(config.duracionSegundos, { onExpire: () => setDone(true) })

  function handleStart() {
    setStarted(true)
    start()
  }

  return (
    <div className="category-game">
      <TornCard>
        <h2>{config.titulo}</h2>
        <p>{config.subtitulo}</p>
        <ol>
          {config.pasos.map((paso) => <li key={paso}>{paso}</li>)}
        </ol>
        <p className="enchoque-timer__clock">{formatTime(secondsLeft)}</p>
        <ProgressTimerBar totalSeconds={config.duracionSegundos} secondsLeft={secondsLeft} />
        {!started && <PillButton label="Empezar" onClick={handleStart} />}
        {done && <PillButton label="Terminar ronda" onClick={onFinished} variant="ghost" />}
      </TornCard>
    </div>
  )
}
```

`src/screens/categories/Enchoque/Enchoque.css`:
```css
.enchoque-timer__clock {
  font-size: 56px;
  font-weight: 800;
  margin: 16px 0;
}
```

- [ ] **Step 2: `index.jsx`**

```jsx
// src/screens/categories/Enchoque/index.jsx
import { useState } from 'react'
import EnchoqueTimer from './EnchoqueTimer'
import RoundEndScreen from '../../../components/RoundEndScreen'
import './Enchoque.css'

const STEPS = { TIMER: 'timer', END: 'end' }

export default function EnchoqueCategory({ onRoundComplete }) {
  const [step, setStep] = useState(STEPS.TIMER)

  if (step === STEPS.TIMER) return <EnchoqueTimer onFinished={() => setStep(STEPS.END)} />
  return <RoundEndScreen onBackToWheel={onRoundComplete} />
}
```

- [ ] **Step 3: Wire into `CategoryRouter`**

```jsx
import EnchoqueCategory from './screens/categories/Enchoque'
// ...
enchoque: EnchoqueCategory,
```

- [ ] **Step 4: Write test**

`src/screens/categories/Enchoque/Enchoque.test.jsx`:
```jsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import EnchoqueCategory from './index'

describe('EnchoqueCategory', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows a 3:00 clock, counts down after Empezar, and reaches round end', () => {
    const onRoundComplete = vi.fn()
    render(<EnchoqueCategory onRoundComplete={onRoundComplete} />)

    expect(screen.getByText('3:00')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Empezar'))

    act(() => vi.advanceTimersByTime(180000))
    expect(screen.getByText('0:00')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Terminar ronda'))
    fireEvent.click(screen.getByText('Ir a la ruleta'))
    expect(onRoundComplete).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 5: Run tests, verify pass**

```bash
npm test
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: implement Enchoque category as a 3-minute physical-challenge timer"
```

---

## Task 14: Final integration pass

**Files:**
- Modify: `src/CategoryRouter.jsx` (remove now-dead stub fallback comment, confirm all 5 keys are real components)
- Modify: `src/App.test.jsx` (extend to exercise all 5 categories via the wheel, not just the stub)
- Verify: `npm run build` succeeds

**Interfaces:**
- No new interfaces — this task verifies every category wired in Tasks 9-13 is reachable from the real `WheelScreen`, and that a production build succeeds.

- [ ] **Step 1: Sanity-check `CategoryRouter`**

Read `src/CategoryRouter.jsx` and confirm all 5 `CATEGORY_SCREENS` entries point to real imported components (no `null` left). Remove the stub fallback's now-inaccurate comment about "pending" categories, keep the fallback itself as a defensive default for unknown ids.

- [ ] **Step 2: Extend `App.test.jsx` to mock the random pick and drive each category once**

```jsx
// add to src/App.test.jsx
import * as randomLib from './lib/random'
import categorias from './data/categorias.json'

describe('App - all categories reachable from the wheel', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks() })

  it.each(categorias.map((c) => c.id))('reaches category "%s" from the wheel and returns to it', (categoryId) => {
    vi.spyOn(randomLib, 'pickRandom').mockReturnValue(categorias.find((c) => c.id === categoryId))
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)

    render(<App />)
    fireEvent.click(screen.getByText('Desafío Camba!'))
    fireEvent.click(screen.getByText('Iniciar'))
    act(() => vi.advanceTimersByTime(4000))

    // Each category's first screen renders something other than the generic stub text.
    expect(screen.queryByText(/pendiente de implementar/)).not.toBeInTheDocument()
  })
})
```

Note: this requires `WheelScreen` to import `pickRandom` from `../lib/random` as a named import (already the case from Task 7), so `vi.spyOn(randomLib, 'pickRandom')` can intercept it.

- [ ] **Step 3: Run full test suite**

```bash
npm test
```
Expected: every test file passes, including the new parametrized "all categories reachable" test (5 cases).

- [ ] **Step 4: Verify production build**

```bash
npm run build
```
Expected: build succeeds with no errors, `dist/` is generated.

- [ ] **Step 5: Manual smoke test with the dev server**

```bash
npm run dev &
sleep 3
curl -s http://localhost:5173 | grep -q "root" && echo "SERVER UP"
kill %1
```
Then tell the user the dev server command (`npm run dev`) so they can click through the whole game manually in a browser before calling it done — this plan's automated tests cover logic and flow, not pixel-level visual fidelity against the Figma file.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "test: verify all 5 categories reachable end to end, confirm production build"
```

---

## Post-plan manual follow-ups (not automatable here)

- Replace the 3 silent placeholder clips in `public/audio/` with real cruceño song clips (update `src/data/canciones.json` filenames to match).
- Visually compare the running app against the Figma screenshots (`intro.png`, `ruleta.png` already captured in this session) and adjust `tokens.css`/component CSS for closer pixel fidelity — the plan prioritizes correct structure, copy, and mechanics over pixel-perfect recreation, per the spec's explicit "Fuera de alcance" section.
