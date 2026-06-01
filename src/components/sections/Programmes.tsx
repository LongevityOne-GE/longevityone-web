'use client'

import { Briefcase, Users, Handshake, type LucideIcon } from 'lucide-react'
import type { Locale } from '@/lib/utils'
import type { CorporateProgramme } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

const iconMap: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  users: Users,
  handshake: Handshake,
}

function ProgrammeIcon({ name }: { name: string | null }) {
  if (!name) return null
  const Icon = iconMap[name.toLowerCase()]
  if (Icon)
    return (
      <Icon
        size={28}
        className="text-burnt-orange transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
      />
    )
  return <span className="text-3xl block">{name}</span>
}

interface ProgrammesProps {
  locale: Locale
  programmes: CorporateProgramme[] | null | undefined
}

export function Programmes({ locale, programmes }: ProgrammesProps) {
  if (!programmes || !programmes.length) return null

  const eyebrow = locale === 'ka' ? 'პროგრამები' : 'Programmes'
  const heading =
    locale === 'ka'
      ? 'სამი გზა ჯანმრთელი გუნდისკენ'
      : 'Three Paths to a Healthier Team'
  const subhead =
    locale === 'ka'
      ? 'თითოეული პროგრამა მორგებულია თქვენი კომპანიის სტრუქტურასა და კულტურაზე.'
      : 'Each programme is tailored to your company\'s structure and culture.'

  return (
    <section
      id="programmes"
      className="relative py-24 md:py-32 bg-dark-brown text-dark-brown overflow-hidden isolate"
    >
      {/* Medical background video - softened against dark bg */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90"
      >
        <source src="/videos/longevity-one-medical-light-bg.mp4" type="video/mp4" />
      </video>

      {/* Subtle edge fades - light, just enough to imply continuity */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-16 md:h-20 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(66,41,34,0.35) 0%, rgba(66,41,34,0) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-16 md:h-20 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to top, rgba(66,41,34,0.35) 0%, rgba(66,41,34,0) 100%)',
        }}
      />

      <div className="section-container relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <Reveal>
            <span className="block text-[11px] uppercase tracking-[0.3em] text-burnt-orange font-bold mb-5">
              {eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-black leading-[1.05] tracking-tight text-3xl sm:text-4xl md:text-5xl text-dark-brown">
              {heading}
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <div
              className="mt-6 mb-6 flex items-center justify-center gap-4 text-burnt-orange"
              aria-hidden="true"
            >
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-burnt-orange/70" />
              <span
                aria-hidden="true"
                className="inline-block h-6 w-6 bg-burnt-orange"
                style={{
                  WebkitMaskImage: 'url(/logos/logo-mark.svg)',
                  maskImage: 'url(/logos/logo-mark.svg)',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                }}
              />
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-burnt-orange/70" />
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="text-base md:text-lg text-dark-brown/75 leading-relaxed max-w-xl mx-auto">
              {subhead}
            </p>
          </Reveal>
        </div>

        {/* Programme cards (dark glassy variant) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {programmes.map((prog, idx) => {
            const title = locale === 'ka' ? prog.title_ka : prog.title_en
            const body = locale === 'ka' ? prog.body_ka : prog.body_en

            return (
              <Reveal key={idx} delay={0.1 * idx} className="h-full">
                <div className="group h-full">
                  <div className="relative card-ornamental overflow-hidden p-8 md:p-10 bg-bone-white/40 backdrop-blur-sm flex flex-col h-full border border-dark-brown/10 transition-all duration-500 ease-out group-hover:border-burnt-orange/50 group-hover:bg-bone-white/70 group-hover:shadow-[0_30px_70px_-20px_rgba(212,88,0,0.35)] group-hover:-translate-y-2">
                    {/* Sheen sweep on hover */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-y-8 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-bone-white/40 to-transparent opacity-0 transition-all duration-[900ms] ease-out group-hover:left-[150%] group-hover:opacity-100"
                    />

                    {/* Top row: icon + number on opposite sides, no overlap */}
                    <div className="relative flex items-center justify-between mb-6">
                      <ProgrammeIcon name={prog.icon} />
                      <span
                        aria-hidden="true"
                        className="text-xs font-bold tracking-[0.2em] text-burnt-orange/70 font-sans select-none transition-all duration-500 group-hover:text-burnt-orange group-hover:scale-110"
                      >
                        {String(prog.number).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="relative text-xl md:text-2xl font-black text-dark-brown leading-tight mb-4 transition-colors duration-500 group-hover:text-burnt-orange">
                      {title}
                    </h3>
                    {body && (
                      <p className="relative text-sm md:text-base text-dark-brown/75 leading-relaxed flex-grow">
                        {body}
                      </p>
                    )}

                    {/* Bottom hairline accent on hover */}
                    <span
                      aria-hidden="true"
                      className="mt-8 block h-px w-10 bg-burnt-orange/60 transition-all duration-500 group-hover:w-24 group-hover:bg-burnt-orange"
                    />
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
