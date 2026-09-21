import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TimeUpOverlay from './TimeUpOverlay'

describe('TimeUpOverlay', () => {
  it('renders nothing when visible is false', () => {
    const { container } = render(<TimeUpOverlay visible={false} onContinue={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the message and calls onContinue when visible', () => {
    const onContinue = vi.fn()
    render(<TimeUpOverlay visible onContinue={onContinue} />)
    expect(screen.getByText('¡Se acabó el Tiempo!')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Continuar'))
    expect(onContinue).toHaveBeenCalledOnce()
  })
})
