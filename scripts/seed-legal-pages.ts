/**
 * Seed script — Legal pages (Privacy, Terms, Cookies).
 *
 * Run:  npm run seed:legal     (requires SANITY_API_TOKEN with write access)
 *
 * Writes three documents to Sanity with deterministic _ids so re-running the
 * script updates in place instead of creating duplicates. The lawyer's content
 * lives ONLY in this file — every other component reads it from Sanity.
 *
 * The Medical Disclaimer document is NOT touched by this seed.
 *
 * ─── TODOs FOR THE OPERATOR ─────────────────────────────────────────────────
 *   1. COMPANY_NAME_KA / COMPANY_NAME_EN
 *        Lawyer's Cookies doc uses "შპს ლონჯევიტივან" (Company ID 405837590)
 *        but the Privacy / Terms PDFs render the Georgian name differently
 *        ("შპს ლონჯევითი ვან") — likely a Mtavruli/font artefact from the PDF.
 *        Confirm the exact registered Georgian and English names against the
 *        incorporation certificate before running this in production.
 *
 *   2. DPO_EMAIL is a personal Gmail (ana.gabunia1995@gmail.com) — the lawyer
 *        wrote it that way. Confirm or replace with dpo@longevityone.ge before
 *        publishing the Cookie Policy.
 *
 *   3. LAST_UPDATED is the date the lawyer marked. Update when re-running
 *        the seed after content changes.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from '@sanity/client'
import { randomUUID } from 'node:crypto'
import type { PortableTextBlock } from '@portabletext/types'

// ─── Constants (substituted into body text) ──────────────────────────────────
const COMPANY_NAME_KA = 'შპს Longevity One' // ⚠️ TODO confirm registered name
const COMPANY_NAME_EN = 'Longevity One LLC' // ⚠️ TODO confirm registered name
const COMPANY_ID = '405837590'
const COMPANY_ADDRESS_KA =
  'თამარაშვილის ქუჩა №4ა, მე-3 სადარბაზო, მე-3 სართული, ბინა №50, თბილისი, საქართველო'
const COMPANY_ADDRESS_EN =
  '4a Tamarashvili Street, Entrance 3, Floor 3, Apt. 50, Tbilisi, Georgia'
const COMPANY_EMAIL = 'info@longevityone.ge'
const COMPANY_PHONE = '+995 511 70 88 88'
const DPO_EMAIL = 'ana.gabunia1995@gmail.com' // ⚠️ TODO confirm or switch to dpo@longevityone.ge
const LAST_UPDATED = '2026-05-07'

// ─── Sanity client ───────────────────────────────────────────────────────────
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'icuuryo0'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error('SANITY_API_TOKEN is required. Set it in .env.local.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-01',
  token,
  useCdn: false,
})

// ─── Portable Text helpers ───────────────────────────────────────────────────
// Each block and each span gets a unique _key so Sanity accepts the document.

interface Span {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

interface Block {
  _type: 'block'
  _key: string
  style: 'normal' | 'h2' | 'h3' | 'blockquote'
  listItem?: 'bullet' | 'number'
  level?: number
  markDefs: Array<{ _key: string; _type: string; href?: string; external?: boolean }>
  children: Span[]
}

interface MarkRun {
  text: string
  marks: string[]
}

interface LinkAnnotation {
  _key: string
  _type: 'link'
  href: string
  external: boolean
}

/**
 * Parses inline Markdown-style link syntax: [label](href).
 * Returns ordered runs of plain text + linked text, plus the markDefs that
 * each linked run should reference.
 */
function parseInline(
  raw: string,
): { runs: MarkRun[]; markDefs: LinkAnnotation[] } {
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
  const runs: MarkRun[] = []
  const markDefs: LinkAnnotation[] = []
  let cursor = 0
  let match: RegExpExecArray | null
  while ((match = linkPattern.exec(raw)) !== null) {
    if (match.index > cursor) {
      runs.push({ text: raw.slice(cursor, match.index), marks: [] })
    }
    const label = match[1] ?? ''
    const href = match[2] ?? '#'
    const annotation: LinkAnnotation = {
      _key: randomUUID(),
      _type: 'link',
      href,
      external: !href.startsWith('/') && !href.startsWith('mailto:') && !href.startsWith('tel:'),
    }
    markDefs.push(annotation)
    runs.push({ text: label, marks: [annotation._key] })
    cursor = match.index + match[0].length
  }
  if (cursor < raw.length) runs.push({ text: raw.slice(cursor), marks: [] })
  if (!runs.length) runs.push({ text: '', marks: [] })
  return { runs, markDefs }
}

function makeBlock(
  style: Block['style'],
  text: string,
  listItem?: Block['listItem'],
): Block {
  const { runs, markDefs } = parseInline(text)
  const children: Span[] = runs.map((r) => ({
    _type: 'span',
    _key: randomUUID(),
    text: r.text,
    marks: r.marks,
  }))
  const block: Block = {
    _type: 'block',
    _key: randomUUID(),
    style,
    markDefs,
    children,
  }
  if (listItem) {
    block.listItem = listItem
    block.level = 1
  }
  return block
}

const p = (text: string): Block => makeBlock('normal', text)
const h2 = (text: string): Block => makeBlock('h2', text)
const h3 = (text: string): Block => makeBlock('h3', text)
const quote = (text: string): Block => makeBlock('blockquote', text)
const li = (text: string): Block => makeBlock('normal', text, 'bullet')

// ─── Privacy Policy content ──────────────────────────────────────────────────

