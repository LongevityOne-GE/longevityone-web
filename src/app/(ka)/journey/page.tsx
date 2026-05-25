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

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.longevityone.ge'

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityClient.fetch<JourneyPage | null>(
    JOURNEY_PAGE_QUERY,
    {},
    { next: { tags: ['journeyPage'] } },
  )
  const title = page?.seo_title_ka || page?.h1_ka || 'პაციენტის გზა'
  const description = page?.seo_description_ka || page?.intro_ka || undefined
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/journey`,
      languages: {
        ka: `${SITE_URL}/journey`,
        en: `${SITE_URL}/en/journey`,
      },
    },
    openGraph: {
      title: title ?? undefined,
      description: description ?? undefined,
      locale: 'ka_GE',
      type: 'article',
      url: `${SITE_URL}/journey`,
    },
  }
}

export default async function KaJourneyPage() {
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
        locale="ka"
        data={{ page, stages: safeStages }}
        baseUrl={SITE_URL}
      />
      <JourneyHero locale="ka" page={page} />
      <JourneyTimeline locale="ka" stages={safeStages} />
      <JourneyCta locale="ka" page={page} />
    </main>
  )
}
