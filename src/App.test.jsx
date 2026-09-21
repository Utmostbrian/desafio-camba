import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('goes splash -> wheel -> category stub -> back to wheel', () => {
    render(<App />)

    expect(screen.getByText('Desafío Camba!')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Desafío Camba!'))

    expect(screen.getByText('Iniciar')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Iniciar'))
    act(() => vi.advanceTimersByTime(4000))

    expect(screen.getByText(/pendiente de implementar/)).toBeInTheDocument()
    fireEvent.click(screen.getByText('Ir a la ruleta'))

    expect(screen.getByText('Iniciar')).toBeInTheDocument()
  })
})