const privacy_body_ka: Block[] = [
  quote(
    `ეს პოლიტიკა განსაზღვრავს, თუ როგორ ამუშავებს ${COMPANY_NAME_KA} („კომპანია", „ჩვენ") თქვენს პერსონალურ მონაცემებს ვებგვერდის გამოყენებისა და ჩვენი სერვისებით სარგებლობისას. პოლიტიკა შემუშავებულია „პერსონალურ მონაცემთა დაცვის შესახებ" საქართველოს კანონის შესაბამისად.`,
  ),
  h2('1. კონტროლერი'),
  p(COMPANY_NAME_KA),
  p(`მისამართი: ${COMPANY_ADDRESS_KA}`),
  p(`ელ. ფოსტა: ${COMPANY_EMAIL} | ტელეფონი: ${COMPANY_PHONE}`),

  h2('2. რა მონაცემებს ვამუშავებთ'),

  h3('2.1 საიდენტიფიკაციო და საკონტაქტო მონაცემები'),
  p(
    'სახელი, გვარი, დაბადების თარიღი, სქესი, პირადი ნომერი (საჭიროების შემთხვევაში), ტელეფონი, ელ. ფოსტა, მისამართი.',
  ),

  h3('2.2 ჯანმრთელობის მონაცემები (განსაკუთრებული კატეგორია)'),
  p(
    'სამედიცინო ისტორია, ამჟამინდელი დიაგნოზები, მედიკამენტები, ცხოვრების წესი (კვება, ძილი, ვარჯიში), VO₂ max-ის მაჩვენებლები (PNOE ანალიზატორი), სისხლის ანალიზების შედეგები.',
  ),

  h3('2.3 ბიომეტრიული მონაცემები (განსაკუთრებული კატეგორია)'),
  p('სხეულის შემადგენლობა, კუნთებისა და ცხიმის განაწილება, სახსრების კუთხეები.'),

  h3('2.4 გენეტიკური / ეპიგენეტიკური მონაცემები (განსაკუთრებული კატეგორია — მაქსიმალური დაცვა)'),
  p(
    'ბიოლოგიური ასაკის ინდექსები, მეთილაციის მონაცემები — TrueDiagnostic ეპიგენეტიკური ტესტის საშუალებით. ეს მონაცემები მუშავდება TrueDiagnostic-ის სერვერებზე (აშშ).',
  ),

  h3('2.5 მიკრობიომის მონაცემები'),
  p(
    'ნაწლავის მიკრობიომის ანალიზი Enbiosis-ის (თურქეთი) პლატფორმის საშუალებით. მონაცემები ფსევდონიმიზდება გადაგზავნამდე.',
  ),

  h3('2.6 ფინანსური მონაცემები'),
  p('გადახდის ქვითრები და ტრანზაქციების ისტორია. სრული საბარათო მონაცემები ჩვენ მიერ არ ინახება.'),

  h3('2.7 ტექნიკური მონაცემები'),
  p(
    'IP მისამართი, ბრაუზერი, მოწყობილობა, ვებგვერდის გამოყენების სტატისტიკა — ქუქი-ფაილების პოლიტიკის შესაბამისად.',
  ),

  h2('3. დამუშავების სამართლებრივი საფუძველი'),
  li(
    'თანხმობა — განსაკუთრებული კატეგორიის ყველა მონაცემისათვის (ჯანმრთელობა, ბიომეტრია, გენეტიკა) ვიღებთ წერილობით, ცალსახა თანხმობას სერვისის დაწყებამდე.',
  ),
  li('ხელშეკრულების შესრულება — სერვისის მიწოდება, ჯავშნის დადასტურება, შედეგების გაგზავნა.'),
  li('სამართლებრივი ვალდებულება — სამედიცინო ჩანაწერების შენახვა საქართველოს კანონმდებლობის შესაბამისად.'),
  li('ლეგიტიმური ინტერესი — უსაფრთხოება, თაღლითობის პრევენცია.'),

  h2('4. მიზნები'),
  li('სერვისების გაწევა: შეფასება, ტესტირება, შედეგების ანგარიში, კონსულტაცია.'),
  li('ლონგიტუდინალური მონიტორინგი მრავალჯერადი ვიზიტის კლიენტებისათვის.'),
  li('ვიზიტის განრიგი და შეხსენებები.'),
  li('სამედიცინო ჩანაწერების წარმოება.'),
  li('მარკეტინგული კომუნიკაცია — მხოლოდ ცალკე, ნებაყოფლობითი თანხმობის საფუძველზე.'),

  h2('5. საერთაშორისო გადაცემა'),

  h3('TrueDiagnostic (აშშ):'),
  p(
    'ეპიგენეტიკური ტესტის ნიმუშები და მონაცემები გადაიგზავნება შეერთებულ შტატებში. გადაცემა ხდება თქვენი ცალსახა თანხმობის საფუძველზე, სტანდარტული სახელშეკრულებო დებულებების შესაბამისად.',
  ),

  h3('Enbiosis (თურქეთი):'),
  p(
    'ნაწლავის მიკრობიომის ანალიზი ხდება Enbiosis-ის პლატფორმაზე. მონაცემები ფსევდონიმიზდება გადაგზავნამდე.',
  ),

  h2('6. შენახვის ვადები'),
  li(
    'სამედიცინო / ჯანმრთელობის ჩანაწერები: მინიმუმ 10 წელი ბოლო ვიზიტიდან, საქართველოს სამედიცინო კანონმდებლობის შესაბამისად.',
  ),
  li('გენეტიკური / ეპიგენეტიკური მონაცემები: 5 წელი ან თანხმობის გაუქმებამდე (უფრო ადრე).'),
  li('ფინანსური ჩანაწერები: 6 წელი, საქართველოს საგადასახადო კანონმდებლობის შესაბამისად.'),
  li('მარკეტინგის მიზნებით: თანხმობის გაუქმებამდე.'),
  li('ვებგვერდის ტექნიკური მონაცემები: ქუქი-ფაილების პოლიტიკის შესაბამისად.'),

  h2('7. თქვენი უფლებები'),
  p(
    '„პერსონალურ მონაცემთა დაცვის შესახებ" საქართველოს კანონის შესაბამისად, თქვენ გაქვთ შემდეგი უფლებები:',
  ),
  li('ინფორმაციის მიღება — გაიგოთ, რა მონაცემებს ვამუშავებთ.'),
  li('ასლის მიღება — მიიღოთ თქვენი მონაცემების ასლი.'),
  li('გასწორება — მოითხოვოთ მონაცემების განახლება.'),
  li('წაშლა — მოითხოვოთ მონაცემების წაშლა (სამართლებრივი ვალდებულებებიდან გამომდინარე გამონაკლისებით).'),
  li('დამუშავების შეზღუდვა — მოითხოვოთ დამუშავების შეჩერება.'),
  li('გადაცემადობა — მიიღოთ მონაცემები მანქანა-წაკითხვადი ფორმატით.'),
  li('თანხმობის გაუქმება — ნებისმიერ დროს, წარსულ დამუშავებაზე ზეგავლენის გარეშე.'),
  li('საჩივარი — პერსონალურ მონაცემთა დაცვის სამსახურს ([www.pdps.gov.ge](https://www.pdps.gov.ge)).'),
  p(
    `უფლებების განხორციელებისათვის მოგვწერეთ: ${COMPANY_EMAIL}. ვპასუხობთ 10 სამუშაო დღის ვადაში.`,
  ),

  h2('8. უსაფრთხოება'),
  p(
    'ვიყენებთ ტექნიკურ და ორგანიზაციულ ზომებს: მონაცემთა დაშიფვრა, წვდომის კონტროლი, პერსონალის კონფიდენციალობის ვალდებულება. მონაცემთა დარღვევის შემთხვევაში ვაცნობებთ საქართველოს პერსონალურ მონაცემთა დაცვის სამსახურს 72 საათის განმავლობაში.',
  ),

  h2('9. ბავშვები'),
  p(
    'ჩვენი სერვისები განკუთვნილია 18 წლის ზემოთ პირებისთვის. არასრულწლოვნებისათვის სერვისების მიწოდება ხდება მხოლოდ კანონიერი წარმომადგენლის წერილობითი თანხმობის საფუძველზე.',
  ),

  h2('10. პოლიტიკის ცვლილებები'),
  p(
    'მნიშვნელოვანი ცვლილებების შემთხვევაში გაცნობებთ ელ. ფოსტით ან ვებგვერდის ბანერით. ცვლილებები ამოქმედდება 30 დღის შემდეგ.',
  ),

  h2('11. კონტაქტი'),
  p(`${COMPANY_EMAIL} | ${COMPANY_PHONE}`),
  p(COMPANY_ADDRESS_KA),
  p('პერსონალურ მონაცემთა დაცვის სამსახური: [www.pdps.gov.ge](https://www.pdps.gov.ge)'),
]

