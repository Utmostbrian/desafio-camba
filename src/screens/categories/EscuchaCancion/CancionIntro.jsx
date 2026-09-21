import { useEffect, useRef, useState } from 'react'
import TornCard from '../../../components/TornCard'
import PillButton from '../../../components/PillButton'

export default function CancionIntro({ cancion, onDone }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    setPlaying(true)
    const stopPlaying = () => setPlaying(false)
    // Playback can fail silently (autoplay policy blocking play(), or the audio
    // file 404ing / failing to load). If we only unstick `playing` on the
    // `ended` event, either of those leaves it stuck `true` forever, and since
    // "Continuar" is the only control on this screen the round becomes
    // unfinishable. So we also unstick on the play() rejection and on the
    // element's `error` event.
    audio.play().catch(stopPlaying)
    audio.addEventListener('ended', stopPlaying)
    audio.addEventListener('error', stopPlaying)

    // The spec calls for a 3-second clip; cap playback at 3s even if the
    // underlying audio file is longer, whichever comes first with `ended`.
    const capTimeout = setTimeout(() => {
      audio.pause()
      stopPlaying()
    }, 3000)

    return () => {
      audio.removeEventListener('ended', stopPlaying)
      audio.removeEventListener('error', stopPlaying)
      clearTimeout(capTimeout)
    }
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
