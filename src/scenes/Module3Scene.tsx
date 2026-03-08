import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SceneWrapper } from '@/components/layout/SceneWrapper'
import { Button } from '@/components/ui/button'
import { DerivationPathTree } from '@/components/module3/DerivationPathTree'
import { WalletAddressCard } from '@/components/module3/WalletAddressCard'
import { ChainSelector } from '@/components/module3/ChainSelector'
import { useGame } from '@/context/GameContext'
import { getMockAddress } from '@/lib/crypto'
import type { Chain } from '@/lib/constants'

export function Module3Scene() {
  const navigate = useNavigate()
  const { derivedAddress, selectedChain, setSelectedChain, masterSeed } = useGame()
  const [treeComplete, setTreeComplete] = useState(false)

  const handleTreeComplete = useCallback(() => {
    setTreeComplete(true)
  }, [])

  const handleChainChange = useCallback(
    (chain: Chain) => {
      if (masterSeed) {
        setSelectedChain(chain)
        setTreeComplete(false)
      }
    },
    [masterSeed, setSelectedChain]
  )

  // Use real Solana address or mock for other chains
  const displayAddress =
    selectedChain === 'solana' ? derivedAddress : getMockAddress(selectedChain)

  return (
    <SceneWrapper className="gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-2"
      >
        <h2 className="text-lg font-semibold tracking-tight">
          <span className="text-accent">03</span>{' '}
          <span className="text-text-secondary">Master Seed → Wallet Address</span>
        </h2>
        <p className="text-text-muted text-sm max-w-md">
          Your master seed travels through a derivation path to produce a unique wallet address.
          Same seed, different path = different address.
        </p>
      </motion.div>

      {/* Chain selector */}
      <ChainSelector selected={selectedChain} onChange={handleChainChange} />

      {/* Derivation path tree */}
      <DerivationPathTree chain={selectedChain} onComplete={handleTreeComplete} />

      {/* Info tags */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          selectedChain === 'solana' ? 'Ed25519 curve' : 'secp256k1 curve',
          'Same seed → different chains → different addresses',
          'Public address is safe to share',
        ].map((text) => (
          <span
            key={text}
            className="px-2.5 py-1 bg-card border border-border rounded-full text-[10px] font-mono text-text-muted"
          >
            {text}
          </span>
        ))}
      </div>

      {/* Wallet address card */}
      {treeComplete && displayAddress && (
        <WalletAddressCard address={displayAddress} chain={selectedChain} />
      )}

      {/* Continue button */}
      {treeComplete && (
        <Button size="lg" onClick={() => navigate('/memorize')}>
          Begin the Drill →
        </Button>
      )}
    </SceneWrapper>
  )
}