const privacy_body_en: Block[] = [
  quote(
    `This policy sets out how ${COMPANY_NAME_EN} (the "Company", "we") processes your personal data when you use our website and engage our services. The policy has been prepared in accordance with the Law of Georgia on Personal Data Protection.`,
  ),
  h2('1. Controller'),
  p(COMPANY_NAME_EN),
  p(`Address: ${COMPANY_ADDRESS_EN}`),
  p(`Email: ${COMPANY_EMAIL} | Phone: ${COMPANY_PHONE}`),

  h2('2. Categories of Data We Process'),

  h3('2.1 Identification and contact data'),
  p(
    'First name, surname, date of birth, sex, personal identification number (where required), telephone, email address, postal address.',
  ),

  h3('2.2 Health data (special category)'),
  p(
    'Medical history, current diagnoses, medications, lifestyle (nutrition, sleep, exercise), VO₂ max measurements (via the PNOE analyser), blood-test results.',
  ),

  h3('2.3 Biometric data (special category)'),
  p('Body composition, muscle and fat distribution, joint angles.'),

  h3('2.4 Genetic / epigenetic data (special category — maximum protection)'),
  p(
    'Biological-age indices and methylation data obtained through the TrueDiagnostic epigenetic test. This data is processed on TrueDiagnostic servers (United States).',
  ),

  h3('2.5 Microbiome data'),
  p(
    'Gut-microbiome analysis performed via the Enbiosis (Türkiye) platform. Data is pseudonymised before transfer.',
  ),

  h3('2.6 Financial data'),
  p('Payment receipts and transaction history. We do not store full card details.'),

  h3('2.7 Technical data'),
  p('IP address, browser, device, website-usage statistics — in accordance with the Cookie Policy.'),

  h2('3. Legal Basis for Processing'),
  li(
    'Consent — for all special-category data (health, biometric, genetic) we obtain written, explicit consent before any service begins.',
  ),
  li('Performance of a contract — delivering the service, confirming bookings, sending results.'),
  li('Legal obligation — retaining medical records in line with Georgian law.'),
  li('Legitimate interest — security and fraud prevention.'),

  h2('4. Purposes'),
  li('Service delivery: assessment, testing, results reporting, consultation.'),
  li('Longitudinal monitoring for clients across multiple visits.'),
  li('Appointment scheduling and reminders.'),
  li('Keeping medical records.'),
  li('Marketing communications — only on the basis of a separate, voluntary consent.'),

  h2('5. International Transfers'),

  h3('TrueDiagnostic (USA):'),
  p(
    'Epigenetic-test samples and data are transferred to the United States. The transfer takes place on the basis of your explicit consent and under Standard Contractual Clauses.',
  ),

  h3('Enbiosis (Türkiye):'),
  p('Gut-microbiome analysis is performed on the Enbiosis platform. Data is pseudonymised before transfer.'),

  h2('6. Retention Periods'),
  li(
    'Medical / health records: a minimum of 10 years from the last visit, in accordance with Georgian medical legislation.',
  ),
  li('Genetic / epigenetic data: 5 years, or until consent is withdrawn (whichever is earlier).'),
  li('Financial records: 6 years, in accordance with Georgian tax legislation.'),
  li('Marketing purposes: until consent is withdrawn.'),
  li('Website technical data: in accordance with the Cookie Policy.'),

  h2('7. Your Rights'),
  p('Under the Law of Georgia on Personal Data Protection you have the following rights:'),
  li('Information — to know what data we process about you.'),
  li('Copy — to receive a copy of your data.'),
  li('Rectification — to request that your data be updated.'),
  li(
    'Erasure — to request deletion of your data (subject to exceptions arising from legal obligations).',
  ),
  li('Restriction of processing — to request that processing be paused.'),
  li('Portability — to receive your data in a machine-readable format.'),
  li(
    'Withdrawal of consent — at any time, without affecting processing that has already taken place.',
  ),
  li('Complaint — to the Personal Data Protection Service ([www.pdps.gov.ge](https://www.pdps.gov.ge)).'),
  p(`To exercise your rights, write to ${COMPANY_EMAIL}. We respond within 10 working days.`),

  h2('8. Security'),
  p(
    'We apply technical and organisational measures including data encryption, access controls, and confidentiality obligations for personnel. In the event of a data breach, we notify the Personal Data Protection Service of Georgia within 72 hours.',
  ),

  h2('9. Children'),
  p(
    'Our services are intended for individuals aged 18 and over. Services may be provided to minors only on the basis of the written consent of a legal representative.',
  ),

  h2('10. Changes to This Policy'),
  p(
    'We will notify you of material changes by email or via a banner on our website. Changes take effect 30 days after notice.',
  ),

  h2('11. Contact'),
  p(`${COMPANY_EMAIL} | ${COMPANY_PHONE}`),
  p(COMPANY_ADDRESS_EN),
  p('Personal Data Protection Service: [www.pdps.gov.ge](https://www.pdps.gov.ge)'),
]

