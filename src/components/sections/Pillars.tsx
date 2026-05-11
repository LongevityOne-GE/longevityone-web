'use client'

import { ArrowRight } from 'lucide-react'
import type { Locale } from '@/lib/utils'
import type { HomeService, HomePageData } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { GodVideo } from '@/components/shared/GodVideo'

interface PillarsProps {
  locale: Locale
  services?: HomeService[] | null
  data?: HomePageData | null
}

export function Pillars({ locale, services, data }: PillarsProps) {
  const pillars = services ?? []

  return (
    <section className="py-16 md:py-32 bg-dark-brown text-bone-white relative overflow-hidden">
      <GodVideo
        src={{ webm: '/videos/columns-bg_boomerang.webm', mp4: '/videos/columns-bg_boomerang.mp4' }}
        overlay="tint"
        tint="dark"
        tintOpacity={0.6}
      />
      <div className="section-container relative z-10 text-center">
        {(data?.pillars_heading_ka || data?.pillars_heading_en) && (
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-12 md:mb-24 font-serif">
              {locale === 'ka' ? data.pillars_heading_ka : data.pillars_heading_en}
            </h2>
          </Reveal>
        )}

        {pillars.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 text-left">
            {pillars.map((pillar, idx) => {
              const title = locale === 'ka' ? pillar.title_ka : pillar.title_en
              const desc = locale === 'ka' ? pillar.summary_ka : pillar.summary_en
              return (
                <Reveal key={pillar._id} delay={0.1 * idx}>
                <div
                  className="border-t border-bone-white/10 pt-10 flex flex-col group cursor-default"
                >
                  {title && (
                    <h3 className="text-2xl font-bold mb-1 group-hover:text-burnt-orange transition-colors">
                      {title}
                    </h3>
                  )}
                  {desc && (
                    <div className="space-y-4 text-sm font-light mb-10 mt-6 flex-grow">
                      <p className="leading-relaxed opacity-90">{desc}</p>
                    </div>
                  )}
                  <a
                    href={`${locale === 'en' ? '/en' : ''}/services/${pillar.slug}`}
                    className="flex items-center text-burnt-orange font-bold uppercase tracking-[0.2em] text-[10px] group-hover:pl-2 transition-all"
                  >
                    {locale === 'ka' ? 'გაიგეთ მეტი' : 'EXPLORE'} <ArrowRight size={14} className="ml-2" />
                  </a>
                </div>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
