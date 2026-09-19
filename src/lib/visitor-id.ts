/**
 * Stable first-party visitor ID, sent to Meta as external_id.
 *
 * Meta scores how confidently it can match an event to a person (event match
 * quality). Ad blockers and iOS strip its own cookies, so the browser and the
 * server often arrive with nothing in common. A random ID we mint ourselves and
 * keep in localStorage survives that, and gives Meta a second key to both match
 * the person and deduplicate the browser and server copies of one action.
 *
 * It is a random value tied to nothing: no name, email, phone or IP goes into
 * it, and it is only created once the visitor has accepted marketing cookies.
 */
const KEY = 'lo_vid'

export function getVisitorId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const existing = localStorage.getItem(KEY)
    if (existing && /^[\w-]{8,64}$/.test(existing)) return existing
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `v-${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem(KEY, id)
    return id
  } catch {
    // Private mode or storage disabled: events still send, just without this key.
    return null
  }
}