// ─── Terms of Service content ────────────────────────────────────────────────

const terms_body_ka: Block[] = [
  quote(
    'ეს პირობები არეგულირებს ვებგვერდის longevityone.ge გამოყენებასა და Longevity One-ის სერვისებით სარგებლობას. ჯავშნის განხორციელება ან ვებგვერდის გამოყენება ნიშნავს ამ პირობებთან სრულ თანხმობას. პირობებზე ვრცელდება საქართველოს კანონმდებლობა.',
  ),

  h2('1. კომპანიის ვინაობა'),
  p(COMPANY_NAME_KA),
  p(`მისამართი: ${COMPANY_ADDRESS_KA}`),
  p(`ელ. ფოსტა: ${COMPANY_EMAIL} | ტელეფონი: ${COMPANY_PHONE}`),

  h2('2. სერვისების აღწერა'),
  p('Longevity One გთავაზობთ პრევენციული ჯანმრთელობის შეფასებებს, მათ შორის:'),
  li('PNOE — მეტაბოლური და VO₂ max ანალიზი'),
  li('TrueDiagnostic — ეპიგენეტიკური ასაკის ტესტი'),
  li('Enbiosis — ნაწლავის მიკრობიომის ანალიზი'),
  li('IHHT — ინტერმიტული ჰიპოქსია-ჰიპეროქსიის თერაპია'),
  li('წითელი სინათლის თერაპია'),
  li('პერსონალიზებული კონსულტაციები'),
  p(
    'ყველა სერვისი წარმოადგენს პრევენციულ შეფასებას და არ ჩაითვლება სამედიცინო მკურნალობად, თუ კომპანია ამას ცალსახად არ განაცხადებს.',
  ),

  h2('3. დასაშვები ასაკი და წინაპირობები'),
  p('ჩვენი სერვისების დამოუკიდებლად შეძენა შეიძლება 18 წლის ზემოთ პირებმა. კლიენტი ვალდებულია:'),
  li('სიზუსტით გადმოსცეს ჯანმრთელობის ისტორია.'),
  li('გამოავლინოს ყველა წინარე დიაგნოზი, მედიკამენტი ან მდგომარეობა, რომელმაც შეიძლება ზეგავლენა მოახდინოს ტესტების შედეგებზე.'),
  li(
    'IHHT თერაპიის წინ ცნობება: პროცედურა კონტრაინდიცირებულია გარკვეული გულ-სისხლძარღვთა პათოლოგიების, ორსულობის, მწვავე ინფექციური დაავადებებისა და სხვა მდგომარეობების შემთხვევაში. კომპანია ატარებს სკრინინგს ყოველი სესიის წინ.',
  ),

  h2('4. ჯავშანი, გადახდა და გაუქმება'),
  li('ჯავშანი შეიძლება განხორციელდეს ვებგვერდზე, ტელეფონით ან ელ. ფოსტით.'),
  li('გადახდა: სესიამდე სრული ან ნაწილობრივი გადახდა (პაკეტისა და სერვისის მიხედვით).'),
  li(
    'გაუქმება: ჯავშნის გაუქმება/გადატანა შეიძლება არანაკლებ 24 საათით ადრე. 24 საათზე ნაკლები შეტყობინების შემთხვევაში სესიის 50% გადახდილი ჯარიმა ვრცელდება.',
  ),
  li('No-show: ჩამოუცდენლობის შემთხვევაში სრული გადახდა ჩაითვლება დაკარგულად.'),
  li(
    'თანხის დაბრუნება: ტექნიკური ან სამედიცინო მიზეზების გამო კომპანიის ბრალით გამოწვეული გაუქმებისათვის სრული თანხა ბრუნდება.',
  ),

  h2('5. კლიენტის ვალდებულებები'),
  li('სიზუსტით შეავსოს ჯანმრთელობის კითხვარი.'),
  li('დაიცვას ტესტის წინასწარი მოთხოვნები (მაგ., PNOE ტესტისთვის — 4-საათიანი მარხვა).'),
  li('ვიზიტის დროს ატარებდეს კომფორტულ, სპორტულ ტანსაცმელს 3D სკანერისთვის.'),
  li('არ მოახდინოს ჩვენი ბრენდის, ანგარიშების ან მეთოდოლოგიის არამართლზომიერი გამოყენება.'),

  h2('6. შედეგები და ანგარიშები'),
  li('შედეგები კლიენტს ეგზავნება დაშიფრული ციფრული ფორმატით სესიის შემდეგ.'),
  li('შედეგები კლიენტის პირადი საკუთრებაა.'),
  li(
    'ანგარიშები წარმოადგენს ინფორმაციულ შეფასებას და არ ჩაითვლება სამედიცინო დიაგნოზად. კლიენტს ეძლევა რეკომენდაცია, კლინიკური გადაწყვეტილებებისათვის მიმართოს ლიცენზირებულ ექიმს.',
  ),

  h2('7. სამედიცინო გამართლება'),
  p(
    'Longevity One-ის სერვისები წარმოადგენს პრევენციულ კეთილდღეობის შეფასებებს და არ ჩაითვლება სამედიცინო მკურნალობად ან კლინიკურ სამედიცინო მომსახურებად. გარე ლაბორატორიული ტესტების (TrueDiagnostic, Enbiosis) სიზუსტეზე პასუხისმგებლობა ეკისრება შესაბამის მიმწოდებლებს. Longevity One-ის პასუხისმგებლობა შეზღუდულია კომერციულად გონივრული ზომებით.',
  ),

  h2('8. ინტელექტუალური საკუთრება'),
  p(
    'ყველა ანგარიში, მეთოდოლოგია, ბრენდი და ვებგვერდის კონტენტი წარმოადგენს კომპანიის ინტელექტუალურ საკუთრებას. კლიენტი ფლობს საკუთარ პერსონალურ მონაცემებს, მაგრამ არა საკუთრების ანგარიშის ფორმატს.',
  ),

  h2('9. მესამე მხარეები'),
  p(
    'გარკვეული სერვისები ეყრდნობა გარე ლაბორატორიებს (TrueDiagnostic, Enbiosis). კლიენტი ვეთანხმება, რომ ამ მესამე მხარეების მიერ გაწეული სერვისებისათვის ვრცელდება მათი საკუთარი პირობები და კონფიდენციალობის პოლიტიკა.',
  ),

  h2('10. პასუხისმგებლობის შეზღუდვა'),
  p(
    'Longevity One-ის პასუხისმგებლობა შემოიფარგლება შეძენილი სერვისის ღირებულებით. კომპანია არ არის პასუხისმგებელი: (ა) არაპირდაპირ ზიანზე; (ბ) კლიენტის მიერ ჯანმრთელობის ისტორიის არასრული ან არაზუსტი გამჟღავნებიდან გამომდინარე შედეგებზე; (გ) ფორსმაჟორულ გარემოებებზე.',
  ),

  h2('11. მომსახურების შეჩერება'),
  p(
    'კომპანიამ შეიძლება უარი თქვას ან გააუქმოს სერვისი, თუ კლიენტი: (ა) გამოავლინა ჯანმრთელობის მდგომარეობა, რომელიც კონტრაინდიცირებს პროცედურას; (ბ) გაამჟღავნა არასწორი ინფორმაცია; (გ) დაარღვია ამ პირობების ნებისმიერი დებულება.',
  ),

  h2('12. მარეგულირებელი კანონი და დავები'),
  p(
    `ამ პირობებს არეგულირებს საქართველოს კანონმდებლობა. ნებისმიერი დავა ჯერ მოგვარდება მოლაპარაკების გზით (${COMPANY_EMAIL}). შეუთანხმებლობის შემთხვევაში გამოიყენება თბილისის სამოქალაქო სასამართლოს იურისდიქცია.`,
  ),

  h2('13. კონტაქტი'),
  p(`${COMPANY_EMAIL} | ${COMPANY_PHONE}`),
  p(COMPANY_ADDRESS_KA),
  p('ვებგვერდი: longevityone.ge'),
]

