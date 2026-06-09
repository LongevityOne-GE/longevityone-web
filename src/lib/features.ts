/**
 * Feature flags.
 *
 * BOOKING_ENABLED — online (Cal.com) booking is temporarily disabled at the
 * clinic's request; the site runs in "calls only" mode. While `false`:
 *   • every "book a visit" CTA opens the "request a call" lead-capture modal,
 *   • the /booking route redirects to /contact,
 *   • /booking is dropped from the sitemap.
 * All Cal.com / BookingPage code is left intact — flip this to `true` to fully
 * restore online booking everywhere. No other change is required.
 */
export const BOOKING_ENABLED = false

/** Label for the "request a call" CTA shown while booking is disabled. */
export const CALL_CTA_LABEL: Record<'ka' | 'en', string> = {
  ka: 'მოითხოვეთ ზარი',
  en: 'Request a call',
}
