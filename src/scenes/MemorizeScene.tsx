import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SceneWrapper } from '@/components/layout/SceneWrapper'
import { Button } from '@/components/ui/button'
import { SeedCard } from '@/components/shared/SeedCard'
import { CountdownTimer } from '@/components/module4/CountdownTimer'
import { useGame } from '@/context/GameContext'
import { useCountdown } from '@/hooks/useCountdown'
import { MEMORIZE_TIME_EASY, MEMORIZE_TIME_HARD } from '@/lib/constants'

export function MemorizeScene() {
  const navigate = useNavigate()
  const { seedPhrase, difficulty, startTimer, clearUserInput } = useGame()
  const duration = difficulty === 'easy' ? MEMORIZE_TIME_EASY : MEMORIZE_TIME_HARD

  const handleExpire = useCallback(() => {
    navigate('/type')
  }, [navigate])

  const { timeLeft, progress, start } = useCountdown({
    duration,
    onExpire: handleExpire,
  })

  useEffect(() => {
    start()
    startTimer()
    clearUserInput()
  }, [start, startTimer, clearUserInput])

  const handleSkip = () => {
    navigate('/type')
  }

  return (
    <SceneWrapper className="gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-2"
      >
        <h2 className="text-lg font-semibold tracking-tight">
          <span className="text-accent">04</span>{' '}
          <span className="text-text-secondary">Memorize Your Seed Phrase</span>
        </h2>
        <p className="text-text-muted text-sm max-w-md">
          Study these 12 words carefully. You'll need to type them back from memory.
        </p>
      </motion.div>

      {/* Countdown */}
      <CountdownTimer timeLeft={timeLeft} progress={progress} duration={duration} />

      {/* Seed card — fully visible */}
      <motion.div
        animate={timeLeft <= 3 ? { rotateY: [0, 90] } : { rotateY: 0 }}
        transition={timeLeft <= 3 ? { duration: 0.5, delay: timeLeft } : {}}
        style={{ perspective: 1000 }}
      >
        <SeedCard words={seedPhrase} />
      </motion.div>

      {/* Difficulty badge */}
      <span className="px-3 py-1.5 bg-card border border-border rounded-full text-xs font-mono text-text-muted">
        {difficulty === 'easy' ? 'Normal Mode' : 'Hard Mode'} — {duration}s window
      </span>

      {/* Skip button */}
      <Button variant="outline" onClick={handleSkip}>
        I've memorized it →
      </Button>
    </SceneWrapper>
  )
}
