import { cn } from '@/lib/utils'

interface BodyProps {
  as?: React.ElementType
  size?: 'lg' | 'base' | 'sm'
  className?: string
  children: React.ReactNode
}

const sizeMap = {
  lg: 'text-[1.125rem] leading-[1.7]',
  base: 'text-[1rem] leading-[1.7]',
  sm: 'text-[0.875rem] leading-[1.6]',
}

export function Body({ as: Tag = 'p', size = 'base', className, children }: BodyProps) {
  return (
    <Tag className={cn('text-brown text-pretty', sizeMap[size], className)}>
      {children}
    </Tag>
  )
}
