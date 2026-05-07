'use client'

import type { Locale } from '@/lib/utils'
import type { HomePageData } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface TeamProps {
  locale: Locale
  data?: HomePageData | null
}

export function Team({ locale, data }: TeamProps) {
  const heading = locale === 'ka' ? data?.team_heading_ka : data?.team_heading_en
  const subtext = locale === 'ka' ? data?.team_subtext_ka : data?.team_subtext_en

  return (
    <section className="py-20 md:py-40 bg-dark-brown text-bone-white text-center relative overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/videos/Monogram_boomerang.webm" type="video/webm" />
        <source src="/videos/Monogram_boomerang.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-dark-brown/90 pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        {heading && (
          <Reveal>
            <h2 className="text-3xl sm:text-5xl md:text-8xl font-black mb-6 md:mb-8 leading-tight font-serif">
              {heading}
            </h2>
          </Reveal>
        )}
        {subtext && (
          <Reveal delay={0.15}>
            <div className="max-w-2xl mx-auto space-y-6">
              <p className="text-xl md:text-2xl font-light leading-relaxed">{subtext}</p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
