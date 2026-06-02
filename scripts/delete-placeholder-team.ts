/**
 * Delete legacy placeholder teamMember docs (the `team-founder-*` set from
 * the initial seed). Real team members live under `teamMember-*` and are
 * preserved.
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

async function run() {
  const docs = await c.fetch<Array<{ _id: string }>>(
    `*[_type=="teamMember" && _id match "team-founder-*"]{_id}`
  )
  console.log(`Found ${docs.length} legacy placeholder doc(s).`)
  for (const d of docs) {
    await c.delete(d._id)
    console.log(`  ✗ deleted ${d._id}`)
  }
  console.log('Done.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
