/**
 * Remove duplicate metabolic addon documents, keeping the oldest of each.
 *
 * Run: npx tsx --env-file=.env.local scripts/fix-addon-duplicates.ts
 */

import { createClient } from '@sanity/client'

const token = process.env.SANITY_API_TOKEN
if (!token) { console.error('SANITY_API_TOKEN is required.'); process.exit(1) }

const client = createClient({
  projectId: 'icuuryo0',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

async function main() {
  const docs = await client.fetch<{ _id: string; name_en: string | null; order: number; _createdAt: string }[]>(
    `*[_type == "package" && category == "addon"] | order(_createdAt asc) { _id, name_en, order, _createdAt }`
  )

  console.log('All addons:')
  docs.forEach((d) => console.log(`  [${d.order}] ${d.name_en} (${d._id}) created: ${d._createdAt}`))

  const seen = new Map<string, string>()
  const toDelete: string[] = []

  for (const doc of docs) {
    const key = doc.name_en ?? ''
    if (seen.has(key)) {
      toDelete.push(doc._id)
    } else {
      seen.set(key, doc._id)
    }
  }

  if (toDelete.length === 0) {
    console.log('No duplicates found.')
    return
  }

  console.log(`\nDeleting ${toDelete.length} duplicate(s): ${toDelete.join(', ')}`)
  for (const id of toDelete) {
    await client.delete(id)
    console.log(`  Deleted ${id}`)
  }
  console.log('Done.')
}

main().catch((err) => { console.error(err); process.exit(1) })
