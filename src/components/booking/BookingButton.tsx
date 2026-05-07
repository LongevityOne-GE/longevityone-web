import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────
type EventType = 'consultation' | 'followup' | 'pnoe'

// ─── Bilingual default labels ────────────────────────────────────────────────
const COPY = {
  ka: {
    primary: 'დაჯავშნეთ',
    secondary: 'კონსულტაციის დაჯავშნა',
    ghost: 'კონსულტაციის დაჯავშნა',
  },
  en: {
    primary: 'Book a Consultation',
    secondary: 'Book Now',
    ghost: 'Book Now',
  },
} as const

// ─── Variant styles ──────────────────────────────────────────────────────────
const VARIANT_CLASSES = {
  primary: cn(
    'bg-dark-brown text-bone-white',
    'hover:bg-dark-brown/90',
    'px-8 py-4 text-[11px] tracking-[0.15em] uppercase'
  ),
  secondary: cn(
    'border border-dark-brown text-dark-brown',
    'hover:bg-dark-brown hover:text-bone-white',
    'px-8 py-4 text-[11px] tracking-[0.15em] uppercase'
  ),
  ghost: cn(
    'text-dark-brown underline underline-offset-4',
    'decoration-burnt-orange hover:decoration-2'
  ),
} as const

const SIZE_CLASSES = {
  sm: 'text-[10px] px-5 py-2.5',
  md: '',
  lg: 'text-[12px] px-10 py-5',
} as const

// ─── Props ───────────────────────────────────────────────────────────────────
interface BookingButtonProps {
  lang: 'ka' | 'en'
  eventType?: EventType
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: ReactNode
}

// ─── Component ───────────────────────────────────────────────────────────────
export function BookingButton({
  lang,
  eventType,
  variant = 'primary',
  size = 'md',
  className,
  children,
}: BookingButtonProps) {
  const prefix = lang === 'en' ? '/en' : ''
  const type = eventType ?? 'consultation'
  const href = `${prefix}/booking?type=${type}`
  const label = children ?? COPY[lang][variant]

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center font-sans font-medium',
        'transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
    >
      {label}
    </Link>
  )
}

// ─── Integration examples ────────────────────────────────────────────────────
//
// Nav CTA
// <BookingButton lang={lang} variant="primary" size="sm" />
//
// Hero CTA
// <BookingButton lang={lang} variant="primary" size="lg" />
//
// Package card — pre-selects consultation
// <BookingButton lang={lang} variant="secondary" eventType="consultation">
//   {lang === 'ka' ? 'ამ პაკეტით დაწყება' : 'Start with this package'}
// </BookingButton>
//
// PNOE service page — pre-selects PNOE
// <BookingButton lang={lang} variant="ghost" eventType="pnoe" />
