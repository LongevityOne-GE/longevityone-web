import type { Metadata } from 'next'
import { sanityClient, servicesFullQuery } from '@/lib/sanity'
import type { ServiceDetail } from '@/lib/sanity/types'
import { ServicesPage } from '@/components/pages/ServicesPage'
import { buildMetadata } from '@/lib/seo/metadata'
import { JsonLd } from '@/components/seo/JsonLd'
import { servicesSchema } from '@/lib/seo/schema'

export const metadata: Metadata = buildMetadata({
  locale: 'ka',
  path: '/services',
  title: 'სერვისები',
  description: 'Longevity One-ის სამი ძირითადი პრევენციული მედიცინის სერვისი - დღეგრძელობა, მეტაბოლური ჯანმრთელობა და ელიტური პერფორმანსი.',
})

export default async function KaServicesIndexPage() {
  const services = await sanityClient.fetch<ServiceDetail[]>(
    servicesFullQuery,
    {},
    { next: { tags: ['sanity'] } }
  )

  const serviceLd = (services ?? []).map((s) => ({
    name: s.title_ka || '',
    description: s.summary_ka || s.intro_ka,
    path: `/services#${s.slug}`,
  }))

  return (
    <>
      {serviceLd.length > 0 && <JsonLd data={servicesSchema(serviceLd, 'ka')} />}
      <ServicesPage locale="ka" services={services ?? []} />
    </>
  )
}
