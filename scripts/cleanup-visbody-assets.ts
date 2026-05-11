/**
 * Deletes the orphaned Visbody image assets from the Sanity media library.
 * Only deletes if no document references them.
 *
 * Usage:
 *   APPLY=1 node --env-file=.env.local --experimental-strip-types \
 *     scripts/cleanup-visbody-assets.ts
 */

import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-11-01',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
})

const apply = process.env.APPLY === '1'

async function main() {
  const assets: Array<{ _id: string; originalFilename: string | null; references: string[] }> =
    await client.fetch(
      `*[_type == "sanity.imageAsset" && originalFilename match "*visbody*"]{
        _id,
        originalFilename,
        "references": *[references(^._id)]._id
      }`
    )

  console.log(`Visbody-named image assets: ${assets.length}\n`)
  for (const a of assets) {
    console.log(
      `  ${a._id}\n    file: ${a.originalFilename}\n    referenced by: ${
        a.references.length === 0 ? '(none)' : a.references.join(', ')
      }`
    )
  }

  if (!apply) {
    console.log(`\nDRY-RUN — re-run with APPLY=1 to delete orphans.\n`)
    return
  }

  const orphans = assets.filter((a) => a.references.length === 0)
  if (orphans.length === 0) {
    console.log('\nNo orphans to delete.\n')
    return
  }

  const tx = client.transaction()
  for (const a of orphans) tx.delete(a._id)
  const result = await tx.commit()
  console.log(`\n✓ deleted ${orphans.length} asset(s) — txn ${result.transactionId}\n`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
