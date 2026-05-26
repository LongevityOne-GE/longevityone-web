/**
 * Migration — backfill name_ka / name_en on existing `technology` documents.
 *
 * The `technology.name` field was being filled with mixed Georgian/English
 * content. The schema now requires `name_ka` and `name_en` as the display
 * fields, while `name` becomes a language-neutral brand code used for slug
 * source, JSON-LD canonical name, and tech-mention link matching.
 *
 * Run:  npx tsx --env-file=.env.local scripts/migrate-technology-names.ts
 *
 * Idempotent — re-running just re-asserts the same values.
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'icuuryo0'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error('SANITY_API_TOKEN is required.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-01',
  token,
  useCdn: false,
})

interface MigrationRow {
  // Match by current `name` value (whatever editor typed) OR by slug fallback.
  matchName: string
  matchSlug?: string
  newName: string // language-neutral brand code
  name_ka: string
  name_en: string
}

const ROWS: MigrationRow[] = [
  {
    matchName: 'მეტაბოლური აუდიტი -VO₂ max ტესტი',
    matchSlug: 'მეტაბოლური აუდიტი',
    newName: 'VO2 Max',
    name_ka: 'მეტაბოლური აუდიტი – VO₂ Max ტესტი',
    name_en: 'Metabolic Audit – VO₂ Max Test',
  },
  {
    matchName: 'ეპიგენეტიკური ტესტირება',
    matchSlug: 'ეპიგენეტიკური ტესტირება',
    newName: 'Epigenetics',
    name_ka: 'ეპიგენეტიკური ტესტირება',
    name_en: 'Epigenetic Testing',
  },
  {
    matchName: 'ნაწლავის მიკრობიომი',
    matchSlug: 'მიკრობიომი',
    newName: 'Microbiome',
    name_ka: 'ნაწლავის მიკრობიომი',
    name_en: 'Gut Microbiome',
  },
  {
    matchName: 'IHHT',
    matchSlug: 'ihht',
    newName: 'IHHT',
    name_ka: 'IHHT',
    name_en: 'IHHT',
  },
  {
    matchName: 'Red Light Therapy  /   წითელი სინათლის თერაპია',
    matchSlug: 'red-light',
    newName: 'Red Light',
    name_ka: 'წითელი სინათლის თერაპია',
    name_en: 'Red Light Therapy',
  },
]

interface TechDoc {
  _id: string
  name: string
  slug?: { current?: string }
}

async function run(): Promise<void> {
  const docs = await client.fetch<TechDoc[]>(
    `*[_type == "technology"]{ _id, name, slug }`,
  )
  console.log(`Fetched ${docs.length} technology documents.`)

  for (const row of ROWS) {
    const match = docs.find(
      (d) => d.name === row.matchName || d.slug?.current === row.matchSlug,
    )
    if (!match) {
      console.warn(
        `  ! Could not match row: matchName="${row.matchName}" matchSlug="${row.matchSlug}". Skipped.`,
      )
      continue
    }
    console.log(`  → ${match._id}  (was: "${match.name}")`)
    console.log(`     name    = "${row.newName}"`)
    console.log(`     name_ka = "${row.name_ka}"`)
    console.log(`     name_en = "${row.name_en}"`)
    await client
      .patch(match._id)
      .set({
        name: row.newName,
        name_ka: row.name_ka,
        name_en: row.name_en,
      })
      .commit()
  }

  console.log(`\n✅ Migrated ${ROWS.length} technology documents.`)
}

run().catch((err: unknown) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
