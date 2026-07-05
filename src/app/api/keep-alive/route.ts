import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { timingSafeEqual } from 'node:crypto'

export const runtime = 'nodejs'
// Never cache — this endpoint exists to generate real DB traffic on each run.
export const dynamic = 'force-dynamic'

// Constant-time secret comparison to avoid leaking the secret via timing.
function secretMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

/**
 * Keep-alive ping (invoked by the Vercel Cron defined in vercel.json).
 *
 * Supabase free-tier projects auto-pause after ~7 days of inactivity, which
 * takes the database offline and makes every lead submission fail. A tiny daily
 * query counts as activity and keeps the project awake. Once the project is on a
 * paid plan this is harmless to keep (or can be removed).
 *
 * Vercel sends `Authorization: Bearer <CRON_SECRET>` automatically when the
 * CRON_SECRET env var is set. We fail closed so the endpoint can't be abused.
 */
export async function GET(req: NextRequest) {
  const expected = process.env.CRON_SECRET
  const provided = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')

  if (!expected || !secretMatches(provided, expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )
    // Cheapest possible read that still hits Postgres: HEAD + exact count, 0 rows.
    const { error, count } = await supabase
      .from('founder_circle_leads')
      .select('id', { head: true, count: 'exact' })

    if (error) {
      console.error('[keep-alive] supabase ping failed', error)
      return NextResponse.json({ ok: false, error: 'ping failed' }, { status: 502 })
    }

    return NextResponse.json({ ok: true, count: count ?? 0, at: new Date().toISOString() })
  } catch (err) {
    console.error('[keep-alive] supabase client error', err)
    return NextResponse.json({ ok: false, error: 'client error' }, { status: 502 })
  }
}
