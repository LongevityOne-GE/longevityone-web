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

export async function sendMetaTestEvent(testEventCode: string): Promise<MetaSendResult> {
  const pixelId = process.env.META_PIXEL_ID
  const token = process.env.META_CONVERSIONS_API_TOKEN
  if (!pixelId || !token) return { ok: false, error: 'Credentials are not configured' }
  if (!isValidTestCode(testEventCode)) {
    return { ok: false, error: 'That does not look like a test code (e.g. TEST12345)' }
  }

  try {
    const res = await fetch(
      `${GRAPH}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
          test_event_code: testEventCode.toUpperCase(),
          data: [
            {
              event_name: 'Contact',
              event_time: Math.floor(Date.now() / 1000),
              event_id: `diagnostic-${Date.now()}`,
              event_source_url: 'https://www.longevityone.ge/thank-you',
              action_source: 'website',
              // A fixed, obviously synthetic user so the test never resembles a patient.
              user_data: {
                client_user_agent: 'LongevityOne tracking check',
                client_ip_address: '127.0.0.1',
              },
            },
          ],
        }),
      },
    )
    const body = (await res.json()) as {
      events_received?: number
      error?: { message?: string }
    }
    if (!res.ok || body.error) {
      return { ok: false, error: body.error?.message ?? `Meta returned ${res.status}` }
    }
    return { ok: body.events_received === 1, eventsReceived: body.events_received }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Request failed' }
  }
}
