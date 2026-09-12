/**
 * Admin allowlist.
 *
 * `ADMIN_ALLOWED_EMAILS` is a comma-separated list of the only addresses that
 * may receive a magic link or read the leads dashboard. It is deliberately NOT
 * a NEXT_PUBLIC_ var: the list of people with access to patient enquiries is
 * itself sensitive and must never reach the browser bundle.
 *
 * Fails closed. An unset or empty list allows nobody, so a missing env var
 * locks the dashboard rather than opening it.
 */
function allowedEmails(): string[] {
  // Matches the guard style used by createServiceClient in lib/supabase/server.
  // ADMIN_ALLOWED_EMAILS is not a NEXT_PUBLIC_ var so it is undefined in the
  // browser anyway, but failing loudly beats silently allowing nobody.
  if (typeof window !== 'undefined') {
    throw new Error('Admin allowlist must never be evaluated on the client')
  }

  return (process.env.ADMIN_ALLOWED_EMAILS ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

/** True when this address is on the allowlist. Case-insensitive. */
export function isAllowedAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  const list = allowedEmails()
  if (list.length === 0) return false
  return list.includes(email.trim().toLowerCase())
}

/** True when an allowlist is configured at all - used to warn during setup. */
export function hasAllowlist(): boolean {
  return allowedEmails().length > 0
}
