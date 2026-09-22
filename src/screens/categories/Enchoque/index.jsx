import { useState } from 'react'
import EnchoqueIntro from './EnchoqueIntro'
import EnchoqueInstructions from './EnchoqueInstructions'
import EnchoqueTimer from './EnchoqueTimer'
import RoundEndScreen from '../../../components/RoundEndScreen'
import './Enchoque.css'

const STEPS = { INTRO: 'intro', INSTRUCTIONS: 'instructions', TIMER: 'timer', END: 'end' }

export default function EnchoqueCategory({ onRoundComplete }) {
  const [step, setStep] = useState(STEPS.INTRO)

  if (step === STEPS.INTRO) return <EnchoqueIntro onStart={() => setStep(STEPS.INSTRUCTIONS)} />
  if (step === STEPS.INSTRUCTIONS) return <EnchoqueInstructions onStart={() => setStep(STEPS.TIMER)} />
  if (step === STEPS.TIMER) return <EnchoqueTimer onFinished={() => setStep(STEPS.END)} />
  return <RoundEndScreen onBackToWheel={onRoundComplete} />
}
