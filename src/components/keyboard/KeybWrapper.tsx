import { Keyboard, type KeyboardInteractionEvent } from '@/components/ui/keyboard'
import { cn } from '@/lib/utils'

interface KeybWrapperProps {
  onKeyEvent: (event: KeyboardInteractionEvent) => void
  className?: string
}

export function KeybWrapper({ onKeyEvent, className }: KeybWrapperProps) {
  return (
    <div className={cn('flex justify-center', className)}>
      <Keyboard
        theme="dolch"
        enableSound={true}
        enableHaptics={true}
        onKeyEvent={onKeyEvent}
        className="scale-[0.85] md:scale-100 origin-top"
      />
    </div>
  )
}
