import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import MencionaLugaresCategory from './index'

describe('MencionaLugaresCategory', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('goes intro -> game (shows a single letter) -> time up -> round end', () => {
    const onRoundComplete = vi.fn()
    render(<MencionaLugaresCategory onRoundComplete={onRoundComplete} />)

    expect(screen.getByText('Menciona 3 lugares con la letra...')).toBeInTheDocument()
    fireEvent.click(screen.getByText('¡Inicia!'))

    const letra = screen.getByText(/^[A-ZÑ]$/)
    expect(letra).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(15000))
    expect(screen.getByText('¡Se acabó el Tiempo!')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Continuar'))

    fireEvent.click(screen.getByText('Ir a la ruleta'))
    expect(onRoundComplete).toHaveBeenCalledOnce()
  })

  it('"Ya terminé" finishes the round immediately without showing the time-up overlay', () => {
    const onRoundComplete = vi.fn()
    render(<MencionaLugaresCategory onRoundComplete={onRoundComplete} />)

    fireEvent.click(screen.getByText('¡Inicia!'))
    fireEvent.click(screen.getByText('Ya terminé'))

    expect(screen.queryByText('¡Se acabó el Tiempo!')).not.toBeInTheDocument()
    expect(screen.getByText('Ir a la ruleta')).toBeInTheDocument()
  })
})
