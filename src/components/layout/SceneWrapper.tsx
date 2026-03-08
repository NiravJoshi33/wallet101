import { motion } from 'framer-motion'
import { SCENE_TRANSITION } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface SceneWrapperProps {
  children: ReactNode
  className?: string
}

export function SceneWrapper({ children, className }: SceneWrapperProps) {
  return (
    <motion.div
      initial={SCENE_TRANSITION.initial}
      animate={SCENE_TRANSITION.animate}
      exit={SCENE_TRANSITION.exit}
      transition={SCENE_TRANSITION.transition}
      className={cn(
        'min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-10 md:py-14',
        className
      )}
    >
      {children}
    </motion.div>
  )
}
