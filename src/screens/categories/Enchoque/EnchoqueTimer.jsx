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
        <p className="enchoque-timer__clock">{formatTime(secondsLeft)}</p>
        <ProgressTimerBar totalSeconds={config.duracionSegundos} secondsLeft={secondsLeft} />
        {!started && <PillButton label="Empezar" onClick={handleStart} />}
        {started && !done && <PillButton label="Cancelar" onClick={onFinished} variant="ghost" />}
        {done && <PillButton label="Terminar ronda" onClick={onFinished} variant="ghost" />}
      </TornCard>
    </div>
  )
}
