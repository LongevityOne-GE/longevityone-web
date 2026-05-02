'use client'

import { forwardRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: React.ReactNode
}

type ButtonAsButton = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never; external?: never }

type ButtonAsLink = ButtonBaseProps &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, 'href'> & {
    href: string
    external?: boolean
  }

type ButtonProps = ButtonAsButton | ButtonAsLink

const variantMap: Record<ButtonVariant, string> = {
  primary:
    'bg-brown text-bone hover:bg-brown-dark active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2',
  outline:
    'border border-brown text-brown hover:bg-brown hover:text-bone active:scale-[0.98]',
  ghost: 'text-brown hover:text-orange underline-offset-4 hover:underline',
}

const sizeMap: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[0.75rem] tracking-[0.1em]',
  md: 'px-7 py-3.5 text-[0.8125rem] tracking-[0.1em]',
  lg: 'px-10 py-4.5 text-[0.875rem] tracking-[0.1em]',
}

const base =
  'inline-flex items-center justify-center gap-2 font-sans font-semibold uppercase transition-all duration-[200ms] ease-luxury cursor-pointer select-none'

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button({ variant = 'primary', size = 'md', className, children, ...props }, ref) {
  const classes = cn(base, variantMap[variant], sizeMap[size], className)

  if ('href' in props && props.href !== undefined) {
    const { href, external, ...rest } = props as ButtonAsLink
    if (external) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
})
