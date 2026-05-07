import type { Metadata } from 'next'
import { sanityClient, corporatePageQuery } from '@/lib/sanity'
import type { CorporatePage as CorporatePageData } from '@/lib/sanity/types'
import { CorporatePage } from '@/components/pages/CorporatePage'

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityClient.fetch<CorporatePageData>(
    corporatePageQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  return {
    title: data?.seo_title_en || 'Corporate Wellness',
    description: data?.seo_description_en || undefined,
  }
}

export default async function EnCorporatePage() {
  const data = await sanityClient.fetch<CorporatePageData>(
    corporatePageQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  return <CorporatePage locale="en" data={data ?? null} />
}
