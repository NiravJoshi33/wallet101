import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface HashingVisualProps {
  words: string[]
  onComplete: () => void
}

export function HashingVisual({ words, onComplete }: HashingVisualProps) {
  const [phase, setPhase] = useState<'words' | 'hashing' | 'done'>('words')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hashing'), 1500)
    const t2 = setTimeout(() => {
      setPhase('done')
      onComplete()
    }, 3500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onComplete])

  return (
    <div className="relative flex flex-col items-center gap-6">
      {/* Words flowing in */}
      <div className="flex flex-wrap gap-2 justify-center max-w-sm">
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 1, y: 0 }}
            animate={
              phase === 'hashing' || phase === 'done'
                ? { opacity: 0, y: 40, scale: 0.5 }
                : { opacity: 1, y: 0 }
            }
            transition={{ delay: phase === 'hashing' ? i * 0.08 : 0, duration: 0.4 }}
            className="px-2 py-1 bg-accent-muted border border-accent/30 rounded text-xs font-mono text-accent"
          >
            {word}
          </motion.span>
        ))}
      </div>

      {/* Hashing funnel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={phase !== 'words' ? { opacity: 1 } : { opacity: 0 }}
        className="flex flex-col items-center gap-2"
      >
        <motion.div
          animate={phase === 'hashing' ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 2, repeat: phase === 'hashing' ? Infinity : 0, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-2 border-accent/50 border-t-accent flex items-center justify-center"
        >
          <span className="text-accent text-xl">⚡</span>
        </motion.div>

        <div className="flex flex-col items-center gap-1 mt-2">
          <span className="font-mono text-[10px] text-text-muted tracking-widest uppercase">
            PBKDF2 + HMAC-SHA512
          </span>
          <span className="font-mono text-[10px] text-accent/70">
            2,048 iterations
          </span>
        </div>
      </motion.div>
    </div>
  )
}
