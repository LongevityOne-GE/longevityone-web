'use client'

import { useState } from 'react'
import { localizedTechName, type Locale } from '@/lib/utils'
import type { ServiceDetail } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { PortableTextRenderer } from '@/components/shared/PortableTextRenderer'

interface ServiceSectionProps {
  locale: Locale
  service: ServiceDetail
  index: number
}

const ICON_PATHS: Record<string, string> = {
  dna: 'M7 2v4m10-4v4M7 18v4m10-4v4M4 7h4m8 0h4M4 17h4m8 0h4M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  zap: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
}

const GOD_VIDEOS: Record<string, string> = {
  longevity: '/videos/gods/webm/god-asclepius-original-boomerang.webm',
  metabolic: '/videos/gods/webm/god-hygieia-original-boomerang.webm',
  performance: '/videos/gods/webm/god-discobolus-original-boomerang.webm',
}

const GOD_VIDEO_FALLBACK = '/videos/gods/webm/godess1-boomerang.webm'

const GOD_CAPTIONS: Record<string, { ka: string; en: string }> = {
  longevity: {
    ka: 'ასკლეპიოსი, მკურნალობის ღმერთი',
    en: 'Asclepius, god of medicine',
  },
  metabolic: {
    ka: 'ჰიგიეია, ჯანმრთელობის ქალღმერთი',
    en: 'Hygieia, goddess of health',
  },
  performance: {
    ka: 'დისკოსმტყორცნელი, კლასიკური ათლეტური იდეალი',
    en: 'Discobolus, the classical athletic ideal',
  },
}

function ServiceIcon({ icon }: { icon: string | null }) {
  const path = icon ? (ICON_PATHS[icon] ?? ICON_PATHS.dna) : ICON_PATHS.dna
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d={path} />
    </svg>
  )
}

function GodVideoPanel({ slug, locale }: { slug: string; locale: Locale }) {
  const videoSrc = GOD_VIDEOS[slug] ?? GOD_VIDEO_FALLBACK
  const caption = GOD_CAPTIONS[slug]?.[locale]
  return (
    <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm bg-dark-brown/10 group">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
      >
        <source src={videoSrc} type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-dark-brown/60 via-dark-brown/10 to-dark-brown/20 pointer-events-none" />
      {caption && (
        <p className="absolute bottom-4 left-5 right-5 z-10 text-xs md:text-sm italic font-serif text-bone-white/90 tracking-wide pointer-events-none drop-shadow-md">
          {caption}
        </p>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-burnt-orange/60 to-transparent" />
    </div>
  )
}

function ServiceImage({ src, alt, slug, icon, locale }: { src: string; alt: string; slug: string; icon: string | null; locale: Locale }) {
  const staticSrc = `/images/services/${slug}.jpg`
  const [currentSrc, setCurrentSrc] = useState(src || staticSrc)
  const [errored, setErrored] = useState(false)

  const handleError = () => {
    if (currentSrc !== staticSrc) {
      setCurrentSrc(staticSrc)
    } else {
      setErrored(true)
    }
  }

  if (errored) {
    return <GodVideoPanel slug={slug} locale={locale} />
  }

  return (
    <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm shadow-xl group">
      <img
        src={currentSrc}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        onError={handleError}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-brown/40 via-dark-brown/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-burnt-orange/60 to-transparent" />
    </div>
  )
}

export function ServiceSection({ locale, service, index }: ServiceSectionProps) {
  const isEven = index % 2 === 0
  const title = locale === 'ka' ? service.title_ka : service.title_en
  const summary = locale === 'ka' ? service.summary_ka : service.summary_en
  const intro = locale === 'ka' ? service.intro_ka : service.intro_en
  const showSummary = summary && summary.trim() !== (intro ?? '').trim()
  const body = locale === 'ka' ? service.body_ka : service.body_en
  const differentiator = locale === 'ka' ? service.differentiator_ka : service.differentiator_en
  const targetAudience = locale === 'ka' ? service.targetAudience_ka : service.targetAudience_en

  const forWhomLabel = locale === 'ka' ? 'ვისთვის არის' : "Who It's For"
  const techLabel = locale === 'ka' ? 'გამოყენებული ტექნოლოგიები' : 'Technologies Used'
  const differentiatorLabel = locale === 'ka' ? 'რატომ ჩვენ' : 'Why Us'

  const sectionBg = isEven ? 'bg-bone-white' : 'bg-dark-brown/[0.03]'

  const imageSrc = service.heroImage?.asset?.url ?? `/images/services/${service.slug}.jpg`

  return (
    <section
      id={service.slug}
      className={`py-20 md:py-32 border-t border-dark-brown/10 first:border-t-0 scroll-mt-24 ${sectionBg}`}
    >
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="eyebrow mb-0">{`0${index + 1}`}</span>
                <span className="w-8 h-px bg-burnt-orange/40" />
                <span className="text-burnt-orange/60">
                  <ServiceIcon icon={service.icon} />
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight font-serif text-dark-brown mb-6">
                {title}
              </h2>
            </Reveal>

            {showSummary && (
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

          <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'} flex flex-col gap-8 lg:sticky lg:top-24`}>
            <Reveal delay={0.15}>
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-16 h-16 border-l-2 border-t-2 border-burnt-orange/30 rounded-tl-sm pointer-events-none z-10" />
                <div className="absolute -bottom-3 -right-3 w-16 h-16 border-r-2 border-b-2 border-burnt-orange/30 rounded-br-sm pointer-events-none z-10" />
                <ServiceImage
                  src={imageSrc}
                  alt={title ?? ''}
                  slug={service.slug}
                  icon={service.icon}
                  locale={locale}
                />
                <div className="absolute top-4 right-4 z-20 bg-bone-white/90 backdrop-blur-sm border border-dark-brown/10 rounded-sm px-3 py-1.5 flex items-center gap-2 shadow-sm">
                  <span className="text-burnt-orange">
                    <ServiceIcon icon={service.icon} />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-dark-brown/70">
                    {`0${index + 1}`}
                  </span>
                </div>
              </div>
            </Reveal>

            {service.technologies && service.technologies.length > 0 && (
              <Reveal delay={0.25}>
                <div className="border-t border-dark-brown/20 pt-6">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-4">
                    {techLabel}
                  </h4>
                  <ul className="space-y-3">
                    {service.technologies.map((tech) => {
                      const techDisplay = localizedTechName(tech, locale)
                      return (
                      <li key={tech.slug} className="flex items-start gap-3">
                        {tech.heroImage?.asset?.url ? (
                          <img
                            src={tech.heroImage.asset.url}
                            alt={techDisplay}
                            className="w-10 h-10 rounded-sm object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-sm bg-dark-brown/8 border border-dark-brown/10 flex items-center justify-center flex-shrink-0">
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
