import { createHash } from 'node:crypto'
import { SITE_URL } from '@/lib/seo/metadata'

/**
 * Server-side conversion reporting.
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
const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const GA4_API_SECRET = process.env.GA4_API_SECRET

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
  /** Page the conversion happened on. A path is fine; it is made absolute. */
  sourceUrl: string
  clientIp?: string
  userAgent?: string
  value?: number
  currency?: string
}

/**
 * Report a lead to the Meta Conversions API.
 * No-ops unless META_PIXEL_ID and META_CONVERSIONS_API_TOKEN are set.
 */
export async function sendMetaLead(input: ConversionInput): Promise<void> {
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
  if (input.fbclid) {
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
              event_name: 'Lead',
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
 * Report a lead to GA4 via the Measurement Protocol.
 * No-ops unless GA4_API_SECRET is set.
 */
export async function sendGa4Lead(
  input: ConversionInput & { clientId: string; leadSource: string },
): Promise<void> {
  if (!GA4_MEASUREMENT_ID || !GA4_API_SECRET) return

  try {
    const res = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(GA4_MEASUREMENT_ID)}&api_secret=${encodeURIComponent(GA4_API_SECRET)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: input.clientId,
          events: [
            {
              name: 'lead_submitted',
              params: {
                lead_source: input.leadSource,
                event_id: input.eventId,
                ...(input.value
                  ? { value: input.value, currency: input.currency ?? 'GEL' }
                  : {}),
              },
            },
          ],
        }),
      },
    )
    if (!res.ok) {
      console.error('[conversions] ga4 mp rejected', res.status)
    }
  } catch (err) {
    console.error('[conversions] ga4 mp request failed', err)
  }
}

/**
 * Report one lead to every configured platform.
 *
 * Deliberately fire-and-forget from the caller's perspective: a slow or broken
 * ad platform must never delay or fail a lead submission.
 */
export async function reportLeadConversion(
  input: ConversionInput & { clientId: string; leadSource: string },
): Promise<void> {
  await Promise.allSettled([sendMetaLead(input), sendGa4Lead(input)])
}
