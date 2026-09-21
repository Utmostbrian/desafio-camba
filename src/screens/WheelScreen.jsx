import { useEffect, useRef, useState } from 'react'
import categorias from '../data/categorias.json'
import { pickRandom, angleForCategory } from '../lib/random'
import PillButton from '../components/PillButton'
import fondoRuleta from '../assets/fondo-ruleta.png'
import personajeEsqueleto from '../assets/wheel-personaje-esqueleto.png'
import personajeSombrero from '../assets/wheel-personaje-sombrero.png'
import './WheelScreen.css'

const SPIN_DURATION_MS = 4000
const EXTRA_SPINS = 4 // full rotations before landing, purely visual
const REEL_INTERVAL_MS = 90 // how fast the "Selección" name cycles while spinning

export default function WheelScreen({ onCategorySelected }) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [selectedName, setSelectedName] = useState(null)
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

    // Slot-machine effect: cycle rapidly through the possible categories
    // while the wheel spins, then land on the one it actually picked.
    reelIntervalRef.current = setInterval(() => {
      setSelectedName(pickRandom(categorias).nombre)
    }, REEL_INTERVAL_MS)

    setTimeout(() => {
      clearInterval(reelIntervalRef.current)
      setSpinning(false)
      setSelectedName(category.nombre)
      onCategorySelected(selectedRef.current.id)
    }, SPIN_DURATION_MS)
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
      <div
        className="wheel-screen__wheel"
        style={{ transform: `rotate(${rotation}deg)`, transitionDuration: `${SPIN_DURATION_MS}ms` }}
      >
        <div className="wheel-screen__hub">{spinning ? 'Girando…' : 'GIRAR'}</div>
      </div>
      <PillButton
        className="wheel-screen__start"
        label="Iniciar"
        onClick={handleSpin}
        disabled={spinning}
      />
    </div>
  )
}
