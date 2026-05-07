'use client'

import type { Locale } from '@/lib/utils'
import type { HomePageData } from '@/lib/sanity/types'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Reveal } from '@/components/animations/Reveal'

interface JourneyProps {
  locale: Locale
  data?: HomePageData | null
}

export function Journey({ locale, data }: JourneyProps) {
  const stages = data?.journey_stages ?? []

  return (
    <section className="py-16 md:py-32 relative overflow-hidden bg-bone-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-15 grayscale mix-blend-multiply pointer-events-none"
      >
        <source src="/videos/DNA_boomerang.webm" type="video/webm" />
      </video>
      <div className="section-container relative z-10">
        <SectionHeader
          locale={locale}
          titleKa={data?.journey_heading_ka}
          titleEn={data?.journey_heading_en}
        />

        {stages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-20">
            {stages.map((stage, idx) => {
              const num = String(stage.number).padStart(2, '0')
              const title = locale === 'ka' ? stage.title_ka : stage.title_en
              const body = locale === 'ka' ? stage.body_ka : stage.body_en
              return (
                <Reveal key={idx} delay={0.1 * idx}>
                <div className="group">
                  <span className="text-7xl font-black text-burnt-orange/15 font-serif block mb-4 group-hover:text-burnt-orange/30 transition-colors">
                    {num}
                  </span>
                  {title && (
                    <h3 className="text-xl font-bold uppercase tracking-widest mb-1">
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
        )}
      </div>
    </section>
  )
}
