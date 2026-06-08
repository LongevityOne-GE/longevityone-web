/**
 * Replace the three diagnostic "package" cards on /packages with the 2026
 * 12-week programme content (ka + en). Idempotent — patches by document _id.
 *
 *   ① package-starter      → Metabolic Balance Programme        (order 1, left)
 *   ② package-performance  → Longevity Programme (12 Weeks)      (order 2, MIDDLE / Most Popular)
 *   ③ package-elite        → Energy Recovery & Peak Performance  (order 3, right)
 *
 * The middle card is forced "Most Popular" by DiagnosticTiers, so Longevity
 * is mapped onto the already-middle document.
 *
 * Usage: node scripts/update-programmes-2026.mjs
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

const gel = (n) => ({ priceLabel_ka: `${n.toLocaleString('en-US')} ₾`, priceLabel_en: `${n.toLocaleString('en-US')} GEL` })

const patches = [
  // ① Metabolic Balance — left
  {
    id: 'package-starter',
    set: {
      category: 'diagnostic',
      order: 1,
      tier: 1,
      isFeatured: false,
      name_ka: 'მეტაბოლური ბალანსის პროგრამა',
      name_en: 'Metabolic Balance Programme',
      price: 1990,
      ...gel(1990),
      tagline_ka: '12-კვირიანი კორექციული და აღდგენითი კურსი',
      tagline_en: 'A 12-week corrective and restorative course',
      goal_ka:
        'განკუთვნილია მათთვის, ვისაც სურს წონის კლება/შენარჩუნება, აწუხებს ენერგიის ნაკლებობა, ინსულინრეზისტენტობა ან მეტაბოლური პრობლემები. ეს პროგრამა დაგეხმარებათ უკეთ გაიგოთ თქვენი ორგანიზმი და შეიმუშავოთ პერსონალიზებული, კონკრეტულად თქვენზე მორგებული სტრატეგია.',
      goal_en:
        'For those who want to lose or maintain weight, or who struggle with low energy, insulin resistance, or metabolic issues. This programme helps you better understand your body and build a personalised strategy tailored specifically to you.',
      includes_ka: [
        'ექიმის კონსულტაცია',
        'სხეულის კომპოზიციის განსაზღვრა',
        'მეტაბოლური ანალიზი — მოსვენების მეტაბოლური სიხშირის განსაზღვრა',
        'ინდივიდუალური კვებითი სტრატეგია',
        'IHHT (უჯრედული თერაპია) — 6 სესია',
        'Red Light Therapy — 8 სესია',
        'პროგრესის მონიტორინგი',
        'საბოლოო შეფასება',
      ],
      includes_en: [
        'Physician consultation',
        'Body composition assessment',
        'Metabolic analysis — Resting Metabolic Rate measurement',
        'Individualised nutritional strategy',
        'IHHT (cellular therapy) — 6 sessions',
        'Red Light Therapy — 8 sessions',
        'Progress monitoring',
        'Final assessment',
      ],
    },
  },

  // ② Longevity Programme — MIDDLE (Most Popular)
  {
    id: 'package-performance',
    set: {
      category: 'diagnostic',
      order: 2,
      tier: 2,
      isFeatured: true,
      name_ka: 'დღეგრძელობის პროგრამა (12 კვირა)',
      name_en: 'Longevity Programme (12 Weeks)',
      price: 2490,
      ...gel(2490),
      tagline_ka: '12-კვირიანი სისტემური დღეგრძელობის პროტოკოლი',
      tagline_en: 'A 12-week systematic longevity protocol',
      goal_ka:
        'განკუთვნილია მათთვის, ვისაც სურს შეინარჩუნოს ენერგია, გონებრივი სიმახვილე, ფიზიკური აქტიურობა და ცხოვრების მაღალი ხარისხი ასაკის მატებასთან ერთად.',
      goal_en:
        'For those who want to preserve their energy, mental sharpness, physical activity, and a high quality of life as they age.',
      includes_ka: [
        'საწყისი სამედიცინო შეფასება',
        'სხეულის კომპოზიციის შეფასება',
        'კუნთოვანი ძალის განსაზღვრა',
        'მეტაბოლურ ანალიზი სუნთქვითი ტესტებით (მოსვენების მეტაბოლური სიხშირე და VO₂ Max)',
        'პერსონალიზებული ლონჯევითი პროტოკოლი',
        'Red Light Therapy — 10 სესია',
        'IHHT (უჯრედული თერაპია) — 10 სესია',
        '12-კვირიანი მონიტორინგი',
        'საბოლოო შეფასება',
      ],
      includes_en: [
        'Initial medical assessment',
        'Body composition assessment',
        'Muscle strength evaluation',
        'Metabolic analysis with breath testing (Resting Metabolic Rate and VO₂ Max)',
        'Personalised longevity protocol',
        'Red Light Therapy — 10 sessions',
        'IHHT (cellular therapy) — 10 sessions',
        '12-week monitoring',
        'Final assessment',
      ],
    },
  },

  // ③ Energy Recovery & Peak Performance — right
  {
    id: 'package-elite',
    set: {
      category: 'diagnostic',
      order: 3,
      tier: 3,
      isFeatured: false,
      name_ka: 'ენერგიის აღდგენის და პიკური პერფორმანსის პროგრამა',
      name_en: 'Energy Recovery & Peak Performance Programme',
      price: 2490,
      ...gel(2490),
      tagline_ka:
        '12-კვირიანი ბიო-ოპტიმიზაციის პროგრამა მაღალი ფიზიკური და გონებრივი დატვირთვის მქონე პირებისთვის',
      tagline_en:
        'A 12-week bio-optimisation programme for those with high physical and mental demands',
      goal_ka:
        'განკუთვნილია სპორტსმენებისთვის, მენეჯერებისთვის, მეწარმეებისთვის და ყველასთვის, ვისაც სურს მაქსიმალურად გამოიყენოს საკუთარი ფიზიკური და გონებრივი პოტენციალი.',
      goal_en:
        'For athletes, managers, entrepreneurs, and anyone who wants to make the most of their physical and mental potential.',
      includes_ka: [
        'პერფორმანსის შეფასება სუნთქვითი ტესტის მიხედვით (VO₂ Max განსაზღვრა)',
        'ვარჯიშის ინდივიდუალური ზონების განსაზღვრა და აღდგენის შეფასება',
        'პერსონალიზებული პერფორმანს სტრატეგიის გეგმა',
        'IHHT — 10 სესია',
        'Red Light Therapy — 12 სესია',
        '12-კვირიანი მონიტორინგი',
        'საბოლოო პერფორმანს რეპორტი',
      ],
      includes_en: [
        'Performance assessment with breath testing (VO₂ Max measurement)',
        'Individual training zone evaluation and recovery assessment',
        'Personalised performance strategy plan',
        'IHHT — 10 sessions',
        'Red Light Therapy — 12 sessions',
        '12-week monitoring',
        'Final performance report',
      ],
    },
  },
]

async function main() {
  const tx = patches.reduce(
    (t, p) => t.patch(p.id, (patch) => patch.set(p.set)),
    client.transaction(),
  )
  await tx.commit()
  console.log(`\n✓ Updated ${patches.length} diagnostic programmes:`)
  for (const p of patches) console.log(`  • ${p.id} → ${p.set.name_en} (${p.set.price} GEL, order ${p.set.order})`)
  console.log('')
}

main().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
