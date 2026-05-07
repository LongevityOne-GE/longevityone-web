'use client'

import type { Locale } from '@/lib/utils'
import type { AboutPage as AboutPageData } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'
import { WhyPillars } from '@/components/sections/WhyPillars'
import { FoundingStory } from '@/components/sections/FoundingStory'

interface AboutPageProps {
  locale: Locale
  data: AboutPageData | null
}

export function AboutPage({ locale, data }: AboutPageProps) {
  const title = locale === 'ka' ? data?.h1_ka : data?.h1_en
  const subtitle = locale === 'ka' ? data?.philosophy_ka : data?.philosophy_en
  const foundingHeading =
    locale === 'ka' ? data?.founding_story_heading_ka : data?.founding_story_heading_en
  const foundingStory = locale === 'ka' ? data?.founding_story_ka : data?.founding_story_en

  return (
    <main className="flex flex-col">
      <PageHero
        locale={locale}
        title={title || (locale === 'ka' ? 'ჩვენს შესახებ' : 'About Us')}
        subtitle={subtitle}
      />
      <WhyPillars locale={locale} pillars={data?.why_pillars} />
      <FoundingStory locale={locale} heading={foundingHeading} story={foundingStory} />
    </main>
  )
}
