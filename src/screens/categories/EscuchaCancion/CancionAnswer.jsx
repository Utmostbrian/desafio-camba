import { useEffect, useRef, useState } from 'react'
import TornCard from '../../../components/TornCard'
import ProgressTimerBar from '../../../components/ProgressTimerBar'
import TimeUpOverlay from '../../../components/TimeUpOverlay'
import PillButton from '../../../components/PillButton'
import { useCountdown } from '../../../hooks/useCountdown'
import { pauseBackgroundMusic, playBackgroundMusic } from '../../../lib/backgroundMusic'

const ANSWER_SECONDS = 5

export default function CancionAnswer({ onFinished }) {
  const [timeUp, setTimeUp] = useState(false)
  const { secondsLeft, start } = useCountdown(ANSWER_SECONDS, { onExpire: () => setTimeUp(true) })
  const countdownRef = useRef(null)

  useEffect(() => { start() }, [start])

  // The suspense track plays for the whole time this answer screen (with
  // its progress bar) is up — it stops the moment the screen unmounts,
  // whichever way the round ends (player answers, or time runs out).
  useEffect(() => {
    const audio = countdownRef.current
    pauseBackgroundMusic()
    audio.currentTime = 0
    audio.play().catch(() => {})

    return () => {
      audio.pause()
      playBackgroundMusic()
    }
  }, [])

  return (
    <div className="category-game">
      <div className="card-with-actions">
        <TornCard>
          <h3>¿Apoco y te la sabes?</h3>
          <ProgressTimerBar totalSeconds={ANSWER_SECONDS} secondsLeft={secondsLeft} />
        </TornCard>
        {!timeUp && <PillButton label="¡Si la sé!" onClick={onFinished} />}
      </div>
      <TimeUpOverlay visible={timeUp} onContinue={onFinished} continueLabel="Continuar" />
      <audio ref={countdownRef} src="/audio/trivia-countdown.mp3" loop data-testid="trivia-countdown-audio" />
    </div>
  )
}
