import type { Metadata } from 'next'
import { sanityClient, aboutPageQuery, aboutTeamQuery } from '@/lib/sanity'
import type { AboutPage as AboutPageData, TeamMember } from '@/lib/sanity/types'
import { AboutPage } from '@/components/pages/AboutPage'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityClient.fetch<AboutPageData>(
    aboutPageQuery,
    {},
    { next: { tags: ['sanity'] } }
  )

  return buildMetadata({
    locale: 'en',
    path: '/about',
    title: data?.seo_title_en || 'Longevity One - Longevity Clinic in Georgia',
    description:
      data?.seo_description_en ||
      'Meet Longevity One, a preventive medicine and longevity center in Tbilisi combining physicians, science, biological age testing, and personalized health programs in Georgia.',
    keywords: ['longevity clinic Georgia', 'preventive medicine center Tbilisi', 'Longevity One Georgia'],
  })
}

export default async function EnAboutPage() {
  const [data, team] = await Promise.all([
    sanityClient.fetch<AboutPageData>(aboutPageQuery, {}, { next: { tags: ['sanity'] } }),
    sanityClient.fetch<TeamMember[]>(aboutTeamQuery, {}, { next: { tags: ['sanity'] } }),
  ])

  return <AboutPage locale="en" data={data} team={team ?? []} />
}
