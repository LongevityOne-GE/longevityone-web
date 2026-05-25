/**
 * Strip em dashes from all Advisory Board content in Sanity.
 *
 * Replaces every U+2014 (—) with a regular hyphen-minus (-) inside:
 *   - advisoryBoardPage singleton  (intro_ka, intro_en, eyebrow, heading,
 *     section headings, SEO fields — any string field)
 *   - advisoryBoardMember docs     (title, affiliation, expertise, bio
 *     Portable Text blocks, photo alts)
 *
 * Leaves en dashes (–, U+2013) alone, since the user asked specifically about
 * em dashes. Idempotent: re-running on already-stripped content is a no-op.
 *
 * Run: npx tsx --env-file=.env.local scripts/strip-em-dashes-advisory.ts
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'icuuryo0'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error('SANITY_API_TOKEN is required.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-01',
  token,
  useCdn: false,
})

const EM_DASH = '—'
const REPLACEMENT = '-'

function strip(value: string): string {
  return value.split(EM_DASH).join(REPLACEMENT)
}

/**
 * Recursively walk a Sanity document body, returning a new copy with em
 * dashes stripped from every string leaf. Skips system fields starting with `_`.
 */
function stripDeep<T>(input: T): T {
  if (typeof input === 'string') {
    return strip(input) as T
  }
  if (Array.isArray(input)) {
    return input.map((item) => stripDeep(item)) as T
  }
  if (input && typeof input === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      // Preserve Sanity system fields untouched.
      if (k.startsWith('_')) {
        out[k] = v
        continue
      }
      out[k] = stripDeep(v)
    }
    return out as T
  }
  return input
}

interface SanityDoc {
  _id: string
  _type: string
  _rev?: string
  [key: string]: unknown
}

async function stripDocById(id: string): Promise<{ id: string; changed: boolean }> {
  const doc = (await client.getDocument(id)) as SanityDoc | undefined
  if (!doc) return { id, changed: false }

  const stripped = stripDeep(doc)
  // Compare JSON to detect whether anything changed.
  const before = JSON.stringify(doc)
  const after = JSON.stringify(stripped)
  if (before === after) return { id, changed: false }

  await client.createOrReplace(stripped)
  return { id, changed: true }
}

async function run(): Promise<void> {
  const targetIds = [
    'advisoryBoardPage',
    'advisoryBoardMember-ketevan-shavliashvili',
    'advisoryBoardMember-nino-nadiradze',
    'advisoryBoardMember-zviad-kipiani',
    'advisoryBoardMember-giorgi-kvitaishvili',
  ]

  for (const id of targetIds) {
    const result = await stripDocById(id)
    console.log(`  ${result.changed ? '✓ updated  ' : '· unchanged'}  ${result.id}`)
  }

  console.log(`\n✅ Done.`)
}

run().catch((err: unknown) => {
  console.error('Strip failed:', err)
  process.exit(1)
})
