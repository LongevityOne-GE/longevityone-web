import { cn } from '@/lib/utils'

interface EyebrowProps {
  className?: string
  children: React.ReactNode
}

export function Eyebrow({ className, children }: EyebrowProps) {
  return (
    <p
      className={cn(
        'text-[0.75rem] font-sans font-semibold uppercase tracking-[0.18em] text-orange',
        className
      )}
    >
      {children}
    </p>
  )
}
