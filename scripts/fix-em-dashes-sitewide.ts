/**
 * One-off: remove every em dash (—) from live website content in Sanity.
 * House style rule: no em dashes anywhere on the site. Each occurrence is
 * rewritten with the punctuation that reads most naturally in context
 * (colon for label/definition pairs, comma for asides, period for
 * independent clauses, parentheses for appositives) rather than a blind
 * find-and-replace.
 *
 * Run: tsx --env-file=.env.local scripts/fix-em-dashes-sitewide.ts
 */
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'icuuryo0'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN
if (!token) { console.error('✗ SANITY_API_TOKEN not set'); process.exit(1) }

const client = createClient({ projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false })

const patches: Array<{ id: string; set: Record<string, string> }> = [
  {
    id: '3143d507-98c1-4661-9093-1040673ba598',
    set: {
      'answer_ka[0].children[0].text':
        'ეს არის ჩვენი სტრატეგიული სერვისი: კომპლექსური კვლევა, რომელიც პაციენტს აძლევს სიცოცხლის გახანგრძლივების მეცნიერულად დასაბუთებულ რუკას. ის აერთიანებს თქვენს მეტაბოლურ, ეპიგენეტიკურ და გენეტიკურ მონაცემებს პერსონალიზებული სამოქმედო გეგმის შესაქმნელად.',
    },
  },
  {
    id: '594a9d84-29fa-4da7-b9e7-19022ac952ff',
    set: {
      'answer_ka[2].children[1].text':
        ' IHHT პირდაპირ მოქმედებს მიტოქონდრიებზე: თქვენი უჯრედების „ელექტროსადგურებზე“. პროცესის დროს ხდება ძველი, დაზიანებული მიტოქონდრიების განადგურება და მათი ჩანაცვლება ახალი, ჯანსაღი და მაღალპროდუქტიული მიტოქონდრიებით.',
    },
  },
  {
    id: 'cc9f2c05-039a-4215-aad1-15140ec2cb46',
    set: {
      'answer_en[2].children[3].text':
        ' provides a roadmap for your training. It allows us to strengthen your cardiovascular system: the foundation of sustained energy levels and life extension.',
    },
  },
  {
    id: 'fc999209-6a17-4980-9a60-5fb04db1d6db',
    set: {
      'answer_en[1].children[3].text':
        ': the exact number of calories your body burns to maintain vital functions. By identifying your primary fuel source (fats vs. carbohydrates), we can design a nutrition strategy that optimizes energy production and enhances ',
      'answer_ka[1].children[1].text':
        ' ეს მაჩვენებელი განსაზღვრავს თქვენს „მეტაბოლურ ბაზისს“: კალორიების იმ ზუსტ რაოდენობას, რომელსაც თქვენი სხეული სასიცოცხლო ფუნქციების შესასრულებლად წვავს. ტესტირება ადგენს ენერგიის ძირითად წყაროს (ცხიმები თუ ნახშირწყლები), რაც საშუალებას გვაძლევს შევადგინოთ კვების ინდივიდუალური სტრატეგია მეტაბოლური მოქნილობისა და ენერგიის ოპტიმიზაციისთვის.',
    },
  },
  {
    id: 'aboutPage-singleton',
    set: {
      seo_description_ka:
        'Longevity One: ინოვაციური პრევენციული მედიცინის ცენტრი, დაარსებული ხუთი ქართველი ექიმის მიერ. ჩვენი მიზანია ადამიანის ბიოლოგიური პოტენციალის მაქსიმიზაცია.',
      seo_title_ka: 'ჩვენს შესახებ: ხუთი ექიმის ხედვა',
    },
  },
  {
    id: 'addon-enbiosis',
    set: {
      tagline_en: 'Biological age test, including US shipping and the cost of the test.',
      tagline_ka: 'ბიოლოგიური ასაკის ტესტი, რომელიც მოიცავს აშშ-ში ტრანსპორტირებისა და ტესტის ღირებულებას.',
    },
  },
  {
    id: 'advisoryBoardMember-ketevan-shavliashvili',
    set: {
      'bio_ka[0].children[0].text':
        'ექიმი-მკვლევარი და პრეციზიული ფუნქციური მედიცინის ექსპერტი 25-წლიანი საერთაშორისო კლინიკური გამოცდილებით. ფლობს აღმასრულებელი მაგისტრის (MBA) ხარისხს ჯანდაცვის მენეჯმენტში და ამჟამად არის დოქტორანტი კლინიკურ და ტრანსლაციურ მედიცინაში. ეს მას ეხმარება უახლესი სამეცნიერო კვლევების პრაქტიკულ მედიცინაში წარმატებით ტრანსლაციაში.',
      'bio_ka[1].children[0].text':
        'მისი მთავარი სპეციალიზაციაა შუახნის ქალთა ჯანმრთელობა, ჰორმონალური ოპტიმიზაცია და ჯანმრთელი დაბერება. იგი არის ამერიკის ფუნქციური მედიცინის ინსტიტუტის (The US Institute for Functional Medicine, IFM) აქტიური წევრი და გავლილი აქვს IFM-ის სპეციალიზებული კლინიკური სერტიფიცირება ჰორმონალურ, იმუნო-მეტაბოლურ და ფუნქციური მედიცინის კლინიკურ პრაქტიკაში დანერგვის მოდულებში. მისი მიდგომა ასევე გამყარებულია ჰარვარდის სამედიცინო სკოლისა და პერსონალიზებული ცხოვრების სტილის ინსტიტუტის (PLMI) მოწინავე ტრენინგებით. არის ეპიგენეტიკის მკვლევარი და ნიუ-იორკული ციფრული ჯანმრთელობის პლატფორმის Medea Health-ის დამფუძნებელი. Longevity One-ის სამედიცინო გუნდს უწევს სტრატეგიულ და სამეცნიერო კონსულტაციას მსოფლიო დონის პერსონალიზებული, პრევენციული და Longevity პროტოკოლების შემუშავებაში.',
    },
  },
  {
    id: 'blogPost-biological-age',
    set: {
      'body_ka[11].children[0].text':
        'ორ ადამიანს, რომელთაც იდენტური ბიოლოგიური ასაკი აქვთ, შესაძლოა დაბერების რადიკალურად განსხვავებული სისწრაფე ახასიათებდეთ, და სწორედ ეს ტემპი განსაზღვრავს მათ ფიზიკურ მდგომარეობას ეხლაც და ათი წლის შემდეგ.',
      'body_ka[14].children[0].text':
        'ამ დისბალანსის გამომწვევი ფაქტორები მეცნიერულად კარგად არის შესწავლილი. ძილის ქრონიკული დეფიციტი, ხანგრძლივი ფსიქოლოგიური სტრესი, არასათანადო კვება, ფიზიკური აქტივობის ნაკლებობა და ჭარბი ვისცერული ცხიმი (შიდა ორგანოების ირგვლივ არსებული ცხიმი). ყოველივე ეს აჩქარებს ბიოლოგიურ დაბერებას. საპირისპიროდ, რეგულარული აერობული ვარჯიში, აღდგენითი ძილი, ნატურალური პროდუქტებით კვება, სტრესის ეფექტური მართვა და მყარი სოციალური ურთიერთობები სტაბილურად ასოცირდება უფრო ნელ ეპიგენეტიკურ დაბერებასთან.',
      seoDescription_ka:
        'თქვენი დაბადების წელი თქვენი სიცოცხლის ხანგრძლივობაზე თითქმის არაფერს ამბობს. ის, რაც ნამდვილად მნიშვნელოვანია: სხვა რამეა.',
    },
  },
  {
    id: 'blogPost-traditional-diets',
    set: {
      'body_ka[4].children[1].text':
        ': კალორიების ის რაოდენობაა, რომელსაც ორგანიზმი წვავს მოსვენების მდგომარეობაში სასიცოცხლო ფუნქციების შესანარჩუნებლად. ის შეადგენს თქვენი ყოველდღიური ენერგო დანახარჯების 60-დან 75 პროცენტს. ეს მაჩვენებელი ინდივიდებს შორის დრამატულად ვარირებს. ორ ადამიანს, რომელთაც აქვთ იდენტური სიმაღლე, წონა და ასაკი, შესაძლოა ჰქონდეთ მოსვენების მეტაბოლიზმი, რომელიც დღეში 300-დან 500 კალორიამდე სხვაობას იძლევა. ეს ერთი სრულფასოვანი კვების ეკვივალენტია. დიეტის გეგმა, რომელიც ერთისთვის იდეალურია, მეორეს ან ქრონიკულ შიმშილში ამყოფებს, ან ვერ უზრუნველყოფს საკმარის დატვირთვას.',
      seoDescription_ka:
        'პრობლემა ნებისყოფაში არ არის: დიეტების უმეტესობა თქვენს ინდივიდუალურ მეტაბოლიზმს სრულიად უგულებელყოფს.',
    },
  },
  {
    id: 'blogPost-vo2-max',
    set: {
      seoDescription_ka:
        'ერთი მაჩვენებელი, რომელსაც წლიური გამოკვლევა არასდროს ზომავს: ქოლესტეროლზე, წნევასა და სიმსუქნეზე მეტს გეუბნება.',
      seoTitle_ka: 'VO₂ Max: სიცოცხლის ხანგრძლივობის პრედიქტორი',
    },
  },
  {
    id: 'homePage-singleton',
    set: {
      seo_title_ka: 'Longevity One: დღეგრძელობა და ბიოლოგიური ასაკის მართვა',
    },
  },
  {
    id: 'journeyPage-singleton',
    set: {
      intro_en: 'At Longevity One, everything is systematic and personalised: from digital onboarding through to 12 weeks of micro-coaching.',
      intro_ka: 'Longevity One-ში ყველაფერი სისტემატური და პერსონალიზებულია: ციფრული ონბორდინგიდან 12-კვირიანი მიკრო-კოუჩინგით დასრულებამდე.',
      seo_description_ka: 'Longevity One-ში ყველაფერი სისტემატური და პერსონალიზებულია: ციფრული ონბორდინგიდან 12-კვირიან მიკრო-კოუჩინგამდე. გაიცანით 8-ეტაპიანი გზა.',
      seo_title_ka: 'პაციენტის გზა: 8 ეტაპი',
    },
  },
  {
    id: 'legal-cookies',
    set: {
      'body_en[3].children[0].text':
        "Cookies are small files sent by a website to the user's browser and stored on the user's device, such as a personal computer, mobile phone, tablet, or other terminal.",
      'body_en[5].children[0].text':
        'Their purpose is to remember, store, and process various technical, analytical, statistical, and marketing information. They play an important role in tailoring website functionality to the user (based on user and device behaviour) and in improving the service.',
      'body_en[8].children[0].text':
        'By function: technical cookies, analytical cookies, and personalisation cookies.',
      'body_en[9].children[0].text':
        'By origin: first-party cookies created by the domain of the website being visited, or third-party cookies created and managed by different domains for the purpose of delivering individualised advertising.',
      'body_en[10].children[0].text': 'By duration: for example, session cookies or persistent cookies.',
      'body_ka[8].children[0].text':
        'ფუნქციური: ტექნიკური „ქუქი" ფაილები, ანალიტიკური „ქუქი" ფაილები და ინდივიდუალიზებული „ქუქი" ფაილები.',
      'body_ka[9].children[0].text':
        'მაკონტროლებლისა და წარმოშობის: მომხმარებლის მიერ მონახულებული ვებგვერდის დომენის მიერ შექმნილი საკუთარი „ქუქი" ფაილები, ან მესამე პირის „ქუქი" ფაილები, რომლებიც იქმნება და იმართება მონახულებული ვებგვერდის სხვადასხვა დომენების მიერ, მომხმარებლებთან ინდივიდუალური რეკლამის გაგზავნის მიზნით.',
      'body_ka[10].children[0].text':
        'მოქმედების ხანგრძლივობის: მაგ., სესიის „ქუქი" ფაილები ან მუდმივი გამოყენების „ქუქი" ფაილები.',
      seoDescription_en: 'Longevity One Cookie Policy: cookie categories, management, and the legal basis for processing.',
      seoDescription_ka: 'Longevity One-ის ქუქი-ფაილების პოლიტიკა: ფაილების კატეგორიები, მართვა და სამართლებრივი საფუძველი.',
    },
  },
  {
    id: 'legal-privacy',
    set: {
      'body_en[12].children[0].text': '2.4 Genetic / epigenetic data (special category, maximum protection)',
      'body_en[19].children[0].text': "IP address, browser, device, website-usage statistics, in accordance with the Cookie Policy.",
      'body_en[21].children[0].text':
        'Consent: for all special-category data (health, biometric, genetic) we obtain written, explicit consent before any service begins.',
      'body_en[22].children[0].text': 'Performance of a contract: delivering the service, confirming bookings, sending results.',
      'body_en[23].children[0].text': 'Legal obligation: retaining medical records in line with Georgian law.',
      'body_en[24].children[0].text': 'Legitimate interest: security and fraud prevention.',
      'body_en[30].children[0].text': 'Marketing communications: only on the basis of a separate, voluntary consent.',
      'body_en[44].children[0].text': 'Information: to know what data we process about you.',
      'body_en[45].children[0].text': 'Copy: to receive a copy of your data.',
      'body_en[46].children[0].text': 'Rectification: to request that your data be updated.',
      'body_en[47].children[0].text': 'Erasure: to request deletion of your data (subject to exceptions arising from legal obligations).',
      'body_en[48].children[0].text': 'Restriction of processing: to request that processing be paused.',
      'body_en[49].children[0].text': 'Portability: to receive your data in a machine-readable format.',
      'body_en[50].children[0].text': 'Withdrawal of consent: at any time, without affecting processing that has already taken place.',
      'body_en[51].children[0].text': 'Complaint: to the Personal Data Protection Service (',
      'body_ka[12].children[0].text': '2.4 გენეტიკური / ეპიგენეტიკური მონაცემები (განსაკუთრებული კატეგორია, მაქსიმალური დაცვა)',
      'body_ka[13].children[0].text':
        'ბიოლოგიური ასაკის ინდექსები, მეთილაციის მონაცემები: TrueDiagnostic ეპიგენეტიკური ტესტის საშუალებით. ეს მონაცემები მუშავდება TrueDiagnostic-ის სერვერებზე (აშშ).',
      'body_ka[19].children[0].text':
        'IP მისამართი, ბრაუზერი, მოწყობილობა, ვებგვერდის გამოყენების სტატისტიკა, ქუქი-ფაილების პოლიტიკის შესაბამისად.',
      'body_ka[21].children[0].text':
        'თანხმობა: განსაკუთრებული კატეგორიის ყველა მონაცემისათვის (ჯანმრთელობა, ბიომეტრია, გენეტიკა) ვიღებთ წერილობით, ცალსახა თანხმობას სერვისის დაწყებამდე.',
      'body_ka[22].children[0].text': 'ხელშეკრულების შესრულება: სერვისის მიწოდება, ჯავშნის დადასტურება, შედეგების გაგზავნა.',
      'body_ka[23].children[0].text': 'სამართლებრივი ვალდებულება: სამედიცინო ჩანაწერების შენახვა საქართველოს კანონმდებლობის შესაბამისად.',
      'body_ka[24].children[0].text': 'ლეგიტიმური ინტერესი: უსაფრთხოება, თაღლითობის პრევენცია.',
      'body_ka[30].children[0].text': 'მარკეტინგული კომუნიკაცია: მხოლოდ ცალკე, ნებაყოფლობითი თანხმობის საფუძველზე.',
      'body_ka[44].children[0].text': 'ინფორმაციის მიღება: გაიგოთ, რა მონაცემებს ვამუშავებთ.',
      'body_ka[45].children[0].text': 'ასლის მიღება: მიიღოთ თქვენი მონაცემების ასლი.',
      'body_ka[46].children[0].text': 'გასწორება: მოითხოვოთ მონაცემების განახლება.',
      'body_ka[47].children[0].text': 'წაშლა: მოითხოვოთ მონაცემების წაშლა (სამართლებრივი ვალდებულებებიდან გამომდინარე გამონაკლისებით).',
      'body_ka[48].children[0].text': 'დამუშავების შეზღუდვა: მოითხოვოთ დამუშავების შეჩერება.',
      'body_ka[49].children[0].text': 'გადაცემადობა: მიიღოთ მონაცემები მანქანა-წაკითხვადი ფორმატით.',
      'body_ka[50].children[0].text': 'თანხმობის გაუქმება: ნებისმიერ დროს, წარსულ დამუშავებაზე ზეგავლენის გარეშე.',
      'body_ka[51].children[0].text': 'საჩივარი: პერსონალურ მონაცემთა დაცვის სამსახურს (',
      intro_en: 'How we process your personal data: in accordance with Georgian law and GDPR principles.',
      intro_ka: 'როგორ ვამუშავებთ თქვენს პერსონალურ მონაცემებს: საქართველოს კანონმდებლობისა და GDPR პრინციპების შესაბამისად.',
      seoDescription_en: 'Longevity One Privacy Policy: how we process personal data in accordance with the Law of Georgia on Personal Data Protection.',
      seoDescription_ka: 'Longevity One-ის კონფიდენციალურობის პოლიტიკა: როგორ ვამუშავებთ პერსონალურ მონაცემებს „პერსონალურ მონაცემთა დაცვის შესახებ" საქართველოს კანონის შესაბამისად.',
    },
  },
  {
    id: 'legal-terms',
    set: {
      'body_en[7].children[0].text': 'PNOE: metabolic and VO₂ max analysis',
      'body_en[8].children[0].text': 'TrueDiagnostic: epigenetic age testing',
      'body_en[9].children[0].text': 'Enbiosis: gut-microbiome analysis',
      'body_en[10].children[0].text': 'IHHT: intermittent hypoxia-hyperoxia therapy',
      'body_ka[7].children[0].text': 'PNOE: მეტაბოლური და VO₂ max ანალიზი',
      'body_ka[8].children[0].text': 'TrueDiagnostic: ეპიგენეტიკური ასაკის ტესტი',
      'body_ka[9].children[0].text': 'Enbiosis: ნაწლავის მიკრობიომის ანალიზი',
      'body_ka[10].children[0].text': 'IHHT: ინტერმიტული ჰიპოქსია-ჰიპეროქსიის თერაპია',
      'body_ka[27].children[0].text': 'დაიცვას ტესტის წინასწარი მოთხოვნები (მაგ., PNOE ტესტისთვის: 4-საათიანი მარხვა).',
      seoDescription_en: 'Longevity One Terms of Service: booking, payment, cancellation, client obligations, and limitation of liability.',
      seoDescription_ka: 'Longevity One-ის მომსახურების პირობები: ჯავშანი, გადახდა, გაუქმება, კლიენტის ვალდებულებები და პასუხისმგებლობის შეზღუდვა.',
    },
  },
  {
    id: 'package-elite',
    set: {
      'includes_en[3]': 'IHHT: 10 sessions',
      'includes_en[4]': 'Red Light Therapy: 12 sessions',
      'includes_ka[3]': 'IHHT: 10 სესია',
      'includes_ka[4]': 'Red Light Therapy: 12 სესია',
    },
  },
  {
    id: 'package-performance',
    set: {
      'includes_en[5]': 'Red Light Therapy: 10 sessions',
      'includes_en[6]': 'IHHT (cellular therapy): 10 sessions',
      'includes_ka[5]': 'Red Light Therapy: 10 სესია',
      'includes_ka[6]': 'IHHT (უჯრედული თერაპია): 10 სესია',
    },
  },
  {
    id: 'package-starter',
    set: {
      'includes_en[2]': 'Metabolic analysis: Resting Metabolic Rate measurement',
      'includes_en[4]': 'IHHT (cellular therapy): 6 sessions',
      'includes_en[5]': 'Red Light Therapy: 8 sessions',
      'includes_ka[2]': 'მეტაბოლური ანალიზი: მოსვენების მეტაბოლური სიხშირის განსაზღვრა',
      'includes_ka[4]': 'IHHT (უჯრედული თერაპია): 6 სესია',
      'includes_ka[5]': 'Red Light Therapy: 8 სესია',
    },
  },
  {
    id: 'teamMember-saba-janiashvili',
    set: {
      'fullBio_ka[0].children[0].text':
        'დავით ტვილდიანის სამედიცინო უნივერსიტეტის (DTMU) MD ePBL პროგრამის კურსდამთავრებული. გავლილი აქვს აშშ-ის სამედიცინო ლიცენზირების გამოცდის (USMLE) სამივე საფეხური: Step 1 (2023), Step 2 CK (2024) და Step 3 (2024), რაც საერთაშორისო სამედიცინო სტანდარტების შესაბამის თეორიულ და კლინიკურ მომზადებას ადასტურებს.',
    },
  },
  {
    id: 'teamPage-singleton',
    set: {
      founders_subtext_en:
        "Five physicians. One shared vision. Years of combined experience across Georgia and internationally, brought together to build the country's first dedicated longevity clinic.",
      founders_subtext_ka:
        'ხუთი ექიმი. ერთი საერთო ხედვა. საქართველოსა და საერთაშორისო სცენაზე დაგროვილი გამოცდილება, გაერთიანებული ქვეყნის პირველი სპეციალიზებული დღეგრძელობის კლინიკის შესაქმნელად.',
      seo_description_ka:
        'ხუთი ექიმი. ერთი საერთო ხედვა. საქართველოსა და საერთაშორისო გამოცდილება, ქვეყნის პირველი სპეციალიზებული დღეგრძელობის კლინიკის შესაქმნელად.',
      seo_title_ka: 'ჩვენი გუნდი: ხუთი ექიმი, ერთი ხედვა',
    },
  },
  {
    id: 'tech-pnoe',
    set: {
      'howItWorks_en[6].children[0].text':
        'The test is conducted in a controlled environment, both at rest and under light physical load, on a treadmill or stationary bike, using a dedicated breathing system.',
      'howItWorks_ka[6].children[0].text':
        'ტესტი ტარდება კონტროლირებულ გარემოში, როგორც მოსვენების , ასევე მსუბუქი ფიზიკური დატვირთვის პირობებში, სარბენ ბილიკზე ან ველოსიპედზე, სპეციალური სუნთქვის სისტემის გამოყენებით.',
      'whatItIs_en[0].children[0].text':
        'VO₂ Max testing precisely determines how efficiently your body uses oxygen both at rest and during physical exertion. This is one of the primary indicators of cardiovascular fitness, mitochondrial health, metabolic efficiency, and longevity potential.',
      'whatItIs_ka[0].children[0].text':
        'VO₂ max ტესტირება ზუსტად განსაზღვრავს, რამდენად ეფექტურად იყენებს თქვენი სხეული ჟანგბადს მოსვენების და ასევე ფიზიკური დატვირთვის დროს. ეს წარმოადგენს გულ-სისხლძარღვთა სისტემის, მიტოქონდრიული ჯანმრთელობის, მეტაბოლური ეფექტურობისა და ხანგრძლივი სიცოცხლის პოტენციალის ერთ-ერთ მთავარ მაჩვენებელს.',
      'yourBenefit_en[0].children[0].text':
        "You receive a data-driven, personalised analysis matched precisely to your body, with no guesswork. You'll know your exact zones for fat-burning, endurance, and high intensity; understand how your body uses energy and how to optimise it; and connect your physical fitness directly to your cardiovascular health and longevity potential.",
      'yourBenefit_ka[0].children[0].text':
        'მიიღებთ მონაცემებზე დაფუძნებულ, პერსონალიზებულ ანალიზს, რომელიც ზუსტად შეესაბამება თქვენს სხეულს, ვარაუდის გარეშე. გეცოდინებათ ცხიმის წვის, გამძლეობისა და მაღალი ინტენსივობის ზუსტი ზონები, გაიგებთ როგორ იყენებს თქვენი სხეული ენერგიას და როგორ მოახდინოთ მისი ოპტიმიზაცია, და დააკავშირებთ თქვენს ფიზიკურ ფორმას გულ-სისხლძარღვთა ჯანმრთელობასა და ხანგრძლივი სიცოცხლის პოტენციალთან.',
    },
  },
  {
    id: 'tech-red-light',
    set: {
      'whatItIs_en[0].children[0].text':
        'Red Light Therapy (photobiomodulation) uses specific wavelengths of red and near-infrared light that penetrate the skin and stimulate cellular energy production. At the cellular level, this process supports the body\'s natural repair and regeneration mechanisms.\n\nWhen the light reaches the mitochondria (the cells\' "power centres"), it increases the production of ATP (cellular energy). This elevated cellular energy allows the body to repair tissue more efficiently, reduce inflammation, improve circulation, and stimulate collagen synthesis.',
      'whatItIs_ka[0].children[0].text':
        'წითელი სინათლის თერაპია (ფოტობიომოდულაცია) იყენებს წითელი და ახლო ინფრაწითელი სინათლის სპეციფიკურ ტალღის სიგრძეებს, რომლებიც აღწევს კანში და ასტიმულირებს უჯრედული ენერგიის გამომუშავებას. ეს პროცესი უჯრედულ დონეზე ხელს უწყობს ორგანიზმის ბუნებრივ აღდგენისა და რეგენერაციის მექანიზმებს.\n\nროდესაც სინათლე აღწევს მიტოქონდრიამდე (უჯრედების „ენერგეტიკულ ცენტრამდე"), ის ზრდის ATP-ის (უჯრედული ენერგიის) გამომუშავებას. გაზრდილი უჯრედული ენერგია ორგანიზმს საშუალებას აძლევს უფრო ეფექტურად აღადგინოს ქსოვილები, შეამციროს ანთება, გააუმჯობესოს სისხლის მიმოქცევა და ასტიმულიროს კოლაგენის სინთეზი.',
    },
  },
]