const terms_body_en: Block[] = [
  quote(
    'These terms govern your use of the website longevityone.ge and your engagement of services provided by Longevity One. Making a booking or using the website signifies your full agreement to these terms. These terms are governed by the law of Georgia.',
  ),

  h2('1. Company Identity'),
  p(COMPANY_NAME_EN),
  p(`Address: ${COMPANY_ADDRESS_EN}`),
  p(`Email: ${COMPANY_EMAIL} | Phone: ${COMPANY_PHONE}`),

  h2('2. Description of Services'),
  p('Longevity One offers preventive health assessments, including:'),
  li('PNOE — metabolic and VO₂ max analysis'),
  li('TrueDiagnostic — epigenetic age testing'),
  li('Enbiosis — gut-microbiome analysis'),
  li('IHHT — intermittent hypoxia-hyperoxia therapy'),
  li('Red-light therapy'),
  li('Personalised consultations'),
  p(
    'All services constitute preventive assessment and do not amount to medical treatment unless the Company expressly states otherwise.',
  ),

  h2('3. Age Eligibility and Pre-Conditions'),
  p('Our services may be purchased independently by individuals aged 18 and over. The client undertakes to:'),
  li('Provide an accurate medical history.'),
  li('Disclose every prior diagnosis, medication, or condition that may affect test results.'),
  li(
    'Notice before IHHT therapy: the procedure is contraindicated in cases of certain cardiovascular pathologies, pregnancy, acute infectious disease, and other conditions. The Company performs screening before every session.',
  ),

  h2('4. Booking, Payment, and Cancellation'),
  li('Bookings may be made via the website, by telephone, or by email.'),
  li('Payment: full or partial payment is due before the session (depending on package and service).'),
  li(
    'Cancellation: appointments may be cancelled or rescheduled no less than 24 hours in advance. If notice is given less than 24 hours before the session, a cancellation fee of 50% of the session price applies.',
  ),
  li('No-show: if the client fails to attend, the full payment is forfeited.'),
  li(
    'Refunds: where cancellation is caused by technical or medical reasons attributable to the Company, the full amount is refunded.',
  ),

  h2('5. Client Obligations'),
  li('Complete the health questionnaire accurately.'),
  li('Comply with pre-test requirements (for example, a 4-hour fast before the PNOE test).'),
  li('Wear comfortable, athletic clothing during the visit for the 3D scanner.'),
  li('Refrain from any unlawful use of our brand, reports, or methodology.'),

  h2('6. Results and Reports'),
  li('Results are delivered to the client in encrypted digital format after the session.'),
  li('Results are the personal property of the client.'),
  li(
    'Reports constitute informational assessment and do not constitute a medical diagnosis. Clients are advised to consult a licensed physician for clinical decisions.',
  ),

  h2('7. Medical Disclaimer'),
  p(
    "Longevity One services constitute preventive wellbeing assessments and do not amount to medical treatment or clinical medical services. Liability for the accuracy of external laboratory tests (TrueDiagnostic, Enbiosis) rests with the respective providers. Longevity One's liability is limited to commercially reasonable measures.",
  ),

  h2('8. Intellectual Property'),
  p(
    'All reports, methodology, brand, and website content constitute the intellectual property of the Company. The client owns their personal data, but not the proprietary format of the report.',
  ),

  h2('9. Third Parties'),
  p(
    "Certain services rely on external laboratories (TrueDiagnostic, Enbiosis). The client agrees that those third-party services are governed by the third parties' own terms and privacy policies.",
  ),

  h2('10. Limitation of Liability'),
  p(
    "Longevity One's liability is limited to the price of the service purchased. The Company is not liable for: (a) indirect damage; (b) outcomes arising from the client's incomplete or inaccurate disclosure of their medical history; (c) force majeure.",
  ),

  h2('11. Suspension of Service'),
  p(
    'The Company may refuse or cancel a service if the client: (a) presents a health condition that contraindicates the procedure; (b) has disclosed inaccurate information; (c) has breached any provision of these terms.',
  ),

  h2('12. Governing Law and Disputes'),
  p(
    `These terms are governed by the law of Georgia. Any dispute will first be addressed through negotiation (${COMPANY_EMAIL}). Failing agreement, the civil courts of Tbilisi shall have jurisdiction.`,
  ),

  h2('13. Contact'),
  p(`${COMPANY_EMAIL} | ${COMPANY_PHONE}`),
  p(COMPANY_ADDRESS_EN),
  p('Website: longevityone.ge'),
]

// ─── Cookie Policy content ───────────────────────────────────────────────────

