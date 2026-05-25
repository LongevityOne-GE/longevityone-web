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

const ADVISORY_CROSSLINK = {
  ka: 'სამეცნიერო ზედამხედველობა ჩვენი საკონსულტაციო საბჭოსგან',
  en: 'Scientific oversight from our advisory board',
} as const

export function AboutPage({ locale, data, team = [] }: AboutPageProps) {
  const title = locale === 'ka' ? data?.h1_ka : data?.h1_en
  const subtitle = locale === 'ka' ? data?.philosophy_ka : data?.philosophy_en
  const foundingHeading =
    locale === 'ka' ? data?.founding_story_heading_ka : data?.founding_story_heading_en
  const foundingStory = locale === 'ka' ? data?.founding_story_ka : data?.founding_story_en
  const prefix = locale === 'en' ? '/en' : ''

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
      <FoundingStory locale={locale} heading={foundingHeading} story={foundingStory} />

      {/* Cross-link to advisory board */}
      <div className="bg-bone-white border-t border-dark-brown/8 py-12 md:py-16">
        <div className="section-container text-center">
          <Link
            href={`${prefix}/about/advisory-board`}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-medium
                       text-dark-brown/60 hover:text-burnt-orange transition-colors duration-200 group"
          >
            {ADVISORY_CROSSLINK[locale]}
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </main>
  )
}
