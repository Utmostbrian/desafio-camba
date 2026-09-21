import PillButton from './PillButton'
import './RoundEndScreen.css'

export default function RoundEndScreen({
  message = '¡Mioj! Facilingo — ¡Volvamos de una vez!',
  onBackToWheel,
}) {
  return (
    <div className="round-end-screen">
      <p>{message}</p>
      <PillButton label="Ir a la ruleta" onClick={onBackToWheel} />
    </div>
  )
}
