import type { Metadata } from 'next'
import { sanityClient, packagesQuery, homePageQuery } from '@/lib/sanity'
import type { PackagesData, HomePageData } from '@/lib/sanity/types'
import { PackagesPage } from '@/components/pages/PackagesPage'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  locale: 'ka',
  path: '/packages',
  title: 'ჩვენი პროგრამები',
  description: 'დიაგნოსტიკური, საწევრო და სესიების პაკეტები Longevity One-ში.',
})

export default async function KaPackagesPage() {
  const [packages, homeData] = await Promise.all([
    sanityClient.fetch<PackagesData>(packagesQuery, {}, { next: { tags: ['sanity'] } }),
    sanityClient.fetch<HomePageData>(homePageQuery, {}, { next: { tags: ['sanity'] } }),
  ])

  return <PackagesPage locale="ka" packages={packages ?? null} homeData={homeData ?? null} />
}
