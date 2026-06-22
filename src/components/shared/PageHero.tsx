'use client'

import type { Locale } from '@/lib/utils'
import { renderMultiline } from '@/lib/text'

interface PageHeroProps {
  locale: Locale
  eyebrow?: string | null
  title: string
  subtitle?: string | null
}

export function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-bone-white overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-[0.07]"
      >
        <source src="/videos/Monogram_boomerang.webm" type="video/webm" />
      </video>

      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse at center, rgba(231,222,204,0) 20%, rgba(231,222,204,0.85) 100%)' }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(231,222,204,0) 0%, rgba(231,222,204,1) 100%)' }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10 text-center max-w-4xl mx-auto">
        {eyebrow && (
          <p className="eyebrow mb-6 animate-hero-in" style={{ animationDelay: '0ms' }}>
            {eyebrow}
          </p>
        )}

        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 text-dark-brown animate-hero-in"
          style={{ animationDelay: '80ms' }}
        >
          {renderMultiline(title)}
        </h1>

        {subtitle && (
          <p
            className="text-lg md:text-xl text-dark-brown/80 leading-relaxed max-w-2xl mx-auto animate-hero-in"
            style={{ animationDelay: '160ms' }}
          >
            {subtitle}
          </p>
        )}

        <div
          className="mt-10 flex items-center justify-center gap-4 animate-hero-in"
          style={{ animationDelay: '240ms' }}
        >
          <span className="w-12 h-px bg-burnt-orange/40" />
          <img src="/logos/logo-mark.svg" alt="" className="w-8 h-auto opacity-20" />
          <span className="w-12 h-px bg-burnt-orange/40" />
        </div>
      </div>
    </section>
  )
}
