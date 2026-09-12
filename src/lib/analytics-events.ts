/**
 * Typed dataLayer event helpers.
 *
 * Every conversion signal the site emits goes through this module so the event
 * names stay in one place and match what the ad manager configures as triggers
 * in GTM. Pushing before GTM loads is safe - GTM drains the existing queue on
 * initialisation.
 *
 * These pushes carry no personal data: never put a name, phone number, email
 * or message into the dataLayer, as GTM forwards it to third parties.
 */

/** Event names GTM triggers key off. Keep in sync with the GTM container. */
export const ANALYTICS_EVENTS = {
  phoneClick: 'phone_click',
  leadSubmitted: 'lead_submitted',
} as const

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
 * Fire on every tap of a `tel:` link. The site runs in calls-only mode
 * (BOOKING_ENABLED is false), so a phone tap is the primary conversion.
 *
 * @param source Where the tap happened - 'footer', 'contact_page', 'links_page'.
 */
export function trackPhoneClick(source: string): void {
  push({ event: ANALYTICS_EVENTS.phoneClick, phone_click_source: source })
}

/**
 * Fire once a lead form has been accepted by the server.
 *
 * @param source Which form produced the lead, matching the DB `source` column.
 */
export function trackLeadSubmitted(source: string): void {
  push({ event: ANALYTICS_EVENTS.leadSubmitted, lead_source: source })
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
export function markLeadPending(source: string): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(LEAD_PENDING_KEY, source)
  } catch {
    // Private mode / storage disabled. The thank-you page then simply does not
    // fire the event, which is the safe direction to fail in.
  }
}

/**
 * Consume the pending-lead flag. Returns the source when this view genuinely
 * followed a submission, or null for a reload or a direct visit.
 */
export function consumeLeadPending(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const source = sessionStorage.getItem(LEAD_PENDING_KEY)
    if (!source) return null
    sessionStorage.removeItem(LEAD_PENDING_KEY)
    return source
  } catch {
    return null
  }
}
