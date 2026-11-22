import type { Metadata } from 'next'
import {
  sanityClient,
  aboutPageQuery,
  homeFoundersQuery,
  homePageQuery,
  reviewsQuery,
  siteSettingsQuery,
  technologiesQuery,
} from '@/lib/sanity'
import type {
  AboutPage,
  HomeFounder,
  HomePageData,
  SanityReview,
  SiteSettings,
  Technology,
} from '@/lib/sanity/types'
import { buildMetadata } from '@/lib/seo/metadata'
import { activePromotion } from '@/lib/promotions'
import { LandingPage } from '@/components/landing/LandingPage'

// Ad landing page: reached only from campaigns, so it is kept out of search
// and out of the sitemap, and not linked from the site navigation.
export const metadata: Metadata = buildMetadata({
  locale: 'en',
  path: '/start',
  title: 'LongevityOne: Preventive Medicine Centre in Tbilisi',
  description: 'Request a call and our concierge will contact you within 24 hours.',
  titleAbsolute: true,
  noindex: true,
})

const opts = { next: { tags: ['sanity'] } }

export default async function EnLandingPage() {
  const [homePage, about, technologies, team, reviews, settings] = await Promise.all([
    sanityClient.fetch<HomePageData>(homePageQuery, {}, opts),
    sanityClient.fetch<AboutPage>(aboutPageQuery, {}, opts),
    sanityClient.fetch<Technology[]>(technologiesQuery, {}, opts),
    sanityClient.fetch<HomeFounder[]>(homeFoundersQuery, {}, opts),
    sanityClient.fetch<SanityReview[]>(reviewsQuery, {}, opts),
    sanityClient.fetch<SiteSettings>(siteSettingsQuery, {}, opts),
  ])

  return (
    <LandingPage
      locale="en"
      homePage={homePage ?? null}
      about={about ?? null}
      technologies={technologies ?? []}
      team={team ?? []}
      reviews={reviews ?? []}
      settings={settings ?? null}
      promotion={activePromotion('en')}
    />
  )
}