const cookies_body_ka: Block[] = [
  quote(
    `${COMPANY_NAME_KA} (შემდგომში მოხსენიებული, როგორც „ჩვენ") გაწვდით ინფორმაციას ჩვენი ვებგვერდის გამოყენებისას მზა ჩანაწერების (Cookies) (შემდგომში მოხსენიებული, როგორც „ქუქი") გამოყენების წესების შესახებ. ეს პოლიტიკა განსაზღვრავს თუ როგორ ვამუშავებთ ჩვენ თქვენს პერსონალურ მონაცემებს ვებგვერდით სარგებლობისას. წინამდებარე პოლიტიკა შემუშავებულია პერსონალურ მონაცემთა დაცვის საქართველოს მოქმედი კანონმდებლობისა და ევროპის კავშირის რეგულაციების შესაბამისად.`,
  ),

  h2('1. ზოგადი ინფორმაცია „ქუქის" შესახებ'),

  h3('რას წარმოადგენს?'),
  p(
    '„ქუქი" არის ვებგვერდის მიერ მომხმარებლის ბრაუზერში გაგზავნილი მცირე ზომის ფაილები, რომლებიც ინახება მომხმარებლის ტერმინალზე, როგორიცაა პერსონალური კომპიუტერი, მობილური ტელეფონი, პლანშეტი ან სხვა მოწყობილობა.',
  ),

  h3('რას ემსახურება?'),
  p(
    'მათი დანიშნულება სხვადასხვა სახის ტექნიკური პარამეტრების, ანალიტიკური, სტატისტიკური და მარკეტინგული ინფორმაციის დამახსოვრება, შენახვა და დამუშავება. ისინი მნიშვნელოვან როლს ასრულებენ მომხმარებლისა და მისი მოწყობილობის ქცევიდან გამომდინარე, მომხმარებელზე მორგებული ვებგვერდის ფუნქციონალის შეთავაზებასა და მომსახურების გაუმჯობესებაში.',
  ),

  h3('რა სახის Cookie ფაილები არსებობს?'),
  p('„ქუქი" შეიძლება გამოყენებულ იქნას ერთად ან ცალ-ცალკე. „ქუქი" ფაილები იყოფიან რამდენიმე კატეგორიად:'),
  li('ფუნქციური — ტექნიკური „ქუქი" ფაილები, ანალიტიკური „ქუქი" ფაილები და ინდივიდუალიზებული „ქუქი" ფაილები.'),
  li(
    'მაკონტროლებლისა და წარმოშობის — მომხმარებლის მიერ მონახულებული ვებგვერდის დომენის მიერ შექმნილი საკუთარი „ქუქი" ფაილები, ან მესამე პირის „ქუქი" ფაილები, რომლებიც იქმნება და იმართება მონახულებული ვებგვერდის სხვადასხვა დომენების მიერ, მომხმარებლებთან ინდივიდუალური რეკლამის გაგზავნის მიზნით.',
  ),
  li('მოქმედების ხანგრძლივობის — მაგ., სესიის „ქუქი" ფაილები ან მუდმივი გამოყენების „ქუქი" ფაილები.'),

  h2('2. რა მონაცემებს ვამუშავებთ და რა სახის „ქუქი" ფაილებს ვიყენებთ'),

  h3('აუცილებელი „ქუქი" ფაილები'),
  p('ეს „ქუქი" ფაილები აუცილებელია ვებგვერდის საბაზისო ფუნქციების მუშაობისთვის, ნავიგაციისა და უსაფრთხო მოხმარებისთვის.'),

  h3('ფუნქციური „ქუქი" ფაილები'),
  p(
    'ეს „ქუქი" ფაილები უზრუნველყოფს მომხმარებლის მიერ ვებგვერდზე გაკეთებული ამა თუ იმ არჩევანის დამახსოვრებას, რათა მას ყოველ ვიზიტზე ხელახლა არ მოუხდეს ამ არჩევანის გაკეთება (მაგალითად, ვებგვერდის მოხმარების წესებსა და მზა ჩანაწერების (Cookies) პოლიტიკაზე დათანხმება, სასურველი ენის არჩევა და ა.შ.).',
  ),

  h3('ანალიტიკური „ქუქი" ფაილები'),
  p(
    'ეს „ქუქი" ფაილები გამოიყენება მომხმარებლის ქცევის შესახებ, ვებგვერდის ცალკეულ ვებგვერდებთან მათ ინტერაქციის შესახებ, ინფორმაციის დაგროვებისთვის და მომხმარებლის ვებგვერდზე ვიზიტისას გამოცდილების გასაუმჯობესებლად.',
  ),

  h3('მესამე პირის „ქუქი" ფაილები'),
  p('ცალკეულ შემთხვევებში ჩვენს ვებგვერდზე შესაძლებელია გამოყენებულ იქნას მესამე პირის მომსახურების „ქუქი" ფაილები, როგორიცაა:'),
  li('ანალიტიკური პლატფორმები (მაგ.: Google Analytics)'),
  li('ონლაინ ჩათის მომსახურება'),
  p('ამ შემთხვევაში მესამე პირი პასუხისმგებელია თავისი „ქუქი" პოლიტიკის შესაბამისად.'),

  h2('3. როგორ ვიყენებთ მოპოვებულ ინფორმაციას?'),
  li('ვებგვერდით მომხმარებლის სარგებლობის, მომხმარებელზე ორიენტირებული დიზაინისა და სტრუქტურის ოპტიმიზაციისთვის.'),
  li('ვებგვერდის ტექნიკური გამართულობის, უსაფრთხოების, მონაცემთა დაცვისა და ხელმისაწვდომობის ოპტიმიზაციისთვის.'),
  li('ჩვენ შესახებ უახლესი ინფორმაციის მიწოდებისთვის.'),
  li('ვებგვერდის მომხმარებელთა ქცევის მონიტორინგისა და ანალიზისთვის, ვებგვერდის გაუმჯობესების მიზნით.'),

  h2('4. „ქუქი" ფაილების მართვა'),
  p(
    'ვებგვერდზე მომხმარებლის თავდაპირველი ვიზიტისას თვალშისაცემ ადგილას გამოჩნდება „ქუქი" ფაილების ბანერი, რომელზეც მომხმარებელს საშუალება ეძლევა გამოხატოს თანხმობა და აირჩიოს, რა სახის „ქუქი" ფაილები იქნება შენახული მის ბრაუზერში.',
  ),
  li(
    'მომხმარებელს შეუძლია დაეთანხმოს მიიღოს ყველა სახის „ქუქი" ფაილები და გააგრძელოს ვებგვერდით სარგებლობა. „ქუქი" ფაილების ბანერი ხელახლა აღარ გამოჩნდება და ჩაითვლება, რომ მომხმარებელი ეთანხმება ჩვენს „ქუქი" ფაილების პოლიტიკას.',
  ),
  li(
    'მომხმარებელს შეუძლია არ დაეთანხმოს ყველა სახის „ქუქი" ფაილების მიღებას (გარდა იმ „ქუქი" ფაილებისა, რომლებიც აუცილებელია ვებგვერდის ფუნქციონირებისათვის).',
  ),
  li('მომხმარებელს შეუძლია აირჩიოს დაეთანხმოს მხოლოდ ფუნქციური და ანალიტიკური ან მარკეტინგული „ქუქი" ფაილების მიღებას.'),
  li(
    'მომხმარებლის მიერ ყველა სახის „ქუქი" ფაილების მიღებაზე უარმა ან მხოლოდ კონკრეტული მიზნის „ქუქი" ფაილების მიღებაზე თანხმობამ, შესაძლებელია გამოიწვიოს ვებგვერდის ზოგიერთი ვებგვერდის ან მისი ნაწილით სარგებლობის შეზღუდვა ან ტექნიკური გაუმართაობა.',
  ),
  li('მომხმარებელს სურვილისამებრ ნებისმიერ დროს შეუძლია შეცვალოს მის მიერ გაკეთებული არჩევანი, დაეთანხმოს „ქუქი" ფაილების მიღებას სრულად ან ნაწილობრივ.'),

  h2('5. მონაცემების დამუშავების სამართლებრივი საფუძველი და მონაცემთა მიმღების ვალდებულება'),
  li(
    `ვებგვერდის მომხმარებელი ნებაყოფლობით გამოხატავს მკაფიო და ინფორმირებულ თანხმობას „ქუქი" ფაილების მიღებასა და ${COMPANY_NAME_KA}-ის „ქუქი" ფაილების პოლიტიკასთან დაკავშირებით.`,
  ),
  li(
    `${COMPANY_NAME_KA}-ის ლეგიტიმურ ინტერესს ვებგვერდის მომხმარებელთა ციფრული უსაფრთხოებისა და ვებგვერდის გამართულად ფუნქციონირებისთვის გამოიყენოს „ქუქი" ფაილები.`,
  ),
  li(
    `${COMPANY_NAME_KA} იღებს ვალდებულებას, დაიცვას ვებგვერდის მომხმარებელთა პერსონალური ინფორმაცია მომხმარებელთა მიერ ჩვენი ვებგვერდის გამოყენებისას და მიაწოდოს ინფორმაცია ვებგვერდზე „ქუქი" ფაილების გამოყენების შესახებ.`,
  ),

  h2('6. ცვლილებები „ქუქი" პოლიტიკაში'),
  p(
    'ჩვენ ვიტოვებთ უფლებას, ნებისმიერ დროს განვაახლოთ წინამდებარე „ქუქი" ფაილების პოლიტიკა. ცვლილებები გამოქვეყნდება ამ ვებგვერდზე და ძალაში შევა გამოქვეყნებისთანავე, რასთან დაკავშირებითაც მომხმარებლებს ეცნობებათ ვებგვერდზე ხელახალ ვიზიტისას.',
  ),

  h2('7. საკონტაქტო ინფორმაცია'),
  p('„ქუქი" პოლიტიკასთან დაკავშირებული კითხვების შემთხვევაში, დაგვიკავშირდით:'),
  p(`${COMPANY_NAME_KA} (ს/ნ ${COMPANY_ID})`),
  p(`მისამართი: ${COMPANY_ADDRESS_KA}`),
  p(`ან მიმართეთ კომპანიის პერსონალურ მონაცემთა დაცვის ოფიცერს ელ. ფოსტაზე: ${DPO_EMAIL}.`),
]

