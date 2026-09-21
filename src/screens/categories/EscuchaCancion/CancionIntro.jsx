import { useEffect, useRef, useState } from 'react'
import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'

export default function CancionIntro({ cancion, onDone }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    audio.play().catch(() => {}) // autoplay can be blocked; user can still press Continuar
    setPlaying(true)
    const handleEnded = () => setPlaying(false)
    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [])

  return (
    <div className="category-intro">
      <TornCard>
        <h3>¿Estás escuchando?</h3>
        <div className="cancion-intro__bars" aria-hidden="true">
          <span /><span /><span />
        </div>
        <p>No te distraigas camba e miércole! Ni cagando repetimos</p>
        <p className="cancion-intro__repeat">Repetir 3s</p>
        <audio ref={audioRef} src={`/audio/${cancion.archivo}`} data-testid="cancion-audio" />
        <PillButton label="Continuar" onClick={onDone} disabled={playing} />
      </TornCard>
    </div>
  )
}
