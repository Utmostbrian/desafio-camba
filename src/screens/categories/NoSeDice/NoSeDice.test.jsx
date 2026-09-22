import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import NoSeDiceCategory from './index'

describe('NoSeDiceCategory', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('goes intro -> game -> time up -> round end -> onRoundComplete', () => {
    const onRoundComplete = vi.fn()
    render(<NoSeDiceCategory onRoundComplete={onRoundComplete} />)

    expect(screen.getByText('se dice...')).toBeInTheDocument()
    fireEvent.click(screen.getByText('¡Inicia!'))

    act(() => vi.advanceTimersByTime(10000))

    expect(screen.getByText('¡Se acabó el Tiempo!')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Continuar'))

    fireEvent.click(screen.getByText('Ir a la ruleta'))
    expect(onRoundComplete).toHaveBeenCalledOnce()
  })
})