const cookies_body_en: Block[] = [
  quote(
    `${COMPANY_NAME_EN} (hereinafter, "we") provides you with information about how cookies are used on our website. This policy explains how we process your personal data when you use our website. It has been prepared in accordance with the applicable Georgian legislation on personal data protection and European Union regulations.`,
  ),

  h2('1. General Information About Cookies'),

  h3('What are they?'),
  p(
    "Cookies are small files sent by a website to the user's browser and stored on the user's device — such as a personal computer, mobile phone, tablet, or other terminal.",
  ),

  h3('What are they for?'),
  p(
    'Their purpose is to remember, store, and process various technical, analytical, statistical, and marketing information. They play an important role in tailoring website functionality to the user — based on user and device behaviour — and in improving the service.',
  ),

  h3('What categories of cookies exist?'),
  p('Cookies can be used jointly or separately. They fall into several categories:'),
  li('By function — technical cookies, analytical cookies, and personalisation cookies.'),
  li(
    'By origin — first-party cookies created by the domain of the website being visited, or third-party cookies created and managed by different domains for the purpose of delivering individualised advertising.',
  ),
  li('By duration — for example, session cookies or persistent cookies.'),

  h2('2. What Data We Process and the Cookies We Use'),

  h3('Strictly necessary cookies'),
  p('These cookies are required for the basic functioning of the website, for navigation, and for secure use.'),

  h3('Functional cookies'),
  p(
    'These cookies remember choices made by the user on the website, so the user does not have to repeat those choices on every visit (for example, accepting the website terms of use and Cookie Policy, choosing a preferred language, and so on).',
  ),

  h3('Analytical cookies'),
  p(
    "These cookies are used to gather information about user behaviour and interactions with individual pages of the website, to improve the user's experience.",
  ),

  h3('Third-party cookies'),
  p('In certain cases our website may use third-party service cookies, such as:'),
  li('Analytics platforms (for example, Google Analytics)'),
  li('Online chat services'),
  p('In such cases, the third party is responsible in accordance with its own cookie policy.'),

  h2('3. How We Use the Information Collected'),
  li('To optimise your use of the website and the user-centred design and structure.'),
  li('To optimise the technical reliability, security, data protection, and accessibility of the website.'),
  li('To provide up-to-date information about us.'),
  li('To monitor and analyse user behaviour for the purpose of improving the website.'),

  h2('4. Managing Cookies'),
  p(
    'On a first visit to the website, a cookie banner appears in a prominent place where the user can give consent and choose which cookies will be stored in the browser.',
  ),
  li(
    'You may accept all cookies and continue using the website. The banner will not reappear and you will be deemed to have accepted our Cookie Policy.',
  ),
  li('You may refuse all cookies (other than those strictly necessary for the website to function).'),
  li('You may choose to accept only functional and analytical cookies, or only marketing cookies.'),
  li(
    'Refusing all cookies, or accepting only cookies for a specific purpose, may restrict your use of certain parts of the website or cause technical disruption.',
  ),
  li('You may change your choice at any time and accept cookies in full or in part.'),

  h2('5. Legal Basis for Processing and Our Obligations'),
  li(
    `Users of the website voluntarily express clear and informed consent to the use of cookies and to ${COMPANY_NAME_EN}'s Cookie Policy.`,
  ),
  li(
    `${COMPANY_NAME_EN} has a legitimate interest in using cookies for the digital security of users and the proper functioning of the website.`,
  ),
  li(
    `${COMPANY_NAME_EN} undertakes to protect the personal information of website users when they use our website and to inform users about the use of cookies on the website.`,
  ),

  h2('6. Changes to This Policy'),
  p(
    'We reserve the right to update this Cookie Policy at any time. Changes will be published on this website and take effect upon publication; users will be informed on their next visit to the website.',
  ),

  h2('7. Contact Information'),
  p('For questions about this Cookie Policy, please contact us:'),
  p(`${COMPANY_NAME_EN} (Company ID ${COMPANY_ID})`),
  p(`Address: ${COMPANY_ADDRESS_EN}`),
  p(`Or contact our Data Protection Officer at: ${DPO_EMAIL}.`),
]

