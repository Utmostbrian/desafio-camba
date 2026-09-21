import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import CancionCategory from './index'

beforeEach(() => {
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
  vi.useFakeTimers()
})
afterEach(() => vi.useRealTimers())

describe('CancionCategory', () => {
  it('goes intro (playing audio) -> answer -> time up -> round end', () => {
    const onRoundComplete = vi.fn()
    render(<CancionCategory onRoundComplete={onRoundComplete} />)

    expect(screen.getByTestId('cancion-audio')).toBeInTheDocument()
    // Simulate the clip ending so "Continuar" becomes enabled.
    fireEvent.ended(screen.getByTestId('cancion-audio'))
    fireEvent.click(screen.getByText('Continuar'))

    expect(screen.getByText('¿Apoco y te la sabes?')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(5000))
    expect(screen.getByText('¡Se acabó el Tiempo!')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Continuar'))
    fireEvent.click(screen.getByText('Ir a la ruleta'))
    expect(onRoundComplete).toHaveBeenCalledOnce()
  })

  it('"Repetir 3s" replays the clip from the start', () => {
    render(<CancionCategory onRoundComplete={() => {}} />)
    const playSpy = window.HTMLMediaElement.prototype.play

    fireEvent.ended(screen.getByTestId('cancion-audio'))
    expect(screen.getByText('Repetir 3s')).not.toBeDisabled()

    const initialCalls = playSpy.mock.calls.length
    fireEvent.click(screen.getByText('Repetir 3s'))

    expect(playSpy.mock.calls.length).toBeGreaterThan(initialCalls)
    expect(screen.getByText('Repetir 3s')).toBeDisabled()
    expect(screen.getByText('Continuar')).toBeDisabled()

    fireEvent.ended(screen.getByTestId('cancion-audio'))
    expect(screen.getByText('Repetir 3s')).not.toBeDisabled()
  })
})
