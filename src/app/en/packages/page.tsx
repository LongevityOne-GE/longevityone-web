import type { Metadata } from 'next'
import { sanityClient, packagesQuery, homePageQuery } from '@/lib/sanity'
import type { PackagesData, HomePageData } from '@/lib/sanity/types'
import { PackagesPage } from '@/components/pages/PackagesPage'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  locale: 'en',
  path: '/packages',
  title: 'Programmes & Pricing: Full Health Assessment',
  description:
    'Longevity programmes start from 550 GEL, from a foundational biological and metabolic assessment through to full concierge care.',
})

export default async function EnPackagesPage() {
  const [packages, homeData] = await Promise.all([
    sanityClient.fetch<PackagesData>(packagesQuery, {}, { next: { tags: ['sanity'] } }),
    sanityClient.fetch<HomePageData>(homePageQuery, {}, { next: { tags: ['sanity'] } }),
  ])

  return <PackagesPage locale="en" packages={packages ?? null} homeData={homeData ?? null} />
}
