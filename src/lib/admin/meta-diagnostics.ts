/**
 * Live check of the Meta Conversions API.
 *
 * The first version read the dataset's details to test the token. That was the
 * wrong test: tokens generated in Events Manager are allowed to SEND events but
 * usually not to READ the dataset, so a working token failed with
 * "(#100) Missing Permission". This sends a test event instead, using exactly
 * the permission real leads use.
 *
 * Events sent with a test_event_code appear only in Events Manager's Test
 * Events tab and are never counted in reporting, so this creates no fake leads.
 */

import { META_EVENTS } from '@/lib/meta-events'

const GRAPH = 'https://graph.facebook.com/v21.0'

export interface MetaConfig {
  pixelIdPresent: boolean
  tokenPresent: boolean
}

export interface MetaSendResult {
  ok: boolean
  /** Meta's count of events it accepted. 1 means the send worked. */
  eventsReceived?: number
  /** Meta's own error message when it rejected the event. */
  error?: string
}

export function metaConfig(): MetaConfig {
  return {
    pixelIdPresent: Boolean(process.env.META_PIXEL_ID),
    tokenPresent: Boolean(process.env.META_CONVERSIONS_API_TOKEN),
  }
}

/** Test event codes look like TEST12345. Anything else is rejected before sending. */
export function isValidTestCode(code: string): boolean {
  return /^TEST[A-Z0-9]{2,20}$/i.test(code)
}

export interface TestClient {
  ip?: string | null
  userAgent?: string | null
}

/**
 * Send one PageView and one PhoneClick under the test code: the two kinds of
 * event the site reports that Meta keeps for this dataset (restricted standard
 * events such as Lead and Contact are accepted and then dropped, so they never
 * show in Test events). Uses the admin's own IP and browser, because Meta may
 * discard events with a placeholder IP or user agent.
 */
export async function sendMetaTestEvent(
  testEventCode: string,
  client: TestClient = {},
): Promise<MetaSendResult> {
  const pixelId = process.env.META_PIXEL_ID
  const token = process.env.META_CONVERSIONS_API_TOKEN
  if (!pixelId || !token) return { ok: false, error: 'Credentials are not configured' }
  if (!isValidTestCode(testEventCode)) {
    return { ok: false, error: 'That does not look like a test code (e.g. TEST12345)' }
  }

  const now = Math.floor(Date.now() / 1000)
  const userData = {
    client_user_agent: client.userAgent || 'Mozilla/5.0',
    ...(client.ip ? { client_ip_address: client.ip } : {}),
  }
  const events = [META_EVENTS.pageView, META_EVENTS.phoneClick].map((eventName) => ({
    event_name: eventName,
    event_time: now,
    event_id: `diagnostic-${eventName}-${Date.now()}`,
    event_source_url: 'https://www.longevityone.ge/',
    action_source: 'website',
    user_data: userData,
  }))

  try {
    const res = await fetch(
      `${GRAPH}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ test_event_code: testEventCode.toUpperCase(), data: events }),
      },
    )
    const body = (await res.json()) as {
      events_received?: number
      error?: { message?: string }
    }
    if (!res.ok || body.error) {
      return { ok: false, error: body.error?.message ?? `Meta returned ${res.status}` }
    }
    return { ok: body.events_received === events.length, eventsReceived: body.events_received }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Request failed' }
  }
}
