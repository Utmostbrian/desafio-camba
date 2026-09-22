import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'
import config from '../../../data/enchoque.json'

export default function EnchoqueIntro({ onStart }) {
  return (
    <div className="category-intro">
      <TornCard>
        <h2 className="enchoque-intro__title">
          {config.tituloLinea1}
          <br />
          <span className="enchoque-intro__title-bold">{config.tituloLinea2}</span>
        </h2>
        <p className="enchoque-intro__subtitle">{config.subtituloIntro}</p>
        <PillButton label="¡Inicia!" onClick={onStart} />
      </TornCard>
    </div>
  )
}
