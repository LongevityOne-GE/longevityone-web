/**
 * One-off: migrate the 5 patient reviews from the old src/content/reviews.json
 * into Sanity as `review` documents, now that reviews are Studio-editable.
 *
 * Deterministic _ids (same as the old JSON `id` field) → re-running updates in
 * place rather than duplicating. `consented: true` carries over — these were
 * already approved for publication in the prior code-based version.
 *
 * Run: tsx --env-file=.env.local scripts/seed-reviews.ts
 */
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'icuuryo0'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN
if (!token) { console.error('✗ SANITY_API_TOKEN not set'); process.exit(1) }

const client = createClient({ projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false })

interface ReviewDoc {
  _id: string
  _type: 'review'
  name_ka: string
  name_en: string
  rating: number
  date: null
  service_ka: string
  service_en: string
  text_ka: string
  text_en: string
  source: 'direct' | 'google'
  consented: true
  order: number
}

const reviews: ReviewDoc[] = [
  {
    _id: 'zurab-lakerbaia',
    _type: 'review',
    name_ka: 'ზურაბ ლაკერბაია',
    name_en: 'Zurab Lakerbaia',
    rating: 5,
    date: null,
    service_ka: 'მეტაბოლური აუდიტი — ორივე ერთად',
    service_en: 'Metabolic audit — both together',
    text_ka: 'ძალიან კმაყოფილი ვარ Longevity One-ში ვიზიტით. გავიკეთე RMR (მოსვენების მდგომარეობაში მეტაბოლიზმის) და AMR (აქტიური მეტაბოლიზმის) ტესტები, რამაც მომცა სრული და ზუსტი სურათი, თუ როგორ მუშაობს ჩემი ორგანიზმი. ექიმების პროფესიონალიზმი და მიდგომა უმაღლეს დონეზეა. აქამდე ვვარაუდობდი, ახლა კი ზუსტი, მეცნიერული მონაცემებით ვიცი, როგორ უნდა ვმართო ჩემი კვება და ფიზიკური დატვირთვა. 5 ვარსკვლავი!',
    text_en: 'I am very pleased with my visit to Longevity One. I had the RMR (resting metabolic rate) and AMR (active metabolic rate) tests, which gave me a complete and precise picture of how my body works. The professionalism and approach of the doctors is of the highest standard. Before, I was guessing; now I know from precise, scientific data how to manage my nutrition and my physical training. Five stars!',
    source: 'direct',
    consented: true,
    order: 1,
  },
  {
    _id: 'anonymous-red-light',
    _type: 'review',
    name_ka: 'ანონიმური მომხმარებელი',
    name_en: 'Anonymous client',
    rating: 5,
    date: null,
    service_ka: 'Red Light Therapy',
    service_en: 'Red Light Therapy',
    text_ka: 'პლასტიკური ოპერაციის შემდეგ მჭირდებოდა რეაბილიტაციის პროცესის დაჩქარება და გადავწყვიტე წითელი შუქის თერაპიის გავლა. შედეგით ნამდვილად აღფრთოვანებული ვარ — შეშუპება და დისკომფორტი ბევრად მალე გაქრა, ვიდრე ველოდი. კლინიკაში არის ძალიან მყუდრო, სუფთა გარემო და უყურადღებიანესი პერსონალი, რაც პოსტოპერაციულ პერიოდში განსაკუთრებით მნიშვნელოვანია. უღრმესი მადლობა გუნდს!',
    text_en: 'After plastic surgery I needed to speed up my recovery, so I decided to try red light therapy. I am genuinely delighted with the result — the swelling and discomfort faded far sooner than I had expected. The clinic has a very comfortable, spotless environment and the most attentive staff, which matters especially during the post-operative period. My deepest thanks to the team!',
    source: 'direct',
    consented: true,
    order: 2,
  },
  {
    _id: 'giorgi-oniani',
    _type: 'review',
    name_ka: 'გიორგი ონიანი',
    name_en: 'Giorgi Oniani',
    rating: 5,
    date: null,
    service_ka: 'მიკრობიომის ანალიზი',
    service_en: 'Microbiome Analysis',
    text_ka: 'უმაღლესი დონის მომსახურება! ჩავიტარე ნაწლავის მიკრობიომის ანალიზი, ასევე RMR და AMR კვლევები. ასეთი დეტალური და მეცნიერულად დასაბუთებული ინფორმაცია საკუთარ ჯანმრთელობაზე აქამდე არსად მიმიღია. ექიმებმა დეტალურად ამიხსნეს თითოეული მაჩვენებელი და მომცეს პერსონალიზებული რეკომენდაციები. ეს არის ნამდვილი პრევენციული მედიცინა. დიდი მადლობა პროფესიონალიზმისთვის.',
    text_en: 'Service of the highest standard! I had the gut microbiome analysis, as well as the RMR and AMR assessments. I have never received such detailed, scientifically grounded information about my own health anywhere else. The doctors explained every single marker in detail and gave me personalised recommendations. This is what preventive medicine really means. Many thanks for their professionalism.',
    source: 'direct',
    consented: true,
    order: 3,
  },
  {
    _id: 'maiko-baratashvili',
    _type: 'review',
    name_ka: 'მაიკო ბარათაშვილი',
    name_en: 'Maiko Baratashvili',
    rating: 5,
    date: null,
    service_ka: 'IHHT (უჯრედული წვრთნა)',
    service_en: 'IHHT (cellular training)',
    text_ka: 'ჩემი საუკეთესო აღმოჩენა! გავიარე სრული სპექტრი: მეტაბოლიზმის კვლევები (RMR, AMR), წითელი შუქის თერაპია და IHHT (უჯრედული ჟანგბადით თერაპია). თითოეული სესია იყო ძალიან კომფორტული. თავს ვგრძნობ ბევრად უფრო ენერგიულად, მომიწესრიგდა ძილი და ზოგადი ტონუსი. ვინც საკუთარ ჯანმრთელობასა და ახალგაზრდობის შენარჩუნებას უფრთხილდება, აუცილებლად უნდა ესტუმროს ამ ადგილს.',
    text_en: 'My best discovery! I went through the full spectrum: the metabolic assessments (RMR, AMR), red light therapy and IHHT (cellular oxygen therapy). Every session was very comfortable. I feel far more energetic, and both my sleep and my general tone have settled. Anyone who looks after their health and wants to stay young should certainly visit this place.',
    source: 'direct',
    consented: true,
    order: 4,
  },
  {
    _id: 'ana-topuria',
    _type: 'review',
    name_ka: 'ანა თოფურია',
    name_en: 'Ana Topuria',
    rating: 5,
    date: null,
    service_ka: 'IHHT (უჯრედული წვრთნა)',
    service_en: 'IHHT (cellular training)',
    text_ka: 'ძალიან კმაყოფილი ვარ IHHT (ჰიპოქსიურ-ჰიპეროქსიური) თერაპიით! პროცედურების დაწყების შემდეგ ენერგიის საოცარ მოზღვავებას ვგრძნობ და სტრესთან გამკლავებაც ბევრად გამიმარტივდა. კლინიკაში არის უახლესი აპარატურა, საოცრად თბილი და მშვიდი გარემო. ნამდვილად ვგრძნობ, როგორ გაუმჯობესდა ჩემი უჯრედული ჯანმრთელობა. აუცილებლად გავაგრძელებ სესიებს!',
    text_en: 'I am very pleased with the IHHT (hypoxic-hyperoxic) therapy! Since starting the sessions I have felt a remarkable surge of energy, and coping with stress has become much easier. The clinic has the latest equipment and a wonderfully warm, calm atmosphere. I can genuinely feel how my cellular health has improved. I will definitely continue with the sessions!',
    source: 'direct',
    consented: true,
    order: 5,
  },
]

async function main() {
  let tx = client.transaction()
  for (const doc of reviews) tx = tx.createOrReplace(doc)
  await tx.commit()
  console.log(`✓ Seeded ${reviews.length} review document(s).`)
  for (const r of reviews) console.log(`  · ${r._id} — ${r.name_en} (${r.rating}★)`)
}

main().catch((e) => { console.error('✗ Failed:', e); process.exit(1) })
