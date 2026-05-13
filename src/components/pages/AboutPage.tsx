'use client'

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

export function AboutPage({ locale, data, team = [] }: AboutPageProps) {
  const title = locale === 'ka' ? data?.h1_ka : data?.h1_en
  const subtitle = locale === 'ka' ? data?.philosophy_ka : data?.philosophy_en
  const foundingHeading =
    locale === 'ka' ? data?.founding_story_heading_ka : data?.founding_story_heading_en
  const foundingStory = locale === 'ka' ? data?.founding_story_ka : data?.founding_story_en

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
    </main>
  )
}
