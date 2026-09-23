import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'

export default function MencionaLugaresIntro({ onStart }) {
  return (
    <div className="category-intro">
      <div className="card-with-actions">
        <TornCard>
          <h2 className="category-title">
            Menciona 3
            <span className="category-title__highlight">lugares con la letra...</span>
          </h2>
          <p className="category-title__subtitle">A ver que tan pata de perro sos!</p>
        </TornCard>
        <PillButton label="¡Inicia!" onClick={onStart} />
      </div>
    </div>
  )
}
