import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import { Reveal } from '@/components/animations/Reveal'

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
  variant = 'light',
  delay = 0,
  className = '',
  bookingHref,
}: PackageCardProps) {
  const isLight = variant === 'light'
  const defaultCta = locale === 'ka' ? 'არჩევა' : 'SELECT'

  return (
    <Reveal delay={delay} className={`h-full ${className}`}>
      <div className="filter drop-shadow-lg group h-full">
        <div
          className={`card-ornamental overflow-hidden transition-colors duration-300 px-10 md:px-12 lg:px-16 pt-16 md:pt-20 lg:pt-24 pb-16 md:pb-20 lg:pb-24 flex flex-col h-full ${
            isLight
              ? 'bg-bone-white text-dark-brown group-hover:bg-dark-brown group-hover:text-bone-white'
              : 'bg-dark-brown text-bone-white group-hover:bg-bone-white group-hover:text-dark-brown'
          }`}
        >
          {name && (
            <h3 className="text-lg md:text-xl lg:text-2xl font-black tracking-wide uppercase mb-4 font-sans">
              {name}
            </h3>
          )}

          {tagline && (
            <p
              className={`text-sm mb-6 ${
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
              className={`text-4xl font-bold text-burnt-orange mb-10 pb-10 border-b transition-colors duration-300 font-serif lowercase italic ${
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
            <ul className="space-y-6 text-sm font-medium mb-12 flex-grow">
              {includes.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}

          <Link
            href={bookingHref ?? '#'}
            className={`btn-secondary w-full transition-colors duration-300 ${
              isLight
                ? 'group-hover:bg-burnt-orange group-hover:border-burnt-orange group-hover:text-white'
                : 'bg-burnt-orange border-burnt-orange text-white group-hover:bg-transparent group-hover:border-dark-brown group-hover:text-dark-brown'
            }`}
          >
            {ctaLabel || defaultCta}
          </Link>
        </div>
      </div>
    </Reveal>
  )
}
