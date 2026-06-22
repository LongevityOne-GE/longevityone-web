import { sanityClient } from '@/lib/sanity'
import {
  homePageQuery,
  homeServicesQuery,
  homeTechQuery,
  homePackagesTeaserQuery,
  homeMembershipsTeaserQuery,
  homeFoundersQuery,
} from '@/lib/sanity'
import type {
  HomePageData,
  HomeService,
  HomeTech,
  HomePackage,
  HomeMembership,
  HomeFounder,
} from '@/lib/sanity/types'
import type { Metadata } from 'next'
import { HomePage } from '@/components/pages/HomePage'
import { buildMetadata } from '@/lib/seo/metadata'

const EN_DEFAULT_TITLE = 'Longevity One — Preventive Medicine Center, Tbilisi'
const EN_DEFAULT_DESC =
  'Longevity One is a preventive medicine center in Tbilisi — advanced diagnostics, personalized programs, scientific precision.'

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityClient.fetch<HomePageData>(
    homePageQuery,
    {},
    { next: { tags: ['sanity'] } },
  )
  return buildMetadata({
    locale: 'en',
    path: '/',
    title: data?.seo_title_en || EN_DEFAULT_TITLE,
    description: data?.seo_description_en || EN_DEFAULT_DESC,
    titleAbsolute: true,
  })
}

export default async function EnHomePage() {
  const [homePage, services, technologies, packages, memberships, founders] = await Promise.all([
    sanityClient.fetch<HomePageData>(homePageQuery, {}, { next: { tags: ['sanity'] } }),
    sanityClient.fetch<HomeService[]>(homeServicesQuery, {}, { next: { tags: ['sanity'] } }),
    sanityClient.fetch<HomeTech[]>(homeTechQuery, {}, { next: { tags: ['sanity'] } }),
    sanityClient.fetch<HomePackage[]>(homePackagesTeaserQuery, {}, { next: { tags: ['sanity'] } }),
    sanityClient.fetch<HomeMembership[]>(homeMembershipsTeaserQuery, {}, { next: { tags: ['sanity'] } }),
    sanityClient.fetch<HomeFounder[]>(homeFoundersQuery, {}, { next: { tags: ['sanity'] } }),
  ])

  return (
    <HomePage
      locale="en"
      homePage={homePage}
      services={services}
      technologies={technologies}
      packages={packages}
      memberships={memberships}
      founders={founders}
    />
  )
}
