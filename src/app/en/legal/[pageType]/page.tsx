import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  LegalPageLayout,
  generateLegalMetadata,
} from '@/components/legal/LegalPageLayout'

const LEGAL_PAGE_TYPES = ['privacy', 'terms', 'cookies', 'medical-disclaimer'] as const
type LegalSlug = (typeof LEGAL_PAGE_TYPES)[number]

function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_PAGE_TYPES as readonly string[]).includes(value)
}

export const revalidate = 300

interface Props {
  params: Promise<{ pageType: string }>
}

export function generateStaticParams(): Array<{ pageType: string }> {
  return LEGAL_PAGE_TYPES.map((pageType) => ({ pageType }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageType } = await params
  if (!isLegalSlug(pageType)) return {}
  return generateLegalMetadata({ slug: pageType, lang: 'en' })
}

export default async function EnLegalPage({ params }: Props): Promise<React.ReactElement> {
  const { pageType } = await params
  if (!isLegalSlug(pageType)) notFound()
  return <LegalPageLayout slug={pageType} lang="en" />
}
