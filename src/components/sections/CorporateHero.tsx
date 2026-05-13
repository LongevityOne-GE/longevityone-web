'use client'

import type { Locale } from '@/lib/utils'

interface CorporateHeroProps {
  locale: Locale
  title: string
  subtitle?: string | null
}

export function CorporateHero({ locale, title, subtitle }: CorporateHeroProps) {
  const eyebrow = locale === 'ka' ? 'კორპორატიული ჯანმრთელობა' : 'For Forward-Thinking Companies'
  const scrollText = locale === 'ka' ? 'პროგრამები' : 'Programmes'

  return (
    <section className="relative min-h-[88vh] flex items-center pt-32 pb-24 md:pt-40 md:pb-32 bg-dark-brown text-bone-white overflow-hidden isolate">
      {/* Vascular HUD background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/videos/longevity-one-vascular-hud-loop.mp4" type="video/mp4" />
      </video>

      {/* Tint + vignette so text reads cleanly */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-dark-brown/55"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(66,41,34,0.85) 0%, rgba(66,41,34,0.3) 60%, rgba(66,41,34,0) 100%)',
        }}
      />

      {/* Bottom fade into next bone-white section */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-32 md:h-48 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(231,222,204,0) 0%, rgba(231,222,204,1) 100%)',
        }}
      />

      <div className="section-container relative z-10">
        <div className="max-w-3xl">
          <p
            className="text-[11px] uppercase tracking-[0.3em] text-burnt-orange font-bold mb-6 animate-hero-in"
            style={{ animationDelay: '0ms' }}
          >
            {eyebrow}
          </p>

          <h1
            className="font-serif font-black leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-bone-white mb-6 animate-hero-in"
            style={{ animationDelay: '80ms' }}
            dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br />') }}
          />

          {subtitle && (
            <p
              className="text-lg md:text-xl text-bone-white/80 leading-relaxed max-w-2xl mb-10 animate-hero-in"
              style={{ animationDelay: '160ms' }}
            >
              {subtitle}
            </p>
          )}

          <a
            href="#programmes"
            className="inline-flex items-center gap-3 group text-bone-white animate-hero-in"
            style={{ animationDelay: '240ms' }}
          >
            <span className="h-px w-8 bg-burnt-orange transition-all duration-300 group-hover:w-14" />
            <span className="text-[11px] uppercase tracking-[0.3em] font-bold">
              {scrollText}
            </span>
            <span className="text-burnt-orange text-lg leading-none transition-transform duration-300 group-hover:translate-y-1">
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
