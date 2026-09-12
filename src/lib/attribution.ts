import { z } from 'zod'

/**
 * Campaign attribution capture.
 *
 * Nobody books a longevity programme in one browsing session. A visitor clicks
 * an ad, thinks about it for days, comes back by typing the domain, and only
 * then submits a form. So attribution is stored in localStorage with a 90-day
 * window (matching the ad platforms' own lookback) rather than sessionStorage,
 * which dies with the tab and would report almost every conversion as "direct".
 *
 * Both touches are kept:
 *  - FIRST touch is the campaign that discovered the visitor. It never changes
 *    inside the window, so paid media keeps credit for creating demand.
 *  - LAST touch is the campaign that brought them back to convert. Google Ads
 *    and Meta both attribute on last click, so storing this is what lets the
 *    dashboard reconcile with what those platforms report.
 */

const STORAGE_KEY = 'lo_attribution'

/** Matches the 90-day click lookback used by Google Ads and Meta. */
const WINDOW_DAYS = 90
const WINDOW_MS = WINDOW_DAYS * 24 * 60 * 60 * 1000

/** A new visit if this long has passed since the last page view. */
const VISIT_GAP_MS = 30 * 60 * 1000

/** Longest value stored per field. Guards against absurd or hostile URLs. */
const MAX_VALUE_LENGTH = 500

/** One set of campaign parameters. */
export interface Touch {
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

interface StoredAttribution {
  first: Touch
  last: Touch
  /** When the first touch happened - drives window expiry. */
  firstAt: number
  /** Last page view, used to decide whether a new visit has started. */
  seenAt: number
  touchCount: number
}

/** Flattened shape sent to the API: first touch unprefixed, last touch prefixed. */
export interface AttributionPayload extends Touch {
  last_utm_source?: string
  last_utm_medium?: string
  last_utm_campaign?: string
  last_utm_content?: string
  last_utm_term?: string
  last_gclid?: string
  last_fbclid?: string
  last_landing_page?: string
  last_referrer?: string
  touch_count?: number
}

const PARAM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
] as const

/** Touch fields in display order, used by the emails and the dashboard. */
export const TOUCH_KEYS = [
  ...PARAM_KEYS,
  'landing_page',
  'referrer',
] as const satisfies readonly (keyof Touch)[]

function clean(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  return trimmed ? trimmed.slice(0, MAX_VALUE_LENGTH) : undefined
}

/** Read the campaign parameters out of the current URL, if any. */
function readTouchFromUrl(): Touch | null {
  const params = new URLSearchParams(window.location.search)
  const touch: Touch = {}

  for (const key of PARAM_KEYS) {
    const value = clean(params.get(key))
    if (value) touch[key] = value
  }

  // No UTM and no click ID means there is nothing to attribute. Recording the
  // landing page alone would pin the visitor to a meaningless touch.
  if (Object.keys(touch).length === 0) return null

  touch.landing_page = clean(window.location.pathname)

  const referrer = clean(document.referrer)
  // Same-origin referrers are internal navigation and say nothing about origin.
  if (referrer && !referrer.startsWith(window.location.origin)) {
    touch.referrer = referrer
  }

  return touch
}

function read(): StoredAttribution | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null

    const record = parsed as Partial<StoredAttribution>
    if (typeof record.firstAt !== 'number' || !record.first || !record.last) return null

    // Outside the window the attribution is stale. Ad platforms would no longer
    // credit this click either, so we drop it rather than over-report.
    if (Date.now() - record.firstAt > WINDOW_MS) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return {
      first: record.first,
      last: record.last,
      firstAt: record.firstAt,
      seenAt: typeof record.seenAt === 'number' ? record.seenAt : record.firstAt,
      touchCount: typeof record.touchCount === 'number' ? record.touchCount : 1,
    }
  } catch {
    return null
  }
}

function write(record: StoredAttribution): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch {
    // Private mode, disabled storage, or quota. Attribution is best-effort and
    // must never break a page or a form.
  }
}

