import type { Metadata } from 'next'
import { sanityClient, servicesFullQuery } from '@/lib/sanity'
import type { ServiceDetail } from '@/lib/sanity/types'
import { ServicesPage } from '@/components/pages/ServicesPage'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Three science-backed preventive medicine programmes - Longevity, Metabolic Health, and Elite Performance.',
}

export default async function EnServicesIndexPage() {
  const services = await sanityClient.fetch<ServiceDetail[]>(
    servicesFullQuery,
    {},
    { next: { tags: ['sanity'] } }
  )

  return <ServicesPage locale="en" services={services ?? []} />
}
