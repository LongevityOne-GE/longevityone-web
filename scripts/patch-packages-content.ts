/**
 * Enrich /packages content for the UX redesign:
 *  - Add-ons: add a one-line description (tagline) + clean names.
 *  - Sessions: store the service group in `tagline` and the session-count
 *    label in `name`, so SessionPacks can render a grouped price table.
 * Idempotent. Usage: npx tsx scripts/patch-packages-content.ts
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

interface Patch {
  id: string
  set: Record<string, unknown>
}

// ── Add-ons: name + one-line description ────────────────────────────────────
const addons: Patch[] = [
  {
    id: 'addon-enbiosis',
    set: {
      name_ka: 'Enbiosis — მიკრობიომის ანალიზი',
      name_en: 'Enbiosis — Microbiome Analysis',
      tagline_ka: 'ნაწლავის მიკრობიომის სექვენირება, რეპორტი და ლოჯისტიკა.',
      tagline_en: 'Gut microbiome sequencing, full report, and logistics.',
    },
  },
  {
    id: 'addon-trueage',
    set: {
      name_ka: 'TrueAge — ეპიგენეტიკური ტესტი',
      name_en: 'TrueAge — Epigenetic Test',
      tagline_ka: 'ბიოლოგიური ასაკის ტესტი — მოიცავს აშშ-ში შიპინგსა და ტესტის ღირებულებას.',
      tagline_en: 'Biological-age test — covers US shipping and the test itself.',
    },
  },
]

// ── Sessions: group (tagline) + count label (name) ──────────────────────────
const IHHT_KA = 'IHHT — უჯრედული წვრთნა'
const IHHT_EN = 'IHHT — Cellular Training'
const RED_KA = 'Red Light Therapy'
const RED_EN = 'Red Light Therapy'
const COMBO_KA = 'COMBO — IHHT + Red Light'
const COMBO_EN = 'COMBO — IHHT + Red Light'

const count = (n: number) => ({
  name_ka: `${n} ${n === 1 ? 'სესია' : 'სესია'}`,
  name_en: `${n} ${n === 1 ? 'session' : 'sessions'}`,
})

const sessions: Patch[] = [
  { id: 'session-pack-0', set: { tagline_ka: IHHT_KA, tagline_en: IHHT_EN, ...count(1) } },
  { id: 'session-pack-1', set: { tagline_ka: IHHT_KA, tagline_en: IHHT_EN, ...count(5) } },
  { id: 'session-pack-2', set: { tagline_ka: IHHT_KA, tagline_en: IHHT_EN, ...count(10) } },
  { id: 'session-pack-3', set: { tagline_ka: RED_KA, tagline_en: RED_EN, ...count(1) } },
  { id: 'session-pack-4', set: { tagline_ka: RED_KA, tagline_en: RED_EN, ...count(5) } },
  { id: 'session-pack-5', set: { tagline_ka: RED_KA, tagline_en: RED_EN, ...count(10) } },
  { id: 'session-pack-6', set: { tagline_ka: COMBO_KA, tagline_en: COMBO_EN, ...count(1) } },
  { id: 'session-pack-7', set: { tagline_ka: COMBO_KA, tagline_en: COMBO_EN, ...count(5) } },
  { id: 'session-pack-8', set: { tagline_ka: COMBO_KA, tagline_en: COMBO_EN, ...count(10) } },
]

async function main() {
  const all = [...addons, ...sessions]
  const tx = all.reduce((t, p) => t.patch(p.id, (patch) => patch.set(p.set)), client.transaction())
  await tx.commit()
  console.log(`\n✓ Enriched ${addons.length} add-ons + ${sessions.length} sessions\n`)
}

main().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
