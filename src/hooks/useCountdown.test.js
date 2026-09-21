import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useCountdown } from './useCountdown'

describe('useCountdown', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('counts down from the given total and calls onExpire at zero', () => {
    const onExpire = vi.fn()
    const { result } = renderHook(() => useCountdown(3, { onExpire }))

    act(() => result.current.start())
    expect(result.current.secondsLeft).toBe(3)

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.secondsLeft).toBe(2)

    act(() => vi.advanceTimersByTime(2000))
    expect(result.current.secondsLeft).toBe(0)
    expect(onExpire).toHaveBeenCalledOnce()
  })

  it('reset restores the total and stops the timer', () => {
    const { result } = renderHook(() => useCountdown(5, {}))
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(2000))
    act(() => result.current.reset())
    expect(result.current.secondsLeft).toBe(5)
    expect(result.current.isRunning).toBe(false)
  })
})
