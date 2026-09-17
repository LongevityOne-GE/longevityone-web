import { readConsent } from '@/lib/cookies'
import { META_EVENTS, type MetaEventName } from '@/lib/meta-events'

/**
 * Typed dataLayer event helpers.
 *
 * Every conversion signal the site emits goes through this module so the event
 * names stay in one place and match what the ad manager configures as triggers
 * in GTM. Pushing before GTM loads is safe: GTM drains the existing queue on
 * initialisation.
 *
 * These pushes carry NO personal data. Never put a name, phone number, email or
 * message into the dataLayer - GTM forwards it to third parties.
 */

/** Event names GTM triggers key off. Keep in sync with the GTM container. */
export const ANALYTICS_EVENTS = {
  phoneClick: 'phone_click',
  leadSubmitted: 'lead_submitted',
  virtualPageView: 'virtual_page_view',
  leadFormOpen: 'lead_form_open',
} as const

/**
 * Nominal value of one lead, used by Google Ads smart bidding. Bidding toward a
 * value rather than a raw count lets the platform weigh conversions; even a
 * rough average beats none. Set NEXT_PUBLIC_LEAD_VALUE to the clinic's figure.
 */
const LEAD_VALUE = Number(process.env.NEXT_PUBLIC_LEAD_VALUE ?? '0')
const LEAD_CURRENCY = process.env.NEXT_PUBLIC_LEAD_CURRENCY ?? 'GEL'

/**
 * Call the Meta Pixel, or queue the call if the Pixel has not loaded yet.
 *
 * The thank-you page fires its FormSubmit event on mount, which can run before the
 * Pixel script has finished loading. Queued calls are flushed when the Pixel
 * initialises. The Pixel only loads with marketing consent, so without consent
 * the queue is never flushed and nothing reaches Meta.
 */
function metaTrack(...args: unknown[]): void {
  if (typeof window === 'undefined') return
  try {
    if (typeof window.fbq === 'function') window.fbq(...args)
    else (window.__loMeta = window.__loMeta ?? []).push(args)
  } catch {
    // Analytics must never break a user interaction.
  }
}

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

/**
 * Run `fn` once the GTM container has loaded, or after a timeout.
 *
 * The thank-you page fires its lead event on mount, which happens before the
 * container script has downloaded. GTM does process queued events, but in
 * queue order: an event queued ahead of `gtm.js` is handled before the
 * Initialization triggers, so the Google tag has not configured GA4 yet and
 * the GA4 event tag fires into nothing. Waiting for the container avoids that.
 * The timeout keeps the event from being lost if GTM is blocked entirely.
 */
function whenGtmReady(fn: () => void, timeoutMs = 5000): void {
  if (typeof window === 'undefined') return
  const w = window as Window & { google_tag_manager?: Record<string, unknown> }
  if (!GTM_ID) return fn()
  const started = Date.now()
  const tick = () => {
    if (w.google_tag_manager?.[GTM_ID] || Date.now() - started > timeoutMs) fn()
    else window.setTimeout(tick, 100)
  }
  tick()
}

function push(event: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  try {
    window.dataLayer = window.dataLayer ?? []
    window.dataLayer.push(event)
  } catch {
    // Analytics must never break a user interaction.
  }
}

/**
 * Coarse device class for the phone-click event.
 *
 * This matters: a `tel:` click on a desktop does not place a call. Counting
 * desktop taps as conversions would teach smart bidding to chase a signal that
 * does not exist, so the event carries the device and the ad manager keys the
 * Google Ads conversion off mobile only.
 */
function deviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  const ua = navigator.userAgent
  if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) return 'tablet'
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return 'mobile'
  return 'desktop'
}

/** True when the device can actually place a call from a tel: link. */
function canPlaceCall(): boolean {
  return deviceType() === 'mobile'
}

/**
 * Fire on every tap of a `tel:` link. The site runs in calls-only mode
 * (BOOKING_ENABLED is false), so a phone tap is the primary conversion.
 *
 * @param source Where the tap happened - 'footer', 'contact_page', 'links_page'.
 */
export function trackPhoneClick(source: string): void {
  push({
    event: ANALYTICS_EVENTS.phoneClick,
    phone_click_source: source,
    phone_click_device: deviceType(),
    // Convenience flag so the GTM trigger can be a simple equals-true check
    // instead of a regex over the device string.
    phone_click_is_callable: canPlaceCall(),
  })
  // Same rule as the GTM condition: a desktop click is not a call.
  if (!canPlaceCall()) return

  const eventId = newEventId('call')
  metaTrack('trackCustom', META_EVENTS.phoneClick, { content_name: source }, { eventID: eventId })
  sendServerCopy(META_EVENTS.phoneClick, eventId)
}

/**
 * Fire once a lead form has been accepted by the server.
 *
 * @param source Which form produced the lead, matching the DB `source` column.
 */
