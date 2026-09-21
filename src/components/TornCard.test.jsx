import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TornCard from './TornCard'

describe('TornCard', () => {
  it('renders children inside the card', () => {
    render(<TornCard>Hola camba</TornCard>)
    expect(screen.getByTestId('torn-card')).toHaveTextContent('Hola camba')
  })
})
