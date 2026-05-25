import type { Locale } from '@/lib/utils'
import type { AdvisoryBoardPage } from '@/lib/sanity/types'

interface AdvisoryHeroProps {
  locale: Locale
  page: AdvisoryBoardPage
}

export function AdvisoryHero({ locale, page }: AdvisoryHeroProps) {
  const eyebrow = locale === 'ka' ? page.eyebrow_ka : page.eyebrow_en
  const heading = locale === 'ka' ? page.heading_ka : page.heading_en
  const intro = locale === 'ka' ? page.intro_ka : page.intro_en

  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 bg-bone-white overflow-hidden">
      {/* Subtle video texture — same pattern as JourneyHero */}
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

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(231,222,204,0) 20%, rgba(231,222,204,0.9) 100%)',
        }}
      />

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to bottom, rgba(231,222,204,0) 0%, rgba(231,222,204,1) 100%)',
        }}
      />

      <div className="section-container relative z-10 text-center max-w-3xl mx-auto">
        {eyebrow && (
          <p
            className="text-[11px] uppercase tracking-[0.22em] text-burnt-orange font-medium mb-5 animate-hero-in"
            style={{ animationDelay: '0ms' }}
          >
            {eyebrow}
          </p>
        )}

        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black leading-[1.05] mb-6 font-serif text-dark-brown animate-hero-in"
          style={{ animationDelay: '80ms' }}
        >
          {heading}
        </h1>

        {intro && (
          <p
            className="mt-6 text-base md:text-[17px] text-dark-brown/70 leading-relaxed max-w-2xl mx-auto animate-hero-in"
            style={{ animationDelay: '200ms' }}
          >
            {intro}
          </p>
        )}

        {/* Decorative hairlines */}
        <div
          className="mt-10 flex items-center justify-center gap-4 animate-hero-in"
          style={{ animationDelay: '280ms' }}
        >
          <span className="w-12 h-px bg-burnt-orange/40" />
          <img src="/logos/logo-mark.svg" alt="" className="w-8 h-auto opacity-20" />
          <span className="w-12 h-px bg-burnt-orange/40" />
        </div>
      </div>
    </section>
  )
}