export function trackLeadSubmitted(source: string, eventId?: string | null): void {
  whenGtmReady(() => pushLead(source, eventId))
}

/**
 * Fire when the call-request popup opens. Opening it is a real step toward a
 * lead, and a click on a styled button is awkward to catch with GTM's generic
 * click trigger. Opens vs. `lead_submitted` gives the form's completion rate.
 */
export function trackLeadFormOpen(source: string): void {
  push({ event: ANALYTICS_EVENTS.leadFormOpen, lead_source: source })
}

function pushLead(source: string, eventId?: string | null): void {
  push({
    event: ANALYTICS_EVENTS.leadSubmitted,
    lead_source: source,
    // Same ID the server sent to Meta / GA4, so the platforms collapse the two
    // reports into a single conversion instead of counting it twice.
    ...(eventId ? { event_id: eventId } : {}),
    ...(LEAD_VALUE > 0 ? { value: LEAD_VALUE, currency: LEAD_CURRENCY } : {}),
  })
  // eventID must equal the server's event_id: that is how Meta recognises the
  // browser and server reports as ONE lead instead of two.
  metaTrack(
    'trackCustom',
    META_EVENTS.formSubmit,
    {
      content_name: source,
      ...(LEAD_VALUE > 0 ? { value: LEAD_VALUE, currency: LEAD_CURRENCY } : {}),
    },
    eventId ? { eventID: eventId } : undefined,
  )
}

/**
 * Fire on client-side route changes. A real page load already gives GTM its
 * Page View; navigating inside the app does not, so tags on "All Pages" would
 * miss every page after the first. GTM triggers on this event instead.
 *
 * GA4 records these navigations itself (enhanced measurement, browser history
 * changes), so this must NOT also fire a GA4 page_view or pages double count.
 */
export function trackVirtualPageView(path: string): void {
  push({
    event: ANALYTICS_EVENTS.virtualPageView,
    page_path: path,
    page_location: typeof window !== 'undefined' ? window.location.href : path,
    page_title: typeof document !== 'undefined' ? document.title : undefined,
  })
  trackMetaPageView()
}

/**
 * Meta PageView with an event_id, plus its Conversions API copy. Called for the
 * first page load and for every client-side navigation after it.
 */
export function trackMetaPageView(): void {
  if (typeof window === 'undefined') return
  const eventId = newEventId('pv')
  metaTrack('track', META_EVENTS.pageView, {}, { eventID: eventId })
  sendServerCopy(META_EVENTS.pageView, eventId)
}

function newEventId(prefix: string): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/**
 * Send the server copy of a browser Meta event to /api/meta-event, which
 * forwards it through the Conversions API. That recovers events ad blockers and
 * iOS tracking prevention hide from the Pixel; Meta merges the pair on
 * event_id. Same marketing-consent gate as the Pixel.
 *
 * sendBeacon survives a navigation that follows immediately, such as the tel:
 * link opening the dialer, where a normal fetch would be cancelled.
 */
function sendServerCopy(eventName: MetaEventName, eventId: string): void {
  try {
    if (readConsent()?.marketing !== true) return
    const fbclid = new URLSearchParams(window.location.search).get('fbclid')
    const body = JSON.stringify({
      event_name: eventName,
      event_id: eventId,
      page: window.location.pathname,
      ...(fbclid ? { fbclid } : {}),
    })
    navigator.sendBeacon?.('/api/meta-event', new Blob([body], { type: 'application/json' }))
  } catch {
    // Analytics must never break a user interaction.
  }
}

/**
 * Handoff between a submitted form and the thank-you page.
 *
 * The conversion event has to fire on /thank-you so GTM can also use the URL as
 * a trigger, but that page is a plain URL anyone can reload or open directly.
 * Firing on every view would inflate the conversion count and corrupt the cost
 * per lead the ad manager optimises against. So the form leaves a one-shot flag
 * behind, and the thank-you page fires only if it finds one, then clears it.
 */
const LEAD_PENDING_KEY = 'lo_lead_pending'

/** Called by a form immediately before redirecting to the thank-you page. */
export function markLeadPending(source: string, eventId?: string | null): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(LEAD_PENDING_KEY, JSON.stringify({ source, eventId: eventId ?? null }))
  } catch {
    // Private mode / storage disabled. The thank-you page then simply does not
    // fire the event, which is the safe direction to fail in.
  }
}

export interface PendingLead {
  source: string
  eventId: string | null
}

/**
 * Consume the pending-lead flag. Returns the submission details when this view
 * genuinely followed a submission, or null for a reload or a direct visit.
 */
export function consumeLeadPending(): PendingLead | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(LEAD_PENDING_KEY)
    if (!raw) return null
    sessionStorage.removeItem(LEAD_PENDING_KEY)
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const record = parsed as Partial<PendingLead>
    if (typeof record.source !== 'string') return null
    return { source: record.source, eventId: record.eventId ?? null }
  } catch {
    return null
  }
}
