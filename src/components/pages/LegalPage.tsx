'use client'

import type { Locale } from '@/lib/utils'
import type { LegalPage as LegalPageType } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'
import { LegalBody } from '@/components/sections/LegalBody'

interface LegalPageProps {
  locale: Locale
  page: LegalPageType | null
}

export function LegalPage({ locale, page }: LegalPageProps) {
  if (!page) {
    return (
      <main className="flex flex-col">
        <PageHero locale={locale} title={locale === 'ka' ? 'გვერდი ვერ მოიძებნა' : 'Page Not Found'} />
      </main>
    )
  }

  const title = locale === 'ka' ? page.title_ka : page.title_en

  return (
    <main className="flex flex-col">
      <PageHero locale={locale} title={title || ''} />
      <LegalBody locale={locale} page={page} />
    </main>
  )
}
