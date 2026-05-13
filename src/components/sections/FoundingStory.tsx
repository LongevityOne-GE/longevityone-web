'use client'

import type { Locale } from '@/lib/utils'
import { Reveal } from '@/components/animations/Reveal'
import { PortableTextRenderer } from '@/components/shared/PortableTextRenderer'

interface FoundingStoryProps {
  locale: Locale
  heading: string | null | undefined
  story: unknown[] | null | undefined
}

export function FoundingStory({ heading, story }: FoundingStoryProps) {
  if (!heading && (!story || story.length === 0)) return null

  return (
    <section className="py-24 md:py-40 bg-bone-white text-dark-brown relative overflow-hidden isolate">
      {/* Decorative columns video, heavily faded and pushed to the edges */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-25 mix-blend-multiply"
      >
        <source src="/videos/columns-bg_boomerang.webm" type="video/webm" />
        <source src="/videos/columns-bg_boomerang.mp4" type="video/mp4" />
      </video>

      {/* Strong center-fade so text area stays clean bone-white */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 80% at center, rgba(231,222,204,1) 0%, rgba(231,222,204,0.92) 45%, rgba(231,222,204,0.3) 100%)',
        }}
      />

      {/* Soft top/bottom fades to blend into adjacent sections */}
      <div
        className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'linear-gradient(to bottom, rgba(231,222,204,1), transparent)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'linear-gradient(to top, rgba(231,222,204,1), transparent)' }}
      />

      {/* Large faded ornamental serif glyph as background flourish */}
      <div
        aria-hidden="true"
        className="absolute -left-8 top-1/2 -translate-y-1/2 font-serif text-[28rem] leading-none text-burnt-orange/[0.06] select-none pointer-events-none hidden lg:block"
      >
        L
      </div>
      <div
        aria-hidden="true"
        className="absolute -right-8 top-1/2 -translate-y-1/2 font-serif text-[28rem] leading-none text-burnt-orange/[0.06] select-none pointer-events-none hidden lg:block"
      >
        1
      </div>

      <div className="section-container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow !mb-6">
              <span aria-hidden="true" className="inline-block w-8 h-px bg-burnt-orange align-middle mr-3" />
              Our Story
              <span aria-hidden="true" className="inline-block w-8 h-px bg-burnt-orange align-middle ml-3" />
            </p>
          </Reveal>

          {heading && (
            <Reveal delay={0.08}>
              <h2 className="font-serif font-black leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-dark-brown">
                {heading}
              </h2>
            </Reveal>
          )}

          {/* Ornamental divider */}
          <Reveal delay={0.18}>
            <div
              className="mt-8 mb-12 flex items-center justify-center gap-4 text-burnt-orange"
              aria-hidden="true"
            >
              <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-burnt-orange/70" />
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="rotate-45">
                <rect x="3" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-burnt-orange/70" />
            </div>
          </Reveal>
        </div>

        {story && story.length > 0 && (
          <Reveal delay={0.25}>
            <div
              className={[
                'mx-auto max-w-2xl lg:max-w-3xl text-pretty',
                'font-serif italic leading-[1.8] text-lg md:text-xl',
                '[&_p]:mb-6 [&_p:last-child]:mb-0',
                '[&_strong]:not-italic [&_strong]:font-semibold',
                '[&_a]:no-underline hover:[&_a]:underline',
                // Elegant drop cap on the very first paragraph
                '[&>div>p:first-of-type::first-letter]:font-serif',
                '[&>div>p:first-of-type::first-letter]:not-italic',
                '[&>div>p:first-of-type::first-letter]:float-left',
                '[&>div>p:first-of-type::first-letter]:text-burnt-orange',
                '[&>div>p:first-of-type::first-letter]:text-7xl',
                '[&>div>p:first-of-type::first-letter]:md:text-8xl',
                '[&>div>p:first-of-type::first-letter]:leading-[0.85]',
                '[&>div>p:first-of-type::first-letter]:mr-3',
                '[&>div>p:first-of-type::first-letter]:mt-2',
                '[&>div>p:first-of-type::first-letter]:font-black',
              ].join(' ')}
            >
              <PortableTextRenderer value={story} />
            </div>
          </Reveal>
        )}

        {/* Stat row */}
        <Reveal delay={0.4}>
          <div className="mt-20 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14 max-w-3xl mx-auto">
            {[
              { value: '5', label: 'Founding physicians' },
              { value: '20+', label: 'Years of friendship' },
              { value: '1', label: 'Shared mission' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden="true" className="hidden md:block w-px h-8 bg-dark-brown/20 -ml-7" />
                )}
                <span className="font-serif font-black text-3xl md:text-4xl text-burnt-orange leading-none">
                  {stat.value}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-dark-brown/70 leading-tight whitespace-nowrap">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Closing flourish */}
        <Reveal delay={0.5}>
          <div
            className="mt-16 flex items-center justify-center gap-3"
            aria-hidden="true"
          >
            <span className="h-px w-10 bg-dark-brown/30" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-sans text-dark-brown/50">
              Longevity One
            </span>
            <span className="h-px w-10 bg-dark-brown/30" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
