import { createClient } from '@sanity/client'
import 'dotenv/config'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN

if (!token) {
  console.error('❌ SANITY_API_TOKEN not found')
  process.exit(1)
}

const client = createClient({ 
  projectId, 
  dataset, 
  apiVersion: '2024-11-01', 
  token, 
  useCdn: false 
})

async function updatePackages() {
  // Delete all existing packages to have a clean slate
  const existingPackages = await client.fetch(`*[_type == "package"]{_id}`)
  for (const pkg of existingPackages) {
    await client.delete(pkg._id)
  }
  
  // Create Diagnostic Packages
  const p1 = {
    _type: 'package',
    _id: 'package-starter',
    category: 'diagnostic',
    tier: 1,
    name_ka: 'Metabolic Audit',
    name_en: 'Metabolic Audit',
    price: 550,
    priceLabel_ka: '550 ₾',
    priceLabel_en: '550 GEL',
    tagline_ka: 'თქვენი ბიოლოგიური ბაზისი',
    tagline_en: 'Your Biological Baseline',
    goal_ka: 'საწყისი პაკეტი მათთვის, ვისაც სურს გაიგოს თავისი ჯანმრთელობის რეალური მდგომარეობა.',
    goal_en: 'Starter package for those who want to understand their true health status.',
    includes_ka: ['PNOE (მეტაბოლური ტესტი)', 'Visbody (3D ანალიზი)', 'დინამომეტრია'],
    includes_en: ['PNOE Metabolic Test', 'Visbody 3D Analysis', 'Dynamometry'],
    isFeatured: false,
    order: 1,
    cta_label_ka: 'დაჯავშნა',
    cta_label_en: 'Book Now',
  }
  
  const p2 = {
    _type: 'package',
    _id: 'package-performance',
    category: 'diagnostic',
    tier: 2,
    name_ka: 'Performance & Recovery',
    name_en: 'Performance & Recovery',
    price: 1850,
    priceLabel_ka: '1,850 ₾',
    priceLabel_en: '1,850 GEL',
    tagline_ka: 'აქტიური ტრანსფორმაცია',
    tagline_en: 'Active Transformation',
    goal_ka: 'პაკეტი ფიზიკური და მეტაბოლური მაჩვენებლების გაუმჯობესებისთვის.',
    goal_en: 'Package for improving physical and metabolic parameters.',
    includes_ka: ['Tier 1-ის ყველა შემოწმება', '5 სესია Red Light Therapy', '5 სესია IHHT'],
    includes_en: ['All Tier 1 tests', '5 Red Light Therapy sessions', '5 IHHT sessions'],
    isFeatured: true,
    order: 2,
    cta_label_ka: 'დაჯავშნა',
    cta_label_en: 'Book Now',
  }

  const p3 = {
    _type: 'package',
    _id: 'package-elite',
    category: 'diagnostic',
    tier: 3,
    name_ka: 'Elite Longevity Map',
    name_en: 'Elite Longevity Map',
    price: 3200,
    priceLabel_ka: '3,200 ₾',
    priceLabel_en: '3,200 GEL',
    tagline_ka: 'სრული ბიოლოგიური აუდიტი',
    tagline_en: 'Complete Biological Audit',
    goal_ka: 'ჩვენი ყველაზე სრული სადიაგნოსტიკო და სარეაბილიტაციო პაკეტი.',
    goal_en: 'Our most comprehensive diagnostic and rehabilitation package.',
    includes_ka: ['Tier 1-ის ყველა შემოწმება', '10 სესია Red Light Therapy', '10 სესია IHHT', 'პერსონალური დღეგრძელობის გეგმა'],
    includes_en: ['All Tier 1 tests', '10 Red Light Therapy sessions', '10 IHHT sessions', 'Personal Longevity Plan'],
    isFeatured: false,
    order: 3,
    cta_label_ka: 'დაჯავშნა',
    cta_label_en: 'Book Now',
  }

  // Create Add-ons
  const a1 = {
    _type: 'package',
    _id: 'addon-enbiosis',
    category: 'addon',
    name_ka: 'Enbiosis Module (მიკრობიომი)',
    name_en: 'Enbiosis Module (Microbiome)',
    price: 1200,
    priceLabel_ka: '1,200 ₾',
    priceLabel_en: '1,200 GEL',
    order: 1
  }

  const a2 = {
    _type: 'package',
    _id: 'addon-trueage',
    category: 'addon',
    name_ka: 'TrueAge Module (ეპიგენეტიკა)',
    name_en: 'TrueAge Module (Epigenetics)',
    price: 2200,
    priceLabel_ka: '2,200 ₾',
    priceLabel_en: '2,200 GEL',
    order: 2
  }

  // Create Session Packs (9 packs)
  const sessions = [
    { nKa: 'IHHT (1 სესია)', nEn: 'IHHT (1 session)', p: 180 },
    { nKa: 'IHHT (5 სესია)', nEn: 'IHHT (5 sessions)', p: 810 },
    { nKa: 'IHHT (10 სესია)', nEn: 'IHHT (10 sessions)', p: 1440 },
    
    { nKa: 'Red Light Therapy (1 სესია)', nEn: 'Red Light Therapy (1 session)', p: 120 },
    { nKa: 'Red Light Therapy (5 სესია)', nEn: 'Red Light Therapy (5 sessions)', p: 540 },
    { nKa: 'Red Light Therapy (10 სესია)', nEn: 'Red Light Therapy (10 sessions)', p: 960 },
    
    { nKa: 'COMBO - IHHT + Red Light (1 სესია)', nEn: 'COMBO - IHHT + Red Light (1 session)', p: 250 },
    { nKa: 'COMBO - IHHT + Red Light (5 სესია)', nEn: 'COMBO - IHHT + Red Light (5 sessions)', p: 1125 },
    { nKa: 'COMBO - IHHT + Red Light (10 სესია)', nEn: 'COMBO - IHHT + Red Light (10 sessions)', p: 2000 }
  ]

  const sessionDocs = sessions.map((s, i) => ({
    _type: 'package',
    _id: `session-pack-${i}`,
    category: 'session',
    name_ka: s.nKa,
    name_en: s.nEn,
    price: s.p,
    priceLabel_ka: `${s.p} ₾`,
    priceLabel_en: `${s.p} GEL`,
    order: i + 1
  }))

  // Create Memberships
  const m1 = {
    _type: 'package',
    _id: 'membership-silver',
    category: 'membership',
    name_ka: 'Silver',
    name_en: 'Silver',
    price: 650,
    priceLabel_ka: '650 ₾',
    priceLabel_en: '650 GEL',
    priceSuffix_ka: '',
    priceSuffix_en: '',
    tagline_ka: 'The Maintenance Pass',
    tagline_en: 'The Maintenance Pass',
    goal_ka: 'მიზანი: მათთვის, ვისაც სურს მიღწეული ფორმის შენარჩუნება.',
    goal_en: 'Goal: For those who want to maintain their achieved form.',
    includes_ka: [
      '4 სესია Red Light Therapy',
      'შეუზღუდავი Visbody 3D სკანირება',
      'პრიორიტეტული ჯავშანი "პიკის საათებში"',
      '10% ფასდაკლება ყველა ლაბორატორიულ ტესტზე (Enbiosis, TrueAge)',
      'ყოველთვიური "დღეგრძელობის ბიულეტენი" მხოლოდ წევრებისთვის'
    ],
    includes_en: [
      '4 sessions Red Light Therapy',
      'Unlimited Visbody 3D Scan',
      'Priority Booking during peak hours',
      '10% discount on all laboratory tests (Enbiosis, TrueAge)',
      'Monthly "Longevity Bulletin" exclusively for members'
    ],
    isFeatured: false,
    order: 1,
    cta_label_ka: 'გაწევრიანება',
    cta_label_en: 'Join Now',
  }

  const m2 = {
    _type: 'package',
    _id: 'membership-gold',
    category: 'membership',
    name_ka: 'Gold',
    name_en: 'Gold',
    price: 1200,
    priceLabel_ka: '1,200 ₾',
    priceLabel_en: '1,200 GEL',
    priceSuffix_ka: '',
    priceSuffix_en: '',
    tagline_ka: 'The Biohacker’s Choice',
    tagline_en: 'The Biohacker’s Choice',
    goal_ka: 'მიზანი: აქტიური ტრანსფორმაცია და ენერგიის მართვა.',
    goal_en: 'Goal: Active transformation and energy management.',
    includes_ka: [
      '4 სესია IHHT + 4 სესია Red Light',
      'Monthly Performance Audit (Visbody + დინამომეტრია)',
      'Quarterly PNOE RMR Check (3 თვეში ერთხელ მეტაბოლიზმის გადამოწმება)',
      '15% ფასდაკლება საერთაშორისო ტესტებზე',
      'თვეში 1 მეგობრის მოყვანის უფლება Tier 1 დიაგნოსტიკაზე 50%-იანი ფასდაკლებით'
    ],
    includes_en: [
      '4 sessions IHHT + 4 sessions Red Light',
      'Monthly Performance Audit (Visbody + Dynamometry)',
      'Quarterly PNOE RMR Check (metabolism check every 3 months)',
      '15% discount on international tests',
      'Guest Pass: Bring 1 friend per month for Tier 1 diagnostic at 50% discount'
    ],
    isFeatured: true,
    order: 2,
    cta_label_ka: 'გაწევრიანება',
    cta_label_en: 'Join Now',
  }

  const m3 = {
    _type: 'package',
    _id: 'membership-platinum',
    category: 'membership',
    name_ka: 'Elite Platinum',
    name_en: 'Elite Platinum',
    price: 2200,
    priceLabel_ka: '2,200 ₾',
    priceLabel_en: '2,200 GEL',
    priceSuffix_ka: '',
    priceSuffix_en: '',
    tagline_ka: 'The Biological Insurance',
    tagline_en: 'The Biological Insurance',
    goal_ka: 'მიზანი: სრული "Concierge" მომსახურება მათთვის, ვისთვისაც ჯანმრთელობა მთავარი აქტივია.',
    goal_en: 'Goal: Full "Concierge" service for those whose health is their main asset.',
    includes_ka: [
      'შეუზღუდავი წვდომა აღდგენის ზონაში (8 IHHT + 8 Red Light)',
      'Total Body Monitoring: ყოველთვიური დინამომეტრია, Visbody და კვარტალური PNOE აუდიტი',
      'Complimentary TrueAge Test (წელიწადში ერთხელ უფასო ეპიგენეტიკური ტესტირება)',
      'პირდაპირი ხაზი კლინიკის ექსპერტთან კონსულტაციებისთვის (Personal Health Concierge)',
      'მოწვევა დახურულ "Longevity One-on-One" ვორქშოპებზე (Elite Network)'
    ],
    includes_en: [
      'Unlimited access to Recovery Zone (8 IHHT + 8 Red Light)',
      'Total Body Monitoring: Monthly Dynamometry, Visbody, and quarterly PNOE audit',
      'Complimentary TrueAge Test (free epigenetic testing once a year)',
      'Direct line to clinic expert for consultations (Personal Health Concierge)',
      'Invitation to exclusive "Longevity One-on-One" workshops (Elite Network)'
    ],
    isFeatured: false,
    order: 3,
    cta_label_ka: 'გაწევრიანება',
    cta_label_en: 'Join Now',
  }

  const allDocs = [p1, p2, p3, a1, a2, ...sessionDocs, m1, m2, m3]

  for (const d of allDocs) {
    await client.createOrReplace(d)
  }

  console.log('✅ Updated all packages from DOCX!')
}

updatePackages().catch(console.error)
