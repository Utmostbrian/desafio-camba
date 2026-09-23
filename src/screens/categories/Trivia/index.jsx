import { useEffect, useRef, useState } from 'react'
import TriviaTitle from './TriviaTitle'
import TriviaInstructions from './TriviaInstructions'
import TriviaQuestion from './TriviaQuestion'
import RoundEndScreen from '../../../components/RoundEndScreen'
import { pickRandomN } from '../../../lib/random'
import { pauseBackgroundMusic, playBackgroundMusic } from '../../../lib/backgroundMusic'
import bank from '../../../data/trivia.json'
import './Trivia.css'

const QUESTIONS_PER_ROUND = 5
const STEPS = { TITLE: 'title', INSTRUCTIONS: 'instructions', QUESTIONS: 'questions', END: 'end' }

export default function TriviaCategory({ onRoundComplete }) {
  const [step, setStep] = useState(STEPS.TITLE)
  const [questions] = useState(() => pickRandomN(bank, QUESTIONS_PER_ROUND))
  const [index, setIndex] = useState(0)
  const countdownRef = useRef(null)

  // The suspense countdown track plays for the whole questions phase (all
  // 5 questions), not per-question — it must not restart every time the
  // question index changes, only when entering/leaving STEPS.QUESTIONS.
  useEffect(() => {
    if (step !== STEPS.QUESTIONS) return
    const audio = countdownRef.current
    pauseBackgroundMusic()
    audio.currentTime = 0
    audio.play().catch(() => {})

    return () => {
      audio.pause()
      playBackgroundMusic()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step === STEPS.QUESTIONS])

  let screen
  if (step === STEPS.TITLE) {
    screen = <TriviaTitle onStart={() => setStep(STEPS.INSTRUCTIONS)} />
  } else if (step === STEPS.INSTRUCTIONS) {
    screen = <TriviaInstructions onStart={() => setStep(STEPS.QUESTIONS)} />
  } else if (step === STEPS.QUESTIONS) {
    screen = (
      <TriviaQuestion
        key={questions[index].id ?? index}
        question={questions[index]}
        questionIndex={index}
        total={questions.length}
        onAnswered={() => {
          if (index + 1 < questions.length) {
            setIndex(index + 1)
          } else {
            setStep(STEPS.END)
          }
        }}
      />
    )
  } else {
    screen = <RoundEndScreen onBackToWheel={onRoundComplete} />
  }

  return (
    <>
      {screen}
      <audio ref={countdownRef} src="/audio/trivia-countdown.mp3" loop data-testid="trivia-countdown-audio" />
    </>
  )
}
