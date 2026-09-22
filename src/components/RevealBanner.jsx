import cintaDiagonal from '../assets/frames/cinta-diagonal.png'
import PillButton from './PillButton'
import './RevealBanner.css'

export default function RevealBanner({ line1, line2, hint, continueLabel = 'Continuar', onContinue }) {
  return (
    <div className="reveal-banner">
      <div className="reveal-banner__ribbon" style={{ backgroundImage: `url(${cintaDiagonal})` }}>
        <p className="reveal-banner__line1">{line1}</p>
        <p className="reveal-banner__line2">{line2}</p>
      </div>
      {hint && <p className="reveal-banner__hint">{hint}</p>}
      <PillButton label={continueLabel} onClick={onContinue} />
    </div>
  )
}
