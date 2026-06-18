import { revalidatePath, updateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'

export const runtime = 'nodejs'

interface SanityWebhookBody {
  _type?: string
  _id?: string
}

const TAG_BY_TYPE: Record<string, string[]> = {
  journeyPage: ['journeyPage'],
  journeyStage: ['journeyStage'],
  advisoryBoardPage: ['advisoryBoardPage'],
  advisoryBoardMember: ['advisoryBoardMember'],
  teamMember: ['sanity'],
  teamPage: ['sanity'],
}

// Constant-time secret comparison to avoid leaking the secret via timing.
function secretMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function POST(req: NextRequest) {
  // Prefer the secret in a header (keeps it out of URLs and access logs); fall
  // back to the ?secret= query param so the existing Sanity webhook keeps working.
  const expected = process.env.SANITY_REVALIDATE_SECRET
  const provided =
    req.headers.get('x-revalidate-secret') ??
    req.nextUrl.searchParams.get('secret') ??
    ''

  // Fail closed: if no secret is configured, reject every request.
  if (!expected || !secretMatches(provided, expected)) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  let body: SanityWebhookBody = {}
  try {
    body = (await req.json()) as SanityWebhookBody
  } catch {
    // Empty/non-JSON payload - fall through to full layout revalidation.
  }

  const tags = body._type ? (TAG_BY_TYPE[body._type] ?? []) : []

  if (tags.length > 0) {
    // Next 16: updateTag is the on-demand single-arg invalidator;
    // revalidateTag now requires a profile (cache-life) argument.
    for (const tag of tags) updateTag(tag)
  } else {
    revalidatePath('/', 'layout')
  }

  return NextResponse.json({
    revalidated: true,
    type: body._type ?? null,
    tags,
    now: Date.now(),
  })
}