async function main() {
  let tx = client.transaction()
  for (const p of patches) tx = tx.patch(p.id, (patch) => patch.set(p.set))
  await tx.commit()
  console.log(`✓ Patched ${patches.length} document(s).`)

  // Final verification: scan the whole dataset again for any remaining em dash.
  function walk(obj: unknown, path: string, hits: string[]) {
    if (typeof obj === 'string') {
      if (obj.includes('—')) hits.push(`${path}: ${obj.slice(0, 60)}`)
      return
    }
    if (Array.isArray(obj)) { obj.forEach((v, i) => walk(v, `${path}[${i}]`, hits)); return }
    if (obj && typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
        if (k.startsWith('_')) continue
        walk(v, path ? `${path}.${k}` : k, hits)
      }
    }
  }
  const docs = await client.fetch<Array<Record<string, unknown>>>('*[]')
  let remaining = 0
  for (const d of docs) {
    const hits: string[] = []
    walk(d, '', hits)
    if (hits.length) {
      remaining += hits.length
      console.log(`  ✗ ${d._type}/${d._id as string}:`)
      for (const h of hits) console.log(`      ${h}`)
    }
  }
  console.log(remaining === 0 ? '✓ Verified: zero em dashes remain anywhere in the dataset.' : `✗ ${remaining} em dash(es) still remain — see above.`)
}

main().catch((e) => { console.error('✗ Failed:', e); process.exit(1) })
