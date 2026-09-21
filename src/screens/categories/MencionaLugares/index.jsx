import { useState } from 'react'
import MencionaLugaresIntro from './MencionaLugaresIntro'
import MencionaLugaresGame from './MencionaLugaresGame'
import RoundEndScreen from '../../../components/RoundEndScreen'
import './MencionaLugares.css'

const STEPS = { INTRO: 'intro', GAME: 'game', END: 'end' }

export default function MencionaLugaresCategory({ onRoundComplete }) {
  const [step, setStep] = useState(STEPS.INTRO)

  if (step === STEPS.INTRO) return <MencionaLugaresIntro onStart={() => setStep(STEPS.GAME)} />
  if (step === STEPS.GAME) return <MencionaLugaresGame onFinished={() => setStep(STEPS.END)} />
  return <RoundEndScreen onBackToWheel={onRoundComplete} />
}
