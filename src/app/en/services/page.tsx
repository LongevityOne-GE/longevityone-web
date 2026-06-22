import type { Metadata } from 'next'
import { sanityClient, servicesFullQuery } from '@/lib/sanity'
import type { ServiceDetail } from '@/lib/sanity/types'
import { ServicesPage } from '@/components/pages/ServicesPage'
import { buildMetadata } from '@/lib/seo/metadata'
import { JsonLd } from '@/components/seo/JsonLd'
import { servicesSchema } from '@/lib/seo/schema'

export const metadata: Metadata = buildMetadata({
  locale: 'en',
  path: '/services',
  title: 'Services: Longevity, Metabolic Health & Performance',
  description:
    'Three pillars, one purpose: managing your biological age, optimising metabolism, and reaching peak physical performance, all based on your data.',
})

export default async function EnServicesIndexPage() {
  const services = await sanityClient.fetch<ServiceDetail[]>(
    servicesFullQuery,
    {},
    { next: { tags: ['sanity'] } }
  )

  const serviceLd = (services ?? []).map((s) => ({
    name: s.title_en || '',
    description: s.summary_en || s.intro_en,
    path: `/services#${s.slug}`,
  }))

  return (
    <>
      {serviceLd.length > 0 && <JsonLd data={servicesSchema(serviceLd, 'en')} />}
      <ServicesPage locale="en" services={services ?? []} />
    </>
  )
}
