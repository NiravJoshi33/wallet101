import { motion, AnimatePresence } from 'framer-motion'
import { filterWordlist } from '@/lib/crypto'

interface BIP39AutocompleteProps {
  prefix: string
  onSelect: (word: string) => void
  visible: boolean
}

export function BIP39Autocomplete({ prefix, onSelect, visible }: BIP39AutocompleteProps) {
  const suggestions = prefix.length >= 1 ? filterWordlist(prefix, 5) : []

  return (
    <AnimatePresence>
      {visible && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full left-0 right-0 mt-1 z-20 bg-card border border-border rounded-lg overflow-hidden shadow-lg"
        >
          {suggestions.map((word, i) => (
            <button
              key={word}
              onClick={() => onSelect(word)}
              className={`
                w-full px-3 py-2 text-left font-mono text-sm text-text-primary
                hover:bg-accent-muted hover:text-accent transition-colors
                ${i > 0 ? 'border-t border-border' : ''}
                cursor-pointer
              `}
            >
              <span className="text-accent">{word.slice(0, prefix.length)}</span>
              <span>{word.slice(prefix.length)}</span>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
