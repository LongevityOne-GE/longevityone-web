/**
 * Seed script — Advisory Board.
 *
 * Creates the advisoryBoardPage singleton and four advisoryBoardMember
 * documents as DRAFTS (prefixed `drafts.` in Sanity). The clinic must then:
 *   1. Review each bio in Sanity Studio
 *   2. Upload portraits with alt text
 *   3. Flip `consentToPublicListing` to `true` after written GDPR consent
 *   4. Publish each document
 *
 * Run:  npx tsx scripts/seed-advisory-board.ts
 * Requires SANITY_API_TOKEN env var with write permissions.
 *
 * Idempotent: if a draft with the same _id already exists it is replaced
 * via createOrReplace, so re-running the script is safe.
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'icuuryo0'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error('SANITY_API_TOKEN is required. Set it before running this script.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-01',
  token,
  useCdn: false,
})

interface BlockChild {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

interface Block {
  _type: 'block'
  _key: string
  style: 'normal'
  markDefs: []
  children: BlockChild[]
}

function paragraph(text: string, key: string): Block {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${key}-s`, text, marks: [] }],
  }
}

// ─── Page singleton ───────────────────────────────────────────────────────────

// The page singleton holds only editorial copy (no personal data) and is
// published immediately so the route renders before members are added.
// Member documents below stay as drafts and only appear after GDPR consent.
const advisoryBoardPageDraft = {
  _id: 'advisoryBoardPage',
  _type: 'advisoryBoardPage',
  eyebrow_ka: 'სამეცნიერო ზედამხედველობა',
  eyebrow_en: 'Scientific Oversight',
  heading_ka: 'სამეცნიერო საკონსულტაციო საბჭო',
  heading_en: 'Scientific Advisory Board',
  intro_ka:
    'ჩვენი საკონსულტაციო საბჭო აერთიანებს გამორჩეულ ექიმებსა და მკვლევარებს, რომლებიც უზრუნველყოფენ პროტოკოლების ვალიდაციას, მტკიცებულებებზე დაფუძნებულ შემოწმებას და კვლევით ზედამხედველობას. წევრები არ მონაწილეობენ პაციენტების მკურნალობაში — მათი როლი არის სამეცნიერო სიზუსტისა და ხარისხის უზრუნველყოფა.',
  intro_en:
    'Our advisory board brings together distinguished physicians and researchers who provide protocol validation, evidence-based review, and research oversight. Members do not treat patients directly — their role is to ensure scientific rigour and quality.',
  sectionGeorgianHeading_ka: 'საქართველოს მრჩევლები',
  sectionGeorgianHeading_en: 'Based in Georgia',
  sectionInternationalHeading_ka: 'საერთაშორისო მრჩევლები',
  sectionInternationalHeading_en: 'International Advisors',
  seoTitle_ka: 'სამეცნიერო საკონსულტაციო საბჭო — Longevity One',
  seoTitle_en: 'Scientific Advisory Board — Longevity One',
  seoDescription_ka:
    'გაიცანით Longevity One-ის სამეცნიერო საკონსულტაციო საბჭოს წევრები — ექიმები და მკვლევარები, რომლებიც უზრუნველყოფენ პროტოკოლების ვალიდაციას.',
  seoDescription_en:
    'Meet the members of the Longevity One Scientific Advisory Board — physicians and researchers providing protocol validation and oversight.',
}

// ─── Members (drafts — no consent, no photo) ─────────────────────────────────

interface MemberDraft {
  _id: string
  _type: 'advisoryBoardMember'
  name_ka: string
  name_en: string
  slug: { _type: 'slug'; current: string }
  credentials: string[]
  boardRole: 'chair' | 'vice-chair' | 'member'
  title_ka: string
  title_en: string
  affiliation_ka: string
  affiliation_en: string
  affiliationCountry: string
  isInternational: boolean
  expertise_ka: string[]
  expertise_en: string[]
  bio_ka: Block[]
  bio_en: Block[]
  profileUrl?: string
  order: number
  consentToPublicListing: boolean
}

const members: MemberDraft[] = [
  {
    _id: 'drafts.advisor-ketevan-shavliashvili',
    _type: 'advisoryBoardMember',
    name_ka: 'ქეთევან შავლიაშვილი',
    name_en: 'Ketevan Shavliashvili',
    slug: { _type: 'slug', current: 'ketevan-shavliashvili' },
    credentials: ['MD', 'MBA'],
    boardRole: 'chair',
    title_ka: 'საბჭოს თავმჯდომარე',
    title_en: 'Chair of the Advisory Board',
    affiliation_ka: 'Medea Health (ნიუ-იორკი) — დამფუძნებელი',
    affiliation_en: 'Medea Health (New York) — Founder',
    affiliationCountry: 'US',
    isInternational: true,
    expertise_ka: ['ციფრული ჯანდაცვა', 'პრევენციული მედიცინა', 'ხარისხის უზრუნველყოფა'],
    expertise_en: ['Digital Health', 'Preventive Medicine', 'Quality Assurance'],
    bio_ka: [
      paragraph(
        'ქეთევან შავლიაშვილი არის Medea Health-ის (ნიუ-იორკი) დამფუძნებელი და გამოცდილი ციფრული ჯანდაცვის ხელმძღვანელი. იგი აერთიანებს კლინიკურ ცოდნასა და სტარტაპ-ლიდერობას, რათა Longevity One-ის სამეცნიერო პროტოკოლები შეესაბამებოდეს საერთაშორისო სტანდარტებს.',
        'k1',
      ),
      paragraph(
        'საბჭოს თავმჯდომარის სტატუსით ის ხელმძღვანელობს მტკიცებულებებზე დაფუძნებული პოლიტიკის ჩამოყალიბებას და კვლევითი მიმართულებების ვალიდაციას.',
        'k2',
      ),
    ],
    bio_en: [
      paragraph(
        'Ketevan Shavliashvili is the Founder of Medea Health (New York) and an experienced leader in digital health. She combines clinical expertise with startup leadership to ensure Longevity One’s scientific protocols meet international standards.',
        'e1',
      ),
      paragraph(
        'As Chair of the Advisory Board, she leads evidence-based policy formation and validation of research directions.',
        'e2',
      ),
    ],
    order: 1,
    consentToPublicListing: false,
  },
  {
    _id: 'drafts.advisor-nino-nadiradze',
    _type: 'advisoryBoardMember',
    name_ka: 'ნინო ნადირაძე',
    name_en: 'Nino Nadiradze',
    slug: { _type: 'slug', current: 'nino-nadiradze' },
    credentials: ['MD'],
    boardRole: 'member',
    title_ka: 'საბჭოს წევრი',
    title_en: 'Board Member',
    affiliation_ka:
      'Diacor — დიაბეტის, ენდოკრინული და კარდიოპულმონური დაავადებების ცენტრი',
    affiliation_en:
      'Diacor — Center for Diabetes, Endocrine and Cardiopulmonary Diseases',
    affiliationCountry: 'GE',
    isInternational: false,
    expertise_ka: ['ენდოკრინოლოგია', 'მეტაბოლური დაავადებები', 'დიაბეტი'],
    expertise_en: ['Endocrinology', 'Metabolic Diseases', 'Diabetes'],
    bio_ka: [
      paragraph(
        'ნინო ნადირაძე არის Diacor-ის — დიაბეტის, ენდოკრინული და კარდიოპულმონური დაავადებების ცენტრის წამყვანი ექიმი. მისი მთავარი სამეცნიერო ინტერესია მეტაბოლური დარღვევების ადრეული გამოვლენა.',
        'k1',
      ),
    ],
    bio_en: [
      paragraph(
        'Nino Nadiradze is a leading physician at Diacor — Center for Diabetes, Endocrine and Cardiopulmonary Diseases. Her core research interest is the early detection of metabolic disorders.',
        'e1',
      ),
    ],
    order: 10,
    consentToPublicListing: false,
  },
  {
    _id: 'drafts.advisor-zviad-kipiani',
    _type: 'advisoryBoardMember',
    name_ka: 'ზვიად ყიფიანი',
    name_en: 'Zviad Kipiani',
    slug: { _type: 'slug', current: 'zviad-kipiani' },
    credentials: ['MD'],
    boardRole: 'member',
    title_ka: 'საბჭოს წევრი',
    title_en: 'Board Member',
    affiliation_ka: 'Jerarsi Clinic — კარდიოლოგიის დეპარტამენტის ხელმძღვანელი',
    affiliation_en: 'Jerarsi Clinic — Head of Cardiology Department',
    affiliationCountry: 'GE',
    isInternational: false,
    expertise_ka: ['კარდიოლოგია', 'პრევენციული კარდიოლოგია'],
    expertise_en: ['Cardiology', 'Preventive Cardiology'],
    bio_ka: [
      paragraph(
        'ზვიად ყიფიანი ხელმძღვანელობს Jerarsi Clinic-ის კარდიოლოგიის დეპარტამენტს და ფლობს მრავალწლიან გამოცდილებას გულსისხლძარღვთა დაავადებების მართვაში.',
        'k1',
      ),
    ],
    bio_en: [
      paragraph(
        'Zviad Kipiani heads the Cardiology Department at Jerarsi Clinic and has many years of experience in managing cardiovascular disease.',
        'e1',
      ),
    ],
    order: 20,
    consentToPublicListing: false,
  },
  {
    _id: 'drafts.advisor-giorgi-kvitaishvili',
    _type: 'advisoryBoardMember',
    name_ka: 'გიორგი კვიტაიშვილი',
    name_en: 'Giorgi Kvitaishvili',
    slug: { _type: 'slug', current: 'giorgi-kvitaishvili' },
    credentials: ['MD'],
    boardRole: 'member',
    title_ka: 'საბჭოს წევრი',
    title_en: 'Board Member',
    affiliation_ka:
      'თ. წერეთლის ინფექციური პათოლოგიის, შიდსისა და კლინიკური იმუნოლოგიის სამეცნიერო-პრაქტიკული ცენტრი',
    affiliation_en:
      'T. Tsertsvadze Scientific-Practical Center for Infectious Pathology, AIDS and Clinical Immunology',
    affiliationCountry: 'GE',
    isInternational: false,
    expertise_ka: ['ინფექციური დაავადებები', 'კლინიკური იმუნოლოგია'],
    expertise_en: ['Infectious Diseases', 'Clinical Immunology'],
    bio_ka: [
      paragraph(
        'გიორგი კვიტაიშვილი არის თ. წერეთლის ცენტრის წამყვანი სპეციალისტი ინფექციური დაავადებებისა და კლინიკური იმუნოლოგიის სფეროში.',
        'k1',
      ),
    ],
    bio_en: [
      paragraph(
        'Giorgi Kvitaishvili is a leading specialist in infectious diseases and clinical immunology at the T. Tsertsvadze Center.',
        'e1',
      ),
    ],
    profileUrl: 'https://aidscenter.ge/cv_ge_giorgi_kvitaishvili.php',
    order: 30,
    consentToPublicListing: false,
  },
]

async function seed(): Promise<void> {
  console.log(`Seeding advisoryBoardPage draft …`)
  await client.createOrReplace(advisoryBoardPageDraft)

  for (const member of members) {
    console.log(`Seeding draft: ${member.name_en}`)
    await client.createOrReplace(member)
  }

  console.log(`\n✅ Done. ${members.length} member drafts + 1 page draft created.`)
  console.log(
    `\n⚠️  Next steps for the clinic:\n` +
      `   1. Open Sanity Studio at /studio\n` +
      `   2. Review each bio and upload portraits with alt text\n` +
      `   3. Obtain written GDPR consent from each member\n` +
      `   4. Flip consentToPublicListing → true\n` +
      `   5. Publish each document\n`,
  )
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
