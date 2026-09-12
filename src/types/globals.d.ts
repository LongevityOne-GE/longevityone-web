/**
 * Global browser augmentations shared across the app.
 *
 * `dataLayer` is the Google Tag Manager queue. GTM is not installed yet (the
 * container snippet is coming from the ad manager), but pushing to the array
 * before GTM loads is safe and intended: GTM drains whatever is already queued
 * when it initialises, so events fired early are not lost.
 */
export {}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}
