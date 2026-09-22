import { useState } from 'react'
import LeyendaTitle from './LeyendaTitle'
import LeyendaInstructions from './LeyendaInstructions'
import LeyendaGame from './LeyendaGame'
import RoundEndScreen from '../../../components/RoundEndScreen'
import './AdivinaLeyenda.css'

const STEPS = { TITLE: 'title', INSTRUCTIONS: 'instructions', GAME: 'game', END: 'end' }

export default function LeyendaCategory({ onRoundComplete }) {
  const [step, setStep] = useState(STEPS.TITLE)

  if (step === STEPS.TITLE) return <LeyendaTitle onStart={() => setStep(STEPS.INSTRUCTIONS)} />
  if (step === STEPS.INSTRUCTIONS) return <LeyendaInstructions onStart={() => setStep(STEPS.GAME)} />
  if (step === STEPS.GAME) return <LeyendaGame onFinished={() => setStep(STEPS.END)} />
  return <RoundEndScreen onBackToWheel={onRoundComplete} />
}
