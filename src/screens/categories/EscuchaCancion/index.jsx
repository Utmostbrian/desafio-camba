import { useState } from 'react'
import CancionTitle from './CancionTitle'
import CancionIntro from './CancionIntro'
import CancionAnswer from './CancionAnswer'
import RoundEndScreen from '../../../components/RoundEndScreen'
import { pickRandom } from '../../../lib/random'
import canciones from '../../../data/canciones.json'
import './EscuchaCancion.css'

const STEPS = { TITLE: 'title', INTRO: 'intro', ANSWER: 'answer', END: 'end' }

export default function CancionCategory({ onRoundComplete }) {
  const [cancion] = useState(() => pickRandom(canciones))
  const [step, setStep] = useState(STEPS.TITLE)

  if (step === STEPS.TITLE) {
    return <CancionTitle onStart={() => setStep(STEPS.INTRO)} />
  }
  if (step === STEPS.INTRO) {
    return <CancionIntro cancion={cancion} onDone={() => setStep(STEPS.ANSWER)} />
  }
  if (step === STEPS.ANSWER) {
    return <CancionAnswer cancion={cancion} onFinished={() => setStep(STEPS.END)} />
  }
  return <RoundEndScreen onBackToWheel={onRoundComplete} />
}
