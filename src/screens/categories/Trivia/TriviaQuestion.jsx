import { useEffect, useState } from 'react'
import TornCard from '../../../components/TornCard'
import ProgressTimerBar from '../../../components/ProgressTimerBar'
import TimeUpOverlay from '../../../components/TimeUpOverlay'
import PillButton from '../../../components/PillButton'
import { useCountdown } from '../../../hooks/useCountdown'

const QUESTION_SECONDS = 15
const OPTION_LETTERS = ['A', 'B', 'C', 'D']
const LONG_OPTION_THRESHOLD = 24 // chars; beyond this, font drops per spec

export default function TriviaQuestion({ question, questionIndex, total, onAnswered }) {
  const [answered, setAnswered] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [timeUp, setTimeUp] = useState(false)
  const [showTimeUpReveal, setShowTimeUpReveal] = useState(false)
  const { secondsLeft, start } = useCountdown(QUESTION_SECONDS, {
    onExpire: () => setTimeUp(true),
  })

  useEffect(() => {
    start()
  }, [start, question])

  const hasLongOptions = question.opciones.some((opt) => opt.length > LONG_OPTION_THRESHOLD)

  function handleSelect(index) {
    if (answered || timeUp) return
    setSelectedIndex(index)
    setAnswered(true)
  }

  function optionStateClass(index) {
    if (!answered) return ''
    if (index === question.correctaIndex) return 'trivia-question__option--correct'
    if (index === selectedIndex) return 'trivia-question__option--wrong'
    return ''
  }

  // When the clock runs out, the black "¡Se acabó el Tiempo!" overlay shows
  // first (same as every other category); dismissing it here reveals the
  // correct answer as its own screen, matching the real design, instead of
  // jumping straight to the next question.
  if (showTimeUpReveal) {
    return (
      <div className="category-game">
        <TornCard>
          <p className="category-game__prompt">{question.pregunta}</p>
          <div className="trivia-question__correct-pill">
            <span className="trivia-question__letter">{OPTION_LETTERS[question.correctaIndex]}</span>
            {question.opciones[question.correctaIndex]}
          </div>
          <p className="trivia-question__facilingo">Facilingo verdad?</p>
          <PillButton label="Continuar" onClick={() => onAnswered()} />
        </TornCard>
      </div>
    )
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
              className={`trivia-question__option ${optionStateClass(i)}`}
              onClick={() => handleSelect(i)}
              disabled={answered || timeUp}
            >
              <span className="trivia-question__letter">{OPTION_LETTERS[i]}</span>
              {opt}
              {answered && i === question.correctaIndex && (
                <span className="trivia-question__check" aria-hidden="true">✓</span>
              )}
            </button>
          ))}
        </div>
        <ProgressTimerBar totalSeconds={QUESTION_SECONDS} secondsLeft={secondsLeft} />
        {answered && !timeUp && (
          <div className="trivia-question__reveal" role="status">
            <p>Respuesta correcta: {question.opciones[question.correctaIndex]}</p>
            <PillButton label="Siguiente" onClick={() => onAnswered()} />
          </div>
        )}
      </TornCard>
      <TimeUpOverlay
        visible={timeUp}
        onContinue={() => setShowTimeUpReveal(true)}
        continueLabel="Siguiente"
      />
    </div>
  )
}
