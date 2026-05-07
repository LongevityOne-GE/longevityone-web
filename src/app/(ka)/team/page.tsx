import type { Metadata } from 'next'
import { sanityClient, teamPageQuery } from '@/lib/sanity'
import type { TeamData } from '@/lib/sanity/types'
import { TeamPage } from '@/components/pages/TeamPage'

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityClient.fetch<TeamData>(
    teamPageQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  return {
    title: data?.page?.h1_ka || 'ჩვენი გუნდი',
    description: undefined,
  }
}

export default async function KaTeamPage() {
  const data = await sanityClient.fetch<TeamData>(
    teamPageQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  return <TeamPage locale="ka" data={data ?? null} />
}
