import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'

export default function CancionTitle({ onStart }) {
  return (
    <div className="category-intro">
      <div className="card-with-actions">
        <TornCard>
          <h2 className="category-title">
            Escucha y
            <span className="category-title__highlight">continúa la canción</span>
          </h2>
          <p className="category-title__subtitle">Presta mucha atención ¡Solo tienes 3s!</p>
        </TornCard>
        <PillButton label="¡Inicia!" onClick={onStart} />
      </div>
    </div>
  )
}
