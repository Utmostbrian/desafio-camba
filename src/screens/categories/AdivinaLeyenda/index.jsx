import { useState } from 'react'
import LeyendaInstructions from './LeyendaInstructions'
import LeyendaGame from './LeyendaGame'
import RoundEndScreen from '../../../components/RoundEndScreen'
import './AdivinaLeyenda.css'

const STEPS = { INSTRUCTIONS: 'instructions', GAME: 'game', END: 'end' }

export default function LeyendaCategory({ onRoundComplete }) {
  const [step, setStep] = useState(STEPS.INSTRUCTIONS)

  if (step === STEPS.INSTRUCTIONS) return <LeyendaInstructions onStart={() => setStep(STEPS.GAME)} />
  if (step === STEPS.GAME) return <LeyendaGame onFinished={() => setStep(STEPS.END)} />
  return <RoundEndScreen onBackToWheel={onRoundComplete} />
}
