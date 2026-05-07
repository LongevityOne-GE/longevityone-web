import type { Metadata } from 'next'
import { sanityClient, faqQuery } from '@/lib/sanity'
import type { FaqData } from '@/lib/sanity/types'
import { FaqPage } from '@/components/pages/FaqPage'

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityClient.fetch<FaqData>(faqQuery, {}, { next: { tags: ['sanity'] } })
  return {
    title: data?.page?.seo_title_en || 'Frequently Asked Questions',
    description: data?.page?.seo_description_en || undefined,
  }
}

export default async function EnFaqPage() {
  const data = await sanityClient.fetch<FaqData>(faqQuery, {}, { next: { tags: ['sanity'] } })
  return <FaqPage locale="en" data={data ?? null} />
}