/**
 * Record this page view against the visitor's attribution.
 *
 * Safe and cheap to call on every mount. A page view carrying campaign
 * parameters becomes the new last touch (and the first touch if there is none);
 * a plain page view only advances the visit clock.
 */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return

  try {
    const now = Date.now()
    const existing = read()
    const incoming = readTouchFromUrl()

    if (!existing) {
      if (!incoming) return // organic visitor, nothing to store
      write({ first: incoming, last: incoming, firstAt: now, seenAt: now, touchCount: 1 })
      return
    }

    // A gap since the last page view means this is a separate visit.
    const isNewVisit = now - existing.seenAt > VISIT_GAP_MS

    write({
      // First touch is immutable for the life of the window.
      first: existing.first,
      // A campaign hit becomes the new last touch; otherwise keep the old one.
      last: incoming ?? existing.last,
      firstAt: existing.firstAt,
      seenAt: now,
      touchCount: existing.touchCount + (isNewVisit ? 1 : 0),
    })
  } catch {
    // Never let analytics break the page.
  }
}

/**
 * Flatten stored attribution for sending to the API. Returns an empty object
 * when there is none, so callers can spread it unconditionally.
 */
export function getAttribution(): AttributionPayload {
  if (typeof window === 'undefined') return {}

  const record = read()
  if (!record) return {}

  const payload: AttributionPayload = { ...record.first, touch_count: record.touchCount }

  for (const key of TOUCH_KEYS) {
    const value = record.last[key]
    if (value) payload[`last_${key}` as keyof AttributionPayload] = value as never
  }

  return payload
}

/** Clear stored attribution. Exposed for the cookie banner's reject path. */
export function clearAttribution(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

// ─── Server-side validation ──────────────────────────────────────────────────

const touchField = z.string().max(MAX_VALUE_LENGTH).optional()

/**
 * Validation for the attribution block of a submission.
 *
 * This data is attacker controlled - anyone can craft a URL - so every field is
 * optional, length capped, and unknown keys are stripped by Zod.
 */
export const attributionSchema = z.object({
  utm_source: touchField,
  utm_medium: touchField,
  utm_campaign: touchField,
  utm_content: touchField,
  utm_term: touchField,
  gclid: touchField,
  fbclid: touchField,
  landing_page: touchField,
  referrer: touchField,
  last_utm_source: touchField,
  last_utm_medium: touchField,
  last_utm_campaign: touchField,
  last_utm_content: touchField,
  last_utm_term: touchField,
  last_gclid: touchField,
  last_fbclid: touchField,
  last_landing_page: touchField,
  last_referrer: touchField,
  touch_count: z.number().int().min(1).max(1000).optional(),
})

export type ValidatedAttribution = z.infer<typeof attributionSchema>

/**
 * Every attribution column, in the order staff should see them.
 * Spelled out rather than derived from TOUCH_KEYS: a mapped template literal
 * widens to `string` and loses the key union the typed lookups below rely on.
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
  'last_utm_source',
  'last_utm_medium',
  'last_utm_campaign',
  'last_utm_content',
  'last_utm_term',
  'last_gclid',
  'last_fbclid',
  'last_landing_page',
  'last_referrer',
  'touch_count',
] as const satisfies readonly (keyof ValidatedAttribution)[]

/** Normalise validated attribution into DB columns (undefined becomes null). */
export function attributionToColumns(
  attribution: ValidatedAttribution,
): Record<(typeof ATTRIBUTION_KEYS)[number], string | number | null> {
  return Object.fromEntries(
    ATTRIBUTION_KEYS.map((key) => [key, attribution[key] ?? null]),
  ) as Record<(typeof ATTRIBUTION_KEYS)[number], string | number | null>
}

/** True when at least one attribution field carries a value. */
export function hasAttribution(attribution: ValidatedAttribution): boolean {
  return ATTRIBUTION_KEYS.some((key) => Boolean(attribution[key]))
}
