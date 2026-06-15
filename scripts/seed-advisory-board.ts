/**
 * Seed script — Advisory Board (full bilingual content, four founding members).
 *
 * - Creates / replaces 4 advisoryBoardMember DRAFTS (consentToPublicListing = false,
 *   no photos — clinic uploads via Studio).
 * - Patches the published advisoryBoardPage singleton with section headings and
 *   updated intro copy. Leaves eyebrow / heading / SEO fields untouched if set.
 * - Cleans up legacy draft IDs from the previous seed (advisor-{slug}) to avoid
 *   duplicates in the Studio document list.
 *
 * Run:  npx tsx --env-file=.env.local scripts/seed-advisory-board.ts
 * Requires SANITY_API_TOKEN with write permissions.
 *
 * Idempotent: re-running replaces drafts in place.
 */

import { createClient } from '@sanity/client'
import { randomUUID } from 'node:crypto'

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

// ─── Portable Text helpers ────────────────────────────────────────────────────

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

function block(text: string): Block {
  return {
    _type: 'block',
    _key: randomUUID(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: randomUUID(), text, marks: [] }],
  }
}

// ─── Page singleton patch ─────────────────────────────────────────────────────
// Patches the PUBLISHED singleton (not the draft). Eyebrow / heading / SEO are
// not touched — only intro + section headings are set.

const PAGE_SINGLETON_ID = 'advisoryBoardPage'

const pagePatch = {
  intro_ka:
    'Longevity One გახლავთ პრევენციული მედიცინის ცენტრი, რომელსაც გვერდში უდგას გამოცდილი საკონსულტაციო საბჭო — მულტიდისციპლინური გუნდი ქართველი და საერთაშორისო კომპეტენციის მქონე ექიმებისა, რომლებიც პაციენტთა კონსულტირებას ეწევიან, პროტოკოლების მეცნიერულ მტკიცებულებას ამოწმებენ და კლინიკის სამედიცინო ხედვას აყალიბებენ. პრეციზიული მედიცინა, ენდოკრინოლოგია, კარდიოლოგია, გასტროენტეროლოგია — საფუძველი დღეგრძელობის სამეცნიერო მიდგომისთვის.',
  intro_en:
    "Longevity One is supported by an experienced multidisciplinary advisory board — a team of Georgian and internationally credentialed physicians who consult on patient cases, validate the scientific evidence behind our protocols, and shape the clinic's medical direction. Precision medicine, endocrinology, cardiology, gastroenterology — the foundations of an evidence-based approach to longevity.",
  sectionGeorgianHeading_ka: 'ქართველი მრჩევლები',
  sectionGeorgianHeading_en: 'Based in Georgia',
  sectionInternationalHeading_ka: 'საერთაშორისო მრჩევლები',
  sectionInternationalHeading_en: 'International Advisors',
}

// ─── Members ─────────────────────────────────────────────────────────────────

interface PhotoStub {
  _type: 'image'
  alt_ka: string
  alt_en: string
}

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
  consentToPublicListing: false
  // photo intentionally omitted — clinic uploads via Studio.
  // photoAltSeed carries the alt strings for the checklist output.
  photoAltSeed: { alt_ka: string; alt_en: string }
}

