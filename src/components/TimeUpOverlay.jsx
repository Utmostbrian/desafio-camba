import colaDePegi from '../assets/cola-de-pegi.png'
import PillButton from './PillButton'
import './TimeUpOverlay.css'

export default function TimeUpOverlay({ visible, onContinue, continueLabel = 'Continuar' }) {
  if (!visible) return null
  return (
    <div className="time-up-overlay" role="alertdialog" aria-label="Se acabó el Tiempo">
      <div className="time-up-overlay__grain" aria-hidden="true" />
      <img className="time-up-overlay__whip" src={colaDePegi} alt="" aria-hidden="true" />
      <h2 className="time-up-overlay__title">¡Se acabó el Tiempo!</h2>
      <PillButton
        className="time-up-overlay__continue"
        label={continueLabel}
        onClick={onContinue}
        variant="ghost"
      />
    </div>
  )
}
