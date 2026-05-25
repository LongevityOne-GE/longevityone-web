/**
 * Populate fullBio_ka, fullBio_en, pullQuote_ka, pullQuote_en on the three
 * existing teamMember docs. Idempotent: re-running overwrites the same fields.
 *
 * Usage: npx tsx scripts/patch-team-fullbio.ts
 */
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { randomUUID } from 'crypto'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-11-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

/** Build a Portable Text block from a paragraph string. */
function block(text: string) {
  return {
    _type: 'block',
    _key: randomUUID().replace(/-/g, '').slice(0, 12),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: randomUUID().replace(/-/g, '').slice(0, 12),
        text,
        marks: [],
      },
    ],
  }
}

interface MemberPatch {
  id: string
  pullQuote_ka: string
  pullQuote_en: string
  fullBio_ka: string[]
  fullBio_en: string[]
}

const members: MemberPatch[] = [
  {
    id: 'teamMember-pati-gabunia',
    pullQuote_ka: 'იმუნური სისტემის ღრმა ცოდნა - დღეგრძელობის საფუძველი',
    pullQuote_en: 'A deep mastery of the immune system, the foundation of longevity',
    fullBio_ka: [
      'პროფესორი პატი გაბუნია არის ინფექციური დაავადებების სპეციალისტი 26-წლიანი კლინიკური, აკადემიური და სამეცნიერო გამოცდილებით. დაამთავრა თბილისის სახელმწიფო სამედიცინო უნივერსიტეტი წარჩინებით (1995), გაიარა სპეციალიზაცია ინფექციურ დაავადებებში თბილისის სამედიცინო აკადემიაში, 2007 წელს დაიცვა მედიცინის დოქტორის (PhD) ხარისხი.',
      '2006 წლიდან ხელმძღვანელობს თ. ცერცვაძის სახელობის ინფექციური პათოლოგიის, შიდსისა და კლინიკური იმუნოლოგიის ცენტრის #1 სტაციონარულ განყოფილებას. სამედიცინო ცოდნა გაიღრმავა წამყვან საერთაშორისო ცენტრებში - ბირმინგემი (აშშ, 2001), სალცბურგი (ავსტრია, 2005), მონპელიე (საფრანგეთი, 2008) და სხვა. პროფესორია გრიგოლ რობაქიძის სახელობის უნივერსიტეტის მედიცინის ფაკულტეტზე, ხელმძღვანელობს თსუ-ს მედიცინის ფაკულტეტის რეზიდენტურის აივ/შიდსის მოდულს.',
      'არის საქართველოს ოკუპირებული ტერიტორიებიდან იძულებით გადაადგილებულ პირთა, შრომის, ჯანმრთელობისა და სოციალური დაცვის სამინისტროს ექსპერტი-ინფექციონისტი. ჯანდაცვის მსოფლიო ორგანიზაციის ევროპული რეგიონის კლინიკური პროტოკოლების შემუშავებელი პანელის წევრია 2011 წლიდან. თანაავტორია 4 აივ/შიდსზე შექმნილი ჯანმოს კლინიკური გაიდლაინისა და 15-მდე ეროვნული გაიდლაინისა - მათ შორის ანტირეტროვირუსული თერაპიის, ლატენტური ტუბერკულოზის, ოპორტუნისტული ინფექციებისა და ვირუსული ჰეპატიტების სფეროებში.',
      '60-ზე მეტი სამეცნიერო პუბლიკაციის ავტორი რეცენზირებად ჟურნალებში, რეგულარულად მონაწილეობს საერთაშორისო კონფერენციებში პრეზენტაციებითა და მოდერაციით - EACS, ECCMID, CROI, IAS. წევრია ევროპის შიდსის კლინიკური საზოგადოების (EACS), ღვიძლის შესწავლის ევროპული ასოციაციის (EASL), შიდსის საერთაშორისო საზოგადოების (IAS) და ECCMID-ის. Longevity One-ში მისი ექსპერტიზა აერთიანებს იმუნოლოგიის, მეტაბოლური და ღვიძლის ჯანმრთელობის სიღრმისეულ ცოდნას - დღეგრძელობის სამეცნიერო საფუძველს.',
    ],
    fullBio_en: [
      'Professor Pati Gabunia is an infectious disease specialist with 26 years of clinical, academic, and research experience. She graduated with honours from Tbilisi State Medical University (1995), completed her specialist training in infectious diseases at the Tbilisi State Medical Academy, and was awarded her PhD in Medicine in 2007.',
      "Since 2006, she has led Inpatient Department No. 1 at the T. Tsertsvadze Center for Infectious Pathology, AIDS and Clinical Immunology - Georgia's national reference institution for HIV care. She has trained at leading international centres including the University of Alabama at Birmingham (2001), the University of Salzburg (2005), and the University of Montpellier (2008). Professor at the Faculty of Medicine, Grigol Robakidze University, and head of the HIV/AIDS module of the residency programme at Ivane Javakhishvili Tbilisi State University.",
      "National infectious diseases expert at Georgia's Ministry of IDPs, Labour, Health and Social Protection. Member of the WHO European Region clinical protocol panel since 2011. Co-author of four WHO clinical guidelines in HIV/AIDS and up to 15 national guidelines - covering antiretroviral therapy, latent tuberculosis, opportunistic infections, and viral hepatitis.",
      'Author of over 60 peer-reviewed scientific publications, with regular oral and poster presentations at international conferences including EACS, ECCMID, CROI, and IAS. Member of the European AIDS Clinical Society (EACS), the European Association for the Study of the Liver (EASL), the International AIDS Society (IAS), and ECCMID. At Longevity One, her expertise brings deep knowledge of immunology, metabolic and hepatic health - foundational to evidence-based longevity medicine.',
    ],
  },
  {
    id: 'teamMember-saba-janiashvili',
    pullQuote_ka: 'ამერიკული სამედიცინო სტანდარტები, ქართულ მიწაზე გამოყენებული',
    pullQuote_en: 'American medical standards, applied on Georgian ground',
    fullBio_ka: [
      'ექიმი, დავით ტვილდიანის სამედიცინო უნივერსიტეტის (DTMU) MD ePBL პროგრამის კურსდამთავრებული (2015-2021). სრულად სერტიფიცირებულია აშშ-ის სამედიცინო ლიცენზიის (USMLE) სამივე საფეხურზე - STEP 1 (2023), STEP 2 (2024), STEP 3 (2024). ეს კვალიფიკაცია მას აშშ-ის ექიმთა სტანდარტის ექვივალენტურ მზადყოფნას ანიჭებს.',
      '2021 წლიდან მუშაობს თ. ცერცვაძის სახელობის ინფექციური პათოლოგიის, შიდსისა და კლინიკური იმუნოლოგიის სამეცნიერო-პრაქტიკული ცენტრში უმცროსი ექიმის პოზიციაზე - ხელმძღვანელობს რთული შემთხვევების ინტენსიურ მართვას, ასრულებს ინტენსიური თერაპიის რთულ პროცედურებს (ინტუბაცია, ცენტრალური ვენის კათეტერი) უსაფრთხოების უმაღლესი სტანდარტების დაცვით. COVID-19-ის პანდემიის პერიოდში მუშაობდა რუხის რესპუბლიკურ საავადმყოფოში კრიტიკული მოვლის ექთნად (2020-2021).',
      'სამედიცინო ცოდნა გაიღრმავა საერთაშორისო ობზერვერშიფებზე აშშ-ში: MedStar Washington Hospital Center (2024) და Sentara Norfolk General Hospital, ვირჯინია (2017). ფლობს ქართულსა და ინგლისურს. Longevity One-ში მისი მიდგომა ერთიანდება საერთაშორისო ბაზებში ნასწავლი პრეციზიული კლინიკური სტანდარტებითა და ცერცვაძის ცენტრის რთული შემთხვევების მართვაში დახვეწილი გამოცდილებით - სრულყოფილი მზადყოფნა მტკიცებულებაზე დაფუძნებული, ახალი თაობის სამედიცინო პრაქტიკისთვის.',
    ],
    fullBio_en: [
      'Graduate of the MD ePBL programme at David Tvildiani Medical University (DTMU), 2015-2021. Fully certified across all three steps of the United States Medical Licensing Examination - USMLE STEP 1 (2023), STEP 2 (2024), and STEP 3 (2024) - placing him at the American physician standard.',
      'Since 2021, junior physician at the T. Tsertsvadze Scientific-Practical Center for Infectious Pathology, AIDS and Clinical Immunology. There he leads intensive management of complex infectious disease cases, performs advanced ICU procedures (intubation, central venous catheter placement) under the highest safety protocols, and develops treatment plans for HIV/AIDS and immunological disorders. During the COVID-19 pandemic he provided critical care as a nurse at Rukhi Republican Hospital (2020-2021), managing ventilated patients and infection control protocols.',
      "Has deepened his clinical training through international observerships in the United States: MedStar Washington Hospital Center, Washington D.C. (2024) and Sentara Norfolk General Hospital, Virginia (2017). Fluent in Georgian and English. At Longevity One, he combines internationally trained precision standards with hands-on experience managing complex cases at Georgia's national infectious disease centre - a next-generation clinician built for evidence-based, modern medicine.",
    ],
  },
  {
    id: 'teamMember-marina-gorgidze',
    pullQuote_ka: 'ექიმი, რომელიც კარს თვითონ გხვდებათ',
    pullQuote_en: 'A physician who greets you at the door',
    fullBio_ka: [
      'მეან-გინეკოლოგი და სამედიცინო ექსპერტი ორი ათეული წლის გამოცდილებით - საქართველოში მსოფლიო დონის მედიცინის დანერგვის წამყვანი ფიგურა. დაამთავრა თბილისის სახელმწიფო სამედიცინო უნივერსიტეტი წარჩინებით (1995), მიიღო სახელმწიფო სერტიფიკატი მეანობა-გინეკოლოგიაში 1999 წელს.',
      'კარიერა დაიწყო კ. ჩაჩავას სახელობის სამეანო-გინეკოლოგიის სამეცნიერო-კვლევით ინსტიტუტში (1996-1998), შემდეგ მეან-გინეკოლოგად მუშაობდა თბილისის სამშობიარო სახლში „აკვინი" (2000-2004). 2005 წლიდან მუშაობს Roche-სთან საქართველოში - დაიწყო ცხელი ხაზის ოპერატორის პოზიციიდან და გავიდა შპს Roche Georgia-ს სამედიცინო კონსულტანტის როლამდე.',
      '2019-2021 წლებში პასუხისმგებელი იყო Foundation Medicine-ის გენომური პროფილირების ტესტირების საქართველოში დანერგვაზე - სრულყოფილი გენომური პროფილირების (CGP) კულტურის ჩამოყალიბება ონკოლოგიურ პრაქტიკაში. 2016 წელს გაიარა Medical Excellence ტრენინგ-კურსი ციურიხში (შვეიცარია), იმავე წელს მოიპოვა ბიოტექნოლოგიების და ბიოსიმილარების ექსპერტის სტატუსი.',
      'ხელმძღვანელობს მრავალ ფაუნდეიშენ-პროექტს: გვერდითი მოვლენების შეტყობინების კულტურის ამაღლება ფარმაკოზედამხედველობაში (327%-იანი ზრდა), Tecentriq + Avastin-ის როგორც მკურნალობის სტანდარტის დანერგვა არაოპერაბელური ჰეპატოცელულური კარცინომის შემთხვევაში. ფლობს ქართულს (მშობლიური), ინგლისურს და რუსულს თავისუფლად. Longevity One-ში მარინა გახლავთ თქვენი პერსონალური კავშირი ექიმთა გუნდთან - დისკრეცია, სიზუსტე და ყურადღება ყოველი დეტალის მიმართ.',
    ],
    fullBio_en: [
      'An OB-GYN and medical expert with two decades of experience bringing world-class medicine into Georgia. She graduated with honours from Tbilisi State Medical University in 1995 and earned her state certification in obstetrics and gynaecology in 1999.',
      'She began her career as a resident physician at the K. Chachava Research Institute of Obstetrics and Gynaecology (1996-1998), then practised as an OB-GYN at the Akvini maternity hospital in Tbilisi (2000-2004). Since 2005 she has been with Roche in Georgia - beginning as a hotline operator and rising to the role of Medical Consultant at Roche Georgia.',
      "Between 2019 and 2021, she led the introduction of Foundation Medicine's comprehensive genomic profiling (CGP) testing in Georgia - building the country's CGP culture in oncology practice from the ground up. In 2016 she completed the Medical Excellence Training Course in Zürich, Switzerland, and earned certification as a biotechnology and biosimilars expert that same year.",
      'She has led multiple landmark Roche projects: raising the pharmacovigilance reporting culture (a 327% increase in adverse event reporting), and establishing Tecentriq + Avastin as the standard of care for unresectable hepatocellular carcinoma in Georgia. Fluent in Georgian (native), English, and Russian. At Longevity One, Marina is your personal link to the physician team - discretion, precision, and attention to every detail.',
    ],
  },
]

async function main() {
  for (const m of members) {
    await client
      .patch(m.id)
      .set({
        pullQuote_ka: m.pullQuote_ka,
        pullQuote_en: m.pullQuote_en,
        fullBio_ka: m.fullBio_ka.map(block),
        fullBio_en: m.fullBio_en.map(block),
      })
      .commit()
    console.log(`  ✓ ${m.id}`)
  }
  console.log(`\nDone. Patched ${members.length} team members.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
