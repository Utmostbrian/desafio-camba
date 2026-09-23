import { useEffect } from 'react'
import colaDePegi from '../assets/cola-de-pegi.png'
import PillButton from './PillButton'
import { playSfx } from '../lib/sfx'
import './TimeUpOverlay.css'

const CHICOTAZO_URL = '/audio/chicotazo.mp3'

export default function TimeUpOverlay({ visible, onContinue, continueLabel = 'Continuar' }) {
  // This component is always mounted inside its game screen (rendered
  // with visible=false until the timer expires), so a mount-time effect
  // would fire the instant the game screen appears — not when the
  // overlay actually shows. Gate on `visible` itself so the sound only
  // plays on the transition to true. Played via the shared AudioContext
  // (not a plain <audio>) because this fires from a countdown's
  // setTimeout, not a user gesture, which a plain element's play() would
  // get silently blocked for by the autoplay policy.
  useEffect(() => {
    if (visible) playSfx(CHICOTAZO_URL)
  }, [visible])

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
