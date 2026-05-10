'use client'

import Link from 'next/link'
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
      {/* Smooth fade-in from previous (bone-white) section */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-32 md:h-48 bg-gradient-to-b from-bone-white to-transparent pointer-events-none z-20"
      />
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
        <Reveal delay={0.3}>
          <Link
            href={`${locale === 'en' ? '/en' : ''}/about`}
            className="inline-block mt-10 px-8 py-3 border border-bone-white/60 text-bone-white text-sm font-medium uppercase tracking-widest rounded hover:bg-bone-white hover:text-dark-brown transition-colors"
          >
            {locale === 'ka' ? 'გუნდის გაცნობა' : 'Meet the Team'}
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
