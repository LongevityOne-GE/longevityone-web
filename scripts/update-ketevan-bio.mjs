/**
 * Update Ketevan Shavliashvili's advisory-board entry (Georgian bio + role):
 *   • boardRole: chair -> member
 *   • title_ka / title_en: Chair -> Member of the Scientific Advisory Board
 *   • bio_ka: replaced with the new two-paragraph Georgian biography
 * Patches every matching doc (published + any draft). Idempotent.
 * Usage: node scripts/update-ketevan-bio.mjs
 */
import { createClient } from '@sanity/client'
import { randomUUID } from 'node:crypto'
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
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'icuuryo0',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token,
  useCdn: false,
})

const block = (text) => ({
  _type: 'block',
  _key: randomUUID(),
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: randomUUID(), text, marks: [] }],
})

const TITLE_KA = 'კლინიკური და სამეცნიერო მრჩეველი, საკონსულტაციო საბჭოს წევრი'
const TITLE_EN = 'Clinical & Scientific Advisor, Member of the Scientific Advisory Board'

const BIO_KA = [
  block(
    'ექიმი-მკვლევარი და პრეციზიული ფუნქციური მედიცინის ექსპერტი 25-წლიანი საერთაშორისო კლინიკური გამოცდილებით. ფლობს აღმასრულებელი მაგისტრის (MBA) ხარისხს ჯანდაცვის მენეჯმენტში და ამჟამად არის დოქტორანტი კლინიკურ და ტრანსლაციურ მედიცინაში — ეს მას ეხმარება უახლესი სამეცნიერო კვლევების პრაქტიკულ მედიცინაში წარმატებით ტრანსლაციაში.',
  ),
  block(
    'მისი მთავარი სპეციალიზაციაა შუახნის ქალთა ჯანმრთელობა, ჰორმონალური ოპტიმიზაცია და ჯანმრთელი დაბერება. იგი არის ამერიკის ფუნქციური მედიცინის ინსტიტუტის (The US Institute for Functional Medicine — IFM) აქტიური წევრი და გავლილი აქვს IFM-ის სპეციალიზებული კლინიკური სერტიფიცირება ჰორმონალურ, იმუნო-მეტაბოლურ და ფუნქციური მედიცინის კლინიკურ პრაქტიკაში დანერგვის მოდულებში. მისი მიდგომა ასევე გამყარებულია ჰარვარდის სამედიცინო სკოლისა და პერსონალიზებული ცხოვრების სტილის ინსტიტუტის (PLMI) მოწინავე ტრენინგებით. არის ეპიგენეტიკის მკვლევარი და ნიუ-იორკული ციფრული ჯანმრთელობის პლატფორმის Medea Health-ის დამფუძნებელი. Longevity One-ის სამედიცინო გუნდს უწევს სტრატეგიულ და სამეცნიერო კონსულტაციას მსოფლიო დონის პერსონალიზებული, პრევენციული და Longevity პროტოკოლების შემუშავებაში.',
  ),
]

async function main() {
  const docs = await client.fetch(
    `*[_type=="advisoryBoardMember" && slug.current=="ketevan-shavliashvili"]{_id}`,
  )
  if (!docs.length) {
    console.log('No matching advisoryBoardMember found. Nothing to do.')
    return
  }
  const tx = docs.reduce(
    (t, d) =>
      t.patch(d._id, (p) =>
        p.set({ boardRole: 'member', title_ka: TITLE_KA, title_en: TITLE_EN, bio_ka: BIO_KA }),
      ),
    client.transaction(),
  )
  await tx.commit()
  console.log(`\n✓ Updated ${docs.length} doc(s): ${docs.map((d) => d._id).join(', ')}\n`)
}

main().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
