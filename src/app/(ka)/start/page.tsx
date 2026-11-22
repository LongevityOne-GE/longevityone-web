import type { Metadata } from 'next'
import {
  sanityClient,
  aboutPageQuery,
  homeFoundersQuery,
  homePageQuery,
  homeServicesQuery,
  reviewsQuery,
  siteSettingsQuery,
} from '@/lib/sanity'
import type {
  AboutPage,
  HomeFounder,
  HomePageData,
  HomeService,
  SanityReview,
  SiteSettings,
} from '@/lib/sanity/types'
import { buildMetadata } from '@/lib/seo/metadata'
import { activePromotion } from '@/lib/promotions'
import { LandingPage } from '@/components/landing/LandingPage'

// Ad landing page: reached only from campaigns, so it is kept out of search
// and out of the sitemap, and not linked from the site navigation.
export const metadata: Metadata = buildMetadata({
  locale: 'ka',
  path: '/start',
  title: 'Longevity One: პრევენციული მედიცინის ცენტრი თბილისში',
  description: 'მოითხოვეთ ზარი და ჩვენი კონსიერჟი დაგიკავშირდებათ 24 საათში.',
  titleAbsolute: true,
  noindex: true,
})

const opts = { next: { tags: ['sanity'] } }

export default async function KaLandingPage() {
  const [homePage, about, services, team, reviews, settings] = await Promise.all([
    sanityClient.fetch<HomePageData>(homePageQuery, {}, opts),
    sanityClient.fetch<AboutPage>(aboutPageQuery, {}, opts),
    sanityClient.fetch<HomeService[]>(homeServicesQuery, {}, opts),
    sanityClient.fetch<HomeFounder[]>(homeFoundersQuery, {}, opts),
    sanityClient.fetch<SanityReview[]>(reviewsQuery, {}, opts),
    sanityClient.fetch<SiteSettings>(siteSettingsQuery, {}, opts),
  ])

  return (
    <LandingPage
      locale="ka"
      homePage={homePage ?? null}
      about={about ?? null}
      services={services ?? []}
      team={team ?? []}
      reviews={reviews ?? []}
      settings={settings ?? null}
      promotion={activePromotion('ka')}
    />
  )
}
