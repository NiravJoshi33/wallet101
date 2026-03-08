import { useState, useEffect, useRef } from 'react'

const HEX_CHARS = '0123456789abcdef'

function randomHexChar(): string {
  return HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]
}

export function useScrambleText(target: string, duration = 1500) {
  const [display, setDisplay] = useState('')
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!target) {
      setDisplay('')
      return
    }

    const startTime = Date.now()
    const len = target.length

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const resolvedCount = Math.floor(progress * len)

      let result = ''
      for (let i = 0; i < len; i++) {
        if (i < resolvedCount) {
          result += target[i]
        } else {
          result += randomHexChar()
        }
      }

      setDisplay(result)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return display
}
