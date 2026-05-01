import { cn } from '@/lib/utils'

interface ContainerProps {
  as?: React.ElementType
  className?: string
  children: React.ReactNode
  wide?: boolean
}

export function Container({
  as: Tag = 'div',
  className,
  children,
  wide = false,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full px-6 md:px-10 lg:px-16',
        wide ? 'max-w-[85rem]' : 'max-w-[1400px]',
        className
      )}
    >
      {children}
    </Tag>
  )
}
