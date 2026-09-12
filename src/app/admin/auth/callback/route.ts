import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAllowedAdmin } from '@/lib/admin/allowlist'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Magic-link landing. Exchanges the one-time code for a session cookie.
 *
 * The allowlist is re-checked here, not just at link-request time, so a session
 * can never be established for an address that has since been removed from
 * ADMIN_ALLOWED_EMAILS. A rejected user is signed straight back out.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const loginUrl = new URL('/admin/login', req.url)

  if (!code) {
    loginUrl.searchParams.set('error', '1')
    return NextResponse.redirect(loginUrl)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    console.error('[admin] code exchange failed', error?.message)
    loginUrl.searchParams.set('error', '1')
    return NextResponse.redirect(loginUrl)
  }

  if (!isAllowedAdmin(data.user.email)) {
    console.warn('[admin] session rejected for non-allowlisted address')
    await supabase.auth.signOut()
    loginUrl.searchParams.set('error', '1')
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.redirect(new URL('/admin/leads', req.url))
}
