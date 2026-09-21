import { useState } from 'react'
import NoSeDiceIntro from './NoSeDiceIntro'
import NoSeDiceGame from './NoSeDiceGame'
import RoundEndScreen from '../../../components/RoundEndScreen'
import './NoSeDice.css'

const STEPS = { INTRO: 'intro', GAME: 'game', END: 'end' }

export default function NoSeDiceCategory({ onRoundComplete }) {
  const [step, setStep] = useState(STEPS.INTRO)

  if (step === STEPS.INTRO) return <NoSeDiceIntro onStart={() => setStep(STEPS.GAME)} />
  if (step === STEPS.GAME) return <NoSeDiceGame onFinished={() => setStep(STEPS.END)} />
  return <RoundEndScreen onBackToWheel={onRoundComplete} />
}
