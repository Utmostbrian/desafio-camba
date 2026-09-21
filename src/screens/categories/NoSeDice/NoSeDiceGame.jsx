import { useEffect, useState } from 'react'
import TornCard from '../../../components/TornCard'
import ProgressTimerBar from '../../../components/ProgressTimerBar'
import TimeUpOverlay from '../../../components/TimeUpOverlay'
import PillButton from '../../../components/PillButton'
import { useCountdown } from '../../../hooks/useCountdown'
import { pickRandom } from '../../../lib/random'
import palabras from '../../../data/noSeDice.json'

const ROUND_SECONDS = 10

export default function NoSeDiceGame({ onFinished }) {
  const [entry] = useState(() => pickRandom(palabras))
  const [timeUp, setTimeUp] = useState(false)
  const { secondsLeft, start } = useCountdown(ROUND_SECONDS, { onExpire: () => setTimeUp(true) })

  useEffect(() => { start() }, [start])

  return (
    <div className="category-game">
      <TornCard>
        <p className="category-game__prompt">{entry.frase}</p>
        <ProgressTimerBar totalSeconds={ROUND_SECONDS} secondsLeft={secondsLeft} />
        {!timeUp && <PillButton label="Ya adivinó" onClick={onFinished} variant="ghost" />}
      </TornCard>
      <TimeUpOverlay visible={timeUp} onContinue={onFinished} />
    </div>
  )
}
