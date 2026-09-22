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

  it('"Iniciar" does nothing until the wheel has landed on a category', () => {
    const onCategorySelected = vi.fn()
    render(<WheelScreen onCategorySelected={onCategorySelected} />)

    expect(screen.getByText('Iniciar')).toBeDisabled()
    fireEvent.click(screen.getByText('Iniciar'))
    expect(onCategorySelected).not.toHaveBeenCalled()
  })

  it('spinning the hub lands on a category, then "Iniciar" accepts it', () => {
    const onCategorySelected = vi.fn()
    render(<WheelScreen onCategorySelected={onCategorySelected} />)

    fireEvent.click(screen.getByLabelText('Girar la ruleta'))
    act(() => vi.advanceTimersByTime(4000))
    expect(onCategorySelected).not.toHaveBeenCalled()
    expect(screen.getByText('Iniciar')).not.toBeDisabled()

    fireEvent.click(screen.getByText('Iniciar'))
    expect(onCategorySelected).toHaveBeenCalledOnce()
    const calledWith = onCategorySelected.mock.calls[0][0]
    expect(typeof calledWith).toBe('string')
  })

  it('"volver a girar" re-spins without accepting the previous selection', () => {
    const onCategorySelected = vi.fn()
    render(<WheelScreen onCategorySelected={onCategorySelected} />)

    fireEvent.click(screen.getByLabelText('Girar la ruleta'))
    act(() => vi.advanceTimersByTime(4000))
    fireEvent.click(screen.getByText('volver a girar'))
    expect(screen.getByText('Iniciar')).toBeDisabled()
    expect(onCategorySelected).not.toHaveBeenCalled()
  })
})
