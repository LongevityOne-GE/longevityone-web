import { z } from 'zod'
import rawReviews from '@/content/reviews.json'
import type { Locale } from '@/lib/utils'

/**
 * Client reviews — content pipeline.
 *
 * ─── HOW TO ADD A REAL REVIEW ────────────────────────────────────────────────
 * Edit `src/content/reviews.json`. An entry is rendered ONLY if it passes every
 * check below; anything malformed, unconsented, or still containing the
 * `REPLACE_WITH_REAL_REVIEW` sentinel is silently dropped. That is deliberate:
 * it is impossible to ship placeholder or unconsented text to production.
 *
 *   id        unique string
 *   name      client's real name, exactly as they consented to have it shown
 *   rating    integer 1–5
 *   date      ISO date, e.g. "2026-05-14"
 *   service   MUST match a real service name (see VALID_SERVICES below)
 *   text_ge   Georgian review text, verbatim from the client
 *   text_en   human-supplied English translation, or null. NEVER machine
 *             translate: leave it null and the original Georgian is shown.
 *   consented must be literal boolean true — written consent on file
 *   source    "google" | "direct"
 *
 * Valid `service` values (from Sanity `package` documents):
 *   Metabolic Balance Programme / მეტაბოლური ბალანსის პროგრამა
 *   Longevity Programme (12 Weeks) / დღეგრძელობის პროგრამა (12 კვირა)
 *   Energy Recovery & Peak Performance Programme /
 *     ენერგიის აღდგენის და პიკური პერფორმანსის პროგრამა
 *   Metabolic audit — both together / მეტაბოლური აუდიტი — ორივე ერთად
 *   Resting metabolic test / მოსვენების მეტაბოლური ტესტი
 *   Exercise test with VO₂ Max / დატვირთვის ტესტი VO₂ Max-ით
 *   Epigenetic Test / ეპიგენეტიკური ტესტი
 *   Microbiome Analysis / მიკრობიომის ანალიზი
 *   Silver / Gold / Elite Platinum   (memberships)
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Sentinel used by the seeded placeholders. Any entry carrying it is dropped. */
const PLACEHOLDER_SENTINEL = 'REPLACE_WITH_REAL_REVIEW'

const hasSentinel = (value: unknown): boolean =>
  typeof value === 'string' && value.includes(PLACEHOLDER_SENTINEL)

const reviewSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  /** Latin transliteration shown on /en. Falls back to `name` when absent. */
  name_en: z.string().min(1).nullable().optional(),
  rating: z.number().int().min(1).max(5),
  /**
   * ISO date, or null when the real date is not known. Null renders no date at
   * all rather than a guessed one — we never invent a publication date.
   */
  date: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), { message: 'date must be an ISO date string' })
    .nullable(),
  service: z.string().min(1),
  /** English service name shown on /en. Falls back to `service` when absent. */
  service_en: z.string().min(1).nullable().optional(),
  text_ge: z.string().min(1),
  text_en: z.string().min(1).nullable(),
  // Hard consent gate: only the literal boolean `true` passes.
  consented: z.literal(true),
  source: z.enum(['google', 'direct']),
})

export type Review = z.infer<typeof reviewSchema>

/**
 * Returns only reviews that are structurally valid AND explicitly consented.
 * Placeholder rows fail (`consented` is a string, not `true`) and are dropped,
 * so the seeded file yields an empty list until real reviews are supplied.
 */
export function getConsentedReviews(): Review[] {
  if (!Array.isArray(rawReviews)) return []

  return (rawReviews as unknown[]).flatMap((entry) => {
    // Reject anything still holding the placeholder sentinel in a rendered field.
    if (entry && typeof entry === 'object') {
      const values = Object.entries(entry as Record<string, unknown>)
        .filter(([key]) => key !== 'text_en')
        .map(([, value]) => value)
      if (values.some(hasSentinel)) return []
    }

    const parsed = reviewSchema.safeParse(entry)
    if (!parsed.success) return []

    // An untranslated English field left as the sentinel falls back to null,
    // which renders the original Georgian rather than placeholder text.
    const review = parsed.data
    return [hasSentinel(review.text_en) ? { ...review, text_en: null } : review]
  })
}

/**
 * Review body for the active locale. English falls back to the original
 * Georgian when no human translation exists — we never auto-translate.
 */
export function reviewText(review: Review, locale: Locale): string {
  return locale === 'en' ? (review.text_en ?? review.text_ge) : review.text_ge
}

/** Client name for the active locale, falling back to the original. */
export function reviewName(review: Review, locale: Locale): string {
  return locale === 'en' ? (review.name_en ?? review.name) : review.name
}

/** Service name for the active locale, falling back to the original. */
export function reviewService(review: Review, locale: Locale): string {
  return locale === 'en' ? (review.service_en ?? review.service) : review.service
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
