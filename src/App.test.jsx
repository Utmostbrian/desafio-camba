import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import App from './App'
import * as randomLib from './lib/random'
import categorias from './data/categorias.json'
import enchoqueConfig from './data/enchoque.json'

const CATEGORY_EXPECTED_TEXT = {
  'no-se-dice': 'se dice...',
  trivia: 'Cultura general!',
  'adivina-la-leyenda': 'Leyenda!',
  'escucha-la-cancion': 'continúa la canción',
  enchoque: enchoqueConfig.tituloLinea2,
  'menciona-3-lugares': 'lugares con la letra...',
}

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

    expect(screen.getByAltText('Desafío Camba!')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /tocar la pantalla/i }))

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
    fireEvent.click(screen.getByRole('button', { name: /tocar la pantalla/i }))
    fireEvent.click(screen.getByText('Iniciar'))
    act(() => vi.advanceTimersByTime(4000))

    // Each category's first screen renders its own, category-specific content
    // (not just "anything other than the stub text", which a blank screen
    // would also satisfy).
    expect(screen.getByText(CATEGORY_EXPECTED_TEXT[categoryId])).toBeInTheDocument()
    expect(screen.queryByText(/pendiente de implementar/)).not.toBeInTheDocument()
  })
})

describe('App - responsive scaling', () => {
  it('scales the stage down to fit a viewport smaller than 1440x1024', () => {
    const originalWidth = window.innerWidth
    const originalHeight = window.innerHeight
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 720 })
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 512 })

    const { container } = render(<App />)
    const stage = container.querySelector('.stage')
    const match = stage.style.transform.match(/scale\(([^)]+)\)/)

    expect(match).not.toBeNull()
    const scaleValue = Number(match[1])
    expect(scaleValue).toBeLessThan(1)
    expect(scaleValue).toBeGreaterThan(0)

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalWidth })
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalHeight })
  })
})
