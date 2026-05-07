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
    title: data?.seo_title_ka || 'კორპორატიული ჯანმრთელობა',
    description: data?.seo_description_ka || undefined,
  }
}

export default async function KaCorporatePage() {
  const data = await sanityClient.fetch<CorporatePageData>(
    corporatePageQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  return <CorporatePage locale="ka" data={data ?? null} />
}
