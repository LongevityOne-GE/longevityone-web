'use client'

import { localizedTechName, type Locale } from '@/lib/utils'
import type { ServiceDetail } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { PortableTextRenderer } from '@/components/shared/PortableTextRenderer'

interface ServiceBodyProps {
  locale: Locale
  service: ServiceDetail
}

export function ServiceBody({ locale, service }: ServiceBodyProps) {
  const intro = locale === 'ka' ? service.intro_ka : service.intro_en
  const body = locale === 'ka' ? service.body_ka : service.body_en
  const targetAudience = locale === 'ka' ? service.targetAudience_ka : service.targetAudience_en
  const forWhomLabel = locale === 'ka' ? 'ვისთვის არის' : 'Who It\'s For'
  const techLabel = locale === 'ka' ? 'გამოყენებული ტექნოლოგიები' : 'Technologies Used'

  return (
    <section className="py-20 md:py-32 bg-bone-white">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          <div className="lg:col-span-2">
            {intro && (
              <Reveal>
                <p className="text-xl md:text-2xl font-serif italic text-dark-brown/80 leading-relaxed mb-12 pb-12 border-b border-dark-brown/10">
                  {intro}
                </p>
              </Reveal>
            )}

            {body && (
              <Reveal delay={0.1}>
                <PortableTextRenderer value={body} />
              </Reveal>
            )}
          </div>

          <div className="space-y-12">
            {targetAudience && (
              <Reveal delay={0.15}>
                <div className="border-t border-dark-brown/20 pt-8">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-4">
                    {forWhomLabel}
                  </h4>
                  <p className="text-sm text-dark-brown/80 leading-relaxed">
                    {targetAudience}
                  </p>
                </div>
              </Reveal>
            )}

            {service.technologies && service.technologies.length > 0 && (
              <Reveal delay={0.2}>
                <div className="border-t border-dark-brown/20 pt-8">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-6">
                    {techLabel}
                  </h4>
                  <ul className="space-y-4">
                    {service.technologies.map((tech) => {
                      const techDisplay = localizedTechName(tech, locale)
                      return (
                      <li key={tech.slug} className="flex items-start gap-3">
                        {tech.heroImage?.asset?.url ? (
                          <img
                            src={tech.heroImage.asset.url}
                            alt={techDisplay}
                            className="w-10 h-10 rounded object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-dark-brown/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-black text-dark-brown/30 font-serif">
                              {techDisplay.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-dark-brown">{techDisplay}</p>
                          <p className="text-xs text-dark-brown/60 leading-relaxed mt-0.5">
                            {locale === 'ka' ? tech.tagline_ka : tech.tagline_en}
                          </p>
                        </div>
                      </li>
                      )
                    })}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
