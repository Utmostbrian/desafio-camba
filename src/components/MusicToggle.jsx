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
      <svg className="music-toggle__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 9v6h4l5 4V5L8 9H4Z"
          fill="currentColor"
        />
        {muted ? (
          <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path
            d="M16.5 8.5a5 5 0 0 1 0 7M19 6a9 9 0 0 1 0 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </svg>
    </button>
  )
}
