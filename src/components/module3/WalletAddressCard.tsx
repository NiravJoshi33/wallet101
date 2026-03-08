import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { BentoCard } from '@/components/layout/BentoCard'
import { truncateAddress } from '@/lib/crypto'
import type { Chain } from '@/lib/constants'

interface WalletAddressCardProps {
  address: string
  chain: Chain
}

function Identicon({ address }: { address: string }) {
  // Generate a simple deterministic gradient from the address
  const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const hue1 = hash % 360
  const hue2 = (hash * 7) % 360

  return (
    <div
      className="w-12 h-12 rounded-full border border-border-light"
      style={{
        background: `linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 70%, 40%))`,
      }}
    />
  )
}

export function WalletAddressCard({ address, chain }: WalletAddressCardProps) {
  const [displayAddress, setDisplayAddress] = useState('')
  const [done, setDone] = useState(false)

  // Typewriter effect
  useEffect(() => {
    if (!address) return
    setDisplayAddress('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayAddress(address.slice(0, i))
      if (i >= address.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, 25)
    return () => clearInterval(interval)
  }, [address])

  const chainLabels: Record<Chain, { name: string; curve: string }> = {
    solana: { name: 'Solana', curve: 'Ed25519' },
    ethereum: { name: 'Ethereum', curve: 'secp256k1' },
    bitcoin: { name: 'Bitcoin', curve: 'secp256k1' },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BentoCard glow className="w-full max-w-lg">
        <div className="flex items-center gap-4">
          <Identicon address={address} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-accent tracking-widest uppercase">
                Your {chainLabels[chain].name} Address
              </span>
              <span className="text-[9px] font-mono text-text-muted px-1.5 py-0.5 bg-surface border border-border rounded">
                {chainLabels[chain].curve}
              </span>
            </div>

            {/* Full address with typewriter */}
            <p className="font-mono text-[11px] text-text-secondary break-all leading-relaxed">
              {displayAddress}
              {!done && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.4, repeat: Infinity, repeatType: 'reverse' }}
                  className="text-accent"
                >
                  █
                </motion.span>
              )}
            </p>

            {/* Truncated */}
            {done && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-sm text-text-primary mt-1 font-medium"
              >
                {truncateAddress(address)}
              </motion.p>
            )}
          </div>
        </div>
      </BentoCard>
    </motion.div>
  )
}
