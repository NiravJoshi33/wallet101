import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import type { Chain } from '@/lib/constants'

interface PathNode {
  label: string
  description: string
}

const PATH_NODES: Record<Chain, PathNode[]> = {
  solana: [
    { label: 'm', description: 'Master Key' },
    { label: "44'", description: 'Purpose (BIP-44)' },
    { label: "501'", description: 'Coin Type (Solana)' },
    { label: "0'", description: 'Account' },
    { label: "0'", description: 'Address Index' },
  ],
  ethereum: [
    { label: 'm', description: 'Master Key' },
    { label: "44'", description: 'Purpose (BIP-44)' },
    { label: "60'", description: 'Coin Type (Ethereum)' },
    { label: "0'", description: 'Account' },
    { label: "0'", description: 'Address Index' },
  ],
  bitcoin: [
    { label: 'm', description: 'Master Key' },
    { label: "44'", description: 'Purpose (BIP-44)' },
    { label: "0'", description: 'Coin Type (Bitcoin)' },
    { label: "0'", description: 'Account' },
    { label: "0'", description: 'Address Index' },
  ],
}

interface DerivationPathTreeProps {
  chain: Chain
  onComplete: () => void
}

export function DerivationPathTree({ chain, onComplete }: DerivationPathTreeProps) {
  const [revealedCount, setRevealedCount] = useState(1)
  const nodes = PATH_NODES[chain]

  const handleRevealNext = useCallback(() => {
    setRevealedCount((prev) => {
      if (prev < nodes.length) {
        if (prev === nodes.length - 1) {
          setTimeout(onComplete, 600)
        }
        return prev + 1
      }
      return prev
    })
  }, [nodes.length, onComplete])

  // Arrow key listener — only active while nodes remain
  const isComplete = revealedCount >= nodes.length
  useEffect(() => {
    if (isComplete) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
        e.preventDefault()
        e.stopPropagation()
        handleRevealNext()
      }
    }
    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [handleRevealNext, isComplete])

  return (
    <div className="w-full max-w-2xl">
      {/* Instruction */}
      {revealedCount < nodes.length && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-text-muted text-xs font-mono text-center mb-6"
        >
          Click each node or press{' '}
          <kbd className="px-1.5 py-0.5 bg-card border border-border rounded text-accent">→</kbd>{' '}
          to explore the derivation path
        </motion.p>
      )}

      {/* Tree */}
      <div className="flex items-center justify-center gap-0">
        {nodes.map((node, i) => {
          const isRevealed = i < revealedCount
          const isActive = i === revealedCount - 1
          const isNext = i === revealedCount

          return (
            <div key={`${chain}-${i}`} className="flex items-center">
              {/* Connecting line */}
              {i > 0 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isRevealed ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="w-8 md:w-12 h-0.5 bg-border-light origin-left"
                  style={isRevealed ? { backgroundColor: 'var(--color-accent)' } : {}}
                />
              )}

              {/* Node */}
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={
                  isRevealed
                    ? { opacity: 1, scale: 1 }
                    : isNext
                      ? { opacity: 0.7, scale: 0.9 }
                      : { opacity: 0.2, scale: 0.7 }
                }
                transition={{ duration: 0.3, type: 'spring' }}
                onClick={isNext ? handleRevealNext : undefined}
                className={`
                  relative flex flex-col items-center gap-1
                  ${isNext ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                {/* Circle */}
                <motion.div
                  animate={
                    isActive
                      ? { boxShadow: ['0 0 0px rgba(255,107,0,0)', '0 0 15px rgba(255,107,0,0.4)', '0 0 0px rgba(255,107,0,0)'] }
                      : isNext
                        ? { boxShadow: ['0 0 0px rgba(255,107,0,0)', '0 0 10px rgba(255,107,0,0.25)', '0 0 0px rgba(255,107,0,0)'] }
                        : {}
                  }
                  transition={isActive || isNext ? { duration: 1.5, repeat: Infinity } : {}}
                  className={`
                    w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center
                    transition-colors duration-300
                    ${isActive ? 'border-accent bg-accent-muted' : isRevealed ? 'border-accent/50 bg-card' : isNext ? 'border-accent/40 bg-card' : 'border-border bg-card'}
                  `}
                >
                  <span className={`font-mono text-xs md:text-sm font-bold ${isRevealed ? 'text-accent' : 'text-text-muted'}`}>
                    {node.label}
                  </span>
                </motion.div>

                {/* Description */}
                {isRevealed && (
                  <motion.span
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[9px] md:text-[10px] font-mono text-text-muted text-center whitespace-nowrap"
                  >
                    {node.description}
                  </motion.span>
                )}
                {isNext && (
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-[9px] font-mono text-accent text-center whitespace-nowrap"
                  >
                    click
                  </motion.span>
                )}
              </motion.button>
            </div>
          )
        })}
      </div>

      {/* Path string */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mt-6"
      >
        <span className="font-mono text-xs text-text-muted">
          {nodes
            .slice(0, revealedCount)
            .map((n) => n.label)
            .join('/')}
          {revealedCount < nodes.length && (
            <span className="text-text-muted/30">/...</span>
          )}
        </span>
      </motion.div>
    </div>
  )
}
