import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import RoundEndScreen from './RoundEndScreen'

describe('RoundEndScreen', () => {
  it('renders the default message and triggers onBackToWheel', () => {
    const onBackToWheel = vi.fn()
    render(<RoundEndScreen onBackToWheel={onBackToWheel} />)
    expect(screen.getByText(/Facilingo/)).toBeInTheDocument()
    fireEvent.click(screen.getByText('Ir a la ruleta'))
    expect(onBackToWheel).toHaveBeenCalledOnce()
  })
})
