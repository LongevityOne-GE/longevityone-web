/**
 * Fix Georgian FAQ typo in faqItem documents (published + drafts):
 *   შეიმჩნეოს -> შეიმჩნეს   (inside answer_ka Portable Text spans)
 * Idempotent. Usage: node scripts/fix-faq-typo.mjs
 */
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN
if (!token) {
  console.error('❌ SANITY_API_TOKEN (or SANITY_WRITE_TOKEN) not found in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-11-01',
  token,
  useCdn: false,
})

const FROM = 'შეიმჩნეოს'
const TO = 'შეიმჩნეს'

const hasTypo = (answer) =>
  (answer ?? []).some(
    (b) => Array.isArray(b.children) && b.children.some((c) => typeof c.text === 'string' && c.text.includes(FROM)),
  )

async function main() {
  // Include drafts (default GROQ excludes them) so studio doesn't revert the fix.
  const docs = await client.fetch(`*[_type == "faqItem"]{ _id, answer_ka }`)
  const targets = docs.filter((d) => hasTypo(d.answer_ka))

  if (!targets.length) {
    console.log('No documents contain the typo. Nothing to do.')
    return
  }

  const tx = client.transaction()
  for (const doc of targets) {
    const newAnswer = doc.answer_ka.map((block) =>
      block._type === 'block' && Array.isArray(block.children)
        ? {
            ...block,
            children: block.children.map((c) =>
              typeof c.text === 'string' && c.text.includes(FROM)
                ? { ...c, text: c.text.split(FROM).join(TO) }
                : c,
            ),
          }
        : block,
    )
    tx.patch(doc._id, (p) => p.set({ answer_ka: newAnswer }))
    console.log(`  • patched ${doc._id}`)
  }
  await tx.commit()
  console.log(`\n✓ Replaced "${FROM}" → "${TO}" in ${targets.length} document(s)\n`)
}

main().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
