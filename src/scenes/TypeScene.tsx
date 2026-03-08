import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SceneWrapper } from '@/components/layout/SceneWrapper'
import { Button } from '@/components/ui/button'
import { WordSlots, type SlotStatus } from '@/components/shared/WordSlots'
import { BIP39Autocomplete } from '@/components/shared/BIP39Autocomplete'
import { KeybWrapper } from '@/components/keyboard/KeybWrapper'
import { useGame } from '@/context/GameContext'
import { useKeyboardInput } from '@/hooks/useKeyboardInput'

export function TypeScene() {
  const navigate = useNavigate()
  const { userInput, setUserWord, checkAnswer, incrementAttempts, stopTimer } = useGame()
  const [activeIndex, setActiveIndex] = useState(0)
  const [statuses, setStatuses] = useState<SlotStatus[]>(Array(12).fill('empty'))
  const [showAutocomplete, setShowAutocomplete] = useState(false)

  const allFilled = userInput.every((w) => w.length > 0)

  const commitWord = useCallback(
    (word: string) => {
      const trimmed = word.trim().toLowerCase()
      if (!trimmed || activeIndex >= 12) return

      setUserWord(activeIndex, trimmed)

      const newStatuses = [...statuses]
      newStatuses[activeIndex] = 'correct' // We don't reveal correctness yet
      setStatuses(newStatuses)

      clear()
      setShowAutocomplete(false)

      if (activeIndex < 11) {
        setActiveIndex((prev) => prev + 1)
        const nextStatuses = [...newStatuses]
        nextStatuses[activeIndex + 1] = 'typing'
        setStatuses(nextStatuses)
      }
    },
    [activeIndex, statuses, setUserWord]
  )

  const handleSubmit = useCallback(
    (text: string) => {
      if (text.trim()) {
        commitWord(text)
      }
    },
    [commitWord]
  )

  const handleBackspace = useCallback(() => {
    if (activeIndex > 0) {
      const newStatuses = [...statuses]
      newStatuses[activeIndex] = 'empty'
      newStatuses[activeIndex - 1] = 'typing'
      setStatuses(newStatuses)
      setUserWord(activeIndex - 1, '')
      setActiveIndex((prev) => prev - 1)
    }
  }, [activeIndex, statuses, setUserWord])

  const { currentText, handleKeyEvent, clear } = useKeyboardInput({
    onSubmit: handleSubmit,
    onBackspace: handleBackspace,
  })

  // Show autocomplete while typing
  const handleKeyEventWrapped = useCallback(
    (event: Parameters<typeof handleKeyEvent>[0]) => {
      handleKeyEvent(event)
      if (event.phase === 'down') {
        setShowAutocomplete(true)
      }
    },
    [handleKeyEvent]
  )

  const handleCheck = () => {
    stopTimer()
    incrementAttempts()
    const correct = checkAnswer()
    navigate(correct ? '/win' : '/fail')
  }

  // Set first slot to typing
  if (statuses[0] === 'empty' && activeIndex === 0) {
    const newStatuses = [...statuses]
    newStatuses[0] = 'typing'
    setStatuses(newStatuses)
  }

  return (
    <SceneWrapper
      className="gap-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-2"
      >
        <h2 className="text-lg font-semibold tracking-tight">
          <span className="text-danger">04</span>{' '}
          <span className="text-text-secondary">Type Your Seed Phrase</span>
        </h2>
        <p className="text-text-muted text-sm max-w-md">
          Type all 12 words from memory. Get them all right to prove your wallet is safe.
        </p>
      </motion.div>

      {/* Word slots with autocomplete */}
      <div
        className="relative"
        onPaste={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
      >
        <WordSlots
          words={userInput}
          activeIndex={activeIndex}
          currentTyping={currentText}
          statuses={statuses}
        />

        {/* Autocomplete overlay */}
        <div className="absolute left-0 right-0" style={{ top: `${Math.floor(activeIndex / 3) * 52 + 48}px` }}>
          <BIP39Autocomplete
            prefix={currentText}
            onSelect={commitWord}
            visible={showAutocomplete && currentText.length >= 1}
          />
        </div>
      </div>

      {/* Submit */}
      {allFilled && (
        <Button size="lg" onClick={handleCheck}>
          Check Answer
        </Button>
      )}

      {/* Keyboard */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="hidden md:block"
      >
        <KeybWrapper onKeyEvent={handleKeyEventWrapped} />
      </motion.div>

      <p className="md:hidden text-text-muted text-xs font-mono">
        Use your keyboard to type each word, then press Enter
      </p>
    </SceneWrapper>
  )
}