const members: MemberDraft[] = [
  {
    _id: 'drafts.advisoryBoardMember.ketevan-shavliashvili',
    _type: 'advisoryBoardMember',
    name_ka: 'ქეთევან შავლიაშვილი',
    name_en: 'Ketevan Shavliashvili',
    slug: { _type: 'slug', current: 'ketevan-shavliashvili' },
    credentials: ['MD', 'MBA'],
    boardRole: 'member',
    title_ka: 'კლინიკური და სამეცნიერო მრჩეველი, საკონსულტაციო საბჭოს წევრი',
    title_en: 'Clinical & Scientific Advisor, Member of the Scientific Advisory Board',
    affiliation_ka: 'Medea Health (ნიუ-იორკი) — დამფუძნებელი',
    affiliation_en: 'Medea Health (New York) — Founder',
    affiliationCountry: 'US',
    isInternational: true,
    expertise_ka: [
      'პრეციზიული მედიცინა',
      'ფუნქციური მედიცინა',
      'ჰორმონალური ოპტიმიზაცია',
      'ეპიგენეტიკა',
      'ქალთა ჯანმრთელობა',
      'დღეგრძელობა',
    ],
    expertise_en: [
      'Precision Medicine',
      'Functional Medicine',
      'Hormone Optimization',
      'Epigenetics',
      "Women's Health",
      'Longevity',
    ],
    bio_ka: [
      block(
        'ექიმი-მკვლევარი და პრეციზიული ფუნქციური მედიცინის ექსპერტი 25-წლიანი საერთაშორისო კლინიკური გამოცდილებით. ფლობს აღმასრულებელი მაგისტრის (MBA) ხარისხს ჯანდაცვის მენეჯმენტში და ამჟამად არის დოქტორანტი კლინიკურ და ტრანსლაციურ მედიცინაში — ეს მას ეხმარება უახლესი სამეცნიერო კვლევების პრაქტიკულ მედიცინაში წარმატებით ტრანსლაციაში.',
      ),
      block(
        'მისი მთავარი სპეციალიზაციაა შუახნის ქალთა ჯანმრთელობა, ჰორმონალური ოპტიმიზაცია და ჯანმრთელი დაბერება. იგი არის ამერიკის ფუნქციური მედიცინის ინსტიტუტის (The US Institute for Functional Medicine — IFM) აქტიური წევრი და გავლილი აქვს IFM-ის სპეციალიზებული კლინიკური სერტიფიცირება ჰორმონალურ, იმუნო-მეტაბოლურ და ფუნქციური მედიცინის კლინიკურ პრაქტიკაში დანერგვის მოდულებში. მისი მიდგომა ასევე გამყარებულია ჰარვარდის სამედიცინო სკოლისა და პერსონალიზებული ცხოვრების სტილის ინსტიტუტის (PLMI) მოწინავე ტრენინგებით. არის ეპიგენეტიკის მკვლევარი და ნიუ-იორკული ციფრული ჯანმრთელობის პლატფორმის Medea Health-ის დამფუძნებელი. Longevity One-ის სამედიცინო გუნდს უწევს სტრატეგიულ და სამეცნიერო კონსულტაციას მსოფლიო დონის პერსონალიზებული, პრევენციული და Longevity პროტოკოლების შემუშავებაში.',
      ),
    ],
    bio_en: [
      block(
        'Physician-scientist and precision functional medicine expert with over 25 years of international clinical experience. Holds an Executive MBA in Healthcare Management and is currently a PhD candidate in Clinical and Translational Medicine — expertly bridging cutting-edge scientific research and practical patient care.',
      ),
      block(
        "Specialises in midlife women's health, hormone optimisation, and longevity. Her evidence-based approach is backed by advanced training from Harvard Medical School, the Institute for Functional Medicine (IFM), and the Personalized Lifestyle Medicine Institute (PLMI). An epigenetics researcher and founder of the New York-based digital health platform Medea Health, Dr. Shavliashvili provides high-level strategic and scientific guidance to the Longevity One medical team — helping shape world-class personalised, preventive, and longevity protocols.",
      ),
    ],
    order: 1,
    consentToPublicListing: false,
    photoAltSeed: {
      alt_ka:
        'ქეთევან შავლიაშვილი — კლინიკური და სამეცნიერო მრჩეველი, Longevity One-ის საკონსულტაციო საბჭოს წევრი',
      alt_en:
        'Ketevan Shavliashvili — Clinical & Scientific Advisor, Member of the Scientific Advisory Board at Longevity One',
    },
  },
  {
    _id: 'drafts.advisoryBoardMember.nino-nadiradze',
    _type: 'advisoryBoardMember',
    name_ka: 'ნინო ნადირაძე',
    name_en: 'Nino Nadiradze',
    slug: { _type: 'slug', current: 'nino-nadiradze' },
    credentials: ['MD'],
    boardRole: 'member',
    title_ka: 'ენდოკრინოლოგი, საკონსულტაციო საბჭოს წევრი',
    title_en: 'Endocrinologist, Scientific Advisory Board Member',
    affiliation_ka:
      'დიაკორი — დიაბეტის, ენდოკრინული და გულ-ფილტვის დაავადებების ცენტრი',
    affiliation_en:
      'Diacor — Center for Diabetes, Endocrine and Cardiopulmonary Diseases',
    affiliationCountry: 'GE',
    isInternational: false,
    expertise_ka: [
      'ენდოკრინოლოგია',
      'დიაბეტი',
      'ნუტრიციოლოგია',
      'ლიპიდოლოგია',
      'თირეოიდოლოგია',
    ],
    expertise_en: [
      'Endocrinology',
      'Diabetes',
      'Nutrition',
      'Lipidology',
      'Thyroidology',
    ],
    bio_ka: [
      block(
        'ექიმი ენდოკრინოლოგი 15+ წლიანი კლინიკური გამოცდილებით. სამედიცინო განათლება მიიღო აკადემიკოს ი. პავლოვის სახელობის სანკტ-პეტერბურგის სახელმწიფო სამედიცინო უნივერსიტეტში წარჩინების დიპლომით, კლინიკური ორდინატურა გაიარა ვ. ბარანოვის სახელობის ენდოკრინოლოგიის კათედრაზე. 2011 წლიდან მუშაობს კლინიკა „დიაკორში", ასევე ჰეპატოლოგიურ კლინიკა „ჰეპაში". გაიარა კვალიფიკაცია ნუტრიციოლოგიაში თბილისის სახელმწიფო სამედიცინო უნივერსიტეტში.',
      ),
      block(
        'წევრია ევროპის დიაბეტის შემსწავლელი ასოციაციის (EASD), ევროპის ენდოკრინოლოგთა საზოგადოების, ათეროსკლეროზის საერთაშორისო საზოგადოებისა და საქართველოს ენდოკრინოლოგიისა და მეტაბოლიზმის ასოციაციის (GAEM) ბორდისა და გაიდლაინების სარედაქციო კომიტეტის. წარდგენილი აქვს კვლევები IDF-ის მსოფლიო კონგრესებზე ვანკუვერსა და სხვა ქალაქებში. მთავარი მკვლევარია მრავალცენტრულ III ფაზის კლინიკურ კვლევებში.',
      ),
    ],
    bio_en: [
      block(
        'Endocrinologist with over 15 years of clinical experience. Graduated with honours from Pavlov State Medical University in Saint Petersburg and completed clinical residency at the Baranov Endocrinology Chair. Has practised at Diacor — Center for Diabetes, Endocrine and Cardiopulmonary Diseases since 2011, with additional appointments at the Hepa Hepatology Clinic. Holds a postgraduate qualification in nutrition from Tbilisi State Medical University.',
      ),
      block(
        'Member of the European Association for the Study of Diabetes (EASD), the European Society of Endocrinology, the International Atherosclerosis Society, and the Georgian Association of Endocrinology and Metabolism (GAEM) Board and Guidelines Committee. Has presented research at IDF World Diabetes Congresses including Vancouver. Principal Investigator in multicentre Phase III clinical trials.',
      ),
    ],
    order: 10,
    consentToPublicListing: false,
    photoAltSeed: {
      alt_ka: 'ნინო ნადირაძე — ენდოკრინოლოგი, Longevity One-ის საკონსულტაციო საბჭოს წევრი',
      alt_en:
        'Nino Nadiradze — endocrinologist and Scientific Advisory Board member at Longevity One',
    },
  },
  {
    _id: 'drafts.advisoryBoardMember.zviad-kipiani',
    _type: 'advisoryBoardMember',
    name_ka: 'ზვიად ყიფიანი',
    name_en: 'Zviad Kipiani',
    slug: { _type: 'slug', current: 'zviad-kipiani' },
    credentials: ['MD', 'PhD', 'MSc'],
    boardRole: 'member',
    title_ka: 'კარდიოლოგი, საკონსულტაციო საბჭოს წევრი',
    title_en: 'Cardiologist, Scientific Advisory Board Member',
    affiliation_ka: 'კლინიკა „ჯერარსი" — კარდიოლოგიური დეპარტამენტის ხელმძღვანელი',
    affiliation_en: 'Jerarsi Clinic — Head of Cardiology Department',
    affiliationCountry: 'GE',
    isInternational: false,
    expertise_ka: [
      'კარდიოლოგია',
      'გულის უკმარისობა',
      'ჯანდაცვის ეკონომიკა',
      'კლინიკური კვლევები',
    ],
    expertise_en: ['Cardiology', 'Heart Failure', 'Health Economics', 'Clinical Research'],
    bio_ka: [
      block(
        'კარდიოლოგი, მედიცინის დოქტორი (PhD), მაგისტრის ხარისხი ჯანდაცვის ეკონომიკასა და პოლიტიკაში ლონდონის ეკონომიკისა და პოლიტიკის სკოლიდან (LSE, 2016–2018). MD დიპლომი მიიღო თბილისის სახელმწიფო სამედიცინო უნივერსიტეტში 1993 წელს, შემდგომი სპეციალიზაცია გაიარა კარდიოლოგიაში — მათ შორის გულის უკმარისობის სპეციალიზებული კურსი ციურიხის საუნივერსიტეტო კლინიკაში (2013–2015).',
      ),
      block(
        '2023 წლიდან კლინიკა „ჯერარსის" კარდიოლოგიური დეპარტამენტის ხელმძღვანელია, აქამდე ხელმძღვანელობდა იმავე დეპარტამენტებს „ამერიკული ჰოსპიტალი თბილისსა" და „ნიუ ჰოსპიტალში". სამედიცინო ლიცენზია მიიღო 2002 წელს. გავლილი აქვს ICH/GCP ტრენინგი 2006 წლიდან მოყოლებული. მთავარი მკვლევარია მრავალცენტრულ III ფაზის კლინიკურ კვლევებში გულის უკმარისობის, შაქრიანი დიაბეტისა და თრომბოემბოლიის სფეროებში. 15 სამეცნიერო პუბლიკაციის ავტორი.',
      ),
    ],
    bio_en: [
      block(
        "Cardiologist with a PhD in medicine and a Master's degree in Health Economics and Policy from the London School of Economics (LSE, 2016–2018). Received his MD from Tbilisi State Medical University in 1993, followed by specialised postgraduate training in cardiology — including a Heart Failure programme at Zurich University Hospital (2013–2015).",
      ),
      block(
        'Since 2023, Head of the Cardiology Department at Jerarsi Clinic, having previously led the same departments at American Hospital Tbilisi and New Hospital. Medical license obtained in 2002; ICH/GCP-certified since 2006. Principal Investigator in multicentre Phase III clinical trials across heart failure, diabetes, and thromboembolism. Author of 15 peer-reviewed publications.',
      ),
    ],
    order: 20,
    consentToPublicListing: false,
    photoAltSeed: {
      alt_ka: 'ზვიად ყიფიანი — კარდიოლოგი, Longevity One-ის საკონსულტაციო საბჭოს წევრი',
      alt_en:
        'Zviad Kipiani — cardiologist and Scientific Advisory Board member at Longevity One',
    },
  },
  {
    _id: 'drafts.advisoryBoardMember.giorgi-kvitaishvili',
    _type: 'advisoryBoardMember',
    name_ka: 'გიორგი კვიტაიშვილი',
    name_en: 'Giorgi Kvitaishvili',
    slug: { _type: 'slug', current: 'giorgi-kvitaishvili' },
    credentials: ['MD', 'PhD'],
    boardRole: 'member',
    title_ka: 'გასტროენტეროლოგი, ჰეპატოლოგი, საკონსულტაციო საბჭოს წევრი',
    title_en: 'Gastroenterologist, Hepatologist, Scientific Advisory Board Member',
    affiliation_ka:
      'სს თ. ცერცვაძის სახელობის ინფექციური პათოლოგიის, შიდსისა და კლინიკური იმუნოლოგიის სამეცნიერო-პრაქტიკული ცენტრი',
    affiliation_en:
      'T. Tsertsvadze Scientific-Practical Center for Infectious Pathology, AIDS and Clinical Immunology',
    affiliationCountry: 'GE',
    isInternational: false,
    expertise_ka: ['გასტროენტეროლოგია', 'ჰეპატოლოგია', 'ინფექციური დაავადებები'],
    expertise_en: ['Gastroenterology', 'Hepatology', 'Infectious Diseases'],
    bio_ka: [
      block(
        'გასტროენტეროლოგი და ჰეპატოლოგი, მედიცინის დოქტორი, 40 წელზე მეტი კლინიკური გამოცდილებით. სამედიცინო განათლება მიიღო თბილისის სახელმწიფო სამედიცინო ინსტიტუტში (1978–1984), სპეციალიზებული გასტროენტეროლოგიასა და ჰეპატოლოგიაში. 1984 წლიდან დღემდე მუშაობს სს თენგიზ ცერცვაძის სახელობის ინფექციური პათოლოგიის, შიდსისა და კლინიკური იმუნოლოგიის სამეცნიერო-პრაქტიკული ცენტრში — ცენტრის ამბულატორიულ დეპარტამენტში. წევრია საქართველოს ინფექციურ და ტროპიკულ დაავადებათა ასოციაციის. სპეციალიზაცია მოიცავს ღვიძლის ქრონიკული დაავადებების, ვირუსული ჰეპატიტებისა და კუჭ-ნაწლავის ტრაქტის პათოლოგიების მართვას.',
      ),
    ],
    bio_en: [
      block(
        "Gastroenterologist and hepatologist with a doctorate in medicine and over 40 years of clinical experience. Graduated from Tbilisi State Medical Institute (1978–1984) with specialisation in gastroenterology and hepatology. Has worked since 1984 at the T. Tsertsvadze Scientific-Practical Center for Infectious Pathology, AIDS and Clinical Immunology — in the centre's ambulatory department. Member of the Georgian Association of Infectious and Tropical Diseases. His expertise covers the management of chronic liver disease, viral hepatitis, and gastrointestinal pathology — particularly relevant to longevity protocols involving metabolic and hepatic biomarkers.",
      ),
    ],
    profileUrl: 'https://aidscenter.ge/cv_ge_giorgi_kvitaishvili.php',
    order: 30,
    consentToPublicListing: false,
    photoAltSeed: {
      alt_ka:
        'გიორგი კვიტაიშვილი — გასტროენტეროლოგი და ჰეპატოლოგი, Longevity One-ის საკონსულტაციო საბჭოს წევრი',
      alt_en:
        'Giorgi Kvitaishvili — gastroenterologist and hepatologist, Scientific Advisory Board member at Longevity One',
    },
  },
]

