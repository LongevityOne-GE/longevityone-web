/**
 * Targeted patch: replace fragment-style headlines with newline-separated versions.
 *
 * Usage: npx tsx scripts/patch-headlines.ts
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

const updates: Array<{ id: string; field: string; value: string }> = [
  {
    id: 'homePage-singleton',
    field: 'pillars_heading_ka',
    value: 'სამი მიმართულება\nერთი მიზანი',
  },
  {
    id: 'homePage-singleton',
    field: 'pillars_heading_en',
    value: 'Three Pillars\nOne Purpose',
  },
  {
    id: 'aboutPage-singleton',
    field: 'h1_ka',
    value: 'ერთი მეცნიერება\nერთი ჯანმრთელობა\nერთი მომავალი',
  },
  {
    id: 'aboutPage-singleton',
    field: 'h1_en',
    value: 'One Science\nOne Health\nOne Future',
  },
  {
    id: 'homePage-singleton',
    field: 'cta_heading_ka',
    value: 'შეწყვიტეთ ვარაუდი\nდაიწყეთ გაზომვა',
  },
  {
    id: 'homePage-singleton',
    field: 'cta_heading_en',
    value: 'Stop Guessing\nStart Measuring',
  },
]

async function main() {
  console.log(`Connecting to Sanity project ${projectId} (dataset: ${dataset})…`)

  for (const u of updates) {
    await client.patch(u.id).set({ [u.field]: u.value }).commit()
    console.log(`  ✓ ${u.id}.${u.field} updated`)
  }

  console.log(`\nDone. ${updates.length} field(s) patched.`)
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
