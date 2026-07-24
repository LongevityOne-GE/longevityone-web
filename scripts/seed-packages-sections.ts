/**
 * Seed the new /packages pricing content into Sanity (ADD-ONLY).
 *
 *   - Metabolic Audit items (category: metabolic_audit): 250 / 350 / 550
 *   - Individual Session tiers (category: session): IHHT / Red Light / COMBO × 1/5/10
 *
 * Deterministic _ids → re-running updates in place, never duplicates. Does NOT
 * touch any existing package documents (diagnostic / membership / addon).
 *
 * Run: tsx --env-file=.env.local scripts/seed-packages-sections.ts
 */
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'icuuryo0'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN
if (!token) { console.error('✗ SANITY_API_TOKEN not set'); process.exit(1) }

const client = createClient({ projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false })

interface Doc {
  _id: string
  _type: 'package'
  category: 'metabolic_audit' | 'session'
  name_ka: string
  name_en: string
  tagline_ka?: string
  tagline_en?: string
  price: number
  order: number
  isFeatured?: boolean
}

const metabolicAudit: Doc[] = [
  { _id: 'metabolic-audit-resting', _type: 'package', category: 'metabolic_audit', order: 1, price: 250,
    name_ka: 'მოსვენების მეტაბოლური ტესტი', name_en: 'Resting metabolic test' },
  { _id: 'metabolic-audit-vo2', _type: 'package', category: 'metabolic_audit', order: 2, price: 350,
    name_ka: 'დატვირთვის ტესტი VO₂ Max-ით', name_en: 'Exercise test with VO₂ Max' },
  { _id: 'metabolic-audit-combined', _type: 'package', category: 'metabolic_audit', order: 3, price: 550,
    name_ka: 'მეტაბოლური აუდიტი — ორივე ერთად', name_en: 'Metabolic audit — both together', isFeatured: true },
]

// service label lives in tagline_*, session-count label in name_*
function session(id: string, order: number, ka: string, en: string, count: number, price: number): Doc {
  return {
    _id: id, _type: 'package', category: 'session', order, price,
    tagline_ka: ka, tagline_en: en,
    name_ka: `${count} სესია`, name_en: `${count} ${count === 1 ? 'session' : 'sessions'}`,
  }
}

const IHHT_KA = 'IHHT (უჯრედული წვრთნა)', IHHT_EN = 'IHHT (cellular training)'
const RL = 'Red Light Therapy'
const COMBO = 'COMBO (IHHT + Red Light)'

const sessions: Doc[] = [
  session('session-ihht-1', 1, IHHT_KA, IHHT_EN, 1, 180),
  session('session-ihht-5', 2, IHHT_KA, IHHT_EN, 5, 810),
  session('session-ihht-10', 3, IHHT_KA, IHHT_EN, 10, 1440),
  session('session-redlight-1', 4, RL, RL, 1, 120),
  session('session-redlight-5', 5, RL, RL, 5, 550),
  session('session-redlight-10', 6, RL, RL, 10, 980),
  session('session-combo-1', 7, COMBO, COMBO, 1, 250),
  session('session-combo-5', 8, COMBO, COMBO, 5, 1225),
  session('session-combo-10', 9, COMBO, COMBO, 10, 2000),
]

async function main() {
  const all = [...metabolicAudit, ...sessions]
  let tx = client.transaction()
  for (const doc of all) tx = tx.createOrReplace(doc)
  await tx.commit()
  console.log(`✓ Seeded ${metabolicAudit.length} metabolic-audit items and ${sessions.length} session tiers.`)
  for (const d of all) console.log(`  · [${d.category}] ${d._id} — ${d.price} GEL`)
}

main().catch((e) => { console.error('✗ Failed:', e); process.exit(1) })
