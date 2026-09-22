import { useEffect, useState } from 'react'
import TornCard from '../../../components/TornCard'
import ProgressTimerBar from '../../../components/ProgressTimerBar'
import TimeUpOverlay from '../../../components/TimeUpOverlay'
import PillButton from '../../../components/PillButton'
import { useCountdown } from '../../../hooks/useCountdown'
import { pickRandom } from '../../../lib/random'
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

  useEffect(() => { start() }, [start])

  const imageSrc = resolveImage(leyenda.imagen)

  return (
    <div className="category-game">
      <TornCard>
        <h3>{leyenda.nombre}</h3>
        {imageSrc && <img className="leyenda-game__image" src={imageSrc} alt={leyenda.nombre} />}
        <ProgressTimerBar totalSeconds={ROUND_SECONDS} secondsLeft={secondsLeft} />
        {!timeUp && <PillButton label="Ya adivinó" onClick={onFinished} />}
      </TornCard>
      <TimeUpOverlay visible={timeUp} onContinue={onFinished} />
    </div>
  )
}
