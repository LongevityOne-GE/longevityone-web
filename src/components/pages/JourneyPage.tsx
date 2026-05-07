'use client'

import type { Locale } from '@/lib/utils'
import type { JourneyData } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'
import { JourneyTimeline } from '@/components/sections/JourneyTimeline'

interface JourneyPageProps {
  locale: Locale
  data: JourneyData | null
}

export function JourneyPage({ locale, data }: JourneyPageProps) {
  const title =
    (locale === 'ka' ? data?.page?.h1_ka : data?.page?.h1_en) ||
    (locale === 'ka' ? 'თქვენი გზა' : 'Your Journey')
  const subtitle = locale === 'ka' ? data?.page?.intro_ka : data?.page?.intro_en

  return (
    <main className="flex flex-col">
      <PageHero locale={locale} title={title} subtitle={subtitle} />
      <JourneyTimeline locale={locale} stages={data?.stages ?? []} />
    </main>
  )
}
