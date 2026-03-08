import { BentoCard } from '@/components/layout/BentoCard'
import { useScrambleText } from '@/hooks/useScrambleText'

interface HexDisplayProps {
  hex: string
  label?: string
}

export function HexDisplay({ hex, label = '512-bit Master Seed' }: HexDisplayProps) {
  const displayText = useScrambleText(hex, 2000)

  return (
    <BentoCard className="w-full max-w-lg">
      <span className="text-[10px] font-mono text-text-muted tracking-widest uppercase mb-3 block">
        {label}
      </span>
      <div className="font-mono text-[11px] leading-relaxed break-all">
        <span className="text-accent/80">{displayText.slice(0, 64)}</span>
        <span className="text-text-secondary">{displayText.slice(64)}</span>
      </div>
      <span className="text-[10px] font-mono text-text-muted mt-2 block">
        {hex.length} hex characters = {hex.length * 4} bits
      </span>
    </BentoCard>
  )
}
