import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import TriviaCategory from './index'

describe('TriviaCategory', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('asks exactly 5 questions then reaches round end', () => {
    const onRoundComplete = vi.fn()
    render(<TriviaCategory onRoundComplete={onRoundComplete} />)

    expect(screen.getByText('Cultura general!')).toBeInTheDocument()
    fireEvent.click(screen.getByText('¡Inicia!'))
    fireEvent.click(screen.getByText('¡Inicia!'))
    expect(screen.getByText('Pregunta 1 de 5')).toBeInTheDocument()

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(`Pregunta ${i} de 5`)).toBeInTheDocument()

      // Each question must mount fresh: all 4 options enabled, countdown back
      // at 15, and no leftover reveal text from the previous question.
      const options = screen.getAllByRole('button').filter((b) => b.className.includes('trivia-question__option'))
      expect(options).toHaveLength(4)
      options.forEach((opt) => expect(opt).not.toBeDisabled())

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '15')

      expect(screen.queryByText(/^Respuesta correcta:/)).not.toBeInTheDocument()

      fireEvent.click(options[0])
      const next = screen.getAllByText('Siguiente')[0]
      fireEvent.click(next)
    }

    expect(onRoundComplete).not.toHaveBeenCalled() // still needs a manual click on Ir a la ruleta
    fireEvent.click(screen.getByText('Ir a la ruleta'))
    expect(onRoundComplete).toHaveBeenCalledOnce()
  })

  it('shows the time-up overlay when the 15s countdown expires', () => {
    render(<TriviaCategory onRoundComplete={() => {}} />)
    fireEvent.click(screen.getByText('¡Inicia!'))
    fireEvent.click(screen.getByText('¡Inicia!'))
    act(() => vi.advanceTimersByTime(15000))
    expect(screen.getByText('¡Se acabó el Tiempo!')).toBeInTheDocument()
  })
})
