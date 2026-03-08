import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { SceneWrapper } from '@/components/layout/SceneWrapper'
import { Button } from '@/components/ui/button'
import { StatsCard } from '@/components/module4/StatsCard'
import { useGame } from '@/context/GameContext'

export function WinScene() {
  const navigate = useNavigate()
  const { timeSpent, difficulty, attempts, resetGame } = useGame()

  useEffect(() => {
    // Confetti burst
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF6B00', '#FF8533', '#22C55E'],
    })
  }, [])

  const handleRestart = () => {
    resetGame()
    navigate('/')
  }

  return (
    <SceneWrapper className="gap-8">
      {/* Gold gradient overlay */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-gold/5 via-transparent to-transparent" />

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="text-center space-y-3 relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gold">
          Your wallet is safe.
        </h1>
        <p className="text-text-secondary text-lg max-w-md">
          You're in the <span className="text-accent font-semibold">1%</span> of crypto users
          who actually know their seed phrase.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-10"
      >
        <StatsCard
          timeSpent={timeSpent}
          difficulty={difficulty}
          attempts={attempts}
        />
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap gap-3 justify-center relative z-10"
      >
        <Button onClick={handleRestart}>
          Start Over
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(
              `I memorized a 12-word seed phrase in ${timeSpent}s on Wallet101! Can you? 🔑`
            )
          }}
        >
          Share Score
        </Button>
      </motion.div>
    </SceneWrapper>
  )
}
