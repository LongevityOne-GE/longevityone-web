import type { Metadata } from 'next'
import { sanityClient, teamPageQuery } from '@/lib/sanity'
import type { TeamData } from '@/lib/sanity/types'
import { TeamPage } from '@/components/pages/TeamPage'
import { buildMetadata } from '@/lib/seo/metadata'
import { JsonLd } from '@/components/seo/JsonLd'
import { physiciansSchema } from '@/lib/seo/schema'

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityClient.fetch<TeamData>(
    teamPageQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  return buildMetadata({
    locale: 'en',
    path: '/team',
    title: data?.page?.seo_title_en || data?.page?.h1_en || 'Our Team',
    description: data?.page?.seo_description_en,
  })
}

export default async function EnTeamPage() {
  const data = await sanityClient.fetch<TeamData>(
    teamPageQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  const physicians = [...(data?.founders ?? []), ...(data?.team ?? [])].map((m) => ({
    name: m.name_en || m.name || '',
    jobTitle: m.role_en,
    specialty: m.specialty_en,
  }))
  return (
    <>
      {physicians.length > 0 && <JsonLd data={physiciansSchema(physicians)} />}
      <TeamPage locale="en" data={data ?? null} />
    </>
  )
}
