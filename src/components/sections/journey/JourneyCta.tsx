import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import type { JourneyPage } from '@/lib/sanity/types'

interface JourneyCtaProps {
  locale: Locale
  page: JourneyPage | null
}

export function JourneyCta({ locale, page }: JourneyCtaProps) {
  const eyebrow = locale === 'ka' ? page?.ctaHeading_ka : page?.ctaHeading_en
  const body = locale === 'ka' ? page?.ctaBody_ka : page?.ctaBody_en
  const primary = locale === 'ka' ? page?.primaryCtaLabel_ka : page?.primaryCtaLabel_en
  const secondary = locale === 'ka' ? page?.secondaryCtaLabel_ka : page?.secondaryCtaLabel_en
  const prefix = locale === 'en' ? '/en' : ''

  if (!eyebrow && !body && !primary && !secondary) return null

  return (
    <section className="bg-bone-white py-24 md:py-32 border-t border-dark-brown/10">
      <div className="section-container">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="text-[11px] uppercase tracking-[0.2em] text-burnt-orange font-bold mb-6">
              {eyebrow}
            </p>
          )}
          {body && (
            <p className="text-2xl md:text-3xl text-dark-brown leading-snug">
              {body}
            </p>
          )}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            {primary && (
              <Link href={`${prefix}/book`} className="btn-primary">
                <span>{primary}</span>
                <span aria-hidden="true">→</span>
              </Link>
            )}
            {secondary && (
              <Link href={`${prefix}/packages`} className="btn-secondary">
                <span>{secondary}</span>
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
