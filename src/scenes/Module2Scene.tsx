import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SceneWrapper } from '@/components/layout/SceneWrapper'
import { Button } from '@/components/ui/button'
import { HashingVisual } from '@/components/module2/HashingVisual'
import { HexDisplay } from '@/components/module2/HexDisplay'
import { PassphraseSlider } from '@/components/module2/PassphraseSlider'
import { SeedCard } from '@/components/shared/SeedCard'
import { useGame } from '@/context/GameContext'

export function Module2Scene() {
  const navigate = useNavigate()
  const { seedPhrase, masterSeed, setPassphrase } = useGame()
  const [hashingDone, setHashingDone] = useState(false)

  const handleHashComplete = useCallback(() => {
    setHashingDone(true)
  }, [])

  return (
    <SceneWrapper className="gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-2"
      >
        <h2 className="text-lg font-semibold tracking-tight">
          <span className="text-accent">02</span>{' '}
          <span className="text-text-secondary">Phrase → Master Seed</span>
        </h2>
        <p className="text-text-muted text-sm max-w-md">
          Your 12 words pass through a cryptographic hash function to produce a unique master seed.
        </p>
      </motion.div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6 items-center w-full max-w-4xl">
        {/* Left: seed words */}
        <div className="flex-1 min-w-0 w-full">
          <SeedCard words={seedPhrase} compact className="w-full max-w-none" />
        </div>

        {/* Center: hashing animation */}
        <div className="flex-shrink-0 flex items-center justify-center py-4">
          <HashingVisual words={seedPhrase} onComplete={handleHashComplete} />
        </div>

        {/* Right: hex output */}
        <div className="flex-1 min-w-0 w-full">
          {hashingDone && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HexDisplay hex={masterSeed} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Passphrase input */}
      {hashingDone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-lg"
        >
          <PassphraseSlider onPassphraseChange={setPassphrase} />
        </motion.div>
      )}

      {/* Info cards */}
      {hashingDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          {[
            'Same words → always same seed',
            'Passphrase = 25th word',
            'Deterministic derivation',
          ].map((text) => (
            <span
              key={text}
              className="px-3 py-1.5 bg-accent-muted border border-accent/20 rounded-full text-xs font-mono text-accent"
            >
              {text}
            </span>
          ))}
        </motion.div>
      )}

      {/* Continue */}
      {hashingDone && (
        <Button size="lg" onClick={() => navigate('/module3')}>
          See the derivation →
        </Button>
      )}
    </SceneWrapper>
  )
}
