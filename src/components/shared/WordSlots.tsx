import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type SlotStatus = 'empty' | 'typing' | 'correct' | 'incorrect'

interface WordSlotsProps {
  words: string[]
  activeIndex: number
  currentTyping?: string
  statuses: SlotStatus[]
  className?: string
}

export function WordSlots({
  words,
  activeIndex,
  currentTyping = '',
  statuses,
  className,
}: WordSlotsProps) {
  return (
    <div
      className={cn('grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-lg relative', className)}
      onPaste={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      {words.map((word, i) => {
        const status = statuses[i]
        const isActive = i === activeIndex
        const displayText = isActive ? currentTyping : word

        return (
          <motion.div
            key={i}
            animate={
              status === 'incorrect'
                ? { x: [0, -8, 8, -8, 8, 0] }
                : {}
            }
            transition={
              status === 'incorrect'
                ? { duration: 0.4, ease: 'easeInOut' }
                : {}
            }
            className={cn(
              'relative flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-colors duration-200',
              status === 'correct' && 'bg-success-muted border-success/50',
              status === 'incorrect' && 'bg-danger-muted border-danger/50',
              status === 'typing' && isActive && 'bg-accent-muted border-accent/50',
              status === 'empty' && isActive && 'bg-surface border-accent/50',
              status === 'empty' && !isActive && 'bg-card border-border',
            )}
          >
            {/* Active slot indicator — animated orange line at top */}
            {isActive && status !== 'correct' && (
              <motion.div
                layoutId="active-slot-indicator"
                className="absolute -top-px left-2 right-2 h-0.5 bg-accent rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}

            <span className="text-text-muted text-xs font-mono w-5 text-right shrink-0">
              {i + 1}.
            </span>
            <span
              className={cn(
                'font-mono text-sm truncate',
                status === 'correct' && 'text-success',
                status === 'incorrect' && 'text-danger',
                (status === 'typing' || (status === 'empty' && isActive)) && 'text-accent',
                status === 'empty' && !isActive && 'text-text-muted',
              )}
            >
              {displayText || (
                <span className="text-text-muted/50 italic">word {i + 1}</span>
              )}
              {isActive && status !== 'correct' && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                  className="text-accent"
                >
                  |
                </motion.span>
              )}
            </span>

            {/* Correct checkmark */}
            {status === 'correct' && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                className="ml-auto text-success text-xs"
              >
                ✓
              </motion.span>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
