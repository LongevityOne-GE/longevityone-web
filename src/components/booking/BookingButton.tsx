import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { BOOKING_ENABLED, CALL_CTA_LABEL } from '@/lib/features'
import { LeadCaptureForm } from '@/components/sections/LeadCaptureForm'

// ─── Bilingual default labels ────────────────────────────────────────────────
const COPY = {
  ka: {
    primary:   'დაჯავშნეთ ვიზიტი',
    secondary: 'ვიზიტის დაჯავშნა',
    ghost:     'ვიზიტის დაჯავშნა',
  },
  en: {
    primary:   'Book a Visit',
    secondary: 'Book Now',
    ghost:     'Book Now',
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
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: ReactNode
}

// ─── Component ───────────────────────────────────────────────────────────────
export function BookingButton({
  lang,
  variant = 'primary',
  size = 'md',
  className,
  children,
}: BookingButtonProps) {
  const prefix = lang === 'en' ? '/en' : ''
  const href = `${prefix}/booking`
  const label = children ?? COPY[lang][variant]

  // Calls-only mode: render the "request a call" modal styled like this button.
  if (!BOOKING_ENABLED) {
    return (
      <LeadCaptureForm
        locale={lang}
        source="nav"
        label={CALL_CTA_LABEL[lang]}
        triggerClassName={cn(
          'font-sans font-medium transition-all duration-300',
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          // Override the modal trigger's default justify-between
          'justify-center gap-2',
          className
        )}
      />
    )
  }

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
