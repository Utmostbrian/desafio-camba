import { useEffect, useRef } from 'react'
import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'
import { pauseBackgroundMusic, playBackgroundMusic } from '../../../lib/backgroundMusic'

export default function CancionReveal({ cancion, onDone }) {
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    pauseBackgroundMusic()
    audio.play().catch(() => {})

    return () => {
      audio.pause()
      playBackgroundMusic()
    }
  }, [])

  return (
    <div className="category-game">
      <TornCard>
        <h2 className="category-title">
          Era...
          <span className="category-title__highlight">{cancion.nombre}!</span>
        </h2>
        <p className="category-title__subtitle">Temón!</p>
        <audio ref={audioRef} src={`/audio/${cancion.archivoCompleto}`} data-testid="cancion-final-audio" />
        <PillButton label="Continuar" onClick={onDone} />
      </TornCard>
    </div>
  )
}
