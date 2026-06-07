import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Locale } from '@/lib/utils'
import { Reveal } from '@/components/animations/Reveal'
import { GodVideo } from '@/components/shared/GodVideo'

interface FounderCircleBannerProps {
  locale: Locale
}

const content = {
  ka: {
    label: 'ექსკლუზიური შეთავაზება',
    heading: 'დამფუძნებელთა წრე 50',
    subheading: 'მხოლოდ პირველი 50 წევრისთვის',
    body: 'Founder Circle 50 შექმნილია იმ ადამიანებისთვის, რომლებიც ჯანმრთელობასა და აქტიურ დღეგრძელობას საკუთარ მომავალში ინვესტიციად განიხილავენ.',
    benefits: [
      'პერსონალური ექიმი და პირადი კონსიერჟ მენეჯერი',
      'მეტაბოლური აუდიტი სუნთქვითი ტესტით - წელიწადში 3-ჯერ',
      'Red Light Therapy - კლინიკური პროტოკოლის შესაბამისად, ულიმიტოდ',
      'IHHT (ინტერვალური ჰიპოქსიურ-ჰიპეროქსიური თერაპია) - ულიმიტოდ',
      'სპეციალური პირობები დამატებით კვლევებსა და სერვისებზე',
    ],
    price: '3 500 ლარი / წელი',
    cta: 'გახდი Founder Circle 50-ის წევრი',
    ctaSecondary: 'დაჯავშნე უფასო ონლაინ კონსულტაცია',
  },
  en: {
    label: 'Exclusive Offer',
    heading: 'Founder Circle 50',
    subheading: 'For the first 50 members only',
    body: 'Founder Circle 50 is designed for those who treat their health and longevity as an investment in their future.',
    benefits: [
      'Personal physician and private concierge manager',
      'Metabolic audit with breath testing - 3× per year',
      'Red Light Therapy - unlimited, per clinical protocol',
      'IHHT (Interval Hypoxic-Hyperoxic Therapy) - unlimited',
      'Preferential terms on additional tests and services',
    ],
    price: '3,500 GEL / year',
    cta: 'Join Founder Circle 50',
    ctaSecondary: 'Book a free online consultation',
  },
} as const

export function FounderCircleBanner({ locale }: FounderCircleBannerProps) {
  const t = content[locale]
  const prefix = locale === 'en' ? '/en' : ''
  const bookingHref = `${prefix}/booking?type=consultation`

  return (
    <section
      id="founder-circle"
      className="scroll-mt-28 relative overflow-hidden bg-dark-brown text-bone-white isolate"
    >
      <GodVideo
        src={{ webm: '/videos/gods/god-asclepius.webm', mp4: '/videos/gods/god-asclepius.mp4' }}
        overlay="tint"
        tint="dark"
        tintOpacity={0.8}
        position="center top"
      />
      {/* Left-weighted scrim keeps the editorial copy legible over the statue */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(42,26,20,0.97) 0%, rgba(42,26,20,0.82) 42%, rgba(42,26,20,0.45) 100%)',
        }}
      />
      {/* Oversized ghost numeral - exclusivity without a scarcity counter */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute -top-12 right-0 md:right-6 font-black leading-none text-bone-white/[0.04] text-[200px] md:text-[340px]"
      >
        50
      </span>

      <div className="section-container relative z-10 py-20 md:py-32">
        {/* Masthead: hairline + eyebrow */}
        <Reveal>
          <div className="flex items-center gap-5">
            <span aria-hidden="true" className="h-px w-10 bg-burnt-orange" />
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-burnt-orange">
              {t.label}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-y-14 lg:gap-x-20">
          {/* Left: heading, subheading, body, price, CTAs */}
          <div className="lg:col-span-6 flex flex-col">
            <Reveal delay={0.08}>
              <h2 className="font-light leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-6xl text-bone-white">
                {t.heading}
              </h2>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-5 text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-bone-white/55">
                {t.subheading}
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="mt-8 max-w-xl text-base md:text-lg font-light leading-relaxed text-bone-white/75">
                {t.body}
              </p>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="mt-12 border-t border-bone-white/15 pt-8">
                <span className="block font-light leading-none text-burnt-orange text-4xl md:text-5xl">
                  {t.price}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href={bookingHref}
                  className="group inline-flex items-center justify-between gap-6 bg-burnt-orange px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-bone-white transition-colors duration-300 hover:bg-bone-white hover:text-dark-brown"
                >
                  <span>{t.cta}</span>
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href={bookingHref}
                  className="group inline-flex items-center justify-between gap-6 border border-bone-white/30 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-bone-white transition-colors duration-300 hover:border-bone-white hover:bg-bone-white/5"
                >
                  <span>{t.ctaSecondary}</span>
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right: editorial numbered benefits */}
          <div className="lg:col-span-6 lg:border-l lg:border-bone-white/10 lg:pl-20">
            <ul>
              {t.benefits.map((benefit, i) => (
                <Reveal key={i} delay={0.12 + i * 0.08}>
                  <li className="group flex items-baseline gap-6 border-b border-bone-white/10 py-5 first:pt-0">
                    <span className="shrink-0 text-xs font-bold tracking-[0.2em] text-burnt-orange/50 transition-colors duration-300 group-hover:text-burnt-orange">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base md:text-lg font-light leading-relaxed text-bone-white/85 transition-colors duration-300 group-hover:text-bone-white">
                      {benefit}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
