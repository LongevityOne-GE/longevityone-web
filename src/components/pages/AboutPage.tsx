'use client'

import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import type { AboutPage as AboutPageData, TeamMember } from '@/lib/sanity/types'
import { AboutHero } from '@/components/sections/AboutHero'
import { AboutIntro } from '@/components/sections/AboutIntro'
import { FoundingStory } from '@/components/sections/FoundingStory'
import { AboutTeamSection } from '@/components/sections/AboutTeamSection'

interface AboutPageProps {
  locale: Locale
  data: AboutPageData | null
  team?: TeamMember[]
}

const ADVISORY_CTA = {
  ka: {
    eyebrow: 'კლინიკის მიღმა',
    heading: 'სამეცნიერო ზედამხედველობა',
    body: 'ჩვენი პროტოკოლები, კვლევითი მიმართულება და კლინიკური სტანდარტები მუშავდება ქართველი და საერთაშორისო ექიმებისგან შემდგარ საკონსულტაციო საბჭოსთან თანამშრომლობით.',
    cta: 'გაიცანი საკონსულტაციო საბჭო',
  },
  en: {
    eyebrow: 'Beyond the Clinic',
    heading: 'Scientific Oversight',
    body: 'Our protocols, research direction, and clinical standards are shaped in close collaboration with an advisory board of Georgian and internationally credentialed physicians.',
    cta: 'Meet the Advisory Board',
  },
} as const

export function AboutPage({ locale, data, team = [] }: AboutPageProps) {
  const title = locale === 'ka' ? data?.h1_ka : data?.h1_en
  const subtitle = locale === 'ka' ? data?.philosophy_ka : data?.philosophy_en
  const foundingHeading =
    locale === 'ka' ? data?.founding_story_heading_ka : data?.founding_story_heading_en
  const foundingStory = locale === 'ka' ? data?.founding_story_ka : data?.founding_story_en
  const prefix = locale === 'en' ? '/en' : ''
  const cta = ADVISORY_CTA[locale]

  return (
    <main className="flex flex-col">
      <AboutHero />
      <AboutIntro
        locale={locale}
        title={title || (locale === 'ka' ? 'ჩვენს შესახებ' : 'About Us')}
        subtitle={subtitle}
        pillars={data?.why_pillars}
      />
      <AboutTeamSection locale={locale} members={team} />

      {/* ─── Advisory Board cross-link — editorial CTA below the doctors ──
         Promoted from a footer-style mini link to a full section so the
         path to credibility content reads at a glance. Bone-white frame,
         hairline rules, brand-orange button — classical editorial CTA. */}
      <section
        aria-labelledby="advisory-cta-heading"
        className="relative bg-bone-white border-t border-dark-brown/10 py-20 md:py-28 overflow-hidden"
      >
        {/* Classical hairline mark above the eyebrow — twin rules + small dot */}
        <div
          aria-hidden="true"
          className="flex items-center justify-center gap-3 mb-6"
        >
          <span className="block h-px w-16 bg-burnt-orange/40" />
          <span className="block h-1.5 w-1.5 rotate-45 bg-burnt-orange/70" />
          <span className="block h-px w-16 bg-burnt-orange/40" />
        </div>

        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-[11px] uppercase tracking-[0.28em] text-burnt-orange font-bold mb-5">
              {cta.eyebrow}
            </p>
            <h2
              id="advisory-cta-heading"
              className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-dark-brown leading-[1.15] mb-6"
            >
              {cta.heading}
            </h2>
            <p className="text-dark-brown/75 text-[15px] md:text-base leading-[1.75] mb-10 max-w-xl mx-auto">
              {cta.body}
            </p>
            <Link
              href={`${prefix}/about/advisory-board`}
              className="btn-primary group"
            >
              <span>{cta.cta}</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <FoundingStory locale={locale} heading={foundingHeading} story={foundingStory} />
    </main>
  )
}
