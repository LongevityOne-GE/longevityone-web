/**
 * Campaign attribution capture.
 *
 * A visitor usually lands from an ad on one page and submits a lead several
 * pages later, by which point the UTM params are long gone from the URL. This
 * module snapshots them on the first page of the session and replays them onto
 * every form submission, so paid spend can be tied to the leads it produced.
 *
 * First touch wins: once a session has attribution, later navigations never
 * overwrite it. Storage is sessionStorage, so it is scoped to the tab and is
 * discarded when the tab closes.
 */

import { z } from 'zod'

const STORAGE_KEY = 'lo_attribution'

/** The attribution fields mirrored by the founder_circle_leads columns. */
export interface Attribution {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  gclid?: string
  fbclid?: string
  landing_page?: string
  referrer?: string
}

/** Query params copied verbatim from the landing URL. */
const PARAM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
] as const

/** Longest value we will store per field - guards against absurd URLs. */
const MAX_VALUE_LENGTH = 500

function clean(value: string | null): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return trimmed.slice(0, MAX_VALUE_LENGTH)
}

/**
 * Capture UTM / click-ID params on first landing and persist them for the whole
 * session. Safe to call on every mount: it returns immediately once a session
 * already holds attribution.
 */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return

  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return // first touch wins

    const params = new URLSearchParams(window.location.search)
    const attribution: Attribution = {}

    for (const key of PARAM_KEYS) {
      const value = clean(params.get(key))
      if (value) attribution[key] = value
    }

    // Only record a campaign session, not every organic hit: without at least
    // one UTM or click ID there is nothing to attribute, and storing the
    // landing page alone would pin the session to a meaningless first touch.
    if (Object.keys(attribution).length === 0) return

    attribution.landing_page = window.location.pathname.slice(0, MAX_VALUE_LENGTH)

    const referrer = clean(document.referrer)
    // Drop same-origin referrers: an internal navigation says nothing about
    // where the visitor came from.
    if (referrer && !referrer.startsWith(window.location.origin)) {
      attribution.referrer = referrer
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution))
  } catch {
    // sessionStorage throws in private mode / when storage is disabled.
    // Attribution is best-effort and must never break a page or a form.
  }
}

/**
 * Read the session's attribution, or an empty object when there is none.
 * Returns an object (not null) so callers can spread it into a request body
 * unconditionally.
 */
export function getAttribution(): Attribution {
  if (typeof window === 'undefined') return {}

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return parsed as Attribution
  } catch {
    return {}
  }
}

/**
 * Every attribution field, in the order they should be shown to staff.
 * Shared by the API routes (validation, notification emails) and the leads
 * dashboard so the three never drift apart.
 */
export const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
  'landing_page',
  'referrer',
] as const satisfies readonly (keyof Attribution)[]

/**
 * Server-side validation for the attribution block of a form submission.
 *
 * Every field is optional and length-capped: this data is attacker-controlled
 * (anyone can craft a URL), so it is treated as untrusted input and never
 * allowed to grow unbounded. Unknown keys are stripped by Zod's default
 * object behaviour.
 */
export const attributionSchema = z.object({
  utm_source: z.string().max(MAX_VALUE_LENGTH).optional(),
  utm_medium: z.string().max(MAX_VALUE_LENGTH).optional(),
  utm_campaign: z.string().max(MAX_VALUE_LENGTH).optional(),
  utm_content: z.string().max(MAX_VALUE_LENGTH).optional(),
  utm_term: z.string().max(MAX_VALUE_LENGTH).optional(),
  gclid: z.string().max(MAX_VALUE_LENGTH).optional(),
  fbclid: z.string().max(MAX_VALUE_LENGTH).optional(),
  landing_page: z.string().max(MAX_VALUE_LENGTH).optional(),
  referrer: z.string().max(MAX_VALUE_LENGTH).optional(),
})

/** Normalise a validated attribution object into DB columns (undefined -> null). */
export function attributionToColumns(
  attribution: Attribution,
): Record<(typeof ATTRIBUTION_KEYS)[number], string | null> {
  return Object.fromEntries(
    ATTRIBUTION_KEYS.map((key) => [key, attribution[key] ?? null]),
  ) as Record<(typeof ATTRIBUTION_KEYS)[number], string | null>
}

/** True when at least one attribution field carries a value. */
export function hasAttribution(attribution: Attribution): boolean {
  return ATTRIBUTION_KEYS.some((key) => Boolean(attribution[key]))
}
