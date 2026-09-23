import TornCard from './TornCard'
import PillButton from './PillButton'
import './RoundEndScreen.css'

export default function RoundEndScreen({
  message,
  title = '¡Mioj!',
  titleBold = 'Facilingo',
  subtitle = '¡Volvamos de una vez!',
  onBackToWheel,
}) {
  // `message` is a legacy override (used only by CategoryRouter's
  // defensive dev-stub fallback for an unknown category id) — it skips
  // the styled TornCard layout entirely and just prints the raw string.
  if (message) {
    return (
      <div className="round-end-screen round-end-screen--plain">
        <p>{message}</p>
        <PillButton label="Ir a la ruleta" onClick={onBackToWheel} />
      </div>
    )
  }

  return (
    <div className="round-end-screen">
      <div className="card-with-actions">
        <TornCard>
          <h2 className="round-end-screen__title">
            {title}
            <br />
            <span className="round-end-screen__title-bold">{titleBold}</span>
          </h2>
          <p className="round-end-screen__subtitle">{subtitle}</p>
        </TornCard>
        <PillButton label="Ir a la ruleta" onClick={onBackToWheel} />
      </div>
    </div>
  )
}
