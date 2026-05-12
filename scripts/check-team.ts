/**
 * List all teamMember docs in Sanity with their bio-field shape.
 *
 * Usage: npx tsx scripts/check-team.ts
 *
 * Useful for spotting legacy/placeholder docs that should be cleaned up
 * from Sanity Studio (e.g. docs left over from initial seed runs).
 */
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-11-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

c.fetch<
  Array<{ _id: string; name: string | null; tagline_ka: string | null; isFounder: boolean | null }>
>(`*[_type=="teamMember"]{_id, name, tagline_ka, isFounder} | order(_id asc)`).then((docs) => {
  for (const d of docs) {
    const flag = d.tagline_ka ? '✓' : '·'
    const founder = d.isFounder ? ' [founder]' : ''
    console.log(`${flag} ${d._id.padEnd(40)} ${d.name ?? '(no name)'}${founder}`)
  }
  console.log(`\n${docs.length} total. ✓ = has tagline (shown on /about), · = legacy placeholder`)
})
