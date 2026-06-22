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
    locale: 'ka',
    path: '/faq',
    title: data?.page?.seo_title_ka || 'ხშირად დასმული კითხვები',
    description: data?.page?.seo_description_ka,
  })
}

export default async function KaFaqPage() {
  const data = await sanityClient.fetch<FaqData>(faqQuery, {}, { next: { tags: ['sanity'] } })
  const faqItems = (data?.items ?? []).map((it) => ({
    question: it.question_ka || '',
    answer: blocksToPlainText(it.answer_ka),
  }))
  return (
    <>
      {faqItems.length > 0 && <JsonLd data={faqSchema(faqItems, 'ka')} />}
      <FaqPage locale="ka" data={data ?? null} />
    </>
  )
}
