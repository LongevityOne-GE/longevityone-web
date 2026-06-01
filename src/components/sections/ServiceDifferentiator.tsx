'use client'

import type { Locale } from '@/lib/utils'
import { Reveal } from '@/components/animations/Reveal'

interface ServiceDifferentiatorProps {
  locale: Locale
  differentiator: string | null | undefined
}

export function ServiceDifferentiator({ differentiator }: ServiceDifferentiatorProps) {
  if (!differentiator) return null

  return (
    <section className="py-24 md:py-40 bg-dark-brown text-bone-white relative overflow-hidden isolate">
      {/* Heavily blurred amphora-pour background video */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ filter: 'blur(28px) saturate(1.05)', transform: 'scale(1.15)' }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        >
          <source src="/videos/amphora-pour-v2.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Tint + radial vignette so the pull-quote stays the focus */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-dark-brown/55"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at center, rgba(66,41,34,0) 0%, rgba(66,41,34,0.5) 70%, rgba(66,41,34,0.95) 100%)',
        }}
      />

      {/* Soft top/bottom fades for smooth handoff with neighbour sections */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-24 md:h-32 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(66,41,34,0.85) 0%, rgba(66,41,34,0) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 md:h-32 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to top, rgba(66,41,34,0.85) 0%, rgba(66,41,34,0) 100%)',
        }}
      />

      {/* Subtle logo-mark watermark on top of the video */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]">
        <img
          src="/logos/logo-mark.svg"
          alt=""
          className="w-96 md:w-[600px] h-auto opacity-[0.06]"
        />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Decorative top ornament */}
          <Reveal>
            <div
              aria-hidden="true"
              className="mb-10 flex items-center justify-center gap-4 text-burnt-orange"
            >
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-burnt-orange/70" />
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="rotate-45">
                <rect x="3" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-burnt-orange/70" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <span
              aria-hidden="true"
              className="block text-burnt-orange text-6xl md:text-7xl leading-none select-none -mb-4"
            >
              &ldquo;
            </span>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="text-2xl md:text-3xl lg:text-4xl italic leading-snug text-bone-white tracking-tight">
              {differentiator}
            </p>
          </Reveal>

          <Reveal delay={0.26}>
            <span
              aria-hidden="true"
              className="block text-burnt-orange text-6xl md:text-7xl leading-none select-none mt-2 -mb-2"
            >
              &rdquo;
            </span>
          </Reveal>

          <Reveal delay={0.32}>
            <div
              aria-hidden="true"
              className="mt-10 flex items-center justify-center gap-4 text-burnt-orange"
            >
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-burnt-orange/70" />
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="rotate-45">
                <rect x="3" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-burnt-orange/70" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
