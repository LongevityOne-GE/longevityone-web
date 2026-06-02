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
    title: data?.seo_title_en || 'About Us',
    description: data?.seo_description_en || undefined,
  }
}

export default async function EnAboutPage() {
  const [data, team] = await Promise.all([
    sanityClient.fetch<AboutPageData>(aboutPageQuery, {}, { next: { tags: ['sanity'] } }),
    sanityClient.fetch<TeamMember[]>(aboutTeamQuery, {}, { next: { tags: ['sanity'] } }),
  ])

  return <AboutPage locale="en" data={data} team={team ?? []} />
}
