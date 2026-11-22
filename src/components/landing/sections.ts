import type { Locale } from '@/lib/utils'

/** URL of the ad landing page. Not linked from the site and not indexed. */
export const LANDING_PATH = '/start'

export function landingPath(locale: Locale): string {
  return locale === 'en' ? `/en${LANDING_PATH}` : LANDING_PATH
}

/** True for both language versions of the landing page. */
export function isLandingPath(pathname: string | null | undefined): boolean {
  return pathname === LANDING_PATH || pathname === `/en${LANDING_PATH}`
}

/** Section anchors, in page order. Each is linkable, e.g. /start#services. */
export const LANDING_SECTIONS = [
  { id: 'about', label: { ka: 'ჩვენს შესახებ', en: 'About' } },
  { id: 'services', label: { ka: 'სერვისები', en: 'Services' } },
  { id: 'team', label: { ka: 'გუნდი', en: 'Team' } },
  { id: 'reviews', label: { ka: 'შეფასებები', en: 'Reviews' } },
  { id: 'contact', label: { ka: 'კონტაქტი', en: 'Contact' } },
] as const satisfies ReadonlyArray<{ id: string; label: Record<Locale, string> }>
