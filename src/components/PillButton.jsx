import './PillButton.css'

export default function PillButton({ label, onClick, variant = 'primary', disabled = false }) {
  return (
    <button
      className={`pill-button pill-button--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
