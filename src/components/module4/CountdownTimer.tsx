import { motion } from 'framer-motion'

interface CountdownTimerProps {
  timeLeft: number
  progress: number
  duration: number
}

export function CountdownTimer({ timeLeft, progress, duration }: CountdownTimerProps) {
  const color =
    progress > 0.5 ? 'var(--color-success)' :
    progress > 0.2 ? '#EAB308' :
    'var(--color-danger)'

  const isUrgent = timeLeft <= 10
  const isCritical = timeLeft <= 5

  return (
    <div className="w-full max-w-lg space-y-2">
      {/* Time display */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-text-muted tracking-widest uppercase">
          Time Remaining
        </span>
        <motion.span
          animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
          transition={isUrgent ? { duration: 0.5, repeat: Infinity } : {}}
          className="font-mono text-2xl font-bold"
          style={{ color }}
        >
          {Math.ceil(timeLeft)}s
        </motion.span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full transition-colors duration-500"
          style={{ backgroundColor: color, width: `${progress * 100}%` }}
          animate={isUrgent ? { opacity: [1, 0.6, 1] } : { opacity: 1 }}
          transition={isUrgent ? { duration: 0.5, repeat: Infinity } : {}}
        />
      </div>

      {/* Critical screen edge glow */}
      {isCritical && (
        <motion.div
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="fixed inset-0 pointer-events-none z-40"
          style={{
            boxShadow: 'inset 0 0 80px rgba(239, 68, 68, 0.4)',
          }}
        />
      )}

      {/* Duration label */}
      <p className="text-[10px] font-mono text-text-muted text-center">
        {duration}s memorize window
      </p>
    </div>
  )
}
