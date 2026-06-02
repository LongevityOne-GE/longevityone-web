/**
 * Brand audit content patch — items 1, 4, 9.
 * Usage: npx tsx scripts/patch-brand-audit.ts
 *
 *  1. Pricing: PERFORMANCE 1200→1850, ELITE 2500→3200 (price + priceLabel_ka/en)
 *  1. FAQ faq-pricing: "500" → "550" (ka + en)
 *  4. Technology slugs → Latin (slug.current == anchor) so every
 *     `"anchor": slug.current` projection resolves to a stable Latin anchor.
 *  9. membership-platinum name → "Elite Platinum" (both locales)
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

const FAQ_EN =
  'Prices depend on the chosen programme and your individual needs. Initial consultation and biological audit starts from 550 GEL. Contact us for detailed pricing.'
const FAQ_KA =
  'ფასები დამოკიდებულია არჩეულ პროგრამაზე და თქვენს ინდივიდუალურ საჭიროებებზე. საწყისი კონსულტაცია და ბიოლოგიური აუდიტი იწყება 550 ლარიდან. დეტალური ფასების მისაღებად დაგვიკავშირდით.'

async function main() {
  const results: string[] = []

  // ── Item 1: pricing ───────────────────────────────────────────────
  await client
    .patch('package-performance')
    .set({ price: 1850, priceLabel_en: '1,850 GEL', priceLabel_ka: '1,850 ₾' })
    .commit()
  results.push('✓ package-performance → 1,850 GEL')

  await client
    .patch('package-elite')
    .set({ price: 3200, priceLabel_en: '3,200 GEL', priceLabel_ka: '3,200 ₾' })
    .commit()
  results.push('✓ package-elite → 3,200 GEL')

  // ── Item 1: FAQ 500 → 550 (key-based portable-text path) ──────────
  await client
    .patch('faq-pricing')
    .set({
      'answer_en[_key=="block-0"].children[_key=="span-0"].text': FAQ_EN,
      'answer_ka[_key=="block-0"].children[_key=="span-0"].text': FAQ_KA,
    })
    .commit()
  results.push('✓ faq-pricing → 550 (ka + en)')

  // ── Item 4: Latin slugs (slug.current == anchor) ──────────────────
  const slugFixes: Array<[string, string]> = [
    ['tech-enbiosis', 'enbiosis'],
    ['tech-pnoe', 'pnoe'],
    ['tech-truediagnostic', 'truediagnostic'],
  ]
  for (const [id, slug] of slugFixes) {
    await client.patch(id).set({ 'slug.current': slug }).commit()
    results.push(`✓ ${id} slug → ${slug}`)
  }

  // ── Item 9: Elite Platinum ────────────────────────────────────────
  await client
    .patch('membership-platinum')
    .set({ name_en: 'Elite Platinum', name_ka: 'Elite Platinum' })
    .commit()
  results.push('✓ membership-platinum → Elite Platinum')

  console.log('\n' + results.join('\n') + '\n')
}

main().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
