import type { Metadata } from 'next'
import { sanityClient, technologiesQuery } from '@/lib/sanity'
import type { Technology } from '@/lib/sanity/types'
import { TechnologiesPage } from '@/components/pages/TechnologiesPage'

export const metadata: Metadata = {
  title: 'მეცნიერება და ტექნოლოგია',
  description:
    'მოწინავე დიაგნოსტიკური ტექნოლოგიები — PNOE, IHHT, Red Light Therapy, TrueDiagnostic, Enbiosis.',
}

export default async function KaTechnologiesPage() {
  const technologies = await sanityClient.fetch<Technology[]>(
    technologiesQuery,
    {},
    { next: { tags: ['sanity'] } }
  )

  return <TechnologiesPage locale="ka" technologies={technologies ?? []} />
}
