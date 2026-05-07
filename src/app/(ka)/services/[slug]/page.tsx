import type { Metadata } from 'next'
import { sanityClient, serviceBySlugQuery, servicesQuery } from '@/lib/sanity'
import type { ServiceDetail, Service } from '@/lib/sanity/types'
import { ServicePage } from '@/components/pages/ServicePage'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const services = await sanityClient.fetch<Service[]>(servicesQuery)
  return (services ?? []).map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await sanityClient.fetch<ServiceDetail>(
    serviceBySlugQuery,
    { slug },
    { next: { tags: ['sanity'] } }
  )
  return {
    title: service?.seo_title_ka || service?.title_ka || '',
    description: service?.seo_description_ka || undefined,
  }
}

export default async function KaServicePage({ params }: Props) {
  const { slug } = await params
  const service = await sanityClient.fetch<ServiceDetail>(
    serviceBySlugQuery,
    { slug },
    { next: { tags: ['sanity'] } }
  )
  return <ServicePage locale="ka" service={service ?? null} />
}
