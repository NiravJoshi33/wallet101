import { Navigate } from 'react-router-dom'
import { useGame } from '@/context/GameContext'
import type { ReactNode } from 'react'

interface RequireGameStateProps {
  children: ReactNode
}

export function RequireGameState({ children }: RequireGameStateProps) {
  const { seedPhrase } = useGame()

  if (seedPhrase.length === 0) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
