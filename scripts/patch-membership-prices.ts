/**
 * Sync membership prices to the canonical pricing doc
 * (პაკეტები და ფასწარმოქმნა.docx):
 *   Silver 650 · Gold 1,200 · Elite Platinum 2,200 GEL/mo
 *
 * Diagnostic tiers (550 / 1,850 / 3,200) already match — not touched.
 * Usage: npx tsx scripts/patch-membership-prices.ts
 */
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-11-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const UPDATES: Array<{ id: string; price: number; en: string; ka: string }> = [
  { id: 'membership-silver', price: 650, en: '650 GEL', ka: '650 ₾' },
  { id: 'membership-gold', price: 1200, en: '1,200 GEL', ka: '1,200 ₾' },
  { id: 'membership-platinum', price: 2200, en: '2,200 GEL', ka: '2,200 ₾' },
]

async function main() {
  const results: string[] = []
  for (const u of UPDATES) {
    await client
      .patch(u.id)
      .set({ price: u.price, priceLabel_en: u.en, priceLabel_ka: u.ka })
      .commit()
    results.push(`✓ ${u.id} → ${u.en}/mo`)
  }
  console.log('\n' + results.join('\n') + '\n')
}

main().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
