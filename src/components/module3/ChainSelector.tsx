import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Chain } from '@/lib/constants'

interface ChainSelectorProps {
  selected: Chain
  onChange: (chain: Chain) => void
}

const CHAINS: { key: Chain; label: string }[] = [
  { key: 'solana', label: 'Solana' },
  { key: 'ethereum', label: 'Ethereum' },
  { key: 'bitcoin', label: 'Bitcoin' },
]

export function ChainSelector({ selected, onChange }: ChainSelectorProps) {
  return (
    <Tabs value={selected} onValueChange={(v) => onChange(v as Chain)}>
      <TabsList>
        {CHAINS.map(({ key, label }) => (
          <TabsTrigger key={key} value={key}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
