import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'

export default function LeyendaTitle({ onStart }) {
  return (
    <div className="category-intro">
      <div className="card-with-actions">
        <TornCard>
          <h2 className="category-title">
            Adivina la
            <span className="category-title__highlight">Leyenda!</span>
          </h2>
          <p className="category-title__subtitle">La típicas de las típicas</p>
        </TornCard>
        <PillButton label="¡Inicia!" onClick={onStart} />
      </div>
    </div>
  )
}
