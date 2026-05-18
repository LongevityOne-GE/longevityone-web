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
    <section className="py-20 md:py-32 bg-dark-brown text-bone-white relative overflow-hidden isolate">
      {/* Helix background video — softened so it sits subtly behind copy */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-50"
      >
        <source src="/videos/longevity-helix-v2.mp4" type="video/mp4" />
      </video>

      {/* Dark tint + central vignette so headline reads cleanly */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-dark-brown/70"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at center, rgba(66,41,34,0.5) 0%, rgba(66,41,34,0) 70%)',
        }}
      />

      {/* Soft top fade so the helix reveals smoothly from the section above */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-20 md:h-28 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(66,41,34,0.6) 0%, rgba(66,41,34,0) 100%)',
        }}
      />

      {/* Subtle logo-mark watermark on top of the video */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
        <img
          src="/logos/logo-mark.svg"
          alt=""
          className="w-80 md:w-[480px] h-auto opacity-[0.06] animate-slow-spin"
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
          <a
            href={locale === 'en' ? '/en/contact' : '/contact'}
            className="btn-primary group animate-glow-pulse"
          >
            <span>{label}</span>
            <span
              aria-hidden="true"
              className="text-base leading-none transition-transform duration-300 ease-out group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
