import type { Metadata } from 'next'
import { sanityClient, packagesQuery, homePageQuery } from '@/lib/sanity'
import type { PackagesData, HomePageData } from '@/lib/sanity/types'
import { PackagesPage } from '@/components/pages/PackagesPage'

export const metadata: Metadata = {
  title: 'პაკეტები და ფასები',
  description: 'დიაგნოსტიკური, საწევრო და სესიების პაკეტები Longevity One-ში.',
}

export default async function KaPackagesPage() {
  const [packages, homeData] = await Promise.all([
    sanityClient.fetch<PackagesData>(packagesQuery, {}, { next: { tags: ['sanity'] } }),
    sanityClient.fetch<HomePageData>(homePageQuery, {}, { next: { tags: ['sanity'] } }),
  ])

  return <PackagesPage locale="ka" packages={packages ?? null} homeData={homeData ?? null} />
}
