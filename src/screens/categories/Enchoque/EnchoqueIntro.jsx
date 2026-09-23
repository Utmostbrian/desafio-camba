import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'
import config from '../../../data/enchoque.json'

export default function EnchoqueIntro({ onStart }) {
  return (
    <div className="category-intro">
      <div className="card-with-actions">
        <TornCard>
          <h2 className="category-title">
            {config.tituloLinea1}
            <span className="category-title__highlight">{config.tituloLinea2}</span>
          </h2>
          <p className="category-title__subtitle">{config.subtituloIntro}</p>
        </TornCard>
        <PillButton label="¡Inicia!" onClick={onStart} />
      </div>
    </div>
  )
}
