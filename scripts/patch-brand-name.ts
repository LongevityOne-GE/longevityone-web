/**
 * Targeted patch: replace old brand-name variants with "Longevity One"
 * across all Sanity documents and fields (recursively).
 *
 * Usage: npx tsx scripts/patch-brand-name.ts
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-11-01'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
if (!token) throw new Error('Missing SANITY_API_TOKEN')

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

const REPLACEMENTS: Array<[RegExp | string, string]> = [
  // Possessive forms first (longer match wins)
  [/ᲚᲝᲜᲯᲔᲕᲘᲗᲘ ᲣᲐᲜ-ის/g, 'Longevity One-ის'],
  [/ლონჯევითი უან-ის/g, 'Longevity One-ის'],
  [/LongevityOne-ის/g, 'Longevity One-ის'],
  // Plain forms
  [/ᲚᲝᲜᲯᲔᲕᲘᲗᲘ ᲣᲐᲜ/g, 'Longevity One'],
  [/ლონჯევითი უან/g, 'Longevity One'],
  [/LongevityOne/g, 'Longevity One'],
]

function replaceInString(s: string): string {
  let out = s
  for (const [pat, repl] of REPLACEMENTS) {
    out = out.replace(pat as RegExp, repl)
  }
  return out
}

function containsBrand(s: string): boolean {
  return (
    s.includes('ᲚᲝᲜᲯᲔᲕᲘᲗᲘ') ||
    s.includes('ლონჯევითი უან') ||
    s.includes('LongevityOne')
  )
}

type FieldUpdate = { path: string; newValue: string }

function walk(value: unknown, currentPath: string, updates: FieldUpdate[]): void {
  if (typeof value === 'string') {
    if (containsBrand(value)) {
      updates.push({ path: currentPath, newValue: replaceInString(value) })
    }
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, idx) => {
      // Sanity arrays of objects use _key for stable refs; fall back to index
      const keyed =
        item && typeof item === 'object' && '_key' in item
          ? `[_key=="${(item as { _key: string })._key}"]`
          : `[${idx}]`
      walk(item, `${currentPath}${keyed}`, updates)
    })
    return
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith('_')) continue // skip _id, _type, _rev, _key, _createdAt, etc.
      walk(v, currentPath ? `${currentPath}.${k}` : k, updates)
    }
  }
}

async function main() {
  console.log(`Connecting to Sanity project ${projectId} (dataset: ${dataset})…`)

  // Fetch every document (excluding drafts + system docs)
  const docs = await client.fetch<Array<Record<string, unknown>>>(
    '*[!(_id in path("drafts.**")) && !(_id in path("_.**"))]'
  )
  console.log(`Fetched ${docs.length} documents.`)

  let patchedCount = 0
  let updateCount = 0

  for (const doc of docs) {
    const id = doc._id as string
    const updates: FieldUpdate[] = []
    walk(doc, '', updates)

    if (updates.length === 0) continue

    let tx = client.patch(id)
    for (const u of updates) {
      tx = tx.set({ [u.path]: u.newValue })
    }
    await tx.commit()

    patchedCount += 1
    updateCount += updates.length
    console.log(`  ✓ ${id}: ${updates.length} field(s) updated`)
    for (const u of updates) {
      const preview = u.newValue.length > 80 ? u.newValue.slice(0, 80) + '…' : u.newValue
      console.log(`      ${u.path} → ${preview}`)
    }
  }

  console.log(
    `\nDone. Patched ${patchedCount} document(s), ${updateCount} field(s) updated.`
  )
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
