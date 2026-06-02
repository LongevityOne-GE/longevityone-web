/**
 * Sync membership taglines, goals, and benefit lists to the canonical
 * pricing doc (პაკეტები და ფასწარმოქმნა.docx).
 * Usage: npx tsx scripts/patch-membership-benefits.ts
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

interface MembershipContent {
  id: string
  tagline_ka: string
  tagline_en: string
  goal_ka: string
  goal_en: string
  includes_ka: string[]
  includes_en: string[]
}

const CONTENT: MembershipContent[] = [
  {
    id: 'membership-silver',
    tagline_ka: 'მიღწეული ფორმის შენარჩუნება',
    tagline_en: 'The Maintenance Pass',
    goal_ka: 'მათთვის, ვისაც სურს მიღწეული ფორმის შენარჩუნება.',
    goal_en: 'For those who want to maintain the form they have achieved.',
    includes_ka: [
      '4 სესია Red Light Therapy — უჯრედული რეგენერაცია და კანის სიჯანსაღე',
      'შეუზღუდავი Visbody 3D სკანირება — სხეულის პროგრესის გაზომვა ნებისმიერ დროს',
      'პრიორიტეტული ჯავშანი — ექსკლუზიური წვდომა პიკის საათებზე',
      '10% ფასდაკლება ყველა ლაბორატორიულ ტესტზე (Enbiosis, TrueAge)',
      'The Community — ყოველთვიური დღეგრძელობის ბიულეტენი მხოლოდ წევრებისთვის',
    ],
    includes_en: [
      '4 Red Light Therapy sessions — cellular regeneration and skin health',
      'Unlimited Visbody 3D scans — measure your body progress anytime',
      'Priority booking — exclusive access during peak hours',
      '10% discount on all lab tests (Enbiosis, TrueAge)',
      'The Community — members-only monthly longevity newsletter',
    ],
  },
  {
    id: 'membership-gold',
    tagline_ka: 'აქტიური ტრანსფორმაცია',
    tagline_en: "The Biohacker's Choice",
    goal_ka: 'აქტიური ტრანსფორმაცია და ენერგიის მართვა.',
    goal_en: 'Active transformation and energy management.',
    includes_ka: [
      '4 სესია IHHT + 4 სესია Red Light — სრული უჯრედული წვრთნა და აღდგენა',
      'ყოველთვიური Performance აუდიტი — Visbody + დინამომეტრია (ძალის კონტროლი)',
      'კვარტალური PNOE RMR შემოწმება — მეტაბოლიზმი მოწმდება 3 თვეში ერთხელ',
      '15% ფასდაკლება საერთაშორისო ტესტებზე',
      'Guest Pass — თვეში 1 მეგობრის მოყვანა Tier 1 დიაგნოსტიკაზე 50%-იანი ფასდაკლებით',
    ],
    includes_en: [
      '4 IHHT + 4 Red Light sessions — complete cellular training and recovery',
      'Monthly performance audit — Visbody + dynamometry (strength tracking)',
      'Quarterly PNOE RMR check — metabolism re-tested every 3 months',
      '15% discount on international tests',
      'Guest pass — bring one friend monthly for Tier 1 diagnostics at 50% off',
    ],
  },
  {
    id: 'membership-platinum',
    tagline_ka: 'ბიოლოგიური დაზღვევა',
    tagline_en: 'The Biological Insurance',
    goal_ka: 'სრული Concierge მომსახურება მათთვის, ვისთვისაც ჯანმრთელობა მთავარი აქტივია.',
    goal_en: 'Full concierge service for those whose health is their primary asset.',
    includes_ka: [
      'შეუზღუდავი წვდომა Recovery Zone-ზე — 8 სესია IHHT + 8 სესია Red Light',
      'სხეულის სრული მონიტორინგი — ყოველთვიური დინამომეტრია და Visbody, კვარტალური PNOE აუდიტი',
      'უფასო წლიური TrueAge ტესტი — ბიოლოგიური ასაკის ეპიგენეტიკური ვალიდაცია',
      'Personal Health Concierge — პირდაპირი ხაზი კლინიკის ექსპერტთან',
      'Elite Network — მოწვევა დახურულ Longevity One-on-One ვორქშოპებზე',
    ],
    includes_en: [
      'Unlimited Recovery Zone access — 8 IHHT + 8 Red Light sessions',
      'Total body monitoring — monthly dynamometry & Visbody, quarterly PNOE audit',
      'Complimentary annual TrueAge test — epigenetic biological-age validation',
      'Personal health concierge — direct line to a clinic expert',
      'Elite Network — invitations to private Longevity One-on-One workshops',
    ],
  },
]

async function main() {
  const results: string[] = []
  for (const m of CONTENT) {
    await client
      .patch(m.id)
      .set({
        tagline_ka: m.tagline_ka,
        tagline_en: m.tagline_en,
        goal_ka: m.goal_ka,
        goal_en: m.goal_en,
        includes_ka: m.includes_ka,
        includes_en: m.includes_en,
      })
      .commit()
    results.push(`✓ ${m.id} — ${m.includes_en.length} benefits, tagline "${m.tagline_en}"`)
  }
  console.log('\n' + results.join('\n') + '\n')
}

main().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
