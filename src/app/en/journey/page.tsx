import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  sanityClient,
  JOURNEY_PAGE_QUERY,
  JOURNEY_STAGES_QUERY,
} from '@/lib/sanity'
import type { JourneyPage, JourneyStage } from '@/lib/sanity/types'
import { JourneyHero } from '@/components/sections/journey/JourneyHero'
import { JourneyTimeline } from '@/components/sections/journey/JourneyTimeline'
import { JourneyCta } from '@/components/sections/journey/JourneyCta'
import { JourneyJsonLd } from '@/components/sections/journey/JourneyJsonLd'
import { buildMetadata, SITE_URL } from '@/lib/seo/metadata'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityClient.fetch<JourneyPage | null>(
    JOURNEY_PAGE_QUERY,
    {},
    { next: { tags: ['journeyPage'] } },
  )
  return buildMetadata({
    locale: 'en',
    path: '/journey',
    title: page?.seo_title_en || page?.h1_en || 'Patient Journey',
    description: page?.seo_description_en || page?.intro_en,
    type: 'article',
  })
}

export default async function EnJourneyPage() {
  const [page, stages] = await Promise.all([
    sanityClient.fetch<JourneyPage | null>(
      JOURNEY_PAGE_QUERY,
      {},
      { next: { tags: ['journeyPage'] } },
    ),
    sanityClient.fetch<JourneyStage[]>(
      JOURNEY_STAGES_QUERY,
      {},
      { next: { tags: ['journeyStage'] } },
    ),
  ])

  if (!page) notFound()

  const safeStages = stages ?? []

  return (
    <main className="flex flex-col">
      <JourneyJsonLd
        locale="en"
        data={{ page, stages: safeStages }}
        baseUrl={SITE_URL}
      />
      <JourneyHero locale="en" page={page} />
      <JourneyTimeline locale="en" stages={safeStages} />
      <JourneyCta locale="en" page={page} />
    </main>
  )
}
