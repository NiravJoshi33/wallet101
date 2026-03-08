import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { BentoCard } from '@/components/layout/BentoCard'
import { truncateAddress } from '@/lib/crypto'
import { FAKE_BALANCE_SOL, SOL_PRICE_USD } from '@/lib/constants'

interface FakeExplorerCardProps {
  address: string
}

export function FakeExplorerCard({ address }: FakeExplorerCardProps) {
  const usdValue = FAKE_BALANCE_SOL * SOL_PRICE_USD

  const rows = [
    { label: 'Wallet', value: truncateAddress(address), mono: true },
    { label: 'Status', value: 'All funds transferred', danger: true },
    { label: 'Time', value: '2 minutes ago' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <BentoCard className="w-full max-w-md border-danger/30">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
          <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
          <span className="text-[10px] font-mono text-text-muted tracking-widest uppercase">
            Blockchain Explorer
          </span>
        </div>

        {/* Rows */}
        <div className="space-y-3">
          {rows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + i * 0.2 }}
              className="flex items-center justify-between"
            >
              <span className="text-[10px] font-mono text-text-muted uppercase">
                {row.label}
              </span>
              <span
                className={`text-sm font-mono ${
                  row.danger ? 'text-danger' : row.mono ? 'text-text-secondary' : 'text-text-primary'
                }`}
              >
                {row.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Balance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-4 pt-3 border-t border-border text-center"
        >
          <div className="font-mono text-2xl font-bold text-text-primary">
            ◎{' '}
            <CountUp
              end={FAKE_BALANCE_SOL}
              decimals={2}
              duration={2.5}
              separator=","
            />{' '}
            <span className="text-sm text-text-muted">SOL</span>
          </div>
          <div className="font-mono text-lg text-danger mt-1">
            $
            <CountUp
              end={usdValue}
              duration={3}
              separator=","
            />
          </div>
        </motion.div>
      </BentoCard>
    </motion.div>
  )
}
