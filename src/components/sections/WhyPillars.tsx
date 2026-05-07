'use client'

import type { Locale } from '@/lib/utils'
import type { AboutWhyPillar } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface WhyPillarsProps {
  locale: Locale
  pillars: AboutWhyPillar[] | null | undefined
}

export function WhyPillars({ locale, pillars }: WhyPillarsProps) {
  const items = pillars ?? []

  if (items.length === 0) return null

  return (
    <section className="py-16 md:py-32 bg-bone-white">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {items.map((pillar, idx) => {
            const num = String(idx + 1).padStart(2, '0')
            const title = locale === 'ka' ? pillar.title_ka : pillar.title_en
            const body = locale === 'ka' ? pillar.body_ka : pillar.body_en

            return (
              <Reveal key={idx} delay={0.1 * idx}>
                <div className="border-t border-dark-brown/20 pt-8">
                  <span className="text-5xl md:text-6xl font-black text-burnt-orange/30 font-serif block mb-6">
                    {num}
                  </span>
                  {title && (
                    <h3 className="text-xl md:text-2xl font-bold text-dark-brown mb-4">
                      {title}
                    </h3>
                  )}
                  {body && (
                    <p className="text-dark-brown/80 leading-relaxed">
                      {body}
                    </p>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
