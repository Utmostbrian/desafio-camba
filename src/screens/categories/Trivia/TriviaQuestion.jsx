import { useEffect, useState } from 'react'
import TornCard from '../../../components/TornCard'
import ProgressTimerBar from '../../../components/ProgressTimerBar'
import TimeUpOverlay from '../../../components/TimeUpOverlay'
import { useCountdown } from '../../../hooks/useCountdown'

const QUESTION_SECONDS = 15
const OPTION_LETTERS = ['A', 'B', 'C', 'D']
const LONG_OPTION_THRESHOLD = 24 // chars; beyond this, font drops per spec

export default function TriviaQuestion({ question, questionIndex, total, onAnswered }) {
  const [answered, setAnswered] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  const { secondsLeft, start } = useCountdown(QUESTION_SECONDS, {
    onExpire: () => setTimeUp(true),
  })

  useEffect(() => {
    start()
  }, [start, question])

  const hasLongOptions = question.opciones.some((opt) => opt.length > LONG_OPTION_THRESHOLD)

  function handleSelect(index) {
    if (answered || timeUp) return
    setAnswered(true)
  }

  return (
    <div className="category-game">
      <TornCard>
        <p className="trivia-question__meta">Pregunta {questionIndex + 1} de {total}</p>
        <p className="category-game__prompt">{question.pregunta}</p>
        <div className={`trivia-question__options ${hasLongOptions ? 'trivia-question__options--long' : ''}`}>
          {question.opciones.map((opt, i) => (
            <button
              key={opt}
              className="trivia-question__option"
              onClick={() => handleSelect(i)}
              disabled={answered || timeUp}
            >
              <span className="trivia-question__letter">{OPTION_LETTERS[i]}</span>
              {opt}
            </button>
          ))}
        </div>
        <ProgressTimerBar totalSeconds={QUESTION_SECONDS} secondsLeft={secondsLeft} />
      </TornCard>
      <TimeUpOverlay visible={timeUp} onContinue={() => onAnswered()} continueLabel="Siguiente" />
      {answered && !timeUp && (
        <div className="trivia-question__reveal" role="status">
          Respuesta correcta: {question.opciones[question.correctaIndex]}
          <button className="trivia-question__next" onClick={() => onAnswered()}>Siguiente</button>
        </div>
      )}
    </div>
  )
}
