import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import LeyendaCategory from './index'

describe('LeyendaCategory', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('goes instructions -> game (shows a real legend image) -> time up -> round end', () => {
    const onRoundComplete = vi.fn()
    render(<LeyendaCategory onRoundComplete={onRoundComplete} />)

    fireEvent.click(screen.getByText('¡Inicia!'))
    const img = screen.getByRole('img')
    expect(img.getAttribute('src')).toBeTruthy()

    act(() => vi.advanceTimersByTime(35000))
    expect(screen.getByText('¡Se acabó el Tiempo!')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Continuar'))

    fireEvent.click(screen.getByText('Ir a la ruleta'))
    expect(onRoundComplete).toHaveBeenCalledOnce()
  })
})
