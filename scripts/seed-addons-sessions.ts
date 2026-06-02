/**
 * Seed add-on modules and therapy session packs from the canonical pricing doc
 * (პაკეტები და ფასწარმოქმნა.docx). Idempotent — uses createOrReplace.
 * Usage: npx tsx scripts/seed-addons-sessions.ts
 *
 * Renders via existing <AddOns> and <SessionPacks> on /packages
 * (category == "addon" / "session", ordered by `order`).
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

interface PackageDoc {
  _id: string
  _type: 'package'
  category: 'addon' | 'session'
  name_ka: string
  name_en: string
  price: number | null
  priceLabel_ka: string
  priceLabel_en: string
  order: number
}

const gel = (n: number) => `${n.toLocaleString('en-US')} ლარი`
const GEL = (n: number) => `${n.toLocaleString('en-US')} GEL`

// ── Add-on modules (additive price, shown via priceLabel) ───────────────────
const addons: PackageDoc[] = [
  {
    _id: 'addon-enbiosis',
    _type: 'package',
    category: 'addon',
    name_ka: 'Enbiosis მოდული — მიკრობიომი',
    name_en: 'Enbiosis Module — Microbiome',
    price: null,
    priceLabel_ka: '+1,200 ლარი',
    priceLabel_en: '+1,200 GEL',
    order: 1,
  },
  {
    _id: 'addon-trueage',
    _type: 'package',
    category: 'addon',
    name_ka: 'TrueAge მოდული — ეპიგენეტიკა',
    name_en: 'TrueAge Module — Epigenetics',
    price: null,
    priceLabel_ka: '+2,200 ლარი',
    priceLabel_en: '+2,200 GEL',
    order: 2,
  },
]

// ── Therapy session packs (3 services × 1/5/10 tiers) ───────────────────────
// Ordered so each service fills one row of the 3-column grid.
interface Service {
  key: string
  ka: string
  en: string
  prices: [number, number, number] // [1, 5 (-10%), 10 (-20%)]
}

const services: Service[] = [
  { key: 'ihht', ka: 'IHHT — უჯრედული წვრთნა', en: 'IHHT — Cellular Training', prices: [180, 810, 1440] },
  { key: 'redlight', ka: 'Red Light Therapy', en: 'Red Light Therapy', prices: [120, 540, 960] },
  { key: 'combo', ka: 'COMBO — IHHT + Red Light', en: 'COMBO — IHHT + Red Light', prices: [250, 1125, 2000] },
]

const tiers: Array<{ n: number; ka: string; en: string }> = [
  { n: 1, ka: '1 სესია', en: '1 session' },
  { n: 5, ka: '5 სესია (-10%)', en: '5 sessions (-10%)' },
  { n: 10, ka: '10 სესია (-20%)', en: '10 sessions (-20%)' },
]

const sessions: PackageDoc[] = services.flatMap((svc, si) =>
  tiers.map((tier, ti) => {
    const price = svc.prices[ti]
    return {
      _id: `session-${svc.key}-${tier.n}`,
      _type: 'package' as const,
      category: 'session' as const,
      name_ka: `${svc.ka} — ${tier.ka}`,
      name_en: `${svc.en} — ${tier.en}`,
      price,
      priceLabel_ka: gel(price),
      priceLabel_en: GEL(price),
      order: si * 3 + ti + 1,
    }
  }),
)

async function main() {
  const docs = [...addons, ...sessions]
  const tx = docs.reduce((t, doc) => t.createOrReplace(doc), client.transaction())
  await tx.commit()
  console.log(`\n✓ Seeded ${addons.length} add-ons + ${sessions.length} session packs\n`)
  for (const d of docs) console.log(`  ${d.category.padEnd(7)} ${d._id.padEnd(22)} ${d.name_en}`)
  console.log('')
}

main().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
