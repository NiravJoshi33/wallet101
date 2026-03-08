import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SceneWrapper } from '@/components/layout/SceneWrapper'
import { ProgressBar } from '@/components/layout/ProgressBar'
import { SeedCard } from '@/components/shared/SeedCard'
import { WordSlots, type SlotStatus } from '@/components/shared/WordSlots'
import { KeybWrapper } from '@/components/keyboard/KeybWrapper'
import { useGame } from '@/context/GameContext'
import { useKeyboardInput } from '@/hooks/useKeyboardInput'

export function Module1Scene() {
  const navigate = useNavigate()
  const { seedPhrase } = useGame()
  const [activeIndex, setActiveIndex] = useState(0)
  const [statuses, setStatuses] = useState<SlotStatus[]>(Array(12).fill('empty'))
  const [filledWords, setFilledWords] = useState<string[]>(Array(12).fill(''))
  const [revealUpTo, setRevealUpTo] = useState(0)

  // Reveal words one at a time with a delay
  useEffect(() => {
    if (revealUpTo >= 12 || seedPhrase.length === 0) return

    const timer = setTimeout(() => {
      setRevealUpTo((prev) => Math.min(prev + 1, 12))
    }, revealUpTo === 0 ? 300 : 150)

    return () => clearTimeout(timer)
  }, [revealUpTo, seedPhrase])

  const handleSubmit = useCallback(
    (text: string) => {
      if (activeIndex >= 12) return
      const trimmed = text.trim().toLowerCase()
      if (!trimmed) return

      if (trimmed === seedPhrase[activeIndex]) {
        const newStatuses = [...statuses]
        newStatuses[activeIndex] = 'correct'
        setStatuses(newStatuses)

        const newWords = [...filledWords]
        newWords[activeIndex] = trimmed
        setFilledWords(newWords)

        clear()

        if (activeIndex === 11) {
          setTimeout(() => navigate('/module2'), 600)
        } else {
          setTimeout(() => {
            setActiveIndex((prev) => prev + 1)
            const nextStatuses = [...newStatuses]
            nextStatuses[activeIndex + 1] = 'typing'
            setStatuses(nextStatuses)
          }, 400)
        }
      } else {
        const newStatuses = [...statuses]
        newStatuses[activeIndex] = 'incorrect'
        setStatuses(newStatuses)

        setTimeout(() => {
          const resetStatuses = [...newStatuses]
          resetStatuses[activeIndex] = 'typing'
          setStatuses(resetStatuses)
          clear()
        }, 600)
      }
    },
    [activeIndex, seedPhrase, statuses, filledWords, navigate]
  )

  const { currentText, handleKeyEvent, clear } = useKeyboardInput({
    onSubmit: handleSubmit,
  })

  // Set first slot to typing once seed is ready
  useEffect(() => {
    if (seedPhrase.length > 0 && statuses[0] === 'empty') {
      const newStatuses = [...statuses]
      newStatuses[0] = 'typing'
      setStatuses(newStatuses)
    }
  }, [seedPhrase, statuses])

  return (
    <SceneWrapper className="gap-6">
      {/* Header */}
      <div className="w-full max-w-lg space-y-3">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between"
        >
          <h2 className="text-lg font-semibold tracking-tight">
            <span className="text-accent">01</span>{' '}
            <span className="text-text-secondary">What is a Seed Phrase?</span>
          </h2>
          <span className="font-mono text-xs text-text-muted">
            {Math.min(activeIndex + (statuses[activeIndex] === 'correct' ? 1 : 0), 12)}/12
          </span>
        </motion.div>
        <ProgressBar
          value={filledWords.filter(Boolean).length}
          max={12}
        />
      </div>

      {/* Info text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-text-muted text-sm max-w-lg text-center"
      >
        Your seed phrase is generated from a list of{' '}
        <span className="text-accent font-mono">2,048</span> BIP-39 words.
        Type each word below to confirm you understand.
      </motion.p>

      {/* Seed Card — shows the words to type */}
      <SeedCard words={seedPhrase} revealUpTo={revealUpTo} />

      {/* Word Slots — user types here */}
      <WordSlots
        words={filledWords}
        activeIndex={activeIndex}
        currentTyping={currentText}
        statuses={statuses}
      />

      {/* Keyboard */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="hidden md:block"
      >
        <KeybWrapper onKeyEvent={handleKeyEvent} />
      </motion.div>

      {/* Mobile fallback hint */}
      <p className="md:hidden text-text-muted text-xs font-mono">
        Use your keyboard to type each word, then press Enter
      </p>
    </SceneWrapper>
  )
}
