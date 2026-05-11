/**
 * Scans the entire Sanity dataset for any string/portable-text containing
 * "visbody" (case-insensitive). Prints document _id, _type, and a short
 * preview of the matching field.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> node --env-file=.env.local \
 *     --experimental-strip-types scripts/find-visbody.ts
 */

import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-11-01'
const token = process.env.SANITY_WRITE_TOKEN!

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

const REGEX = /visbody/i

function walk(value: unknown, hits: string[]): void {
  if (value == null) return
  if (typeof value === 'string') {
    if (REGEX.test(value)) hits.push(value)
    return
  }
  if (Array.isArray(value)) {
    for (const v of value) walk(v, hits)
    return
  }
  if (typeof value === 'object') {
    for (const v of Object.values(value as Record<string, unknown>)) walk(v, hits)
  }
}

async function main() {
  const docs: Array<Record<string, unknown> & { _id: string; _type: string }> =
    await client.fetch(`*[!(_id in path("drafts.**"))]`)
  console.log(`scanned ${docs.length} published docs`)

  for (const doc of docs) {
    const hits: string[] = []
    walk(doc, hits)
    if (hits.length === 0) continue
    console.log(`\n— ${doc._type} :: ${doc._id}`)
    for (const h of hits) {
      const idx = h.search(REGEX)
      const start = Math.max(0, idx - 60)
      const end = Math.min(h.length, idx + 80)
      console.log(`  …${h.slice(start, end).replace(/\s+/g, ' ')}…`)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
