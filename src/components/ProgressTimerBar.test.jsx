import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProgressTimerBar from './ProgressTimerBar'

describe('ProgressTimerBar', () => {
  it('sets width proportional to secondsLeft/totalSeconds', () => {
    render(<ProgressTimerBar totalSeconds={10} secondsLeft={5} />)
    const bar = screen.getByRole('progressbar')
    expect(bar.firstChild).toHaveStyle({ width: '50%' })
  })

  it('clamps width at 0% when secondsLeft is 0', () => {
    render(<ProgressTimerBar totalSeconds={10} secondsLeft={0} />)
    expect(screen.getByRole('progressbar').firstChild).toHaveStyle({ width: '0%' })
  })
})
