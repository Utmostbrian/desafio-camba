import portada from '../assets/portada.png'
import './SplashScreen.css'

export default function SplashScreen({ onContinue }) {
  return (
    <div className="splash-screen" onClick={onContinue} role="button" tabIndex={0}>
      <img src={portada} alt="Desafío Camba!" className="splash-screen__art" />
      <h1>Desafío Camba!</h1>
      <p>Tocar la pantalla para pasar a la siguiente</p>
    </div>
  )
}
