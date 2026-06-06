/**
 * Add two new metabolic add-on tests to Sanity CMS.
 *
 * Run: npx tsx --env-file=.env.local scripts/add-metabolic-addons.ts
 */

import { createClient } from '@sanity/client'

const token = process.env.SANITY_API_TOKEN
if (!token) {
  console.error('SANITY_API_TOKEN is required.')
  process.exit(1)
}

const client = createClient({
  projectId: 'icuuryo0',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

async function main() {
  const existing = await client.fetch<{ _id: string; name_en: string | null; order: number }[]>(
    `*[_type == "package" && category == "addon"] | order(order asc) { _id, name_en, order }`
  )
  console.log('Existing addons:')
  existing.forEach((d) => console.log(`  [${d.order}] ${d.name_en} (${d._id})`))

  const maxOrder = existing.reduce((max, d) => Math.max(max, d.order ?? 0), 0)

  const newAddons = [
    {
      _type: 'package',
      name_ka: 'მეტაბოლიზმის შეფასება მოსვენებულ ფაზაში',
      name_en: 'Resting Metabolic Rate',
      category: 'addon',
      price: 420,
      priceLabel_ka: '420 ₾',
      priceLabel_en: '420 GEL',
      order: maxOrder + 1,
    },
    {
      _type: 'package',
      name_ka: 'მეტაბოლიზმის შეფასება ფიზიკური დატვირთვის დროს',
      name_en: 'VO2 Max',
      category: 'addon',
      price: 550,
      priceLabel_ka: '550 ₾',
      priceLabel_en: '550 GEL',
      order: maxOrder + 2,
    },
  ]

  for (const doc of newAddons) {
    const created = await client.create(doc)
    console.log(`Created: ${doc.name_en} → ${created._id}`)
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
