import type { Metadata } from 'next'
import { sanityClient, technologiesQuery } from '@/lib/sanity'
import type { Technology } from '@/lib/sanity/types'
import { TechnologiesPage } from '@/components/pages/TechnologiesPage'
import { buildMetadata } from '@/lib/seo/metadata'
import { JsonLd } from '@/components/seo/JsonLd'
import { technologiesSchema } from '@/lib/seo/schema'

export const metadata: Metadata = buildMetadata({
  locale: 'en',
  path: '/technologies',
  title: 'Diagnostics: Biological Age, VO₂ Max, Microbiome',
  description:
    "We measure your biological baseline with the world's leading technologies: PNOĒ metabolism, TrueDiagnostic biological age, and Enbiosis microbiome.",
})

export default async function EnTechnologiesPage() {
  const technologies = await sanityClient.fetch<Technology[]>(
    technologiesQuery,
    {},
    { next: { tags: ['sanity'] } }
  )

  const techLd = (technologies ?? []).map((t) => ({
    name: (t.name_en || t.name) ?? '',
    description: t.tagline_en,
    anchor: t.anchor,
  }))

  return (
    <>
      {techLd.length > 0 && <JsonLd data={technologiesSchema(techLd, 'en')} />}
      <TechnologiesPage locale="en" technologies={technologies ?? []} />
    </>
  )
}
