'use client'

import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/animations/Reveal'
import { LeadCaptureForm } from '@/components/sections/LeadCaptureForm'

interface PackageCardProps {
  locale: Locale
  name: string | null
  price?: number | null
  priceLabel?: string | null
  priceSuffix?: string | null
  tagline?: string | null
  includes?: string[] | null
  ctaLabel?: string | null
  isFeatured?: boolean | null
  variant?: 'light' | 'dark'
  delay?: number
  className?: string
  bookingHref?: string
  // When set, renders the two-action pattern: lead-form primary + booking secondary
  leadFormSource?: string
}

export function PackageCard({
  locale,
  name,
  price,
  priceLabel,
  priceSuffix,
  tagline,
  includes,
  ctaLabel,
  isFeatured,
  variant = 'light',
  delay = 0,
  className = '',
  bookingHref,
  leadFormSource,
}: PackageCardProps) {
  const isLight = variant === 'light'
  const defaultCta = locale === 'ka' ? 'არჩევა' : 'SELECT'
  const featured = isFeatured === true
  const popularLabel = locale === 'ka' ? 'ყველაზე პოპულარული' : 'Most Popular'

  // Two-action copy
  const interestedLabel   = locale === 'ka' ? 'გაიგეთ მეტი'          : 'Learn more'
  const bookDirectlyLabel = locale === 'ka' ? 'პირდაპირ დაჯავშნა →'  : 'Book directly →'

  return (
    <Reveal delay={delay} className={`h-full ${className}`}>
      <div
        className={`group h-full relative transition-transform duration-300 ${
          featured
            ? 'md:-translate-y-6 filter drop-shadow-[0_36px_70px_-22px_rgba(212,88,0,0.62)]'
            : 'filter drop-shadow-lg'
        }`}
      >
        <div
          className={`card-ornamental overflow-hidden transition-colors duration-300 px-8 sm:px-10 md:px-8 lg:px-12 xl:px-16 pt-24 md:pt-28 lg:pt-32 pb-16 md:pb-20 lg:pb-24 flex flex-col h-full min-w-0 relative ${
            featured ? 'ring-1 ring-burnt-orange/20' : ''
          } ${
            isLight
              ? 'bg-bone-white text-dark-brown group-hover:bg-dark-brown group-hover:text-bone-white'
              : 'bg-dark-brown text-bone-white group-hover:bg-bone-white group-hover:text-dark-brown'
          }`}
        >
          {/* Inside-card glow on featured */}
          {featured && (
            <span
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none opacity-95"
              style={{
                background:
                  'linear-gradient(90deg, rgba(212,88,0,0.08), rgba(212,88,0,0) 20%, rgba(212,88,0,0) 80%, rgba(212,88,0,0.08)), linear-gradient(180deg, rgba(212,88,0,0.1), rgba(212,88,0,0) 22%, rgba(212,88,0,0) 78%, rgba(212,88,0,0.07))',
              }}
            />
          )}

          {featured && (
            <span
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-burnt-orange/18 shadow-[inset_0_0_28px_rgba(212,88,0,0.08)]"
            />
          )}

          {featured && (
            <div className="absolute inset-x-0 top-10 md:top-12 z-10 flex items-center justify-center gap-3">
              <span
                aria-hidden="true"
                className="block h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-burnt-orange/70"
              />
              <span className="text-[11px] md:text-xs italic tracking-[0.12em] text-burnt-orange whitespace-nowrap">
                {popularLabel}
              </span>
              <span
                aria-hidden="true"
                className="block h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-burnt-orange/70"
              />
            </div>
          )}

          {name && (
            <h3 className="text-lg md:text-xl lg:text-2xl font-black tracking-wide uppercase mb-4 font-sans relative break-words hyphens-auto">
              {name}
            </h3>
          )}

          {tagline && (
            <p
              className={`text-sm mb-6 relative ${
                isLight
                  ? 'text-dark-brown/70 group-hover:text-bone-white/70'
                  : 'text-bone-white/70 group-hover:text-dark-brown/70'
              } transition-colors duration-300`}
            >
              {tagline}
            </p>
          )}

          {(price != null || priceLabel) && (
            <div
              className={`text-4xl font-bold text-burnt-orange mb-10 pb-10 border-b transition-colors duration-300 lowercase italic relative ${
                isLight
                  ? 'border-dark-brown/10 group-hover:border-bone-white/10'
                  : 'border-bone-white/10 group-hover:border-dark-brown/10'
              }`}
            >
              {price != null ? (
                <>
                  {price.toLocaleString()}{' '}
                  <span className="text-sm font-sans font-bold uppercase tracking-widest not-italic">
                    {locale === 'ka' ? 'ლარი' : 'GEL'}
                  </span>
                  {priceSuffix && (
                    <span className="text-sm font-sans font-normal not-italic ml-1">
                      {priceSuffix}
                    </span>
                  )}
                </>
              ) : (
                priceLabel
              )}
            </div>
          )}

          {includes && includes.length > 0 && (
            <ul className="space-y-6 text-sm font-medium mb-12 flex-grow relative">
              {includes.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}

          {/* ── CTA area ─────────────────────────────────────────────── */}
          {leadFormSource ? (
            // Two-action: lead-form primary + booking secondary
            <div className="relative z-10 flex flex-col gap-3">
              <LeadCaptureForm
                locale={locale}
                source={leadFormSource}
                label={interestedLabel}
                triggerClassName={cn(
                  'w-full bg-burnt-orange text-bone-white',
                  'hover:opacity-80 backdrop-blur-none',
                  // Suppress default bg-bone-white/95 — burnt-orange always readable on both card states
                )}
              />
              <Link
                href={bookingHref ?? '/booking'}
                className={cn(
                  'block text-center text-[11px] uppercase tracking-[0.12em] font-medium',
                  'transition-colors duration-200 hover:text-burnt-orange',
                  isLight
                    ? 'text-dark-brown/50 group-hover:text-bone-white/50'
                    : 'text-bone-white/50 group-hover:text-dark-brown/50'
                )}
              >
                {bookDirectlyLabel}
              </Link>
            </div>
          ) : (
            // Single CTA (existing behaviour — home page usage)
            <Link
              href={bookingHref ?? '#'}
              className={cn(
                'btn-secondary w-full transition-colors duration-300 relative',
                isLight
                  ? 'group-hover:bg-burnt-orange group-hover:border-burnt-orange group-hover:text-white'
                  : 'bg-burnt-orange border-burnt-orange text-white group-hover:bg-transparent group-hover:border-dark-brown group-hover:text-dark-brown'
              )}
            >
              {ctaLabel || defaultCta}
            </Link>
          )}
        </div>
      </div>
    </Reveal>
  )
}
