'use client'

import Link from 'next/link'
import type { Locale } from '@/lib/utils'
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
    <section className="py-32 bg-bone-white relative overflow-hidden">
      <GodVideo
        src="/videos/gods/webm/god-apollo-original-boomerang.webm"
        overlay="tint"
        tint="light"
        tintOpacity={0.8}
      />
      <div className="section-container relative z-10">
        <div className="flex flex-col md:flex-row gap-20">
          <div className="md:w-1/3">
            <SectionHeader
              locale={locale}
              titleKa={data?.tech_heading_ka}
              titleEn={data?.tech_heading_en}
              subtitleKa={data?.tech_intro_ka}
              subtitleEn={data?.tech_intro_en}
            />
          </div>

          {techs.length > 0 && (
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              {techs.map((tech, idx) => {
                const href = `${locale === 'en' ? '/en' : ''}/technologies${
                  tech.anchor ? `#${tech.anchor}` : ''
                }`
                return (
                  <Reveal key={tech.name} delay={0.1 * idx}>
                    <Link
                      href={href}
                      className="block border-t border-dark-brown/10 pt-6 group transition-colors duration-300 hover:border-burnt-orange/60"
                    >
                      <h4 className="text-2xl font-bold mb-1 transition-colors duration-300 group-hover:text-burnt-orange">
                        {tech.name}
                      </h4>
                      <p className="text-sm font-bold text-dark-brown leading-tight mb-1">
                        {locale === 'ka' ? tech.tagline_ka : tech.tagline_en}
                      </p>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
