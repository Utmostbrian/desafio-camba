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
      <PillButton
        className="wheel-screen__start"
        label="Iniciar"
        onClick={handleSpin}
        disabled={spinning}
      />
    </div>
  )
}
