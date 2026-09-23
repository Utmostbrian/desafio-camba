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
    <div className="category-intro explicacion-columns">
      <div className="explicacion-column">
        <TornCard showDecorations={false} frame="suave">
          <h3>Explicación</h3>
          <p>{config.explicacion}</p>
        </TornCard>
        <PillButton label="¡Inicia!" onClick={onStart} />
      </div>
      <div className="explicacion-column">
        <TornCard showDecorations={false} frame="suave">
          <h3>Instrucciones</h3>
          <ol>
            {config.pasos.map((paso) => <li key={paso}>{paso}</li>)}
          </ol>
        </TornCard>
        <p className="explicacion-column__time-label">Tiempo:</p>
        <p className="explicacion-column__time-value">{formatTime(config.duracionSegundos)}</p>
      </div>
    </div>
  )
}
