import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { META_EVENTS } from '@/lib/meta-events'
import { sendMetaEvent } from '@/lib/server-conversions'

export const runtime = 'nodejs'

/**
 * Server copy of a browser Meta event, forwarded to the Conversions API.
 *
 * Called with sendBeacon only after marketing consent. Carries no personal
 * data: the event id, the page path, an optional ad click id, and Meta's own
 * browser cookies (_fbp/_fbc) for matching. FormSubmit is not accepted here; it
 * is reported by the lead routes, which know a real lead was saved.
 */
const schema = z.object({
  event_name: z.enum([META_EVENTS.pageView, META_EVENTS.phoneClick]),
  event_id: z.string().min(8).max(80).regex(/^[\w-]+$/),
  page: z.string().max(500).startsWith('/'),
  fbclid: z.string().max(500).regex(/^[\w-]+$/).optional(),
})

// Best-effort per-instance rate limit. Generous enough for someone browsing
// quickly; beyond it is noise that would inflate Meta's counts.
const MAX_PER_WINDOW = 60
const WINDOW_MS = 10 * 60 * 1000
const hits = new Map<string, number[]>()

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('cf-connecting-ip')?.trim() ||
    (req.headers.get('x-forwarded-for') ?? '').split(',')[0]?.trim() ||
    'unknown'
  )
}

function limited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  const over = recent.length >= MAX_PER_WINDOW
  hits.set(ip, over ? recent : [...recent, now])
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k)
  }
  return over
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  // 204 in every case: a beacon's response is never read, and a uniform reply
  // gives abusers nothing to probe.
  const done = () => new NextResponse(null, { status: 204 })
  if (limited(ip)) return done()

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return done()

  await sendMetaEvent(parsed.data.event_name, {
    eventId: parsed.data.event_id,
    sourceUrl: parsed.data.page,
    fbclid: parsed.data.fbclid ?? null,
    clientIp: ip,
    userAgent: req.headers.get('user-agent') ?? undefined,
    fbp: req.cookies.get('_fbp')?.value ?? null,
    fbc: req.cookies.get('_fbc')?.value ?? null,
  }).catch(() => undefined)

  return done()
}
