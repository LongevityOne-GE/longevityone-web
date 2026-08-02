/**
 * One-off: add 2 more patient reviews (Tamar Ganugrava, Nutsa Tsutskiridze)
 * to the `review` documents in Sanity, continuing display order after the
 * first batch (scripts/seed-reviews.ts, order 1–5).
 *
 * Run: tsx --env-file=.env.local scripts/add-reviews-batch2.ts
 */
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'icuuryo0'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN
if (!token) { console.error('✗ SANITY_API_TOKEN not set'); process.exit(1) }

const client = createClient({ projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false })

const reviews = [
  {
    _id: 'tamar-ganugrava',
    _type: 'review' as const,
    name_ka: 'თამარ განუგრავა',
    name_en: 'Tamar Ganugrava',
    rating: 5,
    date: null,
    // No named procedure was given in the source text (only "assessment") —
    // best-fit real service, flagged to the founder for confirmation.
    service_ka: 'დღეგრძელობის პროგრამა (12 კვირა)',
    service_en: 'Longevity Programme (12 Weeks)',
    text_ka:
      'დიდი ხანია ჯანმრთელობაზე ვზრუნავ, მაგრამ პირველად მივიღე ისეთი შეფასება, რომელმაც რეალურად ამიხსნა, რა ხდება ჩემს ორგანიზმში. ყველაფერი ძალიან პროფესიონალურად, გასაგებად და ყოველგვარი ზედმეტი დაპირებების გარეშე ამიხსნეს. განსაკუთრებით მომეწონა, რომ რეკომენდაციები ზუსტად ჩემს შედეგებზე იყო მორგებული და არა ზოგადი. ნამდვილად იგრძნობა, რომ აქ პრევენციულ მედიცინას სრულიად სხვა დონეზე უყურებენ. ცალკე აღნიშვნის ღირსია გარემოც. სივრცე ძალიან ლამაზი, მშვიდი და მყუდროა — საერთოდ არ გაქვს ტრადიციული კლინიკის შეგრძნება. აქ თავს უფრო სტუმრად გრძნობ, ვიდრე პაციენტად, რაც ვიზიტს კიდევ უფრო სასიამოვნოს ხდის. მადლობა მთელ გუნდს ყურადღებისთვის, პროფესიონალიზმისა და თბილი დამოკიდებულებისთვის.',
    text_en:
      "I have taken care of my health for a long time, but this was the first assessment that actually explained what was happening in my body. Everything was explained very professionally, clearly, and without any exaggerated promises. What I appreciated most was that the recommendations were tailored precisely to my results, not generic. You can genuinely feel that preventive medicine is approached here on a completely different level. The environment deserves a special mention too — the space is very beautiful, calm and comfortable, and you don't get the feeling of a traditional clinic at all. Here you feel more like a guest than a patient, which makes the visit even more pleasant. Thank you to the whole team for their attention, professionalism and warm approach.",
    source: 'direct' as const,
    consented: true,
    order: 6,
  },
  {
    _id: 'nutsa-tsutskiridze',
    _type: 'review' as const,
    name_ka: 'ნუცა ცუცქირიძე',
    name_en: 'Nutsa Tsutskiridze',
    rating: 5,
    date: null,
    service_ka: 'მეტაბოლური აუდიტი — ორივე ერთად',
    service_en: 'Metabolic audit — both together',
    text_ka:
      'მშობიარობის შემდეგ მინდოდა გამეგო, როგორ აღდგა ჩემი ორგანიზმი და როგორ მუშაობდა ჩემი მეტაბოლიზმი. სწორედ ამიტომ გადავწყვიტე მეტაბოლური ტესტირების ჩატარება. მიღებული ინფორმაცია ძალიან საინტერესო და პრაქტიკული აღმოჩნდა — დეტალურად ამიხსნეს ჩემი შედეგები და მივიღე პერსონალიზებული რეკომენდაციები, რომლებიც რეალურად გამომადგება. ამ პერიოდში ბევრ დედას აქვს კითხვები: რატომ არის ენერგია შემცირებული, რატომ არ იკლებს წონა ისე, როგორც ელოდა, რამდენად სწორად იკვებება ძუძუთი კვების ფონზე და როგორ დაუბრუნდეს აქტიურ ცხოვრებას ისე, რომ საკუთარ ჯანმრთელობასაც მიხედოს. სწორედ ამ კითხვებზე მივიღე ჩემთვის გასაგები და ინდივიდუალური პასუხები. ძალიან მომეწონა, რომ აქ მთავარი მიზანი უბრალოდ წონის დაკლება კი არ არის, არამედ ორგანიზმის ჯანმრთელი აღდგენა და სწორი, ეტაპობრივი დაბრუნება ჩვეულ რიტმში.',
    text_en:
      'After giving birth, I wanted to understand how my body had recovered and how my metabolism was functioning. That is exactly why I decided to have metabolic testing done. The information I received turned out to be very interesting and practical — my results were explained in detail, and I received personalised recommendations that are genuinely useful to me. During this period, many mothers have the same questions: why is my energy lower, why isn’t the weight coming off the way I expected, am I eating correctly while breastfeeding, and how do I return to an active life while still taking care of my own health. It was exactly these questions that I received clear, individual answers to. What I really liked was that the main goal here isn’t simply weight loss, but a healthy recovery of the body and a correct, gradual return to your normal rhythm.',
    source: 'direct' as const,
    consented: true,
    order: 7,
  },
]

async function main() {
  let tx = client.transaction()
  for (const doc of reviews) tx = tx.createOrReplace(doc)
  await tx.commit()
  console.log(`✓ Added ${reviews.length} review document(s).`)
  for (const r of reviews) console.log(`  · ${r._id} — ${r.name_en} (${r.rating}★) — service: ${r.service_en}`)
}

main().catch((e) => { console.error('✗ Failed:', e); process.exit(1) })
