import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Locale } from '@/lib/utils'
import { Reveal } from '@/components/animations/Reveal'
import { GodVideo } from '@/components/shared/GodVideo'
import { LeadCaptureForm } from '@/components/sections/LeadCaptureForm'

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
  const bookingHref = `${prefix}/booking`

  return (
    <section
      id="founder-circle"
      className="scroll-mt-28 relative overflow-hidden bg-dark-brown text-bone-white isolate"
    >
      <GodVideo
        src="/videos/longevity-one-founder-circle-bg.mp4"
        overlay="none"
        fit="cover"
        position="center top"
      />
      
      <div className="section-container relative z-10 py-24 md:py-32">
        <div className="mx-auto max-w-[1200px]">
          {/* Centered Luxury Masthead */}
          <Reveal>
            <div className="flex flex-col items-center justify-center text-center mb-16 md:mb-24">
              <div className="flex items-center gap-6 mb-6">
                <span aria-hidden="true" className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-burnt-orange" />
                <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-burnt-orange drop-shadow-md">
                  {t.label}
                </p>
                <span aria-hidden="true" className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-burnt-orange" />
              </div>
              <h2 className="font-light leading-[1.05] tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-bone-white drop-shadow-2xl">
                {t.heading}
              </h2>
              <p className="mt-6 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.4em] text-bone-white/90 drop-shadow-lg">
                {t.subheading}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-16 items-start">
            {/* Left: Body, Price, CTAs */}
            <div className="lg:col-span-5 flex flex-col">
              <Reveal delay={0.1}>
                <p className="text-sm md:text-base font-light leading-relaxed text-bone-white drop-shadow-lg">
                  {t.body}
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-10 border-l-2 border-burnt-orange pl-5 py-1.5">
                  <span className="block font-light leading-none text-burnt-orange text-2xl md:text-3xl drop-shadow-lg">
                    {t.price}
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="mt-10 md:mt-12 flex flex-col gap-3">
                  <LeadCaptureForm locale={locale} label={t.cta} source="founder_circle" heading="Founder Circle 50" />
                  <Link
                    href={bookingHref}
                    className="group flex items-center justify-between border border-bone-white/40 bg-dark-brown/10 backdrop-blur-sm px-6 py-5 text-[11px] font-bold uppercase tracking-[0.25em] text-bone-white transition-all duration-500 hover:border-bone-white hover:bg-bone-white/20 shadow-xl"
                  >
                    <span>{t.ctaSecondary}</span>
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className="transition-transform duration-500 group-hover:translate-x-1.5"
                    />
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Right: Elegant Benefits Ledger */}
            <div className="lg:col-span-7 lg:pl-12 mt-4 lg:mt-0">
              <div className="border-t border-bone-white/20">
                {t.benefits.map((benefit, i) => (
                  <Reveal key={i} delay={0.15 + i * 0.1}>
                    <div className="group flex items-center gap-5 md:gap-8 border-b border-bone-white/20 px-2 md:px-5 py-4 md:py-5 transition-all duration-500 hover:border-burnt-orange hover:bg-black/20">
                      <span className="shrink-0 text-[10px] md:text-xs font-light tracking-[0.2em] text-burnt-orange/70 transition-colors duration-500 group-hover:text-burnt-orange drop-shadow-md">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm md:text-[15px] font-light leading-relaxed text-bone-white drop-shadow-md transition-transform duration-500 group-hover:translate-x-1.5">
                        {benefit}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
