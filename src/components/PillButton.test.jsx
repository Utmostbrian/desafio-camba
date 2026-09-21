import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PillButton from './PillButton'

describe('PillButton', () => {
  it('renders the label and calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<PillButton label="¡Inicia!" onClick={onClick} />)
    fireEvent.click(screen.getByText('¡Inicia!'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn()
    render(<PillButton label="¡Inicia!" onClick={onClick} disabled />)
    fireEvent.click(screen.getByText('¡Inicia!'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
