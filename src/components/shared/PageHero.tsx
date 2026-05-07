'use client'

import type { Locale } from '@/lib/utils'

interface PageHeroProps {
  locale: Locale
  eyebrow?: string | null
  title: string
  subtitle?: string | null
}

export function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-bone-white overflow-hidden">
      {/* Logo watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/logos/logo-mark.svg"
          alt=""
          className="w-64 md:w-96 h-auto opacity-[0.06]"
        />
      </div>

      <div className="section-container relative z-10 text-center max-w-4xl mx-auto">
        {eyebrow && (
          <p className="eyebrow mb-6 animate-hero-in" style={{ animationDelay: '0ms' }}>
            {eyebrow}
          </p>
        )}

        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 font-serif text-dark-brown animate-hero-in"
          style={{ animationDelay: '80ms' }}
          dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br />') }}
        />

        {subtitle && (
          <p
            className="text-lg md:text-xl text-dark-brown/80 leading-relaxed max-w-2xl mx-auto animate-hero-in"
            style={{ animationDelay: '160ms' }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
