import { cn } from '@/lib/utils'

interface BodyProps {
  as?: React.ElementType
  size?: 'lg' | 'base' | 'sm'
  className?: string
  children: React.ReactNode
}

/**
 * lg  → Light (300) — introductory paragraphs, hero subtext. At 1.125rem
 *       with generous line-height, Light reads refined without thinning out.
 * base → Regular (400) — all body copy. Most legible at reading sizes.
 * sm   → Regular (400) — captions, footnotes. Don't go lighter at small sizes.
 */
const sizeMap = {
  lg:   'text-[1.125rem] leading-[1.75] font-light',
  base: 'text-[1rem]     leading-[1.7]  font-normal',
  sm:   'text-[0.875rem] leading-[1.6]  font-normal',
}

export function Body({ as: Tag = 'p', size = 'base', className, children }: BodyProps) {
  return (
    <Tag className={cn('font-sans text-brown text-pretty', sizeMap[size], className)}>
      {children}
    </Tag>
  )
}
