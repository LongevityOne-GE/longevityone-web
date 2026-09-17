/**
 * Event names this site sends to Meta, shared by the browser Pixel and the
 * Conversions API so both sides always use the same name (Meta deduplicates on
 * event name plus event_id).
 *
 * Meta files this dataset under "Health & wellness provider" and restricts mid
 * and lower funnel standard events. Lead and Contact are accepted by the API
 * and then silently dropped, from the Pixel and the server alike. PageView and
 * custom events are kept, so conversions are sent as custom events.
 * https://www.facebook.com/business/help/511197658391698
 */
export const META_EVENTS = {
  pageView: 'PageView',
  /** A lead form accepted by the server (call request, Founder Circle, contact). */
  formSubmit: 'FormSubmit',
  /** A tap on a phone number from a device that can place the call. */
  phoneClick: 'PhoneClick',
} as const

export type MetaEventName = (typeof META_EVENTS)[keyof typeof META_EVENTS]
