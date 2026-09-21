import mascaraChiquitana from '../assets/mascara-chiquitana.png'
import manoChiquitana1 from '../assets/mano-chiquitana-1.png'
import manoChiquitana2 from '../assets/mano-chiquitana-2.png'
import './TornCard.css'

export default function TornCard({ children, className = '', showDecorations = true }) {
  return (
    <div className={`torn-card-wrap ${className}`}>
      {showDecorations && (
        <img className="torn-card__mask" src={mascaraChiquitana} alt="" aria-hidden="true" />
      )}
      <div className="torn-card" data-testid="torn-card">
        {showDecorations && (
          <>
            <img className="torn-card__hand torn-card__hand--left" src={manoChiquitana1} alt="" aria-hidden="true" />
            <img className="torn-card__hand torn-card__hand--right" src={manoChiquitana2} alt="" aria-hidden="true" />
          </>
        )}
        {children}
      </div>
    </div>
  )
}
