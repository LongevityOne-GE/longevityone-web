import type { Metadata } from 'next'
import { sanityClient, corporatePageQuery } from '@/lib/sanity'
import type { CorporatePage as CorporatePageData } from '@/lib/sanity/types'
import { CorporatePage } from '@/components/pages/CorporatePage'
import { buildMetadata } from '@/lib/seo/metadata'

async function fetchCorporate(): Promise<CorporatePageData | null> {
  try {
    return await sanityClient.fetch<CorporatePageData>(
      corporatePageQuery,
      {},
      { next: { tags: ['sanity'] } }
    )
  } catch (err) {
    console.warn('[corporate/en] Sanity fetch failed:', (err as Error).message)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchCorporate()
  return buildMetadata({
    locale: 'en',
    path: '/corporate',
    title: data?.seo_title_en || 'Corporate Wellness',
    description: data?.seo_description_en,
  })
}

export default async function EnCorporatePage() {
  const data = await fetchCorporate()
  return <CorporatePage locale="en" data={data} />
}
