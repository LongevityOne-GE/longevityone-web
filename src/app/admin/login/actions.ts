'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { isAllowedAdmin } from '@/lib/admin/allowlist'

export interface LoginState {
  status: 'idle' | 'sent' | 'error'
  message?: string
}

/** Generic, identical for every failure - never reveals who is on the list. */
const GENERIC_ERROR = 'Could not send a sign-in link. Check the address and try again.'
const SENT_MESSAGE = 'If that address has access, a sign-in link is on its way. Check your inbox.'

/**
 * Send a magic link, but only to an allowlisted address.
 *
 * The allowlist is checked here, before Supabase is called at all, so this is
 * not an open signup: an address that is not on the list never receives a link
 * and no Supabase user is created for it. Both outcomes return the same message
 * so the response cannot be used to enumerate who has access.
 */
export async function requestMagicLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim()

  if (!email || email.length > 254 || !email.includes('@')) {
    return { status: 'error', message: GENERIC_ERROR }
  }

  if (!isAllowedAdmin(email)) {
    // Not on the allowlist. Report the same message as success so an attacker
    // cannot tell allowlisted addresses from rejected ones.
    console.warn('[admin] sign-in attempt for non-allowlisted address')
    return { status: 'sent', message: SENT_MESSAGE }
  }

  const hdrs = await headers()
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
      console.error('[admin] signInWithOtp failed', error.message)
      return { status: 'error', message: GENERIC_ERROR }
    }
  } catch (err) {
    console.error('[admin] signInWithOtp threw', err)
    return { status: 'error', message: GENERIC_ERROR }
  }

  return { status: 'sent', message: SENT_MESSAGE }
}
