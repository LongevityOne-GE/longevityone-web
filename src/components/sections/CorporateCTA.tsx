'use client'

import type { Locale } from '@/lib/utils'
import { Reveal } from '@/components/animations/Reveal'

interface CorporateCTAProps {
  locale: Locale
  ctaLabel: string | null | undefined
}

export function CorporateCTA({ locale, ctaLabel }: CorporateCTAProps) {
  const heading =
    locale === 'ka'
      ? 'მოაწყვეთ კონსულტაცია თქვენი გუნდისთვის'
      : 'Arrange a Consultation for Your Team'
  const subtext =
    locale === 'ka'
      ? 'ჩვენი კორპორატიული გუნდი შეადგენს პროგრამას თქვენი კომპანიის საჭიროებების მიხედვით.'
      : 'Our corporate team will design a programme tailored to your company\'s needs.'
  const label = ctaLabel || (locale === 'ka' ? 'დაგვიკავშირდით' : 'Get in Touch')

  return (
    <section className="py-20 md:py-32 bg-dark-brown text-bone-white relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/logos/logo-mark.svg"
          alt=""
          className="w-80 md:w-[480px] h-auto opacity-[0.04]"
        />
      </div>

      <div className="section-container relative z-10 text-center max-w-2xl mx-auto">
        <Reveal>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-serif text-bone-white leading-tight mb-6">
            {heading}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-bone-white/70 mb-10 text-lg leading-relaxed">{subtext}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <a href={locale === 'en' ? '/en/contact' : '/contact'} className="btn-primary">
            {label}
          </a>
        </Reveal>
      </div>
    </section>
  )
}
