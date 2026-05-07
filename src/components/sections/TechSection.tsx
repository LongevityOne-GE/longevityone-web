'use client'

import type { Locale } from '@/lib/utils'
import type { Technology } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface TechSectionProps {
  locale: Locale
  tech: Technology
  index: number
}

export function TechSection({ locale, tech, index }: TechSectionProps) {
  const isOdd = index % 2 === 0
  const tagline = locale === 'ka' ? tech.tagline_ka : tech.tagline_en
  const whatItIs = locale === 'ka' ? tech.whatItIs_ka : tech.whatItIs_en
  const howItWorks = locale === 'ka' ? tech.howItWorks_ka : tech.howItWorks_en
  const whatItShows = locale === 'ka' ? tech.whatItShows_ka : tech.whatItShows_en
  const yourBenefit = locale === 'ka' ? tech.yourBenefit_ka : tech.yourBenefit_en

  const detailLabel1 = locale === 'ka' ? 'რა არის' : 'What It Is'
  const detailLabel2 = howItWorks
    ? (locale === 'ka' ? 'როგორ მუშაობს' : 'How It Works')
    : (locale === 'ka' ? 'რას აჩვენებს' : 'What It Shows')
  const detailValue2 = howItWorks || whatItShows
  const detailLabel3 = locale === 'ka' ? 'თქვენი სარგებელი' : 'Your Benefit'

  return (
    <section
      id={tech.anchor}
      className={`min-h-screen py-20 md:py-32 border-t border-dark-brown/10 first:border-t-0 ${
        isOdd ? 'bg-bone-white' : 'bg-bone-white'
      }`}
    >
      <div className="section-container">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start ${
            isOdd ? '' : 'lg:flex-row-reverse'
          }`}
        >
          <div className={isOdd ? 'lg:order-1' : 'lg:order-2'}>
            <Reveal>
              <p className="eyebrow">{tech.name}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight font-serif text-dark-brown mb-8">
                {tagline}
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {whatItIs && (
                <Reveal delay={0.2}>
                  <div className="border-t border-dark-brown/20 pt-6">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-3">
                      {detailLabel1}
                    </h4>
                    <p className="text-sm text-dark-brown/80 leading-relaxed">
                      {whatItIs}
                    </p>
                  </div>
                </Reveal>
              )}

              {detailValue2 && (
                <Reveal delay={0.25}>
                  <div className="border-t border-dark-brown/20 pt-6">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-3">
                      {detailLabel2}
                    </h4>
                    <p className="text-sm text-dark-brown/80 leading-relaxed">
                      {detailValue2}
                    </p>
                  </div>
                </Reveal>
              )}

              {yourBenefit && (
                <Reveal delay={0.3}>
                  <div className="border-t border-dark-brown/20 pt-6">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-3">
                      {detailLabel3}
                    </h4>
                    <p className="text-sm text-dark-brown/80 leading-relaxed">
                      {yourBenefit}
                    </p>
                  </div>
                </Reveal>
              )}
            </div>

          </div>

          <div className={`${isOdd ? 'lg:order-2' : 'lg:order-1'} flex items-center justify-center`}>
            {tech.heroImage?.asset?.url ? (
              <Reveal delay={0.15}>
                <img
                  src={tech.heroImage.asset.url}
                  alt={tech.name}
                  className="w-full max-w-md rounded-lg shadow-lg"
                />
              </Reveal>
            ) : (
              <div className="w-full max-w-md aspect-square bg-dark-brown/5 rounded-lg" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
