import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import WheelScreen from './WheelScreen'

describe('WheelScreen', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows the "Iniciar" button before spinning', () => {
    render(<WheelScreen onCategorySelected={() => {}} />)
    expect(screen.getByText('Iniciar')).toBeInTheDocument()
  })

  it('spins and calls onCategorySelected with a valid category id after the animation', () => {
    const onCategorySelected = vi.fn()
    render(<WheelScreen onCategorySelected={onCategorySelected} />)

    fireEvent.click(screen.getByText('Iniciar'))
    act(() => vi.advanceTimersByTime(4000))

    expect(onCategorySelected).toHaveBeenCalledOnce()
    const calledWith = onCategorySelected.mock.calls[0][0]
    expect(typeof calledWith).toBe('string')
  })
})
