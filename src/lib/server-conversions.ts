import { createHash } from 'node:crypto'
import { SITE_URL } from '@/lib/seo/metadata'
import { META_EVENTS, type MetaEventName } from '@/lib/meta-events'

/**
 * Server-side conversion reporting (Meta Conversions API).
 *
 * Browser-side tags miss a real share of conversions: ad blockers, tracking
 * prevention (Safari/iOS in particular), and people who close the tab before
 * the tag fires. Reporting the same conversion from the server recovers those,
 * and the ad platforms deduplicate against the browser event using a shared
 * event ID so nothing is double counted.
 *
 * Entirely optional. Every function no-ops unless its credentials are set, so
 * the site behaves exactly as before until the ad manager supplies them.
 *
 * PRIVACY: personal data is only ever sent SHA-256 hashed, which is what both
 * platforms require. Raw emails and phone numbers never leave the server.
 */

const META_PIXEL_ID = process.env.META_PIXEL_ID
const META_ACCESS_TOKEN = process.env.META_CONVERSIONS_API_TOKEN

/**
 * Meta requires `event_source_url` to be a full URL for website events. The
 * routes only know a path (the page the form was submitted from), so it is
 * resolved against the canonical origin here. Anything that is already an
 * absolute http(s) URL is passed through untouched.
 */
function absoluteUrl(pathOrUrl: string | null | undefined): string {
  const value = (pathOrUrl ?? '').trim()
  if (/^https?:\/\//i.test(value)) return value
  const path = value.startsWith('/') ? value : `/${value}`
  return `${SITE_URL}${path === '/' ? '' : path}` || SITE_URL
}

/** Both platforms require lowercase, trimmed values before hashing. */
function hash(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  const normalised = value.trim().toLowerCase()
  if (!normalised) return undefined
  return createHash('sha256').update(normalised).digest('hex')
}

/** Phone numbers hash in E.164 without the plus or any separators. */
function hashPhone(phone: string | null | undefined): string | undefined {
  if (!phone) return undefined
  const digits = phone.replace(/\D/g, '')
  if (!digits) return undefined
  return createHash('sha256').update(digits).digest('hex')
}

export interface ConversionInput {
  /** Shared with the browser event so the platforms deduplicate. */
  eventId: string
  email?: string | null
  phone?: string | null
  /** Meta click ID, if this visitor arrived from a Meta ad. */
  fbclid?: string | null
  /** First-party visitor ID (see visitor-id.ts). Sent hashed as external_id. */
  externalId?: string | null
  /** Page the conversion happened on. A path is fine; it is made absolute. */
  sourceUrl: string
  clientIp?: string
  userAgent?: string
  value?: number
  currency?: string
}

export interface MetaEventInput extends ConversionInput {
  /** Meta's browser cookies, when the request came from the visitor's browser. */
  fbp?: string | null
  fbc?: string | null
}

/**
 * Send one event to the Meta Conversions API.
 *
 * Only names from META_EVENTS: Meta silently drops restricted standard events
 * such as Lead and Contact for this dataset, so conversions go as custom events
 * (see meta-events.ts). No-ops unless META_PIXEL_ID and
 * META_CONVERSIONS_API_TOKEN are set.
 */
export async function sendMetaEvent(eventName: MetaEventName, input: MetaEventInput): Promise<void> {
  if (!META_PIXEL_ID || !META_ACCESS_TOKEN) return

  const userData: Record<string, unknown> = {}
  const em = hash(input.email)
  const ph = hashPhone(input.phone)
  if (em) userData.em = [em]
  if (ph) userData.ph = [ph]
  if (input.clientIp && input.clientIp !== 'unknown') {
    userData.client_ip_address = input.clientIp
  }
  if (input.userAgent) userData.client_user_agent = input.userAgent
  // Browser cookies set by the Pixel give Meta the strongest match, so prefer
  // them; fall back to building fbc from a click ID.
  // Meta hashes external_id itself in the browser, so the server sends the
  // SHA-256 of the same value and the two sides line up.
  const ext = hash(input.externalId)
  if (ext) userData.external_id = [ext]
  if (input.fbp) userData.fbp = input.fbp
  if (input.fbc) userData.fbc = input.fbc
  else if (input.fbclid) {
    // Meta expects the click ID packed as fb.1.<timestamp>.<fbclid>.
    userData.fbc = `fb.1.${Date.now()}.${input.fbclid}`
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(META_ACCESS_TOKEN)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [
            {
              event_name: eventName,
              event_time: Math.floor(Date.now() / 1000),
              event_id: input.eventId,
              event_source_url: absoluteUrl(input.sourceUrl),
              action_source: 'website',
              user_data: userData,
              ...(input.value
                ? { custom_data: { value: input.value, currency: input.currency ?? 'GEL' } }
                : {}),
            },
          ],
        }),
      },
    )
    if (!res.ok) {
      // Log only Meta's error code and message. The error payload does not
      // echo user data, and without the message a rejection is undiagnosable.
      const detail = (await res.json().catch(() => null)) as {
        error?: { code?: number; error_subcode?: number; message?: string }
      } | null
      console.error('[conversions] meta capi rejected', res.status, {
        code: detail?.error?.code,
        subcode: detail?.error?.error_subcode,
        message: detail?.error?.message,
      })
    }
  } catch (err) {
    console.error('[conversions] meta capi request failed', err)
  }
}

/**
 * Report one lead to Meta from the server.
 *
 * Only when the visitor granted marketing consent in the cookie banner. The
 * browser Pixel is gated on the same consent, so the two paths always agree:
 * either both report (and Meta merges them on event_id) or neither does.
 *
 * GA4 is deliberately not reported from the server. Unlike Meta, GA4 does not
 * deduplicate Measurement Protocol events against browser events, so a server
 * copy would count every lead twice. GA4 receives leads through GTM only.
 *
 * Fire-and-forget from the caller's perspective: a slow or broken ad platform
 * must never delay or fail a lead submission.
 */
export async function reportLeadConversion(
  input: ConversionInput & { marketingConsent: boolean },
): Promise<void> {
  if (!input.marketingConsent) return
  await sendMetaEvent(META_EVENTS.formSubmit, input).catch(() => undefined)
}
