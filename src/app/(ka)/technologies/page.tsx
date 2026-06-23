import type { Metadata } from 'next'
import { sanityClient, technologiesQuery } from '@/lib/sanity'
import type { Technology } from '@/lib/sanity/types'
import { TechnologiesPage } from '@/components/pages/TechnologiesPage'
import { buildMetadata } from '@/lib/seo/metadata'
import { JsonLd } from '@/components/seo/JsonLd'
import { technologiesSchema } from '@/lib/seo/schema'

export const metadata: Metadata = buildMetadata({
  locale: 'ka',
  path: '/technologies',
  title: 'დიაგნოსტიკა — ბიოლოგიური ასაკი, VO₂ Max, მიკრობიომი',
  description:
    'მსოფლიოს წამყვანი ტექნოლოგიებით ვზომავთ თქვენს ბიოლოგიურ საწყის მდგომარეობას: PNOE მეტაბოლიზმი, TrueDiagnostic ბიოლოგიური ასაკი, Enbiosis მიკრობიომი.',
})

export default async function KaTechnologiesPage() {
  const technologies = await sanityClient.fetch<Technology[]>(
    technologiesQuery,
    {},
    { next: { tags: ['sanity'] } }
  )

  const techLd = (technologies ?? []).map((t) => ({
    name: (t.name_ka || t.name) ?? '',
    description: t.tagline_ka,
    anchor: t.anchor,
  }))

  return (
    <>
      {techLd.length > 0 && <JsonLd data={technologiesSchema(techLd, 'ka')} />}
      <TechnologiesPage locale="ka" technologies={technologies ?? []} />
    </>
  )
}
