import './ProgressTimerBar.css'

export default function ProgressTimerBar({ totalSeconds, secondsLeft }) {
  const pct = totalSeconds > 0 ? Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100)) : 0
  return (
    <div className="progress-timer-bar" role="progressbar" aria-valuenow={secondsLeft} aria-valuemax={totalSeconds}>
      <div className="progress-timer-bar__fill" style={{ width: `${pct}%` }} />
    </div>
  )
}
