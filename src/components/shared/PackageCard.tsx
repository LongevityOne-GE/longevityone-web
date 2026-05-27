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
  isFeatured,
  variant = 'light',
  delay = 0,
  className = '',
  bookingHref,
}: PackageCardProps) {
  const isLight = variant === 'light'
  const defaultCta = locale === 'ka' ? 'არჩევა' : 'SELECT'
  const featured = isFeatured === true
  const popularLabel = locale === 'ka' ? 'ყველაზე პოპულარული' : 'Most Popular'

  return (
    <Reveal delay={delay} className={`h-full ${className}`}>
      <div
        className={`group h-full relative transition-transform duration-500 ease-out ${
          featured
            ? 'md:-translate-y-4 md:drop-shadow-[0_30px_60px_-20px_rgba(212,88,0,0.45)] filter'
            : 'filter drop-shadow-lg'
        }`}
      >
        {/* ─── Featured: animated shimmering edge ────────────────────────
           A single masked span behind the card with a slowly-rotating
           conic gradient. The keyframe scales it to 1.025x of the card,
           and the card-ornamental mask follows that scale — so the only
           visible part is a thin glowing halo around the card silhouette.
           Light beads travel around the edge like polished metal.
           Reduced-motion: animation pauses (handled in globals.css).   */}
        {featured && (
          <span
            aria-hidden="true"
            className="pkg-shimmer absolute inset-0 card-ornamental pointer-events-none"
          />
        )}

        <div
          className={`card-ornamental overflow-hidden transition-colors duration-300 px-10 md:px-12 lg:px-16 pt-16 md:pt-20 lg:pt-24 pb-16 md:pb-20 lg:pb-24 flex flex-col h-full relative ${
            isLight
              ? 'bg-bone-white text-dark-brown group-hover:bg-dark-brown group-hover:text-bone-white'
              : 'bg-dark-brown text-bone-white group-hover:bg-bone-white group-hover:text-dark-brown'
          }`}
        >
          {/* Inside-card glow at the top, very subtle spotlight on featured. */}
          {featured && (
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-32 pointer-events-none opacity-90"
              style={{
                background:
                  'radial-gradient(ellipse at top, rgba(212,88,0,0.18), rgba(212,88,0,0) 70%)',
              }}
            />
          )}

          {/* Classical chapter-marker "Most Popular" label above the title.
             Italic serif, tracked, with tapered burnt-orange hairlines on
             either side. No chip, no dots — magazine pull-quote feel.    */}
          {featured && (
            <div className="relative flex items-center justify-center gap-3 mb-6 -mt-2">
              <span
                aria-hidden="true"
                className="block h-px w-10 md:w-14 bg-burnt-orange/55"
              />
              <span className="text-[11px] md:text-xs font-serif italic tracking-[0.12em] text-burnt-orange whitespace-nowrap">
                {popularLabel}
              </span>
              <span
                aria-hidden="true"
                className="block h-px w-10 md:w-14 bg-burnt-orange/55"
              />
            </div>
          )}

          {name && (
            <h3 className="text-lg md:text-xl lg:text-2xl font-black tracking-wide uppercase mb-4 font-sans relative">
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
              className={`text-4xl font-bold text-burnt-orange mb-10 pb-10 border-b transition-colors duration-300 font-serif lowercase italic relative ${
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

          <Link
            href={bookingHref ?? '#'}
            className={`btn-secondary w-full transition-colors duration-300 relative ${
              isLight
                ? 'group-hover:bg-burnt-orange group-hover:border-burnt-orange group-hover:text-white'
                : 'bg-burnt-orange border-burnt-orange text-white group-hover:bg-transparent group-hover:border-dark-brown group-hover:text-dark-brown'
            } ${featured ? 'bg-burnt-orange border-burnt-orange text-white' : ''}`}
          >
            {ctaLabel || defaultCta}
          </Link>
        </div>
      </div>
    </Reveal>
  )
}
