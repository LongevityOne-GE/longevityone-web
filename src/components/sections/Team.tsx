'use client'

import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import type { HomePageData, HomeFounder } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface TeamProps {
  locale: Locale
  data?: HomePageData | null
  founders?: HomeFounder[] | null
}

export function Team({ locale, data }: TeamProps) {
  const aboutHref = `${locale === 'en' ? '/en' : ''}/about`
  const headline =
    (locale === 'ka' ? data?.team_heading_ka : data?.team_heading_en) ||
    (locale === 'ka' ? 'თქვენი დღეგრძელობის გუნდი' : 'Your longevity team')
  const subtext =
    (locale === 'ka' ? data?.team_subtext_ka : data?.team_subtext_en) ||
    (locale === 'ka'
      ? 'ექიმები საქართველოსა და საერთაშორისო სცენაზე დაგროვილი გამოცდილებით.'
      : 'Physicians with decades of experience in Georgia and abroad.')
  const ctaLabel = locale === 'ka' ? 'გაიცანი გუნდი' : 'Meet the team'

  return (
    <section className="py-24 md:py-32 bg-dark-brown text-bone-white relative overflow-hidden isolate">
      {/* Team background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/videos/team-bg.mp4" type="video/mp4" />
      </video>

      <div className="section-container relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal delay={0.08}>
            <h2 className="font-black leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-6xl text-bone-white">
              {headline}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-bone-white/75">
              {subtext}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-10">
              <Link href={aboutHref} className="btn-primary">
                <span>{ctaLabel}</span>
                <span className="ml-3">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
