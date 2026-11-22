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
    locale: 'ka',
    path: '/about',
    title: data?.seo_title_ka || 'LongevityOne - დღეგრძელობის კლინიკა საქართველოში',
    description:
      data?.seo_description_ka ||
      'გაიცანით LongevityOne - პრევენციული მედიცინისა და დღეგრძელობის ცენტრი თბილისში, რომელიც აერთიანებს ექიმებს, მეცნიერებას, ბიოლოგიური ასაკის შეფასებას და პერსონალიზებულ ჯანმრთელობის პროგრამებს.',
    keywords: ['დღეგრძელობის კლინიკა', 'პრევენციული მედიცინის ცენტრი', 'LongevityOne საქართველო'],
  })
}

export default async function KaAboutPage() {
  const [data, team] = await Promise.all([
    sanityClient.fetch<AboutPageData>(aboutPageQuery, {}, { next: { tags: ['sanity'] } }),
    sanityClient.fetch<TeamMember[]>(aboutTeamQuery, {}, { next: { tags: ['sanity'] } }),
  ])

  return <AboutPage locale="ka" data={data} team={team ?? []} />
}
