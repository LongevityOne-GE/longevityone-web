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
  if (Icon) return <Icon size={28} className="text-burnt-orange mb-6" />
  return <span className="text-3xl mb-6 block">{name}</span>
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
      {/* Medical background video — softened against dark bg */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-30"
      >
        <source src="/videos/longevity-one-medical-light-bg.mp4" type="video/mp4" />
      </video>

      {/* Soft dark overlay so video reads as ambient texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-dark-brown/40"
      />

      {/* Subtle edge fades — light, just enough to imply continuity */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-20 md:h-28 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(66,41,34,0.6) 0%, rgba(66,41,34,0) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-20 md:h-28 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to top, rgba(66,41,34,0.6) 0%, rgba(66,41,34,0) 100%)',
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
            <h2 className="font-serif font-black leading-[1.05] tracking-tight text-3xl sm:text-4xl md:text-5xl text-dark-brown">
              {heading}
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <div
              className="mt-6 mb-6 flex items-center justify-center gap-4 text-burnt-orange"
              aria-hidden="true"
            >
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-burnt-orange/70" />
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="rotate-45">
                <rect x="3" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.2" />
              </svg>
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
                  <div className="relative card-ornamental overflow-hidden p-8 md:p-10 bg-bone-white/40 backdrop-blur-sm flex flex-col h-full border border-dark-brown/10 transition-all duration-500 group-hover:border-burnt-orange/50 group-hover:bg-bone-white/60 group-hover:shadow-[0_20px_60px_-20px_rgba(66,41,34,0.25)] group-hover:-translate-y-1">
                    {/* Number badge — small, top-right, doesn't overlap copy */}
                    <span
                      aria-hidden="true"
                      className="absolute top-6 right-7 text-xs font-bold tracking-[0.2em] text-burnt-orange/70 font-sans select-none transition-colors duration-500 group-hover:text-burnt-orange"
                    >
                      {String(prog.number).padStart(2, '0')}
                    </span>

                    <ProgrammeIcon name={prog.icon} />

                    <h3 className="relative text-xl md:text-2xl font-black font-serif text-dark-brown leading-tight mb-4">
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
                      className="mt-8 block h-px w-10 bg-burnt-orange/60 transition-all duration-500 group-hover:w-20"
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
