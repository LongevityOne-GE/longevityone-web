'use client'

import type { Locale } from '@/lib/utils'
import type { HomePageData } from '@/lib/sanity/types'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Reveal } from '@/components/animations/Reveal'
import { GodVideo } from '@/components/shared/GodVideo'

interface JourneyProps {
  locale: Locale
  data?: HomePageData | null
}

export function Journey({ locale, data }: JourneyProps) {
  const stages = data?.journey_stages ?? []

  return (
    <section className="py-16 md:py-32 relative overflow-hidden bg-bone-white">
      <GodVideo
        src="/videos/DNA_boomerang.webm"
        opacity={0.35}
        filter="grayscale(1) contrast(1.1)"
        overlay="fade"
        tint="light"
        tintOpacity={1}
      />
      <div className="section-container relative z-10">
        <SectionHeader
          locale={locale}
          titleKa={data?.journey_heading_ka}
          titleEn={data?.journey_heading_en}
        />

        {stages.length > 0 && (
          <div className="relative mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
              {stages.map((stage, idx) => {
                const num = String(stage.number).padStart(2, '0')
                const title = locale === 'ka' ? stage.title_ka : stage.title_en
                const body = locale === 'ka' ? stage.body_ka : stage.body_en
                return (
                  <Reveal key={idx} delay={0.1 * idx}>
                  <div className="group relative pt-6 lg:pt-0">
                    <span className="relative z-10 text-7xl font-black text-burnt-orange/25 font-serif block mb-4 transition-all duration-500 group-hover:text-burnt-orange group-hover:-translate-y-1">
                      {num}
                    </span>
                    {title && (
                      <h3 className="text-xl font-bold uppercase tracking-widest mb-1 transition-colors duration-300 group-hover:text-burnt-orange">
                        {title}
                      </h3>
                    )}
                    {body && (
                      <div className="space-y-4 text-sm leading-relaxed mt-6">
                        <p className="font-medium text-dark-brown">{body}</p>
                      </div>
                    )}
                  </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
