import portada from '../assets/portada.png'
import logo from '../assets/logo-desafio-camba.svg'
import './SplashScreen.css'

export default function SplashScreen({ onContinue }) {
  return (
    <div className="splash-screen" onClick={onContinue} role="button" tabIndex={0}>
      <img className="splash-screen__logo" src={logo} alt="Desafío Camba!" />
      <img className="splash-screen__art" src={portada} alt="" aria-hidden="true" />
      <p className="splash-screen__hint">Tocar la pantalla para pasar a la siguiente</p>
    </div>
  )
}
