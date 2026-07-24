/**
 * One-off: set LinkedIn, TikTok, and YouTube URLs on the siteSettings
 * singleton (Facebook/Instagram were already set; socialLinkedIn existed in
 * the schema but was never populated).
 *
 * Run: tsx --env-file=.env.local scripts/patch-social-links.ts
 */
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'icuuryo0'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN
if (!token) { console.error('✗ SANITY_API_TOKEN not set'); process.exit(1) }

const client = createClient({ projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false })

const patch = {
  socialLinkedIn: 'https://www.linkedin.com/company/longevityone-geo',
  socialTikTok: 'https://www.tiktok.com/@longevityonegeo',
  socialYouTube: 'https://www.youtube.com/@LongevityOneGeo',
}

async function main() {
  const doc = await client.fetch<{ _id: string } | null>(`*[_type == "siteSettings"][0]{_id}`)
  if (!doc?._id) { console.error('✗ No siteSettings document found'); process.exit(1) }

  await client.patch(doc._id).set(patch).commit()
  console.log(`✓ Updated siteSettings (${doc._id}):`)
  for (const [k, v] of Object.entries(patch)) console.log(`  · ${k} -> ${v}`)
}

main().catch((e) => { console.error('✗ Failed:', e); process.exit(1) })
