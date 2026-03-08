import { useState, useCallback, useRef, useEffect } from 'react'

interface UseCountdownOptions {
  duration: number
  onExpire?: () => void
}

export function useCountdown({ duration, onExpire }: UseCountdownOptions) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const startTimeRef = useRef<number>(0)
  const rafRef = useRef<number>(0)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  const tick = useCallback(() => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000
    const remaining = Math.max(0, duration - elapsed)
    setTimeLeft(remaining)

    if (remaining <= 0) {
      setIsRunning(false)
      onExpireRef.current?.()
      return
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [duration])

  const start = useCallback(() => {
    startTimeRef.current = Date.now()
    setIsRunning(true)
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  const pause = useCallback(() => {
    setIsRunning(false)
    cancelAnimationFrame(rafRef.current)
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    cancelAnimationFrame(rafRef.current)
    setTimeLeft(duration)
  }, [duration])

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const progress = timeLeft / duration

  return { timeLeft, progress, isRunning, isExpired: timeLeft <= 0, start, pause, reset }
}
