import type { Metadata } from 'next'
import { sanityClient, journeyPageQuery } from '@/lib/sanity'
import type { JourneyData } from '@/lib/sanity/types'
import { JourneyPage } from '@/components/pages/JourneyPage'

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityClient.fetch<JourneyData>(
    journeyPageQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  return {
    title: data?.page?.seo_title_ka || 'თქვენი გზა',
    description: data?.page?.seo_description_ka || undefined,
  }
}

export default async function KaJourneyPage() {
  const data = await sanityClient.fetch<JourneyData>(
    journeyPageQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  return <JourneyPage locale="ka" data={data ?? null} />
}
