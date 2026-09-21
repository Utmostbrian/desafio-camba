import { useEffect, useState } from 'react'
import TornCard from '../../../components/TornCard'
import ProgressTimerBar from '../../../components/ProgressTimerBar'
import TimeUpOverlay from '../../../components/TimeUpOverlay'
import PillButton from '../../../components/PillButton'
import { useCountdown } from '../../../hooks/useCountdown'

const ANSWER_SECONDS = 5

export default function CancionAnswer({ cancion, onFinished }) {
  const [timeUp, setTimeUp] = useState(false)
  const { secondsLeft, start } = useCountdown(ANSWER_SECONDS, { onExpire: () => setTimeUp(true) })

  useEffect(() => { start() }, [start])

  return (
    <div className="category-game">
      <TornCard>
        <h3>¿Apoco y te la sabes?</h3>
        <ProgressTimerBar totalSeconds={ANSWER_SECONDS} secondsLeft={secondsLeft} />
        {!timeUp && <PillButton label="¡Si la sé!" onClick={() => setTimeUp(true)} />}
      </TornCard>
      <TimeUpOverlay
        visible={timeUp}
        onContinue={onFinished}
        continueLabel="Continuar"
      />
      {timeUp && (
        <p className="cancion-answer__reveal" role="status">
          Era: {cancion.nombre} — {cancion.artista}
        </p>
      )}
    </div>
  )
}
