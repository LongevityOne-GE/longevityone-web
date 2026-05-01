import { cn } from '@/lib/utils'

interface ScriptAccentProps {
  className?: string
  children: React.ReactNode
}

export function ScriptAccent({ className, children }: ScriptAccentProps) {
  return (
    <span
      className={cn('font-script text-orange italic', className)}
    >
      {children}
    </span>
  )
}
