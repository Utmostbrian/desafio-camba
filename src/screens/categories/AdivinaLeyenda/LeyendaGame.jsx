import { useEffect, useRef, useState } from 'react'
import TornCard from '../../../components/TornCard'
import ProgressTimerBar from '../../../components/ProgressTimerBar'
import TimeUpOverlay from '../../../components/TimeUpOverlay'
import PillButton from '../../../components/PillButton'
import { useCountdown } from '../../../hooks/useCountdown'
import { pickRandom } from '../../../lib/random'
import { pauseBackgroundMusic, playBackgroundMusic } from '../../../lib/backgroundMusic'
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

  const imageSrc = resolveImage(leyenda.imagen)

  return (
    <div className="category-game">
      <div className="card-with-actions">
        <TornCard>
          <h3>{leyenda.nombre}</h3>
          {imageSrc && <img className="leyenda-game__image" src={imageSrc} alt={leyenda.nombre} />}
          <ProgressTimerBar totalSeconds={ROUND_SECONDS} secondsLeft={secondsLeft} />
        </TornCard>
        {!timeUp && <PillButton label="Ya adivinó" onClick={onFinished} />}
      </div>
      <TimeUpOverlay visible={timeUp} onContinue={onFinished} />
      <audio ref={countdownRef} src="/audio/trivia-countdown.mp3" loop data-testid="trivia-countdown-audio" />
    </div>
  )
}
