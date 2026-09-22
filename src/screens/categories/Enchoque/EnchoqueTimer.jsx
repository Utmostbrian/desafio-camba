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
      <div className="enchoque-timer__stack">
        <TornCard>
          <h2 className="category-title">
            ¡Juguemos
            <span className="category-title__highlight">Enchoque!</span>
          </h2>
          <p className="enchoque-timer__clock">{formatTime(secondsLeft)}</p>
          {!started && <PillButton label="Empezar" onClick={handleStart} />}
          {started && !done && <PillButton label="Cancelar" onClick={onFinished} />}
          {done && <PillButton label="Terminar ronda" onClick={onFinished} />}
        </TornCard>
        <ProgressTimerBar totalSeconds={config.duracionSegundos} secondsLeft={secondsLeft} />
      </div>
    </div>
  )
}
