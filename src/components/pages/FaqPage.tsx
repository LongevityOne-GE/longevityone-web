'use client'

import type { Locale } from '@/lib/utils'
import type { FaqData } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'
import { FaqAccordion } from '@/components/sections/FaqAccordion'

interface FaqPageProps {
  locale: Locale
  data: FaqData | null
}

export function FaqPage({ locale, data }: FaqPageProps) {
  const h1 = (locale === 'ka' ? data?.page?.h1_ka : data?.page?.h1_en) || (locale === 'ka' ? 'ხშირად დასმული კითხვები' : 'Frequently Asked Questions')

  return (
    <main className="flex flex-col">
      <PageHero locale={locale} title={h1} />
      <FaqAccordion locale={locale} items={data?.items ?? []} />
    </main>
  )
}
