import { cn } from '@/lib/utils'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'

interface HeadingProps {
  as?: HeadingLevel
  level?: HeadingLevel
  className?: string
  children: React.ReactNode
}

/**
 * Weight ladder: thin → extralight → light → medium
 *
 * Luxury editorial rule: the larger the type, the lighter the weight.
 * Thin (100) at 7rem looks architectural. Regular (400) at 7rem looks
 * like a newspaper. Do not deviate from these defaults without a strong
 * visual reason — pass className="font-{weight}" to override per callsite.
 */
const sizeMap: Record<HeadingLevel, string> = {
  h1: 'text-[clamp(3.5rem,8vw,7rem)] leading-[1.05] tracking-[-0.02em] font-thin',
  h2: 'text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1]  tracking-[-0.01em] font-extralight',
  h3: 'text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.2]  tracking-[-0.005em] font-light',
  h4: 'text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.3]  font-medium',
}

export function Heading({ as, level, className, children }: HeadingProps) {
  const tag = as ?? level ?? 'h2'
  const Tag = tag

  return (
    <Tag className={cn('font-sans text-brown', sizeMap[tag], className)}>
      {children}
    </Tag>
  )
}
