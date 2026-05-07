export const CONSENT_KEY = 'lo_cookie_consent'
export const CONSENT_VERSION = 1

export interface CookieConsent {
  version: number
  analytics: boolean
  marketing: boolean
  timestamp: number
}

export function readConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CookieConsent
    if (parsed.version !== CONSENT_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

export function writeConsent(analytics: boolean, marketing: boolean): CookieConsent {
  const record: CookieConsent = {
    version: CONSENT_VERSION,
    analytics,
    marketing,
    timestamp: Date.now(),
  }
  localStorage.setItem(CONSENT_KEY, JSON.stringify(record))
  window.dispatchEvent(new CustomEvent('lo:consent', { detail: record }))
  return record
}

export function hasConsented(): boolean {
  return readConsent() !== null
}
