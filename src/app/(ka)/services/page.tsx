import type { Metadata } from 'next'
import { sanityClient, servicesFullQuery } from '@/lib/sanity'
import type { ServiceDetail } from '@/lib/sanity/types'
import { ServicesPage } from '@/components/pages/ServicesPage'

export const metadata: Metadata = {
  title: 'სერვისები',
  description: 'Longevity One-ის სამი ძირითადი პრევენციული მედიცინის სერვისი - დღეგრძელობა, მეტაბოლური ჯანმრთელობა და ელიტური პერფორმანსი.',
}

export default async function KaServicesIndexPage() {
  const services = await sanityClient.fetch<ServiceDetail[]>(
    servicesFullQuery,
    {},
    { next: { tags: ['sanity'] } }
  )

  return <ServicesPage locale="ka" services={services ?? []} />
}
