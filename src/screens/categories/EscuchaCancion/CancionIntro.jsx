import { useEffect, useRef, useState } from 'react'
import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'
import { pauseBackgroundMusic, playBackgroundMusic } from '../../../lib/backgroundMusic'

export default function CancionIntro({ cancion, onDone }) {
  const audioRef = useRef(null)
  const capTimeoutRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  function stopPlaying() {
    setPlaying(false)
    // Resume the ambient background track once the guessing clip stops,
    // however it stopped (ended, 3s cap, error, or a failed play()).
    playBackgroundMusic()
  }

  function playClip() {
    const audio = audioRef.current
    clearTimeout(capTimeoutRef.current)
    audio.currentTime = 0
    setPlaying(true)
    // The game clip and the ambient background track must never overlap.
    pauseBackgroundMusic()
    // Playback can fail silently (autoplay policy blocking play(), or the audio
    // file 404ing / failing to load). If we only unstick `playing` on the
    // `ended` event, either of those leaves it stuck `true` forever, and since
    // "Continuar"/"Repetir 3s" are the only controls on this screen the round
    // becomes unfinishable. So we also unstick on the play() rejection and on
    // the element's `error` event.
    audio.play().catch(stopPlaying)

    // The spec calls for a 3-second clip; cap playback at 3s even if the
    // underlying audio file is longer, whichever comes first with `ended`.
    capTimeoutRef.current = setTimeout(() => {
      audio.pause()
      stopPlaying()
    }, 3000)
  }

  useEffect(() => {
    const audio = audioRef.current
    audio.addEventListener('ended', stopPlaying)
    audio.addEventListener('error', stopPlaying)

    playClip()

    return () => {
      audio.removeEventListener('ended', stopPlaying)
      audio.removeEventListener('error', stopPlaying)
      clearTimeout(capTimeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="category-intro">
      <div className="card-with-actions">
        <TornCard>
          <h3>¿Estás escuchando?</h3>
          <div className="cancion-intro__bars" aria-hidden="true">
            <span /><span /><span />
          </div>
          <p>No te distraigas camba e miércole! Ni cagando repetimos</p>
          <audio ref={audioRef} src={`/audio/${cancion.archivo}`} data-testid="cancion-audio" />
        </TornCard>
        <button
          type="button"
          className="cancion-intro__repeat"
          onClick={playClip}
          disabled={playing}
        >
          Repetir 3s
        </button>
        <PillButton label="Continuar" onClick={onDone} disabled={playing} />
      </div>
    </div>
  )
}
