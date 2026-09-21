import { useState } from 'react'
import TriviaInstructions from './TriviaInstructions'
import TriviaQuestion from './TriviaQuestion'
import RoundEndScreen from '../../../components/RoundEndScreen'
import { pickRandomN } from '../../../lib/random'
import bank from '../../../data/trivia.json'
import './Trivia.css'

const QUESTIONS_PER_ROUND = 5
const STEPS = { INSTRUCTIONS: 'instructions', QUESTIONS: 'questions', END: 'end' }

export default function TriviaCategory({ onRoundComplete }) {
  const [step, setStep] = useState(STEPS.INSTRUCTIONS)
  const [questions] = useState(() => pickRandomN(bank, QUESTIONS_PER_ROUND))
  const [index, setIndex] = useState(0)

  if (step === STEPS.INSTRUCTIONS) {
    return <TriviaInstructions onStart={() => setStep(STEPS.QUESTIONS)} />
  }

  if (step === STEPS.QUESTIONS) {
    return (
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
  }

  return <RoundEndScreen onBackToWheel={onRoundComplete} />
}
