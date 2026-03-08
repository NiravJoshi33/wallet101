import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SceneWrapper } from '@/components/layout/SceneWrapper'
import { Button } from '@/components/ui/button'
import { FakeExplorerCard } from '@/components/module4/FakeExplorerCard'
import { useGame } from '@/context/GameContext'

export function FailScene() {
  const navigate = useNavigate()
  const { derivedAddress, resetGame } = useGame()
  const [showContent, setShowContent] = useState(false)

  // 200ms black screen delay before content appears
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const handleRestart = () => {
    resetGame()
    navigate('/')
  }

  return (
    <SceneWrapper className="gap-8 bg-black relative">
      {/* CRT overlay */}
      <div className="crt-overlay" />

      {showContent && (
        <>
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-bold text-danger animate-glitch relative z-10"
          >
            Wallet access lost.
          </motion.h1>

          {/* Fake explorer */}
          <div className="relative z-10">
            <FakeExplorerCard address={derivedAddress || 'Unknown'} />
          </div>

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="text-text-muted text-xs font-mono text-center max-w-md relative z-10"
          >
            This is a simulation. But this is exactly what happens when you forget.
          </motion.p>

          {/* Restart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 }}
            className="relative z-10"
          >
            <Button variant="destructive" size="lg" onClick={handleRestart}>
              Practice again →
            </Button>
          </motion.div>
        </>
      )}
    </SceneWrapper>
  )
}
