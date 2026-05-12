/**
 * Targeted patch: translate corporate programme titles to Georgian.
 */
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-11-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

const updates: Array<{ key: string; title_ka: string }> = [
  { key: 'prog-1', title_ka: 'აღმასრულებლების დღეგრძელობა' },
  { key: 'prog-2', title_ka: 'ჯანმრთელობა და პროდუქტიულობა' },
  { key: 'prog-3', title_ka: 'სტრატეგიული პარტნიორობა' },
]

async function main() {
  for (const u of updates) {
    await client
      .patch('corporatePage-singleton')
      .set({ [`programmes[_key=="${u.key}"].title_ka`]: u.title_ka })
      .commit()
    console.log(`  ✓ programmes[${u.key}].title_ka → ${u.title_ka}`)
  }
  console.log('\nDone.')
}

main().catch((e) => { console.error(e); process.exit(1) })
