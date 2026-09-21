import { useState, useRef, useCallback, useEffect } from 'react'

export function useCountdown(totalSeconds, { onExpire } = {}) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    clear()
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clear()
          setIsRunning(false)
          onExpire?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [clear, onExpire])

  const reset = useCallback(() => {
    clear()
    setIsRunning(false)
    setSecondsLeft(totalSeconds)
  }, [clear, totalSeconds])

  useEffect(() => clear, [clear])

  return { secondsLeft, isRunning, start, reset }
}
