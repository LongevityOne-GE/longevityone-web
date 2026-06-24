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
    locale: 'ka',
    path: '/team',
    title: data?.page?.seo_title_ka || data?.page?.h1_ka || 'დღეგრძელობის ექიმები და გუნდი საქართველოში',
    description:
      data?.page?.seo_description_ka ||
      'გაიცანით Longevity One-ის ექიმები და სპეციალისტები თბილისში, რომლებიც მუშაობენ პრევენციულ მედიცინაზე, ბიოლოგიურ ასაკზე, მეტაბოლურ ჯანმრთელობაზე და პერსონალიზებულ პროგრამებზე.',
    keywords: ['დღეგრძელობის ექიმები', 'პრევენციული მედიცინის ექიმები', 'ექიმები თბილისი'],
  })
}

export default async function KaTeamPage() {
  const data = await sanityClient.fetch<TeamData>(
    teamPageQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  const physicians = [...(data?.founders ?? []), ...(data?.team ?? [])].map((m) => ({
    name: m.name || '',
    jobTitle: m.role_ka,
    specialty: m.specialty_ka,
  }))
  return (
    <>
      {physicians.length > 0 && <JsonLd data={physiciansSchema(physicians)} />}
      <TeamPage locale="ka" data={data ?? null} />
    </>
  )
}
