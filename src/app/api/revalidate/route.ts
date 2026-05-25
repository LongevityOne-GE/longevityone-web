import { revalidatePath, updateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

interface SanityWebhookBody {
  _type?: string
  _id?: string
}

const TAG_BY_TYPE: Record<string, string[]> = {
  journeyPage: ['journeyPage'],
  journeyStage: ['journeyStage'],
  advisoryBoardPage: ['advisoryBoardPage'],
  advisoryBoardMember: ['advisoryBoardMember'],
}

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
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
