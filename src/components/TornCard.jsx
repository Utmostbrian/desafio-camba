import mascaraChiquitana from '../assets/mascara-chiquitana.png'
import manoChiquitana1 from '../assets/mano-chiquitana-1.png'
import manoChiquitana2 from '../assets/mano-chiquitana-2.png'
import hojaEsquina from '../assets/fondo-hoja-2.png'
import hojaChica from '../assets/hoja-chica.png'
import marcoGrueso from '../assets/frames/marco-grueso.png'
import marcoSuave from '../assets/frames/marco-suave.png'
import './TornCard.css'

const FRAMES = { grueso: marcoGrueso, suave: marcoSuave }

export default function TornCard({
  children,
  className = '',
  showDecorations = true,
  showLeaves = true,
  frame = 'grueso',
}) {
  return (
    <div className={`torn-card-wrap ${className}`}>
      {showDecorations && (
        <img className="torn-card__mask" src={mascaraChiquitana} alt="" aria-hidden="true" />
      )}
      {showLeaves && (
        <>
          <img className="torn-card__leaf torn-card__leaf--top" src={hojaEsquina} alt="" aria-hidden="true" />
          <img className="torn-card__leaf torn-card__leaf--bottom" src={hojaChica} alt="" aria-hidden="true" />
        </>
      )}
      <div
        className={`torn-card torn-card--${frame}`}
        data-testid="torn-card"
        style={{ backgroundImage: `url(${FRAMES[frame]})` }}
      >
        {children}
      </div>
      {showDecorations && (
        <>
          {/* Hands live outside .torn-card, not inside it — the card's own
              background frame has its own irregular painted edge, so a hand
              positioned to hang off the side must not be clipped by it. */}
          <img className="torn-card__hand torn-card__hand--left" src={manoChiquitana1} alt="" aria-hidden="true" />
          <img className="torn-card__hand torn-card__hand--right" src={manoChiquitana2} alt="" aria-hidden="true" />
        </>
      )}
    </div>
  )
}
