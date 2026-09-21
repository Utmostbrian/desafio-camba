import './TornCard.css'

export default function TornCard({ children, className = '' }) {
  return (
    <div className={`torn-card ${className}`} data-testid="torn-card">
      {children}
    </div>
  )
}
