import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'
import config from '../../../data/enchoque.json'

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return seconds === 0 ? `${minutes} minutos` : `${minutes}:${String(seconds).padStart(2, '0')}`
}

export default function EnchoqueInstructions({ onStart }) {
  return (
    <div className="category-intro">
      <TornCard showDecorations={false}>
        <h3>Explicación</h3>
        <p>{config.explicacion}</p>
      </TornCard>
      <TornCard showDecorations={false}>
        <h3>Instrucciones</h3>
        <ol>
          {config.pasos.map((paso) => <li key={paso}>{paso}</li>)}
        </ol>
        <PillButton label="¡Inicia!" onClick={onStart} />
        <p className="enchoque-instructions__tiempo-label">Tiempo:</p>
        <p className="enchoque-instructions__tiempo-value">{formatTime(config.duracionSegundos)}</p>
      </TornCard>
    </div>
  )
}
