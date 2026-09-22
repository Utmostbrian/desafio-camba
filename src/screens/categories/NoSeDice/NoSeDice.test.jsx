import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import NoSeDiceCategory from './index'

describe('NoSeDiceCategory', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('goes intro -> game -> time up -> reveal -> round end -> onRoundComplete', () => {
    const onRoundComplete = vi.fn()
    render(<NoSeDiceCategory onRoundComplete={onRoundComplete} />)

    expect(screen.getByText('se dice...')).toBeInTheDocument()
    fireEvent.click(screen.getByText('¡Inicia!'))

    act(() => vi.advanceTimersByTime(10000))

    expect(screen.getByText('¡Se acabó el Tiempo!')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Continuar'))

    expect(screen.getByText(/^Se dice\.\.\. ¡/)).toBeInTheDocument()
    expect(screen.getByText('Ñiee, la sabias?')).toBeInTheDocument()
    fireEvent.click(screen.getByText('siguiente'))

    fireEvent.click(screen.getByText('Ir a la ruleta'))
    expect(onRoundComplete).toHaveBeenCalledOnce()
  })

  it('"Ya adivinó" shows the reveal screen too, not just the time-up path', () => {
    render(<NoSeDiceCategory onRoundComplete={() => {}} />)
    fireEvent.click(screen.getByText('¡Inicia!'))
    fireEvent.click(screen.getByText('Ya adivinó'))
    expect(screen.getByText(/^Se dice\.\.\. ¡/)).toBeInTheDocument()
  })
})
