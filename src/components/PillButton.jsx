import './PillButton.css'

export default function PillButton({ label, onClick, variant = 'primary', disabled = false, className = '' }) {
  return (
    <button
      className={`pill-button pill-button--${variant} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
