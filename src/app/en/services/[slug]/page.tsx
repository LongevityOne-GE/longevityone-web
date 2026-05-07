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
    title: service?.seo_title_en || service?.title_en || '',
    description: service?.seo_description_en || undefined,
  }
}

export default async function EnServicePage({ params }: Props) {
  const { slug } = await params
  const service = await sanityClient.fetch<ServiceDetail>(
    serviceBySlugQuery,
    { slug },
    { next: { tags: ['sanity'] } }
  )
  return <ServicePage locale="en" service={service ?? null} />
}
