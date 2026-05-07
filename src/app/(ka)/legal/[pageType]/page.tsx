import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityClient, legalPageByTypeQuery } from '@/lib/sanity'
import type { LegalPage } from '@/lib/sanity/types'
import { LegalPage as LegalPageComponent } from '@/components/pages/LegalPage'

const LEGAL_PAGE_TYPES = ['privacy', 'terms', 'cookies', 'medical-disclaimer']

interface Props {
  params: Promise<{ pageType: string }>
}

export async function generateStaticParams() {
  return LEGAL_PAGE_TYPES.map((pageType) => ({ pageType }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageType } = await params
  const page = await sanityClient.fetch<LegalPage>(
    legalPageByTypeQuery,
    { pageType },
    { next: { tags: ['sanity'] } }
  )
  return {
    title: page?.title_ka || undefined,
  }
}

export default async function KaLegalPage({ params }: Props) {
  const { pageType } = await params
  if (!LEGAL_PAGE_TYPES.includes(pageType)) notFound()
  const page = await sanityClient.fetch<LegalPage>(
    legalPageByTypeQuery,
    { pageType },
    { next: { tags: ['sanity'] } }
  )
  return <LegalPageComponent locale="ka" page={page ?? null} />
}
