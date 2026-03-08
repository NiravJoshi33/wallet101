import { motion } from 'framer-motion'
import { BentoCard } from '@/components/layout/BentoCard'
import { cn } from '@/lib/utils'

interface SeedCardProps {
  words: string[]
  revealUpTo?: number
  blurred?: boolean
  compact?: boolean
  className?: string
}

export function SeedCard({ words, revealUpTo, blurred = false, compact = false, className }: SeedCardProps) {
  const revealCount = revealUpTo ?? words.length

  return (
    <BentoCard className={cn('w-full max-w-lg', className)}>
      <div className={cn('grid gap-3', compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3')}>
        {words.map((word, i) => {
          const isRevealed = i < revealCount

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 0 }}
              transition={{ delay: isRevealed ? i * 0.1 : 0, duration: 0.3 }}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg border min-w-0',
                isRevealed
                  ? 'bg-surface border-border-light'
                  : 'bg-card border-border',
                blurred && 'blur-sm select-none'
              )}
            >
              <span className="text-text-muted text-xs font-mono w-5 text-right">
                {i + 1}.
              </span>
              <span className="font-mono text-sm text-text-primary truncate">
                {isRevealed ? word : '•••••'}
              </span>
            </motion.div>
          )
        })}
      </div>
    </BentoCard>
  )
}
