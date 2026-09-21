import { useState } from 'react'
import EnchoqueTimer from './EnchoqueTimer'
import RoundEndScreen from '../../../components/RoundEndScreen'
import './Enchoque.css'

const STEPS = { TIMER: 'timer', END: 'end' }

export default function EnchoqueCategory({ onRoundComplete }) {
  const [step, setStep] = useState(STEPS.TIMER)

  if (step === STEPS.TIMER) return <EnchoqueTimer onFinished={() => setStep(STEPS.END)} />
  return <RoundEndScreen onBackToWheel={onRoundComplete} />
}
