import type { Metadata } from 'next'
import { sanityClient, packagesQuery, homePageQuery } from '@/lib/sanity'
import type { PackagesData, HomePageData } from '@/lib/sanity/types'
import { PackagesPage } from '@/components/pages/PackagesPage'

export const metadata: Metadata = {
  title: 'Packages & Pricing',
  description: 'Diagnostic, membership and session packages at Longevity One.',
}

export default async function EnPackagesPage() {
  const [packages, homeData] = await Promise.all([
    sanityClient.fetch<PackagesData>(packagesQuery, {}, { next: { tags: ['sanity'] } }),
    sanityClient.fetch<HomePageData>(homePageQuery, {}, { next: { tags: ['sanity'] } }),
  ])

  return <PackagesPage locale="en" packages={packages ?? null} homeData={homeData ?? null} />
}
