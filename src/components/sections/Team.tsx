'use client'

import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import type { HomePageData, HomeFounder } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface TeamProps {
  locale: Locale
  data?: HomePageData | null
  founders?: HomeFounder[] | null
}

export function Team({ locale, data, founders }: TeamProps) {
  const heading = locale === 'ka' ? data?.team_heading_ka : data?.team_heading_en
  const subtext = locale === 'ka' ? data?.team_subtext_ka : data?.team_subtext_en
  const items = founders ?? []
  const aboutHref = `${locale === 'en' ? '/en' : ''}/about`
  const ctaLabel = locale === 'ka' ? 'გუნდის გაცნობა' : 'Meet the Team'
  const eyebrow = locale === 'ka' ? 'ჩვენი ექიმები' : 'Our Physicians'
  const founderLabel = locale === 'ka' ? 'თანადამფუძნებელი' : 'Co-Founder'

  return (
    <section className="py-24 md:py-32 bg-dark-brown text-bone-white relative overflow-hidden isolate">
      {/* Team background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-60"
      >
        <source src="/videos/team-bg.mp4" type="video/mp4" />
      </video>

      {/* Strong vignette so portraits and copy stand out */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at center, rgba(66,41,34,0.55) 0%, rgba(66,41,34,0.85) 60%, rgba(66,41,34,0.98) 100%)',
        }}
      />

      <div className="section-container relative z-10">
        {/* ─── Centered editorial header ─────────────────────────── */}
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <span className="block text-[11px] uppercase tracking-[0.3em] text-burnt-orange font-bold mb-5">
              {eyebrow}
            </span>
          </Reveal>

          {heading && (
            <Reveal delay={0.08}>
              <h2 className="font-serif font-black leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-6xl text-bone-white">
                {heading}
              </h2>
            </Reveal>
          )}

          {/* Ornamental divider */}
          <Reveal delay={0.14}>
            <div
              className="mt-8 mb-8 flex items-center justify-center gap-4 text-burnt-orange"
              aria-hidden="true"
            >
              <span className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-burnt-orange/70" />
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="rotate-45">
                <rect x="3" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-burnt-orange/70" />
            </div>
          </Reveal>

          {subtext && (
            <Reveal delay={0.18}>
              <p className="text-base md:text-lg leading-relaxed text-bone-white/75 max-w-2xl mx-auto">
                {subtext}
              </p>
            </Reveal>
          )}
        </div>

        {/* ─── Portrait row ───────────────────────────────────────── */}
        {items.length > 0 && (
          <div className="mt-14 md:mt-20">
            <Reveal delay={0.2}>
              <Link
                href={aboutHref}
                className="block group"
                aria-label={ctaLabel}
              >
                <div
                  className={[
                    'grid gap-4 md:gap-6 max-w-5xl mx-auto',
                    items.length <= 3
                      ? 'grid-cols-1 sm:grid-cols-3'
                      : items.length === 4
                      ? 'grid-cols-2 md:grid-cols-4'
                      : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
                  ].join(' ')}
                >
                  {items.map((m, i) => {
                    const rawName =
                      (locale === 'ka' ? m.name : m.name_en || m.name) || ''
                    // Strip credentials suffix (MD, PhD, MSc, MBA, etc.)
                    const name = rawName
                      .replace(/[,\s]+(MD|PhD|Ph\.?D\.?|MSc|MBA|DO|RN|FRCS|FACP)\b.*$/i, '')
                      .trim()

                    return (
                      <div
                        key={m._id}
                        className="relative transition-all duration-500 ease-out"
                        style={{
                          animation: `reveal-anim-keyframe 0.7s ease-out ${0.25 + i * 0.08}s both`,
                          opacity: 0,
                        }}
                      >
                        <div className="relative aspect-[3/4] overflow-hidden bg-bone-white/5 ring-1 ring-bone-white/10 group-hover:ring-burnt-orange/40 transition">
                          {m.isFounder && (
                            <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-bone-white/95 backdrop-blur-sm">
                              <span className="text-[9px] uppercase tracking-[0.2em] text-burnt-orange font-bold">
                                {founderLabel}
                              </span>
                            </div>
                          )}
                          {m.photo?.asset?.url ? (
                            <img
                              src={m.photo.asset.url}
                              alt={name}
                              className="w-full h-full object-cover object-[center_20%] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="font-serif text-6xl text-bone-white/15 leading-none">
                                {name.charAt(0) || '·'}
                              </span>
                            </div>
                          )}
                          <div
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                            style={{
                              background:
                                'linear-gradient(to top, rgba(66,41,34,0.95) 0%, rgba(66,41,34,0.4) 60%, transparent 100%)',
                            }}
                          />
                          <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                            <p className="font-serif font-bold text-base md:text-lg text-burnt-orange leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                              {name}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Link>
            </Reveal>
          </div>
        )}

        {/* ─── CTA ────────────────────────────────────────────────── */}
        <Reveal delay={0.4}>
          <div className="mt-14 md:mt-16 flex justify-center">
            <Link
              href={aboutHref}
              className="inline-flex items-center gap-3 group"
            >
              <span className="h-px w-10 bg-burnt-orange transition-all duration-300 group-hover:w-16" />
              <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-bone-white">
                {ctaLabel}
              </span>
              <span className="text-burnt-orange text-lg leading-none transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
