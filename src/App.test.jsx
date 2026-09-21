import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import App from './App'
import * as randomLib from './lib/random'
import categorias from './data/categorias.json'

describe('App', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('goes splash -> wheel -> category -> back to wheel', () => {
    vi.spyOn(randomLib, 'pickRandom').mockReturnValue(categorias[0])
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)

    render(<App />)

    expect(screen.getByText('Desafío Camba!')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Desafío Camba!'))

    expect(screen.getByText('Iniciar')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Iniciar'))
    act(() => vi.advanceTimersByTime(4000))

    expect(screen.queryByText(/pendiente de implementar/)).not.toBeInTheDocument()
  })
})

describe('App - all categories reachable from the wheel', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it.each(categorias.map((c) => c.id))('reaches category "%s" from the wheel and returns to it', (categoryId) => {
    vi.spyOn(randomLib, 'pickRandom').mockReturnValue(categorias.find((c) => c.id === categoryId))
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)

    render(<App />)
    fireEvent.click(screen.getByText('Desafío Camba!'))
    fireEvent.click(screen.getByText('Iniciar'))
    act(() => vi.advanceTimersByTime(4000))

    // Each category's first screen renders something other than the generic stub text.
    expect(screen.queryByText(/pendiente de implementar/)).not.toBeInTheDocument()
  })
})
