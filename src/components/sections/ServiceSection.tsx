'use client'

import type { Locale } from '@/lib/utils'
import type { ServiceDetail } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { PortableTextRenderer } from '@/components/shared/PortableTextRenderer'

interface ServiceSectionProps {
  locale: Locale
  service: ServiceDetail
  index: number
}

export function ServiceSection({ locale, service, index }: ServiceSectionProps) {
  const isOdd = index % 2 === 0
  const title = locale === 'ka' ? service.title_ka : service.title_en
  const summary = locale === 'ka' ? service.summary_ka : service.summary_en
  const intro = locale === 'ka' ? service.intro_ka : service.intro_en
  const body = locale === 'ka' ? service.body_ka : service.body_en
  const differentiator = locale === 'ka' ? service.differentiator_ka : service.differentiator_en
  const targetAudience = locale === 'ka' ? service.targetAudience_ka : service.targetAudience_en

  const forWhomLabel = locale === 'ka' ? 'ვისთვის არის' : "Who It's For"
  const techLabel = locale === 'ka' ? 'გამოყენებული ტექნოლოგიები' : 'Technologies Used'
  const differentiatorLabel = locale === 'ka' ? 'რატომ ჩვენ' : 'Why Us'

  return (
    <section
      id={service.slug}
      className="py-20 md:py-32 border-t border-dark-brown/10 first:border-t-0 bg-bone-white scroll-mt-24"
    >
      <div className="section-container">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start ${
            isOdd ? '' : 'lg:flex-row-reverse'
          }`}
        >
          <div className={isOdd ? 'lg:order-1' : 'lg:order-2'}>
            <Reveal>
              <p className="eyebrow">{`0${index + 1}`}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight font-serif text-dark-brown mb-6">
                {title}
              </h2>
            </Reveal>

            {summary && (
              <Reveal delay={0.15}>
                <p className="text-base md:text-lg text-dark-brown/70 leading-relaxed mb-8">
                  {summary}
                </p>
              </Reveal>
            )}

            {intro && (
              <Reveal delay={0.2}>
                <p className="text-lg md:text-xl font-serif italic text-dark-brown/80 leading-relaxed mb-8 pb-8 border-b border-dark-brown/10">
                  {intro}
                </p>
              </Reveal>
            )}

            {body && (
              <Reveal delay={0.25}>
                <div className="prose-content">
                  <PortableTextRenderer value={body} />
                </div>
              </Reveal>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              {targetAudience && (
                <Reveal delay={0.3}>
                  <div className="border-t border-dark-brown/20 pt-6">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-3">
                      {forWhomLabel}
                    </h4>
                    <p className="text-sm text-dark-brown/80 leading-relaxed">
                      {targetAudience}
                    </p>
                  </div>
                </Reveal>
              )}

              {differentiator && (
                <Reveal delay={0.35}>
                  <div className="border-t border-dark-brown/20 pt-6">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-3">
                      {differentiatorLabel}
                    </h4>
                    <p className="text-sm text-dark-brown/80 leading-relaxed">
                      {differentiator}
                    </p>
                  </div>
                </Reveal>
              )}
            </div>
          </div>

          <div className={`${isOdd ? 'lg:order-2' : 'lg:order-1'} flex flex-col gap-8 lg:sticky lg:top-24`}>
            {service.heroImage?.asset?.url ? (
              <Reveal delay={0.15}>
                <img
                  src={service.heroImage.asset.url}
                  alt={title || ''}
                  className="w-full rounded-lg shadow-lg object-cover aspect-[4/5]"
                />
              </Reveal>
            ) : (
              <div className="w-full aspect-[4/5] bg-dark-brown/5 rounded-lg" aria-hidden="true" />
            )}

            {service.technologies && service.technologies.length > 0 && (
              <Reveal delay={0.25}>
                <div className="border-t border-dark-brown/20 pt-6">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-4">
                    {techLabel}
                  </h4>
                  <ul className="space-y-3">
                    {service.technologies.map((tech) => (
                      <li key={tech.slug} className="flex items-start gap-3">
                        {tech.heroImage?.asset?.url ? (
                          <img
                            src={tech.heroImage.asset.url}
                            alt={tech.name}
                            className="w-10 h-10 rounded object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-dark-brown/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-black text-dark-brown/30 font-serif">
                              {tech.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-dark-brown">{tech.name}</p>
                          <p className="text-xs text-dark-brown/60 leading-relaxed mt-0.5">
                            {locale === 'ka' ? tech.tagline_ka : tech.tagline_en}
                          </p>
                        </div>
                      </li>
                    ))}
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
