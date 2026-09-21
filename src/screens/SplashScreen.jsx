import { useEffect } from 'react'
import portada from '../assets/portada.png'
import logo from '../assets/logo-desafio-camba.svg'
import { playBackgroundMusic } from '../lib/backgroundMusic'
import './SplashScreen.css'

export default function SplashScreen({ onContinue }) {
  useEffect(() => {
    // Best-effort: most browsers block audio before any user gesture, so
    // this silently no-ops until the tap below (or a browser that happens
    // to allow autoplay) actually starts it — see backgroundMusic.js.
    playBackgroundMusic()
  }, [])

  return (
    <div className="splash-screen" onClick={onContinue} role="button" tabIndex={0}>
      <img className="splash-screen__logo" src={logo} alt="Desafío Camba!" />
      <img className="splash-screen__art" src={portada} alt="" aria-hidden="true" />
      <p className="splash-screen__hint">Tocar la pantalla para pasar a la siguiente</p>
    </div>
  )
}
