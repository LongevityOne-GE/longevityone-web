/**
 * One-off: remove every em dash (—) from patient review content, and fix
 * the package name it was borrowed from (metabolic-audit-combined), per the
 * house rule of no em dashes anywhere. Also corrects Tamar Ganugrava's
 * service attribution to "Full Biological Audit" (founder-confirmed).
 *
 * Run: tsx --env-file=.env.local scripts/fix-em-dashes-and-tamar-service.ts
 */
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'icuuryo0'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN
if (!token) { console.error('✗ SANITY_API_TOKEN not set'); process.exit(1) }

const client = createClient({ projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false })

const patches: Array<{ id: string; set: Record<string, string> }> = [
  // The real package name that review service fields borrow from.
  {
    id: 'metabolic-audit-combined',
    set: {
      name_en: 'Metabolic audit (both together)',
      name_ka: 'მეტაბოლური აუდიტი (ორივე ერთად)',
    },
  },
  {
    id: 'zurab-lakerbaia',
    set: {
      service_en: 'Metabolic audit (both together)',
      service_ka: 'მეტაბოლური აუდიტი (ორივე ერთად)',
    },
  },
  {
    id: 'anonymous-red-light',
    set: {
      text_en:
        'After plastic surgery I needed to speed up my recovery, so I decided to try red light therapy. I am genuinely delighted with the result. The swelling and discomfort faded far sooner than I had expected. The clinic has a very comfortable, spotless environment and the most attentive staff, which matters especially during the post-operative period. My deepest thanks to the team!',
      text_ka:
        'პლასტიკური ოპერაციის შემდეგ მჭირდებოდა რეაბილიტაციის პროცესის დაჩქარება და გადავწყვიტე წითელი შუქის თერაპიის გავლა. შედეგით ნამდვილად აღფრთოვანებული ვარ. შეშუპება და დისკომფორტი ბევრად მალე გაქრა, ვიდრე ველოდი. კლინიკაში არის ძალიან მყუდრო, სუფთა გარემო და უყურადღებიანესი პერსონალი, რაც პოსტოპერაციულ პერიოდში განსაკუთრებით მნიშვნელოვანია. უღრმესი მადლობა გუნდს!',
    },
  },
  {
    id: 'nutsa-tsutskiridze',
    set: {
      service_en: 'Metabolic audit (both together)',
      service_ka: 'მეტაბოლური აუდიტი (ორივე ერთად)',
      text_en:
        'After giving birth, I wanted to understand how my body had recovered and how my metabolism was functioning. That is exactly why I decided to have metabolic testing done. The information I received turned out to be very interesting and practical. My results were explained in detail, and I received personalised recommendations that are genuinely useful to me. During this period, many mothers have the same questions: why is my energy lower, why isn’t the weight coming off the way I expected, am I eating correctly while breastfeeding, and how do I return to an active life while still taking care of my own health. It was exactly these questions that I received clear, individual answers to. What I really liked was that the main goal here isn’t simply weight loss, but a healthy recovery of the body and a correct, gradual return to your normal rhythm.',
      text_ka:
        'მშობიარობის შემდეგ მინდოდა გამეგო, როგორ აღდგა ჩემი ორგანიზმი და როგორ მუშაობდა ჩემი მეტაბოლიზმი. სწორედ ამიტომ გადავწყვიტე მეტაბოლური ტესტირების ჩატარება. მიღებული ინფორმაცია ძალიან საინტერესო და პრაქტიკული აღმოჩნდა. დეტალურად ამიხსნეს ჩემი შედეგები და მივიღე პერსონალიზებული რეკომენდაციები, რომლებიც რეალურად გამომადგება. ამ პერიოდში ბევრ დედას აქვს კითხვები: რატომ არის ენერგია შემცირებული, რატომ არ იკლებს წონა ისე, როგორც ელოდა, რამდენად სწორად იკვებება ძუძუთი კვების ფონზე და როგორ დაუბრუნდეს აქტიურ ცხოვრებას ისე, რომ საკუთარ ჯანმრთელობასაც მიხედოს. სწორედ ამ კითხვებზე მივიღე ჩემთვის გასაგები და ინდივიდუალური პასუხები. ძალიან მომეწონა, რომ აქ მთავარი მიზანი უბრალოდ წონის დაკლება კი არ არის, არამედ ორგანიზმის ჯანმრთელი აღდგენა და სწორი, ეტაპობრივი დაბრუნება ჩვეულ რიტმში.',
    },
  },
  {
    id: 'tamar-ganugrava',
    set: {
      // Founder-confirmed correction (was a best-guess placeholder before).
      service_en: 'Full Biological Audit',
      service_ka: 'სრული ბიოლოგიური აუდიტი',
      text_en:
        "I have taken care of my health for a long time, but this was the first assessment that actually explained what was happening in my body. Everything was explained very professionally, clearly, and without any exaggerated promises. What I appreciated most was that the recommendations were tailored precisely to my results, not generic. You can genuinely feel that preventive medicine is approached here on a completely different level. The environment deserves a special mention too. The space is very beautiful, calm and comfortable, and you don't get the feeling of a traditional clinic at all. Here you feel more like a guest than a patient, which makes the visit even more pleasant. Thank you to the whole team for their attention, professionalism and warm approach.",
      text_ka:
        'დიდი ხანია ჯანმრთელობაზე ვზრუნავ, მაგრამ პირველად მივიღე ისეთი შეფასება, რომელმაც რეალურად ამიხსნა, რა ხდება ჩემს ორგანიზმში. ყველაფერი ძალიან პროფესიონალურად, გასაგებად და ყოველგვარი ზედმეტი დაპირებების გარეშე ამიხსნეს. განსაკუთრებით მომეწონა, რომ რეკომენდაციები ზუსტად ჩემს შედეგებზე იყო მორგებული და არა ზოგადი. ნამდვილად იგრძნობა, რომ აქ პრევენციულ მედიცინას სრულიად სხვა დონეზე უყურებენ. ცალკე აღნიშვნის ღირსია გარემოც. სივრცე ძალიან ლამაზი, მშვიდი და მყუდროა. საერთოდ არ გაქვს ტრადიციული კლინიკის შეგრძნება. აქ თავს უფრო სტუმრად გრძნობ, ვიდრე პაციენტად, რაც ვიზიტს კიდევ უფრო სასიამოვნოს ხდის. მადლობა მთელ გუნდს ყურადღებისთვის, პროფესიონალიზმისა და თბილი დამოკიდებულებისთვის.',
    },
  },
]

async function main() {
  let tx = client.transaction()
  for (const p of patches) tx = tx.patch(p.id, (patch) => patch.set(p.set))
  await tx.commit()
  console.log(`✓ Patched ${patches.length} document(s), em dashes removed.`)

  // Verify: no em dash left anywhere in the touched fields.
  const check = await client.fetch<Array<Record<string, unknown>>>(
    `*[_id in $ids]{ _id, name_ka, name_en, service_ka, service_en, text_ka, text_en }`,
    { ids: patches.map((p) => p.id) },
  )
  let clean = true
  for (const doc of check) {
    for (const [k, v] of Object.entries(doc)) {
      if (typeof v === 'string' && v.includes('—')) {
        clean = false
        console.error(`  ✗ em dash remains: ${doc._id}.${k}`)
      }
    }
  }
  console.log(clean ? '✓ Verified: no em dashes remain in touched documents.' : '✗ Em dashes still present — see above.')
}

main().catch((e) => { console.error('✗ Failed:', e); process.exit(1) })
