import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'

export default function TriviaTitle({ onStart }) {
  return (
    <div className="category-intro">
      <div className="card-with-actions">
        <TornCard>
          <h2 className="category-title">
            ¡Trivia de
            <span className="category-title__highlight">Cultura general!</span>
          </h2>
          <p className="category-title__subtitle">Cuidado eh cunumi, demuestra que tan cambanga soj</p>
          <p>Tienes 10s</p>
        </TornCard>
        <PillButton label="¡Inicia!" onClick={onStart} />
      </div>
    </div>
  )
}
