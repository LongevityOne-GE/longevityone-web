'use client'

import type { Locale } from '@/lib/utils'
import type { AboutWhyPillar } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface AboutIntroProps {
  locale: Locale
  title: string
  subtitle?: string | null
  pillars?: AboutWhyPillar[] | null
}

export function AboutIntro({ locale, title, subtitle, pillars }: AboutIntroProps) {
  const items = pillars ?? []
  const eyebrow = locale === 'ka' ? 'ფილოსოფია' : 'Philosophy'

  return (
    <section className="relative bg-bone-white pt-20 md:pt-28 pb-16 md:pb-24 overflow-hidden">
      {/* Subtle ambient backdrop */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-[0.05]"
      >
        <source src="/videos/Monogram_boomerang.webm" type="video/webm" />
      </video>

      <div className="section-container relative z-10">
        {/* ─── Editorial intro: eyebrow + title + philosophy ─────────────── */}
        <div className="max-w-4xl mx-auto text-center mb-14 md:mb-20">
          <Reveal>
            <span className="block text-[11px] uppercase tracking-[0.3em] text-burnt-orange font-bold mb-5">
              {eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1
              className="font-black text-dark-brown leading-[1.08] text-4xl sm:text-5xl md:text-6xl"
              dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br />') }}
            />
          </Reveal>
          {subtitle && (
            <Reveal delay={0.12}>
              <p className="mt-6 text-base md:text-lg text-dark-brown/70 leading-relaxed max-w-2xl mx-auto">
                {subtitle}
              </p>
            </Reveal>
          )}
        </div>

        {/* ─── Pillars: tight horizontal rhythm, no excess whitespace ─── */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 max-w-6xl mx-auto">
            {items.map((pillar, idx) => {
              const num = String(idx + 1).padStart(2, '0')
              const pTitle = locale === 'ka' ? pillar.title_ka : pillar.title_en
              const body = locale === 'ka' ? pillar.body_ka : pillar.body_en

              return (
                <Reveal key={idx} delay={0.08 * idx}>
                  <div className="relative pt-6 border-t border-dark-brown/15">
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="text-base font-bold text-burnt-orange tracking-wider">
                        {num}
                      </span>
                      <span className="h-px flex-1 bg-dark-brown/10" />
                    </div>
                    {pTitle && (
                      <h3 className="text-xl md:text-2xl text-dark-brown leading-snug mb-3">
                        {pTitle}
                      </h3>
                    )}
                    {body && (
                      <p className="text-[15px] text-dark-brown/70 leading-relaxed">
                        {body}
                      </p>
                    )}
                  </div>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
