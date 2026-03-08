import { useState, useCallback } from 'react'
import type { KeyboardInteractionEvent } from '@/components/ui/keyboard'

const CODE_TO_CHAR: Record<string, string> = {
  KeyA: 'a', KeyB: 'b', KeyC: 'c', KeyD: 'd', KeyE: 'e',
  KeyF: 'f', KeyG: 'g', KeyH: 'h', KeyI: 'i', KeyJ: 'j',
  KeyK: 'k', KeyL: 'l', KeyM: 'm', KeyN: 'n', KeyO: 'o',
  KeyP: 'p', KeyQ: 'q', KeyR: 'r', KeyS: 's', KeyT: 't',
  KeyU: 'u', KeyV: 'v', KeyW: 'w', KeyX: 'x', KeyY: 'y',
  KeyZ: 'z', Space: ' ',
}

interface UseKeyboardInputOptions {
  onSubmit?: (text: string) => void
  onBackspace?: () => void
}

export function useKeyboardInput(options: UseKeyboardInputOptions = {}) {
  const [currentText, setCurrentText] = useState('')

  const handleKeyEvent = useCallback(
    (event: KeyboardInteractionEvent) => {
      if (event.phase !== 'down') return

      const { code } = event

      if (code === 'Enter') {
        options.onSubmit?.(currentText)
        return
      }

      if (code === 'Backspace') {
        setCurrentText((prev) => {
          if (prev.length === 0) {
            options.onBackspace?.()
            return prev
          }
          return prev.slice(0, -1)
        })
        return
      }

      const char = CODE_TO_CHAR[code]
      if (char) {
        setCurrentText((prev) => prev + char)
      }
    },
    [currentText, options]
  )

  const clear = useCallback(() => {
    setCurrentText('')
  }, [])

  const submit = useCallback((): string => {
    const text = currentText
    setCurrentText('')
    return text
  }, [currentText])

  return { currentText, setCurrentText, handleKeyEvent, clear, submit }
}
