import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'

export default function MencionaLugaresIntro({ onStart }) {
  return (
    <div className="category-intro">
      <TornCard>
        <h2>Menciona 3 lugares con la letra...</h2>
        <p>A ver que tan pata de perro sos!</p>
        <PillButton label="¡Inicia!" onClick={onStart} />
      </TornCard>
    </div>
  )
}
