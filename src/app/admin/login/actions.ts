'use server'

import { headers } from 'next/headers'
import { createHash } from 'node:crypto'
import { createClient } from '@/lib/supabase/server'
import { isAllowedAdmin } from '@/lib/admin/allowlist'

export interface LoginState {
  status: 'idle' | 'sent' | 'error'
  message?: string
}

const GENERIC_ERROR = 'Could not send a sign-in link. Please try again.'
const COOLDOWN_MESSAGE =
  'A sign-in link was just requested. Please wait a minute before asking for another.'
const SENT_MESSAGE = 'If that address has access, a sign-in link is on its way. Check your inbox.'

/**
 * Local cooldown between sign-in requests.
 *
 * Supabase enforces roughly 60 seconds between one-time-password requests for
 * the same address, and a separate hourly cap on how many mails it will send.
 * Hitting either returns a 429 that used to surface as "check the address",
 * which sent people looking at their spelling while the real problem was that
 * they had clicked twice in quick succession.
 *
 * Checking here first means the common case never reaches Supabase at all, so
 * repeated clicks stop burning the hourly allowance - which is what previously
 * locked the dashboard for an hour at a time.
 *
 * Deliberately applied BEFORE the allowlist check, so an allowlisted and a
 * non-allowlisted address behave identically. Anything that treated them
 * differently would turn this form into a way to discover who has access.
 *
 * Best effort: in a multi-instance deployment this is per-instance only.
 * Supabase remains the authoritative limit; this exists to keep users out of it.
 */
/**
 * Per address: one request a minute, matching Supabase's own cooldown, so a
 * double click is answered here instead of burning the hourly send allowance.
 */
const ADDRESS_COOLDOWN_MS = 60 * 1000

/**
 * Per IP: a small burst allowance rather than a hard cooldown. A single office
 * network may hold several admins, and one person signing in must not lock a
 * colleague out for a minute. This exists to blunt scripted abuse, not to
 * serialise legitimate users.
 */
const IP_WINDOW_MS = 5 * 60 * 1000
const IP_MAX_REQUESTS = 5

const addressSeen = new Map<string, number>()
const ipHits = new Map<string, number[]>()

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 16)
}

/** True when this address asked for a link less than a minute ago. */
function addressOnCooldown(key: string): boolean {
  const now = Date.now()

  if (addressSeen.size > 5000) {
    for (const [k, at] of addressSeen) {
      if (now - at > ADDRESS_COOLDOWN_MS) addressSeen.delete(k)
    }
  }

  const at = addressSeen.get(key)
  if (at !== undefined && now - at < ADDRESS_COOLDOWN_MS) return true

  addressSeen.set(key, now)
  return false
}

/** True when this IP has exhausted its burst allowance. */
function ipExhausted(key: string): boolean {
  const now = Date.now()
  const cutoff = now - IP_WINDOW_MS
  const hits = (ipHits.get(key) ?? []).filter((t) => t > cutoff)

  if (hits.length >= IP_MAX_REQUESTS) {
    ipHits.set(key, hits)
    return true
  }

  hits.push(now)
  ipHits.set(key, hits)

  if (ipHits.size > 5000) {
    for (const [k, times] of ipHits) {
      const fresh = times.filter((t) => t > cutoff)
      if (fresh.length === 0) ipHits.delete(k)
      else ipHits.set(k, fresh)
    }
  }

  return false
}

/**
 * Send a magic link, but only to an allowlisted address.
 *
 * The allowlist is checked before Supabase is called at all, so this is not an
 * open signup: an address that is not on the list never receives a link and no
 * Supabase user is created for it. Allowed and rejected addresses return the
 * same message so the endpoint cannot be used to enumerate who has access.
 */
export async function requestMagicLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim()

  if (!email || email.length > 254 || !email.includes('@')) {
    return { status: 'error', message: GENERIC_ERROR }
  }

  const hdrs = await headers()
  // Cloudflare overwrites cf-connecting-ip, so it cannot be spoofed.
  const ip =
    hdrs.get('cf-connecting-ip')?.trim() ||
    (hdrs.get('x-forwarded-for') ?? '').split(',')[0]?.trim() ||
    'unknown'

  // IP allowance first, so a script cannot walk a list of addresses quickly.
  if (ipExhausted(hash(ip))) {
    return { status: 'error', message: COOLDOWN_MESSAGE }
  }

  if (addressOnCooldown(hash(email.toLowerCase()))) {
    return { status: 'error', message: COOLDOWN_MESSAGE }
  }

  if (!isAllowedAdmin(email)) {
    // Not on the allowlist. Report the same message as success so an attacker
    // cannot tell allowlisted addresses from rejected ones.
    console.warn('[admin] sign-in attempt for non-allowlisted address')
    return { status: 'sent', message: SENT_MESSAGE }
  }

  const host = hdrs.get('host')
  const protocol = host?.startsWith('localhost') ? 'http' : 'https'
  const origin = `${protocol}://${host}`

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/admin/auth/callback`,
        // The allowlist is the gate. Allow first-time sign-in to provision the
        // Supabase user, since no one has an account until they first log in.
        shouldCreateUser: true,
      },
    })

    if (error) {
      console.error('[admin] signInWithOtp failed', error.status, error.message)
      // Supabase returns 429 both for the per-address cooldown and for the
      // hourly send cap. Both mean "try again shortly", which is far more
      // useful than a generic failure - and says nothing about the allowlist,
      // since the local cooldown above already fires for every address.
      if (error.status === 429) {
        return { status: 'error', message: COOLDOWN_MESSAGE }
      }
      return { status: 'error', message: GENERIC_ERROR }
    }
  } catch (err) {
    console.error('[admin] signInWithOtp threw', err)
    return { status: 'error', message: GENERIC_ERROR }
  }

  return { status: 'sent', message: SENT_MESSAGE }
}
