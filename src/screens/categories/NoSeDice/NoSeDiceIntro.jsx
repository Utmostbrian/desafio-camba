import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'

export default function NoSeDiceIntro({ onStart }) {
  return (
    <div className="category-intro">
      <TornCard>
        <h2>No se dice... se dice...</h2>
        <p>Cuidado eh cunumi, demuestra que tan cambanga soj</p>
        <p>Tienes 10s</p>
        <PillButton label="¡Inicia!" onClick={onStart} />
      </TornCard>
    </div>
  )
}
