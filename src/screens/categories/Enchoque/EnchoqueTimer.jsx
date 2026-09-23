import { useEffect, useRef, useState } from 'react'
import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'
import ProgressTimerBar from '../../../components/ProgressTimerBar'
import { useCountdown } from '../../../hooks/useCountdown'
import { pauseBackgroundMusic, playBackgroundMusic } from '../../../lib/backgroundMusic'
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
  const countdownRef = useRef(null)

  // Stop the suspense track (and restore the ambient music) whenever this
  // screen goes away, however the round ended — time ran out or the
  // player cancelled/finished.
  useEffect(() => {
    return () => {
      countdownRef.current?.pause()
      playBackgroundMusic()
    }
  }, [])

  function handleStart() {
    setStarted(true)
    start()
    // The clock only starts ticking once the player presses "Empezar" —
    // the suspense track should start exactly then, not while they're
    // still looking at the resting 3:00 clock.
    const audio = countdownRef.current
    pauseBackgroundMusic()
    audio.currentTime = 0
    audio.play().catch(() => {})
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
        </TornCard>
        {!started && <PillButton label="Empezar" onClick={handleStart} />}
        {started && !done && <PillButton label="Cancelar" onClick={onFinished} />}
        {done && <PillButton label="Terminar ronda" onClick={onFinished} />}
        <ProgressTimerBar totalSeconds={config.duracionSegundos} secondsLeft={secondsLeft} />
      </div>
      <audio ref={countdownRef} src="/audio/trivia-countdown.mp3" loop data-testid="trivia-countdown-audio" />
    </div>
  )
}
