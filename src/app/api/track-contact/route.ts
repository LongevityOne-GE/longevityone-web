import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendMetaContact } from '@/lib/server-conversions'

export const runtime = 'nodejs'

/**
 * Server copy of a phone-call tap, forwarded to the Meta Conversions API.
 *
 * Called by the browser with sendBeacon only after marketing consent, and only
 * for taps from a device that can dial. Carries no personal data: the event id,
 * where the tap happened, and Meta's own browser cookies (_fbp/_fbc) for
 * matching.
 */
const schema = z.object({
  event_id: z.string().min(8).max(80).regex(/^[\w-]+$/),
  source: z.string().min(1).max(40).regex(/^[\w-]+$/),
  page: z.string().max(500).startsWith('/'),
})

// Best-effort per-instance rate limit. A person taps a phone number a handful
// of times at most; anything beyond this is noise that would inflate Meta's
// conversion count.
const MAX_PER_WINDOW = 10
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
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k)
  }
  return false
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  // 204 in every case: a beacon's response is never read, and a uniform reply
  // gives abusers nothing to probe.
  if (limited(ip)) return new NextResponse(null, { status: 204 })

  let parsed
  try {
    parsed = schema.safeParse(await req.json())
  } catch {
    return new NextResponse(null, { status: 204 })
  }
  if (!parsed.success) return new NextResponse(null, { status: 204 })

  await sendMetaContact({
    eventId: parsed.data.event_id,
    sourceUrl: parsed.data.page,
    clientIp: ip,
    userAgent: req.headers.get('user-agent') ?? undefined,
    fbp: req.cookies.get('_fbp')?.value ?? null,
    fbc: req.cookies.get('_fbc')?.value ?? null,
  }).catch(() => undefined)

  return new NextResponse(null, { status: 204 })
}
