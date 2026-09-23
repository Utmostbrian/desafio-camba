import { useEffect, useRef, useState } from 'react'
import TornCard from '../../../components/TornCard'
import ProgressTimerBar from '../../../components/ProgressTimerBar'
import TimeUpOverlay from '../../../components/TimeUpOverlay'
import PillButton from '../../../components/PillButton'
import RevealBanner from '../../../components/RevealBanner'
import { useCountdown } from '../../../hooks/useCountdown'
import { pickRandom } from '../../../lib/random'
import { pauseBackgroundMusic, playBackgroundMusic } from '../../../lib/backgroundMusic'
import palabras from '../../../data/noSeDice.json'

const ROUND_SECONDS = 10

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export default function NoSeDiceGame({ onFinished }) {
  const [entry] = useState(() => pickRandom(palabras))
  const [timeUp, setTimeUp] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const { secondsLeft, start } = useCountdown(ROUND_SECONDS, { onExpire: () => setTimeUp(true) })
  const countdownRef = useRef(null)

  useEffect(() => { start() }, [start])

  // The suspense track plays only while the frase/timer screen is up. This
  // component never unmounts when `revealed` flips true (same instance,
  // just an early return below), so the effect must key off `revealed`
  // itself rather than mount/unmount to know when to stop.
  useEffect(() => {
    if (revealed) return
    const audio = countdownRef.current
    pauseBackgroundMusic()
    audio.currentTime = 0
    audio.play().catch(() => {})

    return () => {
      audio.pause()
      playBackgroundMusic()
    }
  }, [revealed])

  // Both paths (guessed it in time, or time ran out) converge on the same
  // reveal screen showing the real cruceño phrase before moving on.
  if (revealed) {
    return (
      <div className="category-game">
        <RevealBanner
          line1="Se dice…"
          line2={`¡${capitalize(entry.respuesta)}!`}
          hint="Ñiee, la sabias?"
          continueLabel="siguiente"
          onContinue={onFinished}
        />
      </div>
    )
  }

  return (
    <div className="category-game">
      <div className="card-with-actions">
        <TornCard showDecorations={false}>
          <p className="category-game__prompt no-se-dice__prompt">{entry.frase}</p>
        </TornCard>
        <ProgressTimerBar totalSeconds={ROUND_SECONDS} secondsLeft={secondsLeft} />
        {!timeUp && <PillButton label="Ya adivinó" onClick={() => setRevealed(true)} />}
      </div>
      <TimeUpOverlay visible={timeUp} onContinue={() => setRevealed(true)} />
      <audio ref={countdownRef} src="/audio/trivia-countdown.mp3" loop data-testid="trivia-countdown-audio" />
    </div>
  )
}
