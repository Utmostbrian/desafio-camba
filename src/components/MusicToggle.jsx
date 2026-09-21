import { useState } from 'react'
import { toggleMuteBackgroundMusic, isBackgroundMusicMuted } from '../lib/backgroundMusic'
import './MusicToggle.css'

export default function MusicToggle() {
  const [muted, setMuted] = useState(isBackgroundMusicMuted())

  return (
    <button
      type="button"
      className="music-toggle"
      onClick={() => setMuted(toggleMuteBackgroundMusic())}
      aria-label={muted ? 'Activar música de fondo' : 'Silenciar música de fondo'}
      aria-pressed={muted}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
