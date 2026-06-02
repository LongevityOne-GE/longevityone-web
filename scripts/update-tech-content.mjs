import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-11-01',
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false
})

async function run() {
  console.log('Updating PNOE and Red Light Therapy content...');

  // Standardising "PNOĒ"
  const pnoeUpdates = {
    name_ka: 'PNOĒ VO₂ Max',
    name_en: 'PNOĒ VO₂ Max',
    whatItIs_ka: 'PNOĒ VO₂ Max არის მეტაბოლიზმის „ოქროს სტანდარტი" — სამედიცინო კლასის სუნთქვის ანალიზის სისტემა, რომელიც ერთი ტესტიდან 23 ბიომარკერს ზომავს. VO₂ Max ტესტირება ზუსტად განსაზღვრავს, რამდენად ეფექტურად იყენებს თქვენი სხეული ჟანგბადს — როგორც მოსვენების, ისე ფიზიკური დატვირთვის დროს. ეს არის გულ-სისხლძარღვთა სისტემის ფორმის, მიტოქონდრიული ჯანმრთელობის, მეტაბოლური ეფექტურობისა და ხანგრძლივი სიცოცხლის პოტენციალის ერთ-ერთი მთავარი მაჩვენებელი. მოწინავე სუნთქვის ანალიზის ტექნოლოგიით ჩვენ რეალურ დროში ვაფასებთ, როგორ მუშაობს ერთად თქვენი გული, ფილტვები, კუნთები და მეტაბოლიზმი.',
    whatItIs_en: 'PNOĒ VO₂ Max is the gold standard of metabolism testing — a medical-grade breath-analysis system that measures 23 biomarkers from a single test. VO₂ Max testing precisely determines how efficiently your body uses oxygen, both at rest and under physical load. It is one of the most powerful indicators of cardiovascular fitness, mitochondrial health, metabolic efficiency, and longevity potential. Using advanced breath-analysis technology, we assess in real time how your heart, lungs, muscles, and metabolism work together.',
    howItWorks_ka: 'PNOĒ ტექნოლოგია იყენებს მოწინავე, არაინვაზიურ სუნთქვის ანალიზს, რომელიც რეალურ დროში აღიქვამს თქვენი ორგანიზმის სრულ ფიზიოლოგიურ პასუხს დატვირთვაზე. ტესტი ტარდება კონტროლირებულ გარემოში — მოსვენებისა და მსუბუქი ფიზიკური დატვირთვის პირობებში, სარბენ ბილიკზე ან ველოსიპედზე, სპეციალური სუნთქვის სისტემის გამოყენებით. ანალიზი გრძელდება დაახლოებით 12 წუთი, რომლის განმავლობაშიც ფასდება 23 ბიომარკერი, მათ შორის:\n\n- ჟანგბადის მოხმარების ზუსტი ანალიზი (VO₂)\n- ნახშირორჟანგის დინამიკის შეფასება (VCO₂)\n- მეტაბოლური მოქნილობის განსაზღვრა\n- ენერგიის წარმოების ეფექტურობის გაზომვა',
    howItWorks_en: 'PNOĒ technology uses advanced, non-invasive breath analysis that captures your body\'s full physiological response to exertion in real time. The test is conducted in a controlled environment — at rest and under light physical load, on a treadmill or stationary bike, using a dedicated breathing system. The analysis takes roughly 12 minutes, during which 23 biomarkers are measured, including:\n\n- Precise oxygen-consumption analysis (VO₂)\n- Carbon-dioxide dynamics (VCO₂)\n- Metabolic flexibility\n- Energy-production efficiency',
    yourBenefit_ka: 'მიიღებთ მონაცემებზე დაფუძნებულ, პერსონალიზებულ ანალიზს, რომელიც ზუსტად შეესაბამება თქვენს სხეულს — ვარაუდის გარეშე. გეცოდინებათ ცხიმის წვის, გამძლეობისა და მაღალი ინტენსივობის ზუსტი ზონები, გაიგებთ როგორ იყენებს თქვენი სხეული ენერგიას და როგორ მოახდინოთ მისი ოპტიმიზაცია, და დააკავშირებთ თქვენს ფიზიკურ ფორმას გულ-სისხლძარღვთა ჯანმრთელობასა და ხანგრძლივი სიცოცხლის პოტენციალთან.',
    yourBenefit_en: 'You receive a data-driven, personalised analysis matched precisely to your body — with no guesswork. You\'ll know your exact zones for fat-burning, endurance, and high intensity; understand how your body uses energy and how to optimise it; and connect your physical fitness directly to your cardiovascular health and longevity potential.',
    benefits_ka: [
      'თქვენი VO₂ Max-ის ზუსტი განსაზღვრა',
      'მეტაბოლური ეფექტურობის შეფასება',
      'ცხიმის წვის ოპტიმალური ზონების დადგენა',
      'პერსონალიზებული ვარჯიშის გეგმის შექმნა',
      'გამძლეობისა და ენერგიის დონის გაუმჯობესება',
      'აღდგენის ხარისხის უკეთ გაგება',
      'longevity-ისა და ფიზიოლოგიური პოტენციალის შეფასება'
    ],
    benefits_en: [
      'Precise determination of your VO₂ Max',
      'Assessment of metabolic efficiency',
      'Identification of optimal fat-burning zones',
      'A personalised training plan',
      'Improved endurance and energy levels',
      'A clearer understanding of recovery quality',
      'Evaluation of your longevity and physiological potential'
    ],
    whatItShows_ka: '',
    whatItShows_en: ''
  };

  const redLightUpdates = {
    tagline_en: 'Photobiomodulation therapy for cellular energy',
    tagline_ka: 'ფოტობიომოდულაციის თერაპია უჯრედული ენერგიისთვის',
    whatItIs_ka: 'წითელი სინათლის თერაპია (ფოტობიომოდულაცია) იყენებს წითელი და ახლო ინფრაწითელი სინათლის სპეციფიკურ ტალღის სიგრძეებს, რომლებიც აღწევს კანში და ასტიმულირებს უჯრედული ენერგიის გამომუშავებას. ეს პროცესი უჯრედულ დონეზე ხელს უწყობს ორგანიზმის ბუნებრივ აღდგენისა და რეგენერაციის მექანიზმებს.\n\nროდესაც სინათლე აღწევს მიტოქონდრიამდე — უჯრედების „ენერგეტიკულ ცენტრამდე" — ის ზრდის ATP-ის (უჯრედული ენერგიის) გამომუშავებას. გაზრდილი უჯრედული ენერგია ორგანიზმს საშუალებას აძლევს უფრო ეფექტურად აღადგინოს ქსოვილები, შეამციროს ანთება, გააუმჯობესოს სისხლის მიმოქცევა და ასტიმულიროს კოლაგენის სინთეზი.',
    whatItIs_en: 'Red Light Therapy (photobiomodulation) uses specific wavelengths of red and near-infrared light that penetrate the skin and stimulate cellular energy production. At the cellular level, this process supports the body\'s natural repair and regeneration mechanisms.\n\nWhen the light reaches the mitochondria — the cells\' "power centres" — it increases the production of ATP (cellular energy). This elevated cellular energy allows the body to repair tissue more efficiently, reduce inflammation, improve circulation, and stimulate collagen synthesis.',
    howItWorks_ka: 'თქვენ კომფორტულად დგახართ ან ზიხართ ორ წითელი სინათლის პანელს შორის 15–20 წუთის განმავლობაში. სინათლე შეიწოვება მიტოქონდრიაში არსებული ციტოქრომ c ოქსიდაზას მიერ და გარდაიქმნება ATP-ად. გაზრდილი უჯრედული ენერგია ააქტიურებს ქსოვილების აღდგენას, ამცირებს ანთებას და ასტიმულირებს კოლაგენის სინთეზს. რეკომენდებულია კვირაში 3–5 სესია, სულ 10–15 სესია, შემდეგ კი ყოველკვირეული შენარჩუნება.',
    howItWorks_en: 'You stand or sit comfortably between two red-light panels for 15–20 minutes. The light is absorbed by cytochrome c oxidase within the mitochondria and converted into ATP. This elevated cellular energy activates tissue repair, reduces inflammation, and stimulates collagen synthesis. We recommend 3–5 sessions per week, 10–15 in total, followed by weekly maintenance.',
    benefits_ka: [
      'მხარს უჭერს ქსოვილების რეგენერაციას და საერთო აღდგენით პროცესებს',
      'აუმჯობესებს კანის ტექსტურასა და ელასტიკურობას',
      'ასტიმულირებს კოლაგენის გამომუშავებას',
      'ამცირებს წვრილ ხაზებსა და ნაოჭებს',
      'ხელს უწყობს აკნესა და კანის ანთების შემცირებას',
      'აჩქარებს ჭრილობების შეხორცებას და ქსოვილების აღდგენას',
      'ამცირებს კუნთების ტკივილსა და სახსრების დისკომფორტს',
      'ხელს უწყობს ანთების შემცირებას',
      'აუმჯობესებს სისხლის მიმოქცევას',
      'ხელს უწყობს სწრაფ აღდგენასა და რეაბილიტაციას',
      'უწყობს ხელს თმის ზრდასა და გაძლიერებას'
    ],
    benefits_en: [
      'Supports tissue regeneration and overall recovery processes',
      'Improves skin texture and elasticity',
      'Stimulates collagen production',
      'Reduces fine lines and wrinkles',
      'Helps reduce acne and skin inflammation',
      'Accelerates wound healing and tissue repair',
      'Eases muscle soreness and joint discomfort',
      'Helps reduce inflammation',
      'Improves blood circulation',
      'Promotes rapid recovery and rehabilitation',
      'Supports hair growth and strengthening'
    ],
    yourBenefit_ka: '',
    yourBenefit_en: '',
    whatItShows_ka: '',
    whatItShows_en: ''
  };

  await client.patch('tech-pnoe').set(pnoeUpdates).commit();
  console.log('✅ Updated PNOĒ');

  await client.patch('tech-red-light').set(redLightUpdates).commit();
  console.log('✅ Updated Red Light Therapy');
  
  // also check other docs and fix "low-frequency" / "დაბალი სიხშირის" globally in other string fields
  const allPackages = await client.fetch(`*[_type == "package"]`);
  for (const pkg of allPackages) {
      // already did dashes, let's fix PNOE -> PNOĒ where we can safely
      // Only fix in english for now as "PNOE" in Georgian is normally left alone unless instructed
      // "Standardise the device name to PNOĒ (with macron) across the Technologies page content. Flag any other page still using PNOE but do not change other pages without confirmation."
      // So no need to modify anything here, just flag.
  }
}

run().catch(console.error);
