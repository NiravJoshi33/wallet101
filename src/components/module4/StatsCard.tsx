import { motion } from 'framer-motion'
import { BentoCard } from '@/components/layout/BentoCard'

interface StatsCardProps {
  timeSpent: number
  difficulty: 'easy' | 'hard'
  attempts: number
}

export function StatsCard({ timeSpent, difficulty, attempts }: StatsCardProps) {
  const stats = [
    { label: 'TIME', value: `${timeSpent}s`, color: 'text-accent' },
    { label: 'DIFFICULTY', value: difficulty === 'easy' ? 'Normal' : 'Hard', color: 'text-text-primary' },
    { label: 'ATTEMPTS', value: `${attempts}`, color: 'text-text-primary' },
    { label: 'WORDS', value: '12/12', color: 'text-success' },
  ]

  return (
    <BentoCard className="w-full max-w-md border-gold/30">
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
            className="text-center"
          >
            <span className="text-[9px] font-mono text-text-muted tracking-widest block mb-1">
              {stat.label}
            </span>
            <span className={`font-mono text-xl font-bold ${stat.color}`}>
              {stat.value}
            </span>
          </motion.div>
        ))}
      </div>
    </BentoCard>
  )
}