// ─── Document assembly ───────────────────────────────────────────────────────

interface LegalSeedDoc {
  _id: string
  _type: 'legalPage'
  pageType: 'privacy' | 'terms' | 'cookies'
  title_ka: string
  title_en: string
  intro_ka: string
  intro_en: string
  lastUpdated: string
  body_ka: PortableTextBlock[]
  body_en: PortableTextBlock[]
  seoDescription_ka: string
  seoDescription_en: string
}

const docs: LegalSeedDoc[] = [
  {
    _id: 'legal-privacy',
    _type: 'legalPage',
    pageType: 'privacy',
    title_ka: 'კონფიდენციალურობის პოლიტიკა',
    title_en: 'Privacy Policy',
    intro_ka:
      'როგორ ვამუშავებთ თქვენს პერსონალურ მონაცემებს — საქართველოს კანონმდებლობისა და GDPR პრინციპების შესაბამისად.',
    intro_en:
      'How we process your personal data — in accordance with Georgian law and GDPR principles.',
    lastUpdated: LAST_UPDATED,
    body_ka: privacy_body_ka as unknown as PortableTextBlock[],
    body_en: privacy_body_en as unknown as PortableTextBlock[],
    seoDescription_ka:
      'Longevity One-ის კონფიდენციალურობის პოლიტიკა — როგორ ვამუშავებთ პერსონალურ მონაცემებს „პერსონალურ მონაცემთა დაცვის შესახებ" საქართველოს კანონის შესაბამისად.',
    seoDescription_en:
      'Longevity One Privacy Policy — how we process personal data in accordance with the Law of Georgia on Personal Data Protection.',
  },
  {
    _id: 'legal-terms',
    _type: 'legalPage',
    pageType: 'terms',
    title_ka: 'მომსახურების პირობები',
    title_en: 'Terms of Service',
    intro_ka:
      'ვებგვერდისა და Longevity One-ის სერვისების გამოყენების პირობები. ჯავშნის განხორციელება ნიშნავს ამ პირობებთან სრულ თანხმობას.',
    intro_en:
      'Terms governing the use of the longevityone.ge website and our services. Making a booking signifies full agreement with these terms.',
    lastUpdated: LAST_UPDATED,
    body_ka: terms_body_ka as unknown as PortableTextBlock[],
    body_en: terms_body_en as unknown as PortableTextBlock[],
    seoDescription_ka:
      'Longevity One-ის მომსახურების პირობები — ჯავშანი, გადახდა, გაუქმება, კლიენტის ვალდებულებები და პასუხისმგებლობის შეზღუდვა.',
    seoDescription_en:
      'Longevity One Terms of Service — booking, payment, cancellation, client obligations, and limitation of liability.',
  },
  {
    _id: 'legal-cookies',
    _type: 'legalPage',
    pageType: 'cookies',
    title_ka: 'ქუქი-ფაილების პოლიტიკა',
    title_en: 'Cookie Policy',
    intro_ka: 'რა ქუქი-ფაილებს ვიყენებთ, რას ემსახურება და როგორ მართოთ თქვენი არჩევანი.',
    intro_en: 'What cookies we use, what they do, and how you can manage your preferences.',
    lastUpdated: LAST_UPDATED,
    body_ka: cookies_body_ka as unknown as PortableTextBlock[],
    body_en: cookies_body_en as unknown as PortableTextBlock[],
    seoDescription_ka:
      'Longevity One-ის ქუქი-ფაილების პოლიტიკა — ფაილების კატეგორიები, მართვა და სამართლებრივი საფუძველი.',
    seoDescription_en:
      'Longevity One Cookie Policy — cookie categories, management, and the legal basis for processing.',
  },
]

// Legacy / orphaned _ids that previous seeds created. They are deleted so
// Studio doesn't show duplicates and the public site never resolves the wrong
// doc. `legal-cookie` (singular) had pageType="cookie" which doesn't match
// the schema list. The `legalPage.*` dotted ids are hidden from
// unauthenticated public queries by Sanity, so they must not remain.
const LEGACY_IDS_TO_DELETE = [
  'legal-cookie',
  'legalPage.privacy',
  'legalPage.terms',
  'legalPage.cookies',
]

async function run(): Promise<void> {
  for (const legacyId of LEGACY_IDS_TO_DELETE) {
    await client.delete(legacyId).catch(() => null)
  }
  console.log(`Cleaned up ${LEGACY_IDS_TO_DELETE.length} legacy/orphan ids.`)

  for (const doc of docs) {
    console.log(`→ Seeding ${doc._id} (${doc.title_en})`)
    await client.createOrReplace(doc)
  }
  console.log(`\n✅ Seeded ${docs.length} legal pages.`)
  console.log('   Medical Disclaimer left untouched.')
}

run().catch((err: unknown) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
