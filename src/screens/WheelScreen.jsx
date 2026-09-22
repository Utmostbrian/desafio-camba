import { useEffect, useRef, useState } from 'react'
import categorias from '../data/categorias.json'
import { pickRandom, angleForCategory } from '../lib/random'
import PillButton from '../components/PillButton'
import fondoRuleta from '../assets/fondo-ruleta.png'
import personajeEsqueleto from '../assets/wheel-personaje-esqueleto.png'
import personajeSombrero from '../assets/wheel-personaje-sombrero.png'
import ruletaBase from '../assets/ruleta/ruleta-base.png'
import './WheelScreen.css'

const SPIN_DURATION_MS = 4000
const EXTRA_SPINS = 4 // full rotations before landing, purely visual
const REEL_INTERVAL_MS = 90 // how fast the "Selección" name cycles while spinning

export default function WheelScreen({ onCategorySelected }) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [selectedName, setSelectedName] = useState(null)
  const [hasSelection, setHasSelection] = useState(false)
  const selectedRef = useRef(null)
  const reelIntervalRef = useRef(null)

  useEffect(() => () => clearInterval(reelIntervalRef.current), [])

  function handleSpin() {
    if (spinning) return
    const category = pickRandom(categorias)
    selectedRef.current = category
    const targetAngle = angleForCategory(categorias, category.id)
    const finalRotation = rotation + EXTRA_SPINS * 360 + (360 - targetAngle)
    setRotation(finalRotation)
    setSpinning(true)
    setSelectedName(null)
    setHasSelection(false)

    // Slot-machine effect: cycle rapidly through the possible categories
    // while the wheel spins, then land on the one it actually picked.
    reelIntervalRef.current = setInterval(() => {
      setSelectedName(pickRandom(categorias).nombre)
    }, REEL_INTERVAL_MS)

    setTimeout(() => {
      clearInterval(reelIntervalRef.current)
      setSpinning(false)
      setSelectedName(category.nombre)
      setHasSelection(true)
    }, SPIN_DURATION_MS)
  }

  // "Iniciar" only accepts the category the wheel already landed on — it
  // never spins by itself. Spinning (first time or "volver a girar") is
  // what the wheel's own hub and the respin link are for.
  function handleAccept() {
    if (!hasSelection || !selectedRef.current) return
    onCategorySelected(selectedRef.current.id)
  }

  return (
    <div className="wheel-screen" style={{ backgroundImage: `url(${fondoRuleta})` }}>
      <img className="wheel-screen__character wheel-screen__character--left" src={personajeEsqueleto} alt="" aria-hidden="true" />
      <img className="wheel-screen__character wheel-screen__character--right" src={personajeSombrero} alt="" aria-hidden="true" />
      <h1>¡Girala YA!</h1>
      <div className="wheel-screen__selection">
        <div className="wheel-screen__selection-icon">▼</div>
        <p className="wheel-screen__selection-label">Selección</p>
        <p className="wheel-screen__selection-value" aria-live="polite">
          {selectedName ?? 'Toca el botón para girar la ruleta'}
        </p>
      </div>
      <div className="wheel-screen__wheel-wrap">
        <img
          className="wheel-screen__wheel"
          src={ruletaBase}
          alt=""
          aria-hidden="true"
          style={{ transform: `rotate(${rotation}deg)`, transitionDuration: `${SPIN_DURATION_MS}ms` }}
        />
        {/* The hub is a sibling, not a child, of the rotating wheel — it
            must stay upright and readable while the wheel spins under it.
            The label is always our own text (not the baked-in asset text),
            so it can be sized and centered precisely and can switch to
            "Girando…" mid-spin. */}
        <button
          type="button"
          className="wheel-screen__hub"
          aria-label="Girar la ruleta"
          onClick={handleSpin}
          disabled={spinning}
        >
          {spinning ? 'Girando…' : 'GIRAR'}
        </button>
      </div>
      <p className="wheel-screen__ready-hint">
        ¿Estas listo para jugar?
        <br />
        Apreta &ldquo;Iniciar&rdquo;
      </p>
      <PillButton
        className="wheel-screen__start"
        label="Iniciar"
        onClick={handleAccept}
        disabled={spinning || !hasSelection}
      />
      <button type="button" className="wheel-screen__respin" onClick={handleSpin} disabled={spinning}>
        volver a girar
      </button>
    </div>
  )
}
