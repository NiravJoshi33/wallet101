import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SceneWrapper } from '@/components/layout/SceneWrapper'
import { Button } from '@/components/ui/button'
import { Keyboard } from '@/components/ui/keyboard'
import { ParticleBackground } from '@/components/effects/ParticleBackground'
import { useGame } from '@/context/GameContext'

export function LandingScene() {
  const navigate = useNavigate()
  const { generateSeedPhrase } = useGame()

  const handleStart = () => {
    generateSeedPhrase()
    navigate('/module1')
  }

  return (
    <SceneWrapper className="relative overflow-hidden gap-8">
      <ParticleBackground />

      {/* Disclaimer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-text-muted text-xs font-mono tracking-wide text-center max-w-md"
      >
        This app generates fake wallets for learning. Never enter your real seed phrase anywhere online.
      </motion.p>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          <span className="text-accent">12 words.</span>{' '}
          <span className="text-text-primary">Your entire crypto life.</span>
        </h1>
        <p className="text-text-secondary text-lg md:text-xl">
          Do you actually understand what that means?
        </p>
      </motion.div>

      {/* Keyboard */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="hidden md:flex justify-center"
      >
        <Keyboard
          theme="dolch"
          enableSound={true}
          enableHaptics={true}
          className="scale-[0.85] opacity-80"
        />
      </motion.div>

      {/* CTA */}
      <Button size="lg" onClick={handleStart}>
        Find out →
      </Button>
    </SceneWrapper>
  )
}
