'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import type { SiteSettings } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'
import { consumeLeadPending, trackLeadSubmitted } from '@/lib/analytics-events'

interface ThankYouPageProps {
  locale: Locale
  settings: SiteSettings | null
}

const FALLBACK = {
  ka: {
    heading: 'მადლობა',
    body: 'თქვენი მოთხოვნა მიღებულია. ჩვენი კონსიერჟი დაგიკავშირდებათ 24 საათის განმავლობაში.',
    cta: 'მთავარ გვერდზე დაბრუნება',
  },
  en: {
    heading: 'Thank You',
    body: 'We have received your request. Our concierge will call you within 24 hours.',
    cta: 'Back to home',
  },
} as const

export function ThankYouPage({ locale, settings }: ThankYouPageProps) {
  const fallback = FALLBACK[locale]
  const heading =
    (locale === 'ka' ? settings?.thankYou_heading_ka : settings?.thankYou_heading_en) ||
    fallback.heading
  const body =
    (locale === 'ka' ? settings?.thankYou_body_ka : settings?.thankYou_body_en) ||
    fallback.body
  const cta =
    (locale === 'ka' ? settings?.thankYou_cta_ka : settings?.thankYou_cta_en) ||
    fallback.cta

  useEffect(() => {
    // Fire the conversion only when this view actually followed a submission.
    // A reload or a direct visit finds no pending flag and pushes nothing, so
    // the conversion count stays honest.
    const source = consumeLeadPending()
    if (source) trackLeadSubmitted(source)
  }, [])

  return (
    <main className="flex-1">
      <PageHero locale={locale} title={heading} subtitle={body} />
      <section className="section-container pb-24 md:pb-32 text-center">
        <Link href={locale === 'en' ? '/en' : '/'} className="btn-primary">
          {cta}
        </Link>
      </section>
    </main>
  )
}
