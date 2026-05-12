/**
 * Seed the 3 current team members into Sanity.
 *
 * Usage: npx tsx scripts/seed-team-members.ts
 *
 * Deterministic _id values are used so re-running this script updates
 * the same documents instead of creating duplicates. Photos are NOT
 * uploaded here — upload them via Sanity Studio (Team Member → Photo).
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-11-01'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
if (!token) throw new Error('Missing SANITY_API_TOKEN')

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

// Note: the schema declares bio as portable text (block array). The frontend
// TeamMember type and rendering treat it as a plain string. We store it as
// a plain string to match what the UI actually expects today; the Studio
// will show a soft validation note but the data renders correctly.
const members = [
  {
    _id: 'teamMember-pati-gabunia',
    _type: 'teamMember',
    name: 'ფატი გაბუნია',
    name_en: 'Pati Gabunia, MD, PhD',
    role_ka: 'ინფექციონისტი, პროფესორი',
    role_en: 'Infectious Disease Specialist, Professor',
    tagline_ka: 'იმუნური სისტემის ღრმა ცოდნა, დღეგრძელობის საფუძველი.',
    tagline_en: 'A deep mastery of the immune system, the foundation of longevity.',
    bio_ka:
      'მედიცინის დოქტორი, პროფესორი, 26-წლიანი კლინიკური და სამეცნიერო გამოცდილებით. თ. ცერცვაძის შიდსისა და კლინიკური იმუნოლოგიის ცენტრის სტაციონარული განყოფილების გამგე. ჯანმოს 4 გაიდლაინის თანაავტორი, 60-ზე მეტი სამეცნიერო პუბლიკაცია. ტრენინგი გავლილი აშშ-სა და ევროპაში, ალაბამა, ზალცბურგი, მონპელიე. საქართველოს ჯანდაცვის სამინისტროს ექსპერტი ინფექციური დაავადებების სფეროში. EACS, IAS და EASL-ის წევრი.',
    bio_en:
      'MD, PhD, Professor with 26 years of clinical, academic and research experience. Head of the Inpatient HIV/AIDS Department at the T. Tsertsvadze Center. Co-author of four WHO clinical guidelines and more than 60 peer-reviewed publications. Trained at the universities of Alabama, Salzburg and Montpellier. National expert at the Georgian Ministry of Health. Member of EACS, IAS and EASL.',
    isFounder: true,
    order: 2,
    credentials: ['MD', 'PhD'],
  },
  {
    _id: 'teamMember-saba-janiashvili',
    _type: 'teamMember',
    name: 'საბა ჯანიაშვილი',
    name_en: 'Saba Janiashvili',
    role_ka: 'ექიმი',
    role_en: 'Physician',
    tagline_ka: 'ამერიკული სამედიცინო სტანდარტი, ქართულ ნიადაგზე.',
    tagline_en: 'American medical standards, applied on Georgian ground.',
    bio_ka:
      'დავით ტვილდიანის სამედიცინო უნივერსიტეტის კურსდამთავრებული. სამივე საფეხურის USMLE სერტიფიცირებული ექიმი, აშშ-ის სამედიცინო ლიცენზირების ექვივალენტი. კლინიკური დაკვირვება გავლილი MedStar Washington Hospital Center-სა და Sentara Norfolk General Hospital-ში. 2021 წლიდან მუშაობს თ. ცერცვაძის ინფექციური პათოლოგიის ცენტრში, სადაც ხელმძღვანელობს რთული შემთხვევების ინტენსიურ მართვას. სიზუსტეზე ორიენტირებული, თანამედროვე გენერაციის კლინიცისტი.',
    bio_en:
      'Graduate of David Tvildiani Medical University. USMLE-certified across all three steps, the United States medical licensing equivalent. Clinical observerships at MedStar Washington Hospital Center and Sentara Norfolk General Hospital. Since 2021 at the T. Tsertsvadze Center for Infectious Pathology, where he leads intensive management of complex cases. A precision-focused, next-generation clinician.',
    isFounder: false,
    order: 1,
    credentials: ['MD', 'USMLE'],
  },
  {
    _id: 'teamMember-marina-gorgidze',
    _type: 'teamMember',
    name: 'მარინა გორგიძე',
    name_en: 'Marina Gorgidze',
    role_ka: 'კონსიერჟ მენეჯერი',
    role_en: 'Concierge Manager',
    tagline_ka: 'ექიმი, რომელიც გხვდებათ კარებთან.',
    tagline_en: 'A physician who greets you at the door.',
    bio_ka:
      'მეან-გინეკოლოგი და სამედიცინო ექსპერტი, რომელმაც ორი ათეული წელი მიუძღვნა საქართველოში მოწინავე მედიცინის დანერგვას. Roche-ის სამედიცინო კონსულტანტის რანგში ხელმძღვანელობდა ონკოლოგიური სიზუსტის მედიცინისა და Foundation Medicine-ის გენომური პროფილირების პროგრამის შემოყვანას ქვეყანაში. სამედიცინო სრულყოფის სერტიფიკატი ციურიხიდან. Longevity One-ში მარინა არის თქვენი პირადი კავშირი ექიმთა გუნდთან, დისკრეცია, სიზუსტე და ყურადღება ყოველი დეტალისადმი.',
    bio_en:
      'An OB-GYN and medical expert who has spent two decades bringing world-class medicine into Georgia. As Medical Consultant at Roche, she led the introduction of precision oncology and the Foundation Medicine genomic profiling programme into the country. Holds a Medical Excellence certification from Zürich. At Longevity One, Marina is your personal link to the physician team, discretion, precision and attention to every detail.',
    isFounder: false,
    order: 2,
    credentials: ['MD'],
  },
]

async function run() {
  console.log(`Seeding ${members.length} team members into Sanity...`)
  for (const m of members) {
    await client.createOrReplace(m)
    console.log(`  ✓ ${m._id}`)
  }
  console.log('Done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
