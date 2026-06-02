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
import { HomePage } from '@/components/pages/HomePage'

export default async function KaHomePage() {
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
      locale="ka"
      homePage={homePage}
      services={services}
      technologies={technologies}
      packages={packages}
      memberships={memberships}
      founders={founders}
    />
  )
}
