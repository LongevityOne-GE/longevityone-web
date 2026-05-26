'use client'

import Link from 'next/link'
import { localizedTechName, type Locale } from '@/lib/utils'
import type { HomeTech, HomePageData } from '@/lib/sanity/types'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Reveal } from '@/components/animations/Reveal'
import { GodVideo } from '@/components/shared/GodVideo'

interface ScienceProps {
  locale: Locale
  technologies?: HomeTech[] | null
  data?: HomePageData | null
}

export function Science({ locale, technologies, data }: ScienceProps) {
  const techs = technologies ?? []

  return (
    <section className="py-16 md:py-32 bg-bone-white relative overflow-hidden">
      <GodVideo
        src="/videos/gods/webm/god-apollo-original-boomerang.webm"
        overlay="tint"
        tint="light"
        tintOpacity={0.8}
      />
      <div className="section-container relative z-10">
        <SectionHeader
          locale={locale}
          titleKa={data?.tech_heading_ka}
          titleEn={data?.tech_heading_en}
          subtitleKa={data?.tech_intro_ka}
          subtitleEn={data?.tech_intro_en}
        />

        {techs.length > 0 && (
          <div className="relative mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 relative">
              {techs.map((tech, idx) => {
                const href = `${locale === 'en' ? '/en' : ''}/technologies${
                  tech.anchor ? `#${tech.anchor}` : ''
                }`
                const num = String(idx + 1).padStart(2, '0')
                const displayName = localizedTechName(tech, locale)
                return (
                  <Reveal key={tech.name} delay={0.1 * idx}>
                    <Link
                      href={href}
                      className="group relative block pt-6 lg:pt-0 cursor-pointer"
                    >
                      <span className="relative z-10 text-7xl font-black text-burnt-orange/25 font-serif block mb-4 transition-all duration-500 group-hover:text-burnt-orange group-hover:-translate-y-1">
                        {num}
                      </span>
                      <h3 className="inline text-xl font-bold uppercase tracking-widest transition-colors duration-300 group-hover:text-burnt-orange bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_1px] bg-left-bottom group-hover:bg-[length:100%_1px] [transition:background-size_400ms_ease,color_300ms_ease]">
                        {displayName}
                      </h3>
                      <p className="text-sm leading-relaxed font-medium text-dark-brown/80 mt-3">
                        {locale === 'ka' ? tech.tagline_ka : tech.tagline_en}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-burnt-orange">
                        {locale === 'ka' ? 'გაიგე მეტი' : 'Learn more'}
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-transform duration-300 group-hover:translate-x-1.5"
                          aria-hidden="true"
                        >
                          <line x1="1" y1="5" x2="12" y2="5" />
                          <polyline points="8 1 12 5 8 9" />
                        </svg>
                      </span>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
