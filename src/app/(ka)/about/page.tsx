import type { Metadata } from 'next'
import { sanityClient, aboutPageQuery, aboutTeamQuery } from '@/lib/sanity'
import type { AboutPage as AboutPageData, TeamMember } from '@/lib/sanity/types'
import { AboutPage } from '@/components/pages/AboutPage'

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityClient.fetch<AboutPageData>(
    aboutPageQuery,
    {},
    { next: { tags: ['sanity'] } }
  )

  return {
    title: data?.seo_title_ka || 'ჩვენს შესახებ',
    description: data?.seo_description_ka || undefined,
  }
}

export default async function KaAboutPage() {
  const [data, team] = await Promise.all([
    sanityClient.fetch<AboutPageData>(aboutPageQuery, {}, { next: { tags: ['sanity'] } }),
    sanityClient.fetch<TeamMember[]>(aboutTeamQuery, {}, { next: { tags: ['sanity'] } }),
  ])

  return <AboutPage locale="ka" data={data} team={team ?? []} />
}
