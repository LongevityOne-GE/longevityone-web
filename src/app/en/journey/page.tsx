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
    title: data?.page?.seo_title_en || 'Your Journey',
    description: data?.page?.seo_description_en || undefined,
  }
}

export default async function EnJourneyPage() {
  const data = await sanityClient.fetch<JourneyData>(
    journeyPageQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  return <JourneyPage locale="en" data={data ?? null} />
}
