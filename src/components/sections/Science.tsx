'use client'

import type { Locale } from '@/lib/utils'
import type { HomeTech, HomePageData } from '@/lib/sanity/types'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Reveal } from '@/components/animations/Reveal'

interface ScienceProps {
  locale: Locale
  technologies?: HomeTech[] | null
  data?: HomePageData | null
}

export function Science({ locale, technologies, data }: ScienceProps) {
  const techs = technologies ?? []

  return (
    <section className="py-32 bg-bone-white relative overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/videos/gods/webm/god-apollo-original-boomerang.webm" type="video/webm" />
        
      </video>
      <div className="absolute inset-0 bg-bone-white/80 pointer-events-none" />
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
              {techs.map((tech, idx) => (
                <Reveal key={tech.name} delay={0.1 * idx}>
                  <div className="border-t border-dark-brown/10 pt-6">
                    <h4 className="text-2xl font-bold mb-1">{tech.name}</h4>
                    <p className="text-sm font-bold text-dark-brown leading-tight mb-1">
                      {locale === 'ka' ? tech.tagline_ka : tech.tagline_en}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
