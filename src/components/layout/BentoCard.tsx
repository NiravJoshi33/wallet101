import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface BentoCardProps {
  children: ReactNode
  className?: string
  glow?: boolean
}

export function BentoCard({ children, className, glow = false }: BentoCardProps) {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-xl p-4 sm:p-5 md:p-6 transition-all duration-300',
        glow && 'hover:border-accent/30 hover:shadow-[0_0_20px_rgba(255,107,0,0.1)]',
        className
      )}
    >
      {children}
    </div>
  )
}
