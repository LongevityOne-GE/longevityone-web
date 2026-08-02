import type { Locale } from '@/lib/utils'
import type { SanityReview } from '@/lib/sanity/types'

/**
 * Patient reviews — content lives in Sanity (`review` documents), editable in
 * the Studio at /studio without a code change or deploy.
 *
 * Consent is a hard gate, enforced twice:
 *   1. The `consented` field's Studio validation blocks Publish unless it is
 *      explicitly checked true.
 *   2. `reviewsQuery` (src/lib/sanity/queries.ts) filters on `consented == true`,
 *      so even a stale cache or draft can never surface an unconsented review.
 *
 * `date` is optional in the schema — leave it blank rather than guessing; the
 * card simply shows no date, and `datePublished` is omitted from the JSON-LD.
 */
export type Review = SanityReview

/**
 * Review body for the active locale. English falls back to the original
 * Georgian when no human translation exists — never auto-translated.
 */
export function reviewText(review: Review, locale: Locale): string {
  return locale === 'en' ? (review.text_en ?? review.text_ka) : review.text_ka
}

/** Client name for the active locale, falling back to the original. */
export function reviewName(review: Review, locale: Locale): string {
  return locale === 'en' ? (review.name_en ?? review.name_ka) : review.name_ka
}

/** Service name for the active locale, falling back to the original. */
export function reviewService(review: Review, locale: Locale): string {
  return locale === 'en' ? (review.service_en ?? review.service_ka) : review.service_ka
}

const DIVISIONS: Array<{ unit: Intl.RelativeTimeFormatUnit; ms: number }> = [
  { unit: 'year', ms: 1000 * 60 * 60 * 24 * 365 },
  { unit: 'month', ms: 1000 * 60 * 60 * 24 * 30 },
  { unit: 'week', ms: 1000 * 60 * 60 * 24 * 7 },
  { unit: 'day', ms: 1000 * 60 * 60 * 24 },
]

/**
 * "2 months ago" / "2 თვის წინ" via Intl — no dependency, correct Georgian.
 * Anything under a day reads as "today" in the active locale.
 */
export function formatRelativeDate(iso: string | null, locale: Locale): string {
  if (!iso) return ''
  const then = Date.parse(iso)
  if (Number.isNaN(then)) return ''

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const elapsed = Date.now() - then

  for (const { unit, ms } of DIVISIONS) {
    const value = Math.floor(elapsed / ms)
    if (value >= 1) return rtf.format(-value, unit)
  }
  return rtf.format(0, 'day')
}
