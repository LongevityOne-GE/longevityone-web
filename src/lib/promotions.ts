import type { Locale } from '@/lib/utils'

/**
 * Time-boxed promotions shown on the ad landing page.
 *
 * `endsAt` controls visibility only and is deliberately never displayed: the
 * clinic does not want to advertise an end date. Services are not listed
 * either; the discount applies across several of them and staff explain the
 * details on the call.
 */
interface Promotion {
  id: string
  headline: Record<Locale, string>
  detail: Record<Locale, string>
  startsAt: string
  endsAt: string
}

const PROMOTIONS: Promotion[] = [
  {
    id: 'black-friday-2026',
    headline: { ka: 'Black Friday -20%', en: 'Black Friday -20%' },
    detail: {
      ka: 'დეტალებისთვის მოითხოვეთ ზარი',
      en: 'Request a call for details',
    },
    startsAt: '2026-11-22T00:00:00+04:00',
    // End of November, Tbilisi time.
    endsAt: '2026-11-30T23:59:59+04:00',
  },
]

export interface ActivePromotion {
  id: string
  headline: string
  detail: string
}

/** The promotion running at `now`, if any. Evaluated per request on the server. */
export function activePromotion(locale: Locale, now: Date = new Date()): ActivePromotion | null {
  const t = now.getTime()
  const promo = PROMOTIONS.find(
    (p) => t >= Date.parse(p.startsAt) && t <= Date.parse(p.endsAt),
  )
  if (!promo) return null
  return { id: promo.id, headline: promo.headline[locale], detail: promo.detail[locale] }
}
