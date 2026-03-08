import { useState, useEffect, useRef } from 'react'
import { BentoCard } from '@/components/layout/BentoCard'

interface PassphraseSliderProps {
  onPassphraseChange: (passphrase: string) => void
}

export function PassphraseSlider({ onPassphraseChange }: PassphraseSliderProps) {
  const [value, setValue] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      onPassphraseChange(value)
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [value, onPassphraseChange])

  return (
    <BentoCard className="w-full max-w-lg">
      <label className="block space-y-2">
        <span className="text-[10px] font-mono text-text-muted tracking-widest uppercase">
          Optional Passphrase (25th word)
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter optional passphrase..."
          className="w-full bg-surface border border-border rounded-lg px-4 py-2.5
                     font-mono text-sm text-text-primary placeholder:text-text-muted/50
                     focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30
                     transition-colors"
        />
      </label>
      <p className="text-[11px] text-text-muted mt-2">
        Even one character creates an{' '}
        <span className="text-accent">entirely different wallet</span>. Watch the hex change above.
      </p>
    </BentoCard>
  )
}
