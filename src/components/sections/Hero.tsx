import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import type { HomePageData } from '@/lib/sanity/types'
import { GodVideo } from '@/components/shared/GodVideo'

interface HeroProps {
  locale: Locale
  data?: HomePageData | null
}

export function Hero({ locale, data }: HeroProps) {
  const prefix = locale === 'en' ? '/en' : ''
  const bookingHref = `${prefix}/booking?type=consultation`
  const h1 = locale === 'ka' ? data?.hero_h1_ka : data?.hero_h1_en
  const h2 = locale === 'ka' ? data?.hero_h2_ka : data?.hero_h2_en
  const body = locale === 'ka' ? data?.hero_body_ka : data?.hero_body_en
  const ctaPrimary = locale === 'ka' ? data?.hero_cta_primary_ka : data?.hero_cta_primary_en
  const ctaSecondary = locale === 'ka' ? data?.hero_cta_secondary_ka : data?.hero_cta_secondary_en

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
      <GodVideo
        src="/videos/gods/webm/god-discobolus-original-boomerang.webm"
        opacity={0.15}
        position="center top"
        preload="none"
      />

      <div className="section-container relative z-10 text-center">
        {h1 && (
          <h1
            className="text-4xl sm:text-6xl md:text-8xl font-black leading-[1.05] mb-6 md:mb-8 animate-slide-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
            dangerouslySetInnerHTML={{ __html: h1.replace(/\n/g, '<br />') }}
          />
        )}

        {h2 && (
          <p
            className="text-lg sm:text-2xl font-light mb-6 md:mb-8 italic animate-fade-in"
            style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
          >
            {h2}
          </p>
        )}

        {body && (
          <div
            className="max-w-2xl mx-auto space-y-6 text-dark-brown/90 leading-relaxed mb-12 animate-fade-in"
            style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
          >
            <p className="text-xl">{body}</p>
          </div>
        )}

        <div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up"
          style={{ animationDelay: '1s', animationFillMode: 'both' }}
        >
          {ctaPrimary && (
            <Link
              href={bookingHref}
              className="btn-primary w-full sm:w-auto sm:min-w-[280px]"
            >
              {ctaPrimary} <span>→</span>
            </Link>
          )}
          {ctaSecondary && (
            <Link
              href={bookingHref}
              className="btn-secondary w-full sm:w-auto sm:min-w-[240px]"
            >
              {ctaSecondary} <span>→</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
