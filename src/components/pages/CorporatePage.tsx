'use client'

import type { Locale } from '@/lib/utils'
import type { CorporatePage as CorporatePageData } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'
import { Programmes } from '@/components/sections/Programmes'
import { CorporateCTA } from '@/components/sections/CorporateCTA'

interface CorporatePageProps {
  locale: Locale
  data: CorporatePageData | null
}

export function CorporatePage({ locale, data }: CorporatePageProps) {
  const title =
    (locale === 'ka' ? data?.h1_ka : data?.h1_en) ||
    (locale === 'ka' ? 'კორპორატიული ჯანმრთელობა' : 'Corporate Wellness')
  const subtitle = locale === 'ka' ? data?.intro_ka : data?.intro_en
  const ctaLabel = locale === 'ka' ? data?.cta_label_ka : data?.cta_label_en

  return (
    <main className="flex flex-col">
      <PageHero locale={locale} title={title} subtitle={subtitle} />
      <Programmes locale={locale} programmes={data?.programmes} />
      <CorporateCTA locale={locale} ctaLabel={ctaLabel} />
    </main>
  )
}