// IDs from the previous seed run that should be removed to avoid duplicates.
const LEGACY_DRAFT_IDS = [
  'drafts.advisor-ketevan-shavliashvili',
  'drafts.advisor-nino-nadiradze',
  'drafts.advisor-zviad-kipiani',
  'drafts.advisor-giorgi-kvitaishvili',
]

async function seed(): Promise<void> {
  // 1. Patch the published page singleton (preserves eyebrow/heading/SEO).
  console.log(`Patching page singleton: ${PAGE_SINGLETON_ID}`)
  await client
    .patch(PAGE_SINGLETON_ID)
    .set(pagePatch)
    .commit()
    .catch(async (err: unknown) => {
      // If the published singleton does not exist (e.g. fresh dataset), create it.
      const errMsg = err instanceof Error ? err.message : String(err)
      if (errMsg.includes('does not exist') || errMsg.includes('No document')) {
        console.log('  → singleton missing, creating it with patch values + defaults')
        await client.createOrReplace({
          _id: PAGE_SINGLETON_ID,
          _type: 'advisoryBoardPage',
          eyebrow_ka: 'სამეცნიერო ზედამხედველობა',
          eyebrow_en: 'Scientific Oversight',
          heading_ka: 'სამეცნიერო საკონსულტაციო საბჭო',
          heading_en: 'Scientific Advisory Board',
          ...pagePatch,
        })
      } else {
        throw err
      }
    })

  // 2. Remove legacy draft IDs from the previous seed.
  for (const legacyId of LEGACY_DRAFT_IDS) {
    await client.delete(legacyId).catch(() => null)
  }
  console.log(`Cleaned up ${LEGACY_DRAFT_IDS.length} legacy draft IDs.`)

  // 3. Create / replace member drafts. Strip photoAltSeed before writing — it's
  //    metadata for the operator checklist, not a real schema field.
  for (const member of members) {
    const { photoAltSeed: _unused, ...doc } = member
    void _unused
    console.log(`Seeding draft: ${doc.name_en}  (${doc._id})`)
    await client.createOrReplace(doc)
  }

  console.log(`\n✅ Done. 1 page singleton patched. ${members.length} member drafts written.`)
  console.log(`\n⚠️  Per-member checklist (clinic must complete each before publishing):\n`)
  for (const m of members) {
    console.log(`  • ${m.name_en} (${m.boardRole}) — ${m._id}`)
    console.log(`     ☐ Upload portrait photo`)
    console.log(`     ☐ Set photo.alt_ka  →  ${m.photoAltSeed.alt_ka}`)
    console.log(`     ☐ Set photo.alt_en  →  ${m.photoAltSeed.alt_en}`)
    console.log(`     ☐ Review bio for accuracy with the advisor`)
    console.log(`     ☐ Sign GDPR consent form, archive in clinic records`)
    console.log(`     ☐ Flip consentToPublicListing → true`)
    console.log(`     ☐ Publish from drafts`)
    console.log('')
  }
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
