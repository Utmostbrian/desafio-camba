import { useEffect, useRef } from 'react'
import colaDePegi from '../assets/cola-de-pegi.png'
import PillButton from './PillButton'
import './TimeUpOverlay.css'

export default function TimeUpOverlay({ visible, onContinue, continueLabel = 'Continuar' }) {
  const audioRef = useRef(null)

  // The component only mounts once `visible` flips true (it returns null
  // otherwise), so a mount-time play is exactly "the moment the overlay
  // appears" — no need to track visible transitions by hand.
  useEffect(() => {
    audioRef.current?.play().catch(() => {})
  }, [])

  if (!visible) return null
  return (
    <div className="time-up-overlay" role="alertdialog" aria-label="Se acabó el Tiempo">
      <div className="time-up-overlay__grain" aria-hidden="true" />
      <img className="time-up-overlay__whip" src={colaDePegi} alt="" aria-hidden="true" />
      <h2 className="time-up-overlay__title">¡Se acabó el Tiempo!</h2>
      <audio ref={audioRef} src="/audio/chicotazo.mp3" data-testid="chicotazo-audio" />
      <PillButton
        className="time-up-overlay__continue"
        label={continueLabel}
        onClick={onContinue}
        variant="ghost"
      />
    </div>
  )
}
