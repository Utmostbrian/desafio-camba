import { useEffect, useRef, useState } from 'react'
import TornCard from '../../../components/TornCard'
import ProgressTimerBar from '../../../components/ProgressTimerBar'
import TimeUpOverlay from '../../../components/TimeUpOverlay'
import PillButton from '../../../components/PillButton'
import { useCountdown } from '../../../hooks/useCountdown'
import { pickRandom } from '../../../lib/random'
import { pauseBackgroundMusic, playBackgroundMusic } from '../../../lib/backgroundMusic'

const ROUND_SECONDS = 15
const LETRAS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('')

export default function MencionaLugaresGame({ onFinished }) {
  const [letra] = useState(() => pickRandom(LETRAS))
  const [timeUp, setTimeUp] = useState(false)
  const { secondsLeft, start } = useCountdown(ROUND_SECONDS, { onExpire: () => setTimeUp(true) })
  const countdownRef = useRef(null)

  useEffect(() => { start() }, [start])

  // The suspense track plays for the whole time this screen (with its
  // progress bar) is up — it stops the moment the screen unmounts,
  // whichever way the round ends (player finishes, or time runs out).
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
        <TornCard showDecorations={false}>
          <p className="category-game__prompt">Menciona 3 lugares con la letra:</p>
          <p className="menciona-lugares__letra">{letra}</p>
          <p className="menciona-lugares__hint">Ahorita sacan la labia puej</p>
          <ProgressTimerBar totalSeconds={ROUND_SECONDS} secondsLeft={secondsLeft} />
        </TornCard>
        {!timeUp && <PillButton label="Ya terminé" onClick={onFinished} />}
      </div>
      <TimeUpOverlay visible={timeUp} onContinue={onFinished} />
      <audio ref={countdownRef} src="/audio/trivia-countdown.mp3" loop data-testid="trivia-countdown-audio" />
    </div>
  )
}
