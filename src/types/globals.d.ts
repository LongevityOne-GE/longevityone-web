/**
 * Global browser augmentations shared across the app.
 *
 * `dataLayer` is the Google Tag Manager queue. Pushing to it before GTM loads
 * is safe and intended: GTM drains whatever is already queued when it
 * initialises, so events fired early are not lost.
 *
 * `gtag` is defined by the Consent Mode bootstrap in Analytics.tsx, which runs
 * before any Google tag so consent defaults are set first.
 */
export {}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    gtag?: (...args: unknown[]) => void
    /** Meta Pixel. Only defined after marketing consent. */
    fbq?: (...args: unknown[]) => void
    /** Pixel calls made before the Pixel loaded; flushed when it initialises. */
    __loMeta?: unknown[][]
  }
}
