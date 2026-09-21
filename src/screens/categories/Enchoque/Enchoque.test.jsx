import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import EnchoqueCategory from './index'

describe('EnchoqueCategory', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows a 3:00 clock, counts down after Empezar, and reaches round end', () => {
    const onRoundComplete = vi.fn()
    render(<EnchoqueCategory onRoundComplete={onRoundComplete} />)

    expect(screen.getByText('3:00')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Empezar'))

    act(() => vi.advanceTimersByTime(180000))
    expect(screen.getByText('0:00')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Terminar ronda'))
    fireEvent.click(screen.getByText('Ir a la ruleta'))
    expect(onRoundComplete).toHaveBeenCalledOnce()
  })
})
