import { sanityClient } from '@/lib/sanity'
import {
  homePageQuery,
  homeServicesQuery,
  homeTechQuery,
  homePackagesTeaserQuery,
  homeMembershipsTeaserQuery,
} from '@/lib/sanity'
import type {
  HomePageData,
  HomeService,
  HomeTech,
  HomePackage,
  HomeMembership,
} from '@/lib/sanity/types'
import { HomePage } from '@/components/pages/HomePage'

export default async function KaHomePage() {
  const [homePage, services, technologies, packages, memberships] = await Promise.all([
    sanityClient.fetch<HomePageData>(homePageQuery, {}, { next: { tags: ['sanity'] } }),
    sanityClient.fetch<HomeService[]>(homeServicesQuery, {}, { next: { tags: ['sanity'] } }),
    sanityClient.fetch<HomeTech[]>(homeTechQuery, {}, { next: { tags: ['sanity'] } }),
    sanityClient.fetch<HomePackage[]>(homePackagesTeaserQuery, {}, { next: { tags: ['sanity'] } }),
    sanityClient.fetch<HomeMembership[]>(homeMembershipsTeaserQuery, {}, { next: { tags: ['sanity'] } }),
  ])

  return (
    <HomePage
      locale="ka"
      homePage={homePage}
      services={services}
      technologies={technologies}
      packages={packages}
      memberships={memberships}
    />
  )
}
