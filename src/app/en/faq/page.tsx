import type { Metadata } from 'next'
import { sanityClient, faqQuery } from '@/lib/sanity'
import type { FaqData } from '@/lib/sanity/types'
import { FaqPage } from '@/components/pages/FaqPage'
import { buildMetadata } from '@/lib/seo/metadata'
import { JsonLd } from '@/components/seo/JsonLd'
import { faqSchema } from '@/lib/seo/schema'
import { blocksToPlainText } from '@/lib/seo/portableText'

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityClient.fetch<FaqData>(faqQuery, {}, { next: { tags: ['sanity'] } })
  return buildMetadata({
    locale: 'en',
    path: '/faq',
    title: data?.page?.seo_title_en || 'Longevity Clinic Frequently Asked Questions',
    description:
      data?.page?.seo_description_en ||
      'Answers about Longevity One programs, biological age testing, preventive diagnostics, booking a visit, and longevity clinic services in Tbilisi, Georgia.',
    keywords: ['longevity clinic FAQ', 'biological age test Georgia', 'preventive diagnostics Tbilisi'],
  })
}

export default async function EnFaqPage() {
  const data = await sanityClient.fetch<FaqData>(faqQuery, {}, { next: { tags: ['sanity'] } })
  const faqItems = (data?.items ?? []).map((it) => ({
    question: it.question_en || '',
    answer: blocksToPlainText(it.answer_en),
  }))
  return (
    <>
      {faqItems.length > 0 && <JsonLd data={faqSchema(faqItems, 'en')} />}
      <FaqPage locale="en" data={data ?? null} />
    </>
  )
}
