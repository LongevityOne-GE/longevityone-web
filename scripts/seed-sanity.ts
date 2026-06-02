/**
 * Sanity CMS Seed Script for Longevity One
 * 
 * Populates all 21 pages worth of content from CONTENT.md into Sanity CMS.
 * 
 * Usage: npx tsx scripts/seed-sanity.ts
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-11-01'
const token = process.env.SANITY_API_TOKEN

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
}
if (!token) {
  throw new Error('Missing SANITY_API_TOKEN - required for write operations')
}

// Create write-enabled Sanity client
const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

// ─── Helper: Convert markdown text to Sanity portable text blocks ─────────────
function textToPortableText(text: string): Array<{
  _type: 'block'
  _key: string
  style: string
  markDefs: never[]
  children: Array<{ _type: 'span'; _key: string; text: string; marks: never[] }>
}> {
  if (!text || text.trim() === '') return []
  
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim())
  return paragraphs.map((para, i) => ({
    _type: 'block' as const,
    _key: `block-${i}`,
    style: 'normal' as const,
    markDefs: [],
    children: [
      {
        _type: 'span' as const,
        _key: `span-${i}`,
        text: para.trim(),
        marks: [],
      },
    ],
  }))
}

// ─── Helper: Generate unique key ──────────────────────────────────────────────
function generateKey(prefix: string, index: number): string {
  return `${prefix}-${index}-${Date.now().toString(36)}`
}

// ─── Delete document if exists ────────────────────────────────────────────────
async function deleteDoc(id: string): Promise<void> {
  try {
    await sanityWriteClient.delete(id)
    console.log(`  ↳ Deleted old: ${id}`)
  } catch {
    // Document doesn't exist, that's fine
  }
}

// ─── Create or replace document ───────────────────────────────────────────────
async function createDoc(doc: Record<string, unknown>): Promise<void> {
  try {
    await sanityWriteClient.createOrReplace(doc as Parameters<typeof sanityWriteClient.createOrReplace>[0])
    console.log(`✓ Created ${doc._type}: ${doc._id}`)
  } catch (error) {
    console.error(`✗ Failed to create ${doc._type}: ${doc._id}`, error)
    throw error
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Site Settings ────────────────────────────────────────────────────────────
const siteSettingsDoc = {
  _type: 'siteSettings',
  _id: 'siteSettings-singleton',
  clinicName_ka: 'Longevity One',
  clinicName_en: 'Longevity One',
  tagline_ka: 'დღეგრძელობის ხელოვნება',
  tagline_en: 'The Art of Living Longer',
  address_ka: 'თამარაშვილის 4ა, სადარბაზო 3, სართული 3, ბინა 50, თბილისი',
  address_en: '4a Tamarashvili Street, Entrance 3, Floor 3, Apt. 50, Tbilisi, Georgia',
  phone: '+995 511 70 88 88',
  email: 'info@longevityone.ge',
  openingHours_ka: ['ყოველდღე 09:00 – 21:00'],
  openingHours_en: ['Every day 09:00 – 21:00'],
  nav_cta_ka: 'დაჯავშნეთ',
  nav_cta_en: 'Book a Consultation',
  cookie_title_ka: 'ჩვენ ვიყენებთ ქუქი-ფაილებს',
  cookie_title_en: 'We use cookies',
  cookie_body_ka: 'ჩვენ ვიყენებთ ქუქი-ფაილებს თქვენი გამოცდილების გასაუმჯობესებლად და საიტის გამოყენების ანალიზისთვის. შეგიძლიათ მიიღოთ ყველა ქუქი ან მართოთ თქვენი პარამეტრები.',
  cookie_body_en: 'We use cookies to improve your experience and understand how our site is used. You can accept all cookies or manage your preferences.',
  cookie_accept_ka: 'ყველას მიღება',
  cookie_accept_en: 'Accept All',
  cookie_reject_ka: 'უარყოფა',
  cookie_reject_en: 'Reject All',
  cookie_manage_ka: 'პარამეტრები',
  cookie_manage_en: 'Manage Preferences',
  notFound_h1_ka: 'გვერდი ვერ მოიძებნა',
  notFound_h1_en: 'Page Not Found',
  notFound_body_ka: 'ეს გვერდი არ არსებობს ან გადატანილია.',
  notFound_body_en: "This page doesn't exist or has been moved.",
  notFound_cta_ka: 'მთავარ გვერდზე დაბრუნება',
  notFound_cta_en: 'Return to Homepage',
  footer_copyright_ka: '© 2026 Longevity One. ყველა უფლება დაცულია.',
  footer_copyright_en: '© 2026 Longevity One. All rights reserved.',
  default_seo_title_ka: 'Longevity One — პრევენციული მედიცინის ცენტრი',
  default_seo_title_en: 'Longevity One — Preventive Medicine Centre',
  default_seo_description_ka: 'Longevity One — პრევენციული მედიცინის ცენტრი, სადაც სამეცნიერო სიზუსტე შეხვდება დღეგრძელობის ხელოვნებას.',
  default_seo_description_en: 'Longevity One — a preventive medicine centre where scientific precision meets the art of longevity.',
}

// ─── Homepage ─────────────────────────────────────────────────────────────────
const homePageDoc = {
  _type: 'homePage',
  _id: 'homePage-singleton',
  hero_slogan_ka: 'დღეგრძელობის ხელოვნება',
  hero_slogan_en: 'The Art of Living Longer',
  hero_h1_ka: 'მართეთ თქვენი ბიოლოგიური დრო',
  hero_h1_en: 'Master Your Biological Time',
  hero_h2_ka: 'Longevity One — პრევენციული მედიცინის ცენტრი, სადაც სამეცნიერო სიზუსტე შეხვდება დღეგრძელობის ხელოვნებას.',
  hero_h2_en: 'Longevity One — a preventive medicine centre where scientific precision meets the art of longevity.',
  hero_body_ka: 'ჩვენი მიზანია არა მხოლოდ დაავადების არარსებობა, არამედ ადამიანის ბიოლოგიური პოტენციალის მაქსიმიზაცია — ზუსტ მონაცემებსა და მეცნიერებაზე დაყრდნობით.',
  hero_body_en: 'Our goal is not merely the absence of disease, but the maximisation of human biological potential — grounded in precise data and science.',
  hero_cta_primary_ka: 'დაიწყეთ თქვენი მოგზაურობა',
  hero_cta_primary_en: 'Start Your Journey',
  hero_cta_secondary_ka: 'გაიგეთ მეტი',
  hero_cta_secondary_en: 'Discover More',
  journey_heading_ka: 'თქვენი გზა — ოთხი ნაბიჯი',
  journey_heading_en: 'Your Journey in Four Steps',
  journey_stages: [
    {
      _key: 'stage-1',
      number: 1,
      title_ka: 'იდენტიფიკაცია',
      title_en: 'Identification',
      body_ka: 'თქვენი მოგზაურობა იწყება 360° ბიოლოგიური აუდიტით. ჩვენ ვაანალიზებთ თქვენს ფიზიკურ მაჩვენებლებს, მეტაბოლიზმს, VO₂ Max-ს, ეპიგენეტიკასა და მიკრობიომს.',
      body_en: 'Your journey begins with a 360° biological audit. We analyse your physical metrics, metabolism, VO₂ Max, epigenetics, and microbiome.',
    },
    {
      _key: 'stage-2',
      number: 2,
      title_ka: 'მოდელირება',
      title_en: 'Modelling',
      body_ka: 'მიღებული მონაცემების საფუძველზე ვქმნით თქვენი ჯანმრთელობის ინდივიდუალურ მოდელს — პერსონალურ დღეგრძელობის რუქას.',
      body_en: 'Based on the gathered data, we build your individual health model — your personal longevity map.',
    },
    {
      _key: 'stage-3',
      number: 3,
      title_ka: 'ოპტიმიზაცია',
      title_en: 'Optimisation',
      body_ka: 'ვიწყებთ მიზნობრივ თერაპიებს — IHHT და Red Light — უჯრედული ენერგიის აღსადგენად და შესაძლებლობების მაქსიმიზაციისთვის.',
      body_en: 'We begin targeted therapies — IHHT and Red Light — to restore your cellular energy and maximise your capabilities.',
    },
    {
      _key: 'stage-4',
      number: 4,
      title_ka: 'ევოლუცია',
      title_en: 'Evolution',
      body_ka: 'ჩვენი ექსპერტები რეგულარულად აფასებენ თქვენს პროგრესს და განაახლებენ სტრატეგიას — განუწყვეტელი, გაზომვადი გაუმჯობესებისთვის.',
      body_en: 'Our experts regularly assess your progress and refine the strategy — for continuous, measurable improvement.',
    },
  ],
  pillars_heading_ka: 'სამი მიმართულება\nერთი მიზანი',
  pillars_heading_en: 'Three Pillars\nOne Purpose',
  tech_heading_ka: 'ინოვაციური დიაგნოსტიკა — სიზუსტის ხელოვნება',
  tech_heading_en: 'The Science Behind the Results',
  tech_intro_ka: 'ოპტიმიზაციის დაწყებამდე ჩვენ ზუსტად ვზომავთ თქვენს ბიოლოგიურ საწყის მდგომარეობას — მსოფლიოს წამყვანი ტექნოლოგიებით.',
  tech_intro_en: "Before optimisation begins, we precisely measure your biological baseline using the world's leading technologies.",
  packages_heading_ka: 'ინვესტიცია თქვენს მომავალში',
  packages_heading_en: 'Invest in Your Future',
  packages_subtext_ka: 'ჩვენ არ გთავაზობთ სტანდარტულ პროცედურებს. ჩვენ გთავაზობთ სიცოცხლის გახანგრძლივების მეცნიერულად დასაბუთებულ, პერსონალურ სტრატეგიას.',
  packages_subtext_en: 'We do not offer standard procedures. We provide a scientifically validated, personalised strategy for extending your life.',
  membership_heading_ka: 'გახდით წევრი',
  membership_heading_en: 'Become a Member',
  team_heading_ka: 'თქვენი დღეგრძელობის გუნდი',
  team_heading_en: 'Your Longevity Team',
  team_subtext_ka: 'ხუთი ექიმი. ერთი საერთო ხედვა. საქართველოსა და საერთაშორისო სცენაზე დაგროვილი გამოცდილება — გაერთიანებული ქვეყნის პირველი სპეციალიზებული დღეგრძელობის კლინიკის შესაქმნელად.',
  team_subtext_en: "Five physicians. One shared vision. Years of combined experience across Georgia and internationally — brought together to build the country's first dedicated longevity clinic.",
  cta_heading_ka: 'შეწყვიტეთ ვარაუდი\nდაიწყეთ გაზომვა',
  cta_heading_en: 'Stop Guessing\nStart Measuring',
  cta_subtext_ka: 'დაჯავშნეთ პირველი კონსულტაცია და მიიღეთ სრული ბიოლოგიური შეფასება.',
  cta_subtext_en: 'Book your initial consultation and receive a complete biological assessment.',
  cta_button_ka: 'კონსულტაციის დაჯავშნა',
  cta_button_en: 'Book a Consultation',
}

// ─── About Page ───────────────────────────────────────────────────────────────
const aboutPageDoc = {
  _type: 'aboutPage',
  _id: 'aboutPage-singleton',
  h1_ka: 'ერთი მეცნიერება\nერთი ჯანმრთელობა\nერთი მომავალი',
  h1_en: 'One Science\nOne Health\nOne Future',
  philosophy_ka: 'Longevity One არის ინოვაციური პრევენციული მედიცინის ცენტრი, რომელიც სცილდება ტრადიციული მედიცინის ჩარჩოებს. ჩვენი მიზანია ადამიანის ბიოლოგიური პოტენციალის მაქსიმიზაცია — ზუსტი მონაცემებისა და სამეცნიერო მიდგომის საფუძველზე.',
  philosophy_en: 'Longevity One is an innovative preventive medicine centre that steps beyond the boundaries of traditional medicine. Our aim is the maximisation of human biological potential — grounded in precise data and a rigorous scientific approach.',
  why_pillars: [
    {
      _key: 'pillar-1',
      title_ka: 'სამეცნიერო სიზუსტე',
      title_en: 'Scientific Precision',
      body_ka: 'ექსკლუზიური პარტნიორობა PNOE-სთან, TrueDiagnostic-თან და Enbiosis-თან საქართველოში.',
      body_en: 'Exclusive partnership with PNOE, TrueDiagnostic, and Enbiosis in Georgia.',
    },
    {
      _key: 'pillar-2',
      title_ka: 'მონაცემებზე დაფუძნებული მიდგომა',
      title_en: 'Data-Driven',
      body_ka: 'საქართველოში პირველი კომპლექსური მეტაბოლური მონაცემთა ბაზის შექმნა.',
      body_en: 'Establishing the first comprehensive metabolic database in Georgia.',
    },
    {
      _key: 'pillar-3',
      title_ka: 'ინოვაციური თერაპია',
      title_en: 'Advanced Therapy',
      body_ka: 'IHHT და Red Light თერაპია — ღრმა უჯრედული განახლებისთვის.',
      body_en: 'IHHT and Red Light therapy for deep cellular renewal.',
    },
  ],
  founding_story_heading_ka: 'დაარსების ისტორია',
  founding_story_heading_en: 'Our Story',
  founding_story_ka: textToPortableText(`Longevity One ხუთი ქართველი ექიმის მიერ დაარსდა, რომელთაც სამედიცინო უნივერსიტეტიდან მოყოლებული მრავალწლიანი მეგობრობა აკავშირებთ. თითოეულმა მათგანმა გამორჩეული კარიერა შექმნა — ზოგმა საქართველოში, ზოგმა კი საზღვარგარეთ — თუმცა წლების განმავლობაში მათ ერთი საერთო მიზანი აერთიანებდათ: საკუთარი ცოდნის სამშობლოში დაბრუნება და ადამიანების ჯანმრთელობაზე ნამდვილი, გრძელვადიანი გავლენის მოხდენა.

სამუშაო სფეროს არჩევანი ბუნებრივი იყო. სიცოცხლის ხანგრძლივობის მედიცინა — პრევენციული, მონაცემებზე დაფუძნებული და პერსონალიზებული — სწორედ ის მიმართულება აღმოჩნდა, რომლის ნაკლებობასაც საქართველო განიცდიდა. მეცნიერება და ტექნოლოგია უკვე არსებობდა, ჩვენი მისია კი ამ ყველაფრისთვის რეალური ფორმის მიცემა და მისი ქვეყანაში დანერგვა გახდა.

Longevity One ერთი ურყევი რწმენით შეიქმნა: მედიცინა მხოლოდ დაავადების არარსებობით არ უნდა შემოიფარგლებოდეს. მისი ჭეშმარიტი დანიშნულებაა, დაეხმაროს ადამიანს იცხოვროს არა მხოლოდ უფრო დიდხანს — არამედ უკეთესად.`),
  founding_story_en: textToPortableText(`Longevity One was founded by five Georgian physicians who have been close friends since medical school. Each built a distinguished career — some in Georgia, some abroad — and for years they shared one ambition: to bring their collective expertise home and make a genuine, lasting contribution to people's health in their country.

The choice of field was clear. Longevity medicine — preventive, data-driven, deeply personalised — was a discipline Georgia simply lacked. The science existed. The technology existed. The commitment to build something real around it did too.

They founded Longevity One on a single conviction: medicine should not stop at the absence of disease. Its true purpose is to help people live not just longer — but better.`),
}

// ─── Corporate Page ───────────────────────────────────────────────────────────
const corporatePageDoc = {
  _type: 'corporatePage',
  _id: 'corporatePage-singleton',
  h1_ka: 'ინვესტიცია ადამიანურ კაპიტალში',
  h1_en: 'Investing in Human Capital',
  intro_ka: 'ჯანმრთელი, ენერგიული გუნდი კომპანიის ყველაზე ძლიერი კონკურენტული უპირატესობაა. Longevity One გთავაზობთ კორპორატიულ ჯანმრთელობის პროგრამებს, რომლებიც ზრდის პროდუქტიულობას, ამცირებს პროფესიული გადაღლის რისკს და იცავს კომპანიის ყველაზე ღირებულ რესურსს.',
  intro_en: "A healthy, energised team is a company's strongest competitive advantage. Longevity One offers corporate wellness programmes that increase productivity, reduce burnout risk, and protect a company's most valuable resource.",
  programmes: [
    {
      _key: 'prog-1',
      number: 1,
      title_ka: 'აღმასრულებლების დღეგრძელობა',
      title_en: 'Executive Longevity',
      body_ka: 'C-level მენეჯერებისთვის — ენერგიის მართვისა და გონებრივი სიცხადის სპეციალიზებული პროგრამები.',
      body_en: 'Advanced energy management and mental clarity programmes tailored for C-level leadership.',
      icon: 'briefcase',
    },
    {
      _key: 'prog-2',
      number: 2,
      title_ka: 'ჯანმრთელობა და პროდუქტიულობა',
      title_en: 'Health & Productivity',
      body_ka: 'გუნდური მეტაბოლური აუდიტი პროფესიული გადაღლის რისკების შემცირებისა და შრომისუნარიანობის გაზრდისთვის.',
      body_en: 'Team-wide metabolic audits to significantly reduce burnout risk and improve sustained performance.',
      icon: 'users',
    },
    {
      _key: 'prog-3',
      number: 3,
      title_ka: 'სტრატეგიული პარტნიორობა',
      title_en: 'Strategic Partnerships',
      body_ka: 'კლინიკებთან, სპორტულ ფედერაციებთან და კორპორაციებთან სტრატეგიული თანამშრომლობა.',
      body_en: 'Strategic collaborations with clinics, sports federations, and corporations.',
      icon: 'handshake',
    },
  ],
  cta_label_ka: 'კორპორატიული პარტნიორობისთვის დაგვიკავშირდით',
  cta_label_en: 'Contact Us for Corporate Partnerships',
}

// ─── Journey Page ─────────────────────────────────────────────────────────────
const journeyPageDoc = {
  _type: 'journeyPage',
  _id: 'journeyPage-singleton',
  h1_ka: 'თქვენი მოგზაურობა — 8 ეტაპი',
  h1_en: 'Your Journey — 8 Stages',
  intro_ka: 'Longevity One-ში ყველაფერი სისტემატური და პერსონალიზებულია — ციფრული ონბორდინგიდან 12-კვირიანი მიკრო-კოუჩინგით დასრულებამდე.',
  intro_en: 'At Longevity One, everything is systematic and personalised — from digital onboarding through to 12 weeks of micro-coaching.',
}

// ─── FAQ Page ─────────────────────────────────────────────────────────────────
const faqPageDoc = {
  _type: 'faqPage',
  _id: 'faqPage-singleton',
  h1_ka: 'ხშირად დასმული კითხვები',
  h1_en: 'Frequently Asked Questions',
}

// ─── Team Page ────────────────────────────────────────────────────────────────
const teamPageDoc = {
  _type: 'teamPage',
  _id: 'teamPage-singleton',
  h1_ka: 'ჩვენი გუნდი',
  h1_en: 'Our Team',
  founders_heading_ka: 'დამფუძნებლები',
  founders_heading_en: 'The Founders',
  founders_subtext_ka: 'ხუთი ექიმი. ერთი საერთო ხედვა. საქართველოსა და საერთაშორისო სცენაზე დაგროვილი გამოცდილება — გაერთიანებული ქვეყნის პირველი სპეციალიზებული დღეგრძელობის კლინიკის შესაქმნელად.',
  founders_subtext_en: "Five physicians. One shared vision. Years of combined experience across Georgia and internationally — brought together to build the country's first dedicated longevity clinic.",
  clinic_team_heading_ka: 'კლინიკის გუნდი',
  clinic_team_heading_en: 'The Clinic Team',
}

// ─── Services ─────────────────────────────────────────────────────────────────
const serviceDocs = [
  {
    _type: 'service',
    _id: 'service-longevity',
    title_ka: 'დღეგრძელობა',
    title_en: 'Longevity',
    slug: { _type: 'slug', current: 'longevity' },
    summary_ka: 'დაბერების პროცესის შენელება და ბიოლოგიური ასაკის მართვა — მაღალი პროდუქტიულობის შენარჩუნებისთვის.',
    summary_en: 'Slowing the ageing process and managing your biological age to sustain peak productivity.',
    intro_ka: 'დაბერების პროცესის შენელება და ბიოლოგიური ასაკის მართვა — მაღალი პროდუქტიულობის შენარჩუნებისთვის.',
    intro_en: 'Slowing the ageing process and managing your biological age to sustain peak productivity.',
    body_ka: textToPortableText('ჩვენი დღეგრძელობის პროგრამა განკუთვნილია C-level მენეჯერებისთვის, ბიზნეს ლიდერებისთვის და 40+ ასაკის პირებისთვის, ვინც ორიენტირებულია მაღალ პროდუქტიულობაზე. ჩვენ ვაერთიანებთ PNOE მეტაბოლურ ანალიზს, TrueDiagnostic-ის TrueAge ეპიგენეტიკურ ტესტირებასა და Enbiosis მიკრობიომის კვლევას — რათა ზუსტად გავიგოთ, რა სიჩქარით ბერდება თქვენი ორგანიზმი და როგორ შევანელოთ ეს პროცესი. შედეგი: თქვენი რეალური ბიოლოგიური ასაკი და ზუსტი, მოქმედებაზე ორიენტირებული გეგმა მის შესამცირებლად.'),
    body_en: textToPortableText("Our Longevity programme is designed for C-level executives, business leaders, and high-performers over 40. We combine PNOE metabolic analysis, TrueDiagnostic's TrueAge epigenetic testing, and Enbiosis microbiome research to understand precisely how fast your body is ageing — and how to slow that process. The result: your real biological age and a precise, action-oriented plan to reduce it."),
    icon: 'dna',
    order: 1,
  },
  {
    _type: 'service',
    _id: 'service-metabolic',
    title_ka: 'მეტაბოლური ჯანმრთელობა',
    title_en: 'Metabolic Health',
    slug: { _type: 'slug', current: 'metabolic' },
    summary_ka: 'ნივთიერებათა ცვლის ოპტიმიზაცია და პერსონალიზებული კვება — თქვენი უჯრედული მეტაბოლიზმის მონაცემებზე დაყრდნობით.',
    summary_en: 'Optimising metabolism and personalised nutrition based entirely on your cellular metabolic data.',
    intro_ka: 'ნივთიერებათა ცვლის ოპტიმიზაცია და პერსონალიზებული კვება — თქვენი უჯრედული მეტაბოლიზმის მონაცემებზე დაყრდნობით.',
    intro_en: 'Optimising metabolism and personalised nutrition based entirely on your cellular metabolic data.',
    differentiator_ka: 'ჩვენი ცენტრი ფოკუსირებულია არა სტანდარტულ დიეტებზე, არამედ ნივთიერებათა ცვლის ბიოლოგიურ ოპტიმიზაციაზე. PNOE მეტაბოლური ტესტირებისა და Enbiosis მიკრობიომის ანალიზის კომბინაცია გამორიცხავს ვარაუდს — ეფუძნება ზუსტ გაზომვებს — და „იო-იო" ეფექტს სრულად გამორიცხავს.',
    differentiator_en: 'Our centre focuses on the biological optimisation of metabolism rather than generic diets. Combining PNOE metabolic testing with Enbiosis microbiome analysis eliminates guesswork, relies on precise measurements, and fully prevents the yo-yo effect during weight loss.',
    icon: 'activity',
    order: 2,
  },
  {
    _type: 'service',
    _id: 'service-performance',
    title_ka: 'ელიტური პერფორმანსი',
    title_en: 'Elite Performance',
    slug: { _type: 'slug', current: 'performance' },
    summary_ka: 'ფიზიკური შესაძლებლობების პიკი და სწრაფი აღდგენა — მეცნიერული უპირატესობით.',
    summary_en: 'Peak physical capability and accelerated recovery, backed by science.',
    intro_ka: 'ფიზიკური შესაძლებლობების პიკი და სწრაფი აღდგენა — მეცნიერული უპირატესობით.',
    intro_en: 'Peak physical capability and accelerated recovery, backed by science.',
    targetAudience_ka: 'პროფესიონალი სპორტსმენები (რაგბი, ჭიდაობა, ფეხბურთი), სპორტული ფედერაციები, ოლიმპიური რეზერვი, მაღალი ეფექტიანობის მქონე აღმასრულებლები',
    targetAudience_en: 'Professional athletes (rugby, wrestling, football), sports federations, Olympic reserves, high-performing executives',
    body_ka: textToPortableText('Longevity One-ის Elite Performance პროგრამა გთავაზობთ მეცნიერულ უპირატესობას — პროფესიონალი სპორტსმენისთვის და მაღალი ეფექტიანობის მქონე ლიდერისთვის. IHHT თერაპია ქმნის „მაღალმთიანი შეკრების" ეფექტს თბილისში, განაახლებს მიტოქონდრიებს და ზრდის ენერგეტიკულ გამომავლობას. Red Light თერაპია კი უზრუნველყოფს კუნთოვანი ქსოვილის სწრაფ რეგენერაციას ფიზიკური დატვირთვის შემდეგ. PNOE-ს VO₂ Max ტესტი გვიჩვენებს თქვენს ზუსტ ფიზიკურ პოტენციალს — და სად არის ზრდის ყველაზე დიდი რეზერვი.'),
    body_en: textToPortableText("Longevity One's Elite Performance programme delivers a scientific edge for professional athletes and high-performing leaders alike. IHHT creates an altitude training effect in Tbilisi, renewing mitochondria and boosting energy output. Red Light therapy ensures rapid muscle tissue regeneration post-exertion. PNOE VO₂ Max testing reveals your precise physical potential — and where the greatest room for growth lies."),
    icon: 'zap',
    order: 3,
  },
]

// ─── Technologies ─────────────────────────────────────────────────────────────
const technologyDocs = [
  {
    _type: 'technology',
    _id: 'tech-pnoe',
    name: 'PNOE',
    slug: { _type: 'slug', current: 'pnoe' },
    order: 1,
    tagline_ka: 'მეტაბოლიზმის „ოქროს სტანდარტი"',
    tagline_en: 'The gold standard of metabolism testing',
    whatItIs_ka: 'ეს არის თქვენი მეტაბოლიზმის „ოქროს სტანდარტი". სპეციალური ნიღბისა და სუნთქვის ანალიზის საშუალებით ჩვენ ზუსტად ვზომავთ, როგორ მოიხმარს თქვენი ორგანიზმი ჟანგბადს და როგორ წვავს ენერგიას — ნახშირწყლებსა და ცხიმებს.',
    whatItIs_en: 'The gold standard of metabolism testing. Using a specialised mask and breath analysis, we precisely measure how your body consumes oxygen and burns energy — carbohydrates and fats.',
    whatItShows_ka: 'თქვენს VO₂ Max-ს — გულ-სისხლძარღვოვანი სისტემის ჯანმრთელობისა და სიცოცხლის ხანგრძლივობის ერთ-ერთ უძლიერეს ინდიკატორს.',
    whatItShows_en: 'Your VO₂ Max — one of the most powerful indicators of cardiovascular health and longevity.',
    yourBenefit_ka: 'ჩვენ ვწყვეტთ ვარაუდს და ზუსტად გეტყვით, რომელი კვება და ვარჯიში არის ეფექტური სწორედ თქვენი მეტაბოლიზმისთვის — „იო-იო" ეფექტის გარეშე.',
    yourBenefit_en: 'We eliminate guesswork and tell you precisely which nutrition and exercise approach is effective for your specific metabolism — preventing the yo-yo effect.',
  },
  {
    _type: 'technology',
    _id: 'tech-ihht',
    name: 'IHHT',
    slug: { _type: 'slug', current: 'ihht' },
    order: 2,
    tagline_ka: 'უჯრედული გაკაჟება',
    tagline_en: 'Train your cells, not just your muscles',
    whatItIs_ka: 'ეს არის უჯრედული გაკაჟების მეთოდი, რომელიც „მაღალმთიანი შეკრების" ეფექტს ქმნის. თერაპია ეფუძნება 2019 წლის ნობელის პრემიის ლაურეატების აღმოჩენას — თუ როგორ ადაპტირდებიან უჯრედები ჟანგბადის ცვალებად დონესთან.',
    whatItIs_en: 'A cellular conditioning method that creates an altitude training effect. Based on the 2019 Nobel Prize-winning discovery of how cells sense and adapt to varying oxygen levels.',
    howItWorks_ka: 'ჟანგბადის კონტროლირებული ცვალებადობა პირდაპირ მოქმედებს თქვენს მიტოქონდრიებზე — უჯრედის „ელექტროსადგურებზე". ძველი, დაზიანებული მიტოქონდრიები იშლება და ანაცვლდება ახალი, ჯანსაღი, ენერგეტიკული მიტოქონდრიებით.',
    howItWorks_en: 'Controlled oxygen fluctuation directly stimulates your mitochondria — the powerhouses of your cells. Old, damaged mitochondria are cleared and replaced with new, healthy, high-performing ones.',
    benefits_ka: ['მიტოქონდრიების განახლება — დაზიანებული მიტოქონდრიები იშლება, ახალი და მაღალპროდუქტიული ჩნდება', 'ენერგიის ზრდა — უჯრედული ენერგიისა და მეტაბოლიზმის მნიშვნელოვანი გაუმჯობესება', 'რეგენერაცია და პერფორმანსი — სწრაფი აღდგენა და პიკური ფიზიკური შესაძლებლობების მიღწევა', 'კომფორტული პროცედურა — თერაპია ხდება მშვიდ, დასვენების გარემოში'],
    benefits_en: ['Mitochondrial renewal — damaged mitochondria cleared, replaced with highly productive ones', 'Energy maximisation — significant improvement in cellular energy and metabolism', 'Regeneration & performance — accelerated recovery and peak physical capability', 'Comfortable experience — therapy conducted in a calm, restful environment'],
    namingNote: 'Always use full name "Intermittent Hypoxic-Hyperoxic Training" on first mention per page.',
  },
  {
    _type: 'technology',
    _id: 'tech-red-light',
    name: 'Red Light Therapy',
    slug: { _type: 'slug', current: 'red-light' },
    order: 3,
    tagline_ka: 'ფოტო-ბიომოდულაცია',
    tagline_en: 'Cellular regeneration through light',
    whatItIs_ka: 'Red Light თერაპია (ფოტო-ბიომოდულაცია) გამოიყენებს კონკრეტული სიგრძის ტალღის წითელ და ახლო ინფრაწითელ სინათლეს, რომელიც ღრმად აღწევს ქსოვილებში და ააქტიურებს ბიოლოგიურ პროცესებს — მავნე ულტრაიისფერი სხივების გარეშე.',
    whatItIs_en: 'Red Light Therapy (photobiomodulation) uses specific-wavelength red and near-infrared light that penetrates deep into tissues and activates biological processes — without harmful UV radiation.',
    howItWorks_ka: 'სინათლის ტალღები ასტიმულირებს მიტოქონდრიულ აქტივობასა და ATP-ის გამომუშავებას, აჩქარებს კოლაგენის სინთეზს და ამცირებს ანთებას — ბუნებრივი „დამტენის" ეფექტით თქვენი უჯრედებისთვის.',
    howItWorks_en: 'Light waves stimulate mitochondrial activity and ATP production, accelerate collagen synthesis, and reduce inflammation — acting as a natural cellular charger.',
    benefits_ka: ['სწრაფი რეგენერაცია — კუნთებისა და სახსრების ეფექტიანი აღდგენა ფიზიკური დატვირთვის შემდეგ', 'ანთების საწინააღმდეგო ეფექტი — ორგანიზმში სუბკლინიკური ანთებითი პროცესების შემცირება', 'ესთეტიკური განახლება — კანის ელასტიურობის გაუმჯობესება და კოლაგენის სტიმულაცია'],
    benefits_en: ['Rapid regeneration — effective muscle and joint recovery post-exertion', 'Anti-inflammatory effect — reduction of subclinical inflammatory processes', 'Aesthetic renewal — improved skin elasticity and collagen stimulation'],
    namingNote: 'Uses specific wavelengths in the red and near-infrared spectrum (~630–850nm). Do NOT describe as "low-frequency."',
  },
  {
    _type: 'technology',
    _id: 'tech-truediagnostic',
    name: 'TrueDiagnostic',
    slug: { _type: 'slug', current: 'truediagnostic' },
    order: 4,
    tagline_ka: 'გაიგეთ თქვენი ბიოლოგიური ასაკი',
    tagline_en: 'Know your biological age',
    whatItIs_ka: 'TrueAge — TrueDiagnostic-ის ყველაზე ზუსტი ტესტი თქვენი რეალური ბიოლოგიური ასაკის დასადგენად. კვლევა ეყრდნობა დნმ-ის მეთილირების ანალიზს, რომელიც გვიჩვენებს, რა სიჩქარით ბერდება თქვენი ორგანიზმი უჯრედულ დონეზე.',
    whatItIs_en: 'TrueAge is the most accurate test available to determine your real biological age, developed by TrueDiagnostic. It relies on DNA methylation analysis to show how fast your body is ageing at the cellular level.',
    whatItShows_ka: 'პასუხობს კითხვას: შეესაბამება თუ არა თქვენი ბიოლოგიური მდგომარეობა თქვენს ქრონოლოგიურ ასაკს?',
    whatItShows_en: 'Answers the crucial question: does your biological state match your chronological age?',
    yourBenefit_ka: 'შეძლებთ მართოთ თქვენი ბიოლოგიური დრო. თუ თქვენი ბიოლოგიური ასაკი პასპორტის მონაცემებს აჭარბებს, ჩვენი გეგმა დაგეხმარებათ ამ პროცესის შეფერხებასა და შებრუნებაში.',
    yourBenefit_en: 'You gain the ability to manage your biological time. If your biological age exceeds your passport age, our plan will help slow and reverse that process.',
    clinicalNote_ka: 'აშშ-ში მდებარე ლაბორატორია. Longevity One ფლობს ექსკლუზიურ პარტნიორობას TrueDiagnostic-თან საქართველოში.',
    clinicalNote_en: 'US-based laboratory. Longevity One holds exclusive partnership for TrueDiagnostic in Georgia.',
    namingNote: 'TrueDiagnostic = company. TrueAge = the specific test. Use both correctly on every page.',
  },
  {
    _type: 'technology',
    _id: 'tech-enbiosis',
    name: 'Enbiosis',
    slug: { _type: 'slug', current: 'enbiosis' },
    order: 5,
    tagline_ka: 'ნაწლავები — ჯანმრთელობის გასაღები',
    tagline_en: 'Your gut holds the key to your health',
    whatItIs_ka: 'ხელოვნური ინტელექტის საფუძველზე შემუშავებული ნაწლავის მიკრობიომის სიღრმისეული კვლევა. პროცესი მოიცავს მიკრობიომის გენეტიკური სექვენირებისა და ინტელექტური ანალიზის ეტაპებს — ზუსტად განსაზღვრავს თქვენი შინაგანი ეკოსისტემის მდგომარეობას.',
    whatItIs_en: 'An AI-powered, in-depth gut microbiome analysis. The process involves genetic sequencing followed by intelligent data analysis — accurately determining the state of your internal ecosystem.',
    whatItShows_ka: 'როგორ მოქმედებს თქვენი შინაგანი ფლორა იმუნიტეტზე, ენერგეტიკულ დონეზე და ნივთიერებათა ცვლაზე.',
    whatItShows_en: 'How your internal flora influences immunity, energy levels, and metabolism.',
    yourBenefit_ka: 'მიკრობიომის ბალანსის აღდგენით ვაუმჯობესებთ ნივთიერებათა ცვლას უჯრედულ დონეზე და გთავაზობთ პერსონალიზებულ კვებით რეკომენდაციებს — სწორედ თქვენი ფლორის შემადგენლობის მიხედვით.',
    yourBenefit_en: 'By restoring microbiome balance, we improve metabolism at the cellular level and provide highly personalised nutritional recommendations tailored to your specific flora.',
    clinicalNote_ka: 'Longevity One ფლობს ექსკლუზიურ პარტნიორობას Enbiosis-თან საქართველოში.',
    clinicalNote_en: 'Longevity One holds exclusive partnership for Enbiosis in Georgia.',
  },
]

// ─── FAQ Items ─────────────────────────────────────────────────────────────────
const faqItemDocs = [
  {
    _type: 'faqItem',
    _id: 'faq-what-is-longevity',
    question_ka: 'რა არის დღეგრძელობის მედიცინა?',
    question_en: 'What is longevity medicine?',
    answer_ka: textToPortableText('დღეგრძელობის მედიცინა არის პრევენციული მიდგომა, რომელიც ფოკუსირებულია დაბერების პროცესის შენელებაზე და ჯანმრთელობის ოპტიმიზაციაზე — დაავადების გამოვლენამდე. ჩვენ ვიყენებთ მონაცემებზე დაფუძნებულ დიაგნოსტიკას და პერსონალიზებულ თერაპიებს.'),
    answer_en: textToPortableText('Longevity medicine is a preventive approach focused on slowing the ageing process and optimising health — before disease manifests. We use data-driven diagnostics and personalised therapies.'),
    category: 'general',
    order: 1,
  },
  {
    _type: 'faqItem',
    _id: 'faq-who-is-it-for',
    question_ka: 'ვისთვის არის განკუთვნილი Longevity One?',
    question_en: 'Who is Longevity One for?',
    answer_ka: textToPortableText('ჩვენი სერვისები განკუთვნილია ნებისმიერი ასაკის ადამიანისთვის, ვინც ორიენტირებულია პრევენციაზე და ჯანმრთელობის ოპტიმიზაციაზე. განსაკუთრებით რეკომენდებულია 35+ ასაკის პირებისთვის, C-level მენეჯერებისთვის, პროფესიონალი სპორტსმენებისთვის და მათთვის, ვისაც სურს მაქსიმალური პროდუქტიულობის შენარჩუნება.'),
    answer_en: textToPortableText('Our services are designed for anyone focused on prevention and health optimisation. Especially recommended for individuals 35+, C-level executives, professional athletes, and those who want to maintain peak productivity.'),
    category: 'general',
    order: 2,
  },
  {
    _type: 'faqItem',
    _id: 'faq-first-visit',
    question_ka: 'როგორ გამოიყურება პირველი ვიზიტი?',
    question_en: 'What does the first visit look like?',
    answer_ka: textToPortableText('პირველი ვიზიტი მოიცავს სრულ ბიოლოგიურ აუდიტს: PNOE მეტაბოლური ტესტირება და დეტალური კონსულტაცია ჩვენს ექიმთან. ვიზიტი გრძელდება დაახლოებით 2-3 საათს.'),
    answer_en: textToPortableText('The first visit includes a complete biological audit: PNOE metabolic testing and a detailed consultation with our physician. The visit lasts approximately 2-3 hours.'),
    category: 'services',
    order: 3,
  },
  {
    _type: 'faqItem',
    _id: 'faq-ihht-safety',
    question_ka: 'უსაფრთხოა თუ არა IHHT თერაპია?',
    question_en: 'Is IHHT therapy safe?',
    answer_ka: textToPortableText('დიახ, IHHT თერაპია აბსოლუტურად უსაფრთხოა და ეფუძნება 2019 წლის ნობელის პრემიის ლაურეატების კვლევას. თერაპია ტარდება სამედიცინო ზედამხედველობით და ინდივიდუალურად მორგებული პარამეტრებით.'),
    answer_en: textToPortableText('Yes, IHHT therapy is completely safe and is based on research by 2019 Nobel Prize laureates. The therapy is conducted under medical supervision with individually calibrated parameters.'),
    category: 'therapies',
    order: 4,
  },
  {
    _type: 'faqItem',
    _id: 'faq-results-timeline',
    question_ka: 'რამდენ ხანში ვნახავ შედეგებს?',
    question_en: 'How soon will I see results?',
    answer_ka: textToPortableText('პირველი ცვლილებები შესაძლოა შეიმჩნეოს 2-4 კვირაში — ენერგიის დონის ზრდა, ძილის ხარისხის გაუმჯობესება. მნიშვნელოვანი ბიოლოგიური ცვლილებები, როგორიცაა ბიოლოგიური ასაკის შემცირება, საჭიროებს 3-6 თვეს.'),
    answer_en: textToPortableText('Initial changes may be noticed within 2-4 weeks — increased energy levels, improved sleep quality. Significant biological changes, such as biological age reduction, require 3-6 months.'),
    category: 'results',
    order: 5,
  },
  {
    _type: 'faqItem',
    _id: 'faq-pricing',
    question_ka: 'რა ღირს პროგრამები?',
    question_en: 'What do the programmes cost?',
    answer_ka: textToPortableText('ფასები დამოკიდებულია არჩეულ პროგრამაზე და თქვენს ინდივიდუალურ საჭიროებებზე. საწყისი კონსულტაცია და ბიოლოგიური აუდიტი იწყება 500 ლარიდან. დეტალური ფასების მისაღებად დაგვიკავშირდით.'),
    answer_en: textToPortableText('Prices depend on the chosen programme and your individual needs. Initial consultation and biological audit starts from 500 GEL. Contact us for detailed pricing.'),
    category: 'pricing',
    order: 6,
  },
]

// ─── Team Members ──────────────────────────────────────────────────────────────
const teamMemberDocs = [
  {
    _type: 'teamMember',
    _id: 'team-founder-1',
    name_ka: 'დავით ჯანაშვილი',
    name_en: 'David Janashvili',
    role_ka: 'თანადამფუძნებელი, სამედიცინო დირექტორი',
    role_en: 'Co-founder, Medical Director',
    specialty_ka: 'პრევენციული მედიცინა, მეტაბოლური ჯანმრთელობა',
    specialty_en: 'Preventive Medicine, Metabolic Health',
    bio_ka: textToPortableText('დავით ჯანაშვილი არის პრევენციული მედიცინის სპეციალისტი 15 წელზე მეტი გამოცდილებით. მან სწავლა გაიარა საქართველოსა და ევროპის წამყვან სამედიცინო ცენტრებში.'),
    bio_en: textToPortableText('David Janashvili is a preventive medicine specialist with over 15 years of experience. He trained at leading medical centres in Georgia and Europe.'),
    isFounder: true,
    order: 1,
  },
  {
    _type: 'teamMember',
    _id: 'team-founder-2',
    name_ka: 'გიორგი მაისურაძე',
    name_en: 'Giorgi Maisuradze',
    role_ka: 'თანადამფუძნებელი, კლინიკური დირექტორი',
    role_en: 'Co-founder, Clinical Director',
    specialty_ka: 'სპორტული მედიცინა, ფიზიკური რეაბილიტაცია',
    specialty_en: 'Sports Medicine, Physical Rehabilitation',
    bio_ka: textToPortableText('გიორგი მაისურაძე არის სპორტული მედიცინის ექსპერტი, რომელიც მუშაობდა პროფესიონალურ სპორტულ გუნდებთან საქართველოსა და საზღვარგარეთ.'),
    bio_en: textToPortableText('Giorgi Maisuradze is a sports medicine expert who has worked with professional sports teams in Georgia and abroad.'),
    isFounder: true,
    order: 2,
  },
  {
    _type: 'teamMember',
    _id: 'team-founder-3',
    name_ka: 'ნინო ბერიძე',
    name_en: 'Nino Beridze',
    role_ka: 'თანადამფუძნებელი, კვლევის დირექტორი',
    role_en: 'Co-founder, Research Director',
    specialty_ka: 'მოლეკულური ბიოლოგია, ეპიგენეტიკა',
    specialty_en: 'Molecular Biology, Epigenetics',
    bio_ka: textToPortableText('ნინო ბერიძე არის მოლეკულური ბიოლოგი, რომელმაც დოქტორანტურა გაიარა აშშ-ში და აქვს მრავალწლიანი კვლევითი გამოცდილება დაბერების მეცნიერებაში.'),
    bio_en: textToPortableText('Nino Beridze is a molecular biologist who completed her PhD in the US and has extensive research experience in the science of ageing.'),
    isFounder: true,
    order: 3,
  },
  {
    _type: 'teamMember',
    _id: 'team-founder-4',
    name_ka: 'ალექსანდრე კვარაცხელია',
    name_en: 'Alexandre Kvaratskhelia',
    role_ka: 'თანადამფუძნებელი, ოპერაციების დირექტორი',
    role_en: 'Co-founder, Operations Director',
    specialty_ka: 'ჯანდაცვის მენეჯმენტი',
    specialty_en: 'Healthcare Management',
    bio_ka: textToPortableText('ალექსანდრე კვარაცხელია არის ჯანდაცვის მენეჯმენტის ექსპერტი, რომელსაც აქვს გამოცდილება საერთაშორისო სამედიცინო ორგანიზაციებში.'),
    bio_en: textToPortableText('Alexandre Kvaratskhelia is a healthcare management expert with experience in international medical organisations.'),
    isFounder: true,
    order: 4,
  },
  {
    _type: 'teamMember',
    _id: 'team-founder-5',
    name_ka: 'მარიამ ჩხაიძე',
    name_en: 'Mariam Chkhaidze',
    role_ka: 'თანადამფუძნებელი, პაციენტთა გამოცდილების დირექტორი',
    role_en: 'Co-founder, Patient Experience Director',
    specialty_ka: 'ინტეგრაციული მედიცინა',
    specialty_en: 'Integrative Medicine',
    bio_ka: textToPortableText('მარიამ ჩხაიძე არის ინტეგრაციული მედიცინის სპეციალისტი, რომელიც ფოკუსირებულია პაციენტზე ორიენტირებულ მიდგომაზე და ჰოლისტურ ჯანმრთელობაზე.'),
    bio_en: textToPortableText('Mariam Chkhaidze is an integrative medicine specialist focused on patient-centred care and holistic health.'),
    isFounder: true,
    order: 5,
  },
]

// ─── Legal Pages ───────────────────────────────────────────────────────────────
const legalPageDocs = [
  {
    _type: 'legalPage',
    _id: 'legal-privacy',
    pageType: 'privacy',
    title_ka: 'კონფიდენციალურობის პოლიტიკა',
    title_en: 'Privacy Policy',
    lastUpdated: '2026-01-01',
    body_ka: textToPortableText(`Longevity One პატივს სცემს თქვენს კონფიდენციალურობას და იცავს თქვენს პერსონალურ მონაცემებს.

ჩვენ ვაგროვებთ მხოლოდ იმ ინფორმაციას, რომელიც აუცილებელია ჩვენი სერვისების მიწოდებისთვის: სახელი, საკონტაქტო ინფორმაცია, სამედიცინო ისტორია და დიაგნოსტიკის შედეგები.

თქვენი მონაცემები ინახება უსაფრთხო სერვერებზე და არ გადაეცემა მესამე მხარეს თქვენი თანხმობის გარეშე, გარდა კანონით გათვალისწინებული შემთხვევებისა.

თქვენ გაქვთ უფლება მოითხოვოთ თქვენი მონაცემების წაშლა ან შესწორება ნებისმიერ დროს.`),
    body_en: textToPortableText(`Longevity One respects your privacy and protects your personal data.

We collect only information necessary to provide our services: name, contact information, medical history, and diagnostic results.

Your data is stored on secure servers and is not shared with third parties without your consent, except as required by law.

You have the right to request deletion or correction of your data at any time.`),
  },
  {
    _type: 'legalPage',
    _id: 'legal-terms',
    pageType: 'terms',
    title_ka: 'მომსახურების პირობები',
    title_en: 'Terms & Conditions',
    lastUpdated: '2026-01-01',
    body_ka: textToPortableText(`Longevity One-ის სერვისებით სარგებლობით თქვენ ეთანხმებით შემდეგ პირობებს:

ჩვენი სერვისები არის საინფორმაციო და პრევენციული ხასიათის და არ ცვლის ტრადიციულ სამედიცინო მკურნალობას.

კლიენტი ვალდებულია მიაწოდოს ზუსტი ინფორმაცია თავისი ჯანმრთელობის მდგომარეობის შესახებ.

ჩვენ ვიტოვებთ უფლებას შევცვალოთ ფასები და სერვისები წინასწარი შეტყობინებით.`),
    body_en: textToPortableText(`By using Longevity One services, you agree to the following terms:

Our services are informational and preventive in nature and do not replace traditional medical treatment.

The client is obligated to provide accurate information about their health status.

We reserve the right to change prices and services with prior notice.`),
  },
  {
    _type: 'legalPage',
    _id: 'legal-cookie',
    pageType: 'cookie',
    title_ka: 'ქუქი-ფაილების პოლიტიკა',
    title_en: 'Cookie Policy',
    lastUpdated: '2026-01-01',
    body_ka: textToPortableText(`ჩვენი ვებსაიტი იყენებს ქუქი-ფაილებს თქვენი გამოცდილების გასაუმჯობესებლად.

აუცილებელი ქუქი-ფაილები: საჭიროა ვებსაიტის ძირითადი ფუნქციონირებისთვის.

ანალიტიკური ქუქი-ფაილები: გვეხმარება გავიგოთ, როგორ იყენებენ ვიზიტორები ჩვენს საიტს.

მარკეტინგული ქუქი-ფაილები: გამოიყენება პერსონალიზებული რეკლამისთვის.

თქვენ შეგიძლიათ მართოთ ქუქი-ფაილების პარამეტრები ბრაუზერის პარამეტრებში.`),
    body_en: textToPortableText(`Our website uses cookies to improve your experience.

Essential cookies: Required for basic website functionality.

Analytics cookies: Help us understand how visitors use our site.

Marketing cookies: Used for personalised advertising.

You can manage cookie settings in your browser preferences.`),
  },
  {
    _type: 'legalPage',
    _id: 'legal-medical-disclaimer',
    pageType: 'medical-disclaimer',
    title_ka: 'სამედიცინო უარყოფა',
    title_en: 'Medical Disclaimer',
    lastUpdated: '2026-01-01',
    body_ka: textToPortableText(`ამ ვებსაიტზე მოცემული ინფორმაცია არის მხოლოდ საგანმანათლებლო მიზნებისთვის და არ წარმოადგენს სამედიცინო რჩევას.

Longevity One-ის სერვისები არ ცვლის ტრადიციულ სამედიცინო დიაგნოსტიკას ან მკურნალობას.

ნებისმიერი სამედიცინო გადაწყვეტილების მიღებამდე გირჩევთ კონსულტაცია გაიაროთ კვალიფიციურ ექიმთან.

ჩვენი თერაპიები და დიაგნოსტიკური მეთოდები ეფუძნება თანამედროვე მეცნიერულ კვლევებს, თუმცა ინდივიდუალური შედეგები შეიძლება განსხვავდებოდეს.`),
    body_en: textToPortableText(`The information provided on this website is for educational purposes only and does not constitute medical advice.

Longevity One services do not replace traditional medical diagnosis or treatment.

We recommend consulting with a qualified physician before making any medical decisions.

Our therapies and diagnostic methods are based on contemporary scientific research, though individual results may vary.`),
  },
]

// ─── Journey Stages (detailed) ─────────────────────────────────────────────────
const journeyStageDocs = [
  {
    _type: 'journeyStage',
    _id: 'journey-stage-1',
    number: 1,
    title_ka: 'ციფრული ონბორდინგი',
    title_en: 'Digital Onboarding',
    body_ka: textToPortableText('თქვენი მოგზაურობა იწყება ონლაინ კითხვარით — ჯანმრთელობის ისტორია, ცხოვრების წესი, მიზნები. ეს ინფორმაცია გვეხმარება მოვემზადოთ თქვენი პირველი ვიზიტისთვის.'),
    body_en: textToPortableText('Your journey begins with an online questionnaire — health history, lifestyle, goals. This information helps us prepare for your first visit.'),
  },
  {
    _type: 'journeyStage',
    _id: 'journey-stage-2',
    number: 2,
    title_ka: '360° ბიოლოგიური აუდიტი',
    title_en: '360° Biological Audit',
    body_ka: textToPortableText('კლინიკაში ჩატარდება სრული ბიოლოგიური შეფასება: PNOE მეტაბოლური ტესტი, ეპიგენეტიკური ანალიზი და მიკრობიომის კვლევა.'),
    body_en: textToPortableText('At the clinic, a complete biological assessment is conducted: PNOE metabolic test, epigenetic analysis, and microbiome research.'),
  },
  {
    _type: 'journeyStage',
    _id: 'journey-stage-3',
    number: 3,
    title_ka: 'მონაცემთა ანალიზი',
    title_en: 'Data Analysis',
    body_ka: textToPortableText('ჩვენი გუნდი აანალიზებს თქვენს მონაცემებს და ქმნის თქვენს პერსონალურ ჯანმრთელობის მოდელს — დღეგრძელობის რუქას.'),
    body_en: textToPortableText('Our team analyses your data and creates your personal health model — your longevity map.'),
  },
  {
    _type: 'journeyStage',
    _id: 'journey-stage-4',
    number: 4,
    title_ka: 'სტრატეგიის პრეზენტაცია',
    title_en: 'Strategy Presentation',
    body_ka: textToPortableText('დეტალური კონსულტაცია, სადაც წარმოგიდგენთ თქვენს შედეგებს და პერსონალიზებულ გეგმას — კვება, ვარჯიში, თერაპიები.'),
    body_en: textToPortableText('A detailed consultation where we present your results and personalised plan — nutrition, exercise, therapies.'),
  },
  {
    _type: 'journeyStage',
    _id: 'journey-stage-5',
    number: 5,
    title_ka: 'თერაპიული ფაზა',
    title_en: 'Therapeutic Phase',
    body_ka: textToPortableText('იწყება მიზნობრივი თერაპიები — IHHT და Red Light — თქვენი ინდივიდუალური გეგმის მიხედვით.'),
    body_en: textToPortableText('Targeted therapies begin — IHHT and Red Light — according to your individual plan.'),
  },
  {
    _type: 'journeyStage',
    _id: 'journey-stage-6',
    number: 6,
    title_ka: 'პროგრესის მონიტორინგი',
    title_en: 'Progress Monitoring',
    body_ka: textToPortableText('რეგულარული შეფასებები და გაზომვები — PNOE ტესტების გამოყენება პროგრესის თვალყურისდევნებისთვის.'),
    body_en: textToPortableText('Regular assessments and measurements to track progress.'),
  },
  {
    _type: 'journeyStage',
    _id: 'journey-stage-7',
    number: 7,
    title_ka: 'სტრატეგიის ადაპტაცია',
    title_en: 'Strategy Adaptation',
    body_ka: textToPortableText('თქვენი პროგრესის მიხედვით ვარეგულირებთ გეგმას — უწყვეტი ოპტიმიზაცია საუკეთესო შედეგისთვის.'),
    body_en: textToPortableText('We adjust the plan based on your progress — continuous optimisation for best results.'),
  },
  {
    _type: 'journeyStage',
    _id: 'journey-stage-8',
    number: 8,
    title_ka: '12-კვირიანი მიკრო-კოუჩინგი',
    title_en: '12-Week Micro-Coaching',
    body_ka: textToPortableText('პროგრამის დასრულების შემდეგ გთავაზობთ 12-კვირიან მხარდაჭერას — რეგულარული ჩექ-ინები და რეკომენდაციები ცხოვრების წესის შესანარჩუნებლად.'),
    body_en: textToPortableText('After programme completion, we offer 12-week support — regular check-ins and recommendations to maintain your lifestyle.'),
  },
]

// ─── Diagnostic Packages ───────────────────────────────────────────────────────
const packageDocs = [
  {
    _type: 'package',
    _id: 'package-starter',
    name_ka: 'STARTER',
    name_en: 'STARTER',
    category: 'diagnostic',
    tier: 1,
    price: 550,
    priceLabel_ka: '550 ₾',
    priceLabel_en: '550 GEL',
    tagline_ka: 'თქვენი ბიოლოგიური ბაზისი',
    tagline_en: 'Your Biological Baseline',
    goal_ka: 'საწყისი პაკეტი მათთვის, ვისაც სურს გაიგოს თავისი ჯანმრთელობის რეალური მდგომარეობა.',
    goal_en: 'Starter package for those who want to understand their true health status.',
    includes_ka: [
      'PNOE მეტაბოლური ანალიზი',
      'საწყისი კონსულტაცია',
      'პერსონალიზებული ანგარიში',
    ],
    includes_en: [
      'PNOE metabolic analysis',
      'Initial consultation',
      'Personalised report',
    ],
    isFeatured: false,
    order: 1,
    cta_label_ka: 'დაჯავშნა',
    cta_label_en: 'Book Now',
  },
  {
    _type: 'package',
    _id: 'package-performance',
    name_ka: 'PERFORMANCE',
    name_en: 'PERFORMANCE',
    category: 'diagnostic',
    tier: 2,
    price: 1200,
    priceLabel_ka: '1,200 ₾',
    priceLabel_en: '1,200 GEL',
    tagline_ka: 'სრული ბიოლოგიური აუდიტი',
    tagline_en: 'Complete Biological Audit',
    goal_ka: 'ყოვლისმომცველი პაკეტი, რომელიც მოიცავს ყველა დიაგნოსტიკურ ტესტს და პერსონალიზებულ გეგმას.',
    goal_en: 'Comprehensive package including all diagnostic tests and a personalised plan.',
    includes_ka: [
      'PNOE მეტაბოლური ანალიზი',
      'TrueAge ეპიგენეტიკური ტესტი',
      'Enbiosis მიკრობიომის ანალიზი',
      'სრული კონსულტაცია',
      'პერსონალიზებული დღეგრძელობის გეგმა',
    ],
    includes_en: [
      'PNOE metabolic analysis',
      'TrueAge epigenetic test',
      'Enbiosis microbiome analysis',
      'Full consultation',
      'Personalised longevity plan',
    ],
    isFeatured: true,
    order: 2,
    cta_label_ka: 'დაჯავშნა',
    cta_label_en: 'Book Now',
  },
  {
    _type: 'package',
    _id: 'package-elite',
    name_ka: 'ELITE',
    name_en: 'ELITE',
    category: 'diagnostic',
    tier: 3,
    price: 2500,
    priceLabel_ka: '2,500 ₾',
    priceLabel_en: '2,500 GEL',
    tagline_ka: 'სრული ტრანსფორმაცია',
    tagline_en: 'Complete Transformation',
    goal_ka: 'ჩვენი ყველაზე სრული პაკეტი — დიაგნოსტიკა, თერაპიები და 12-კვირიანი მხარდაჭერა.',
    goal_en: 'Our most complete package — diagnostics, therapies, and 12-week support.',
    includes_ka: [
      'PERFORMANCE პაკეტის ყველა ფუნქცია',
      '10 IHHT სესია',
      '10 Red Light სესია',
      '12-კვირიანი მიკრო-კოუჩინგი',
      'ყოველთვიური პროგრესის მიმოხილვა',
      'პრიორიტეტული ჯავშანი',
    ],
    includes_en: [
      'All PERFORMANCE package features',
      '10 IHHT sessions',
      '10 Red Light sessions',
      '12-week micro-coaching',
      'Monthly progress reviews',
      'Priority scheduling',
    ],
    isFeatured: false,
    order: 3,
    cta_label_ka: 'დაჯავშნა',
    cta_label_en: 'Book Now',
  },
]

// ─── Membership Tiers ──────────────────────────────────────────────────────────
const membershipDocs = [
  {
    _type: 'package',
    _id: 'membership-silver',
    name_ka: 'Silver',
    name_en: 'Silver',
    category: 'membership',
    price: 200,
    priceLabel_ka: '200 ₾',
    priceLabel_en: '200 GEL',
    priceSuffix_ka: '/თვე',
    priceSuffix_en: '/mo',
    tagline_ka: 'ფორმის შენარჩუნება',
    tagline_en: 'The Maintenance Pass',
    goal_ka: 'წვდომა ძირითად სერვისებზე და წევრობის ფასდაკლებები.',
    goal_en: 'Access to core services and membership discounts.',
    includes_ka: [
      '10% ფასდაკლება ყველა სერვისზე',
      'პრიორიტეტული ჯავშანი',
      'კვარტალური ჩექ-აპი',
    ],
    includes_en: [
      '10% discount on all services',
      'Priority booking',
      'Quarterly check-up',
    ],
    isFeatured: false,
    order: 1,
    cta_label_ka: 'გაწევრიანება',
    cta_label_en: 'Join Now',
  },
  {
    _type: 'package',
    _id: 'membership-gold',
    name_ka: 'Gold',
    name_en: 'Gold',
    category: 'membership',
    price: 500,
    priceLabel_ka: '500 ₾',
    priceLabel_en: '500 GEL',
    priceSuffix_ka: '/თვე',
    priceSuffix_en: '/mo',
    tagline_ka: 'ოპტიმიზაციის გზა',
    tagline_en: 'The Optimisation Path',
    goal_ka: 'გაფართოებული წვდომა თერაპიებზე და პერსონალური მხარდაჭერა.',
    goal_en: 'Extended access to therapies and personal support.',
    includes_ka: [
      '20% ფასდაკლება ყველა სერვისზე',
      '2 IHHT სესია თვეში',
      '2 Red Light სესია თვეში',
      'პერსონალური კოორდინატორი',
    ],
    includes_en: [
      '20% discount on all services',
      '2 IHHT sessions per month',
      '2 Red Light sessions per month',
      'Personal coordinator',
    ],
    isFeatured: true,
    order: 2,
    cta_label_ka: 'გაწევრიანება',
    cta_label_en: 'Join Now',
  },
  {
    _type: 'package',
    _id: 'membership-platinum',
    name_ka: 'Platinum',
    name_en: 'Platinum',
    category: 'membership',
    price: 1000,
    priceLabel_ka: '1,000 ₾',
    priceLabel_en: '1,000 GEL',
    priceSuffix_ka: '/თვე',
    priceSuffix_en: '/mo',
    tagline_ka: 'სრული ტრანსფორმაცია',
    tagline_en: 'Total Transformation',
    goal_ka: 'სრული წვდომა ყველა სერვისზე და ექსკლუზიური პრივილეგიები.',
    goal_en: 'Full access to all services and exclusive privileges.',
    includes_ka: [
      '30% ფასდაკლება ყველა სერვისზე',
      'შეუზღუდავი IHHT სესიები',
      'შეუზღუდავი Red Light სესიები',
      'წლიური TrueAge ტესტი',
      'VIP მომსახურება',
    ],
    includes_en: [
      '30% discount on all services',
      'Unlimited IHHT sessions',
      'Unlimited Red Light sessions',
      'Annual TrueAge test',
      'VIP service',
    ],
    isFeatured: false,
    order: 3,
    cta_label_ka: 'გაწევრიანება',
    cta_label_en: 'Join Now',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════════════════

async function seedSanity(): Promise<void> {
  console.log('🌱 Starting Sanity CMS seeding...\n')
  console.log(`📦 Project: ${projectId}`)
  console.log(`📂 Dataset: ${dataset}\n`)

  try {
    // Singleton documents
    console.log('─── Seeding Singleton Documents ───')
    await createDoc(siteSettingsDoc)
    await createDoc(homePageDoc)
    await createDoc(aboutPageDoc)
    await createDoc(corporatePageDoc)
    await createDoc(journeyPageDoc)
    await createDoc(faqPageDoc)
    await createDoc(teamPageDoc)

    // Services
    console.log('\n─── Seeding Services ───')
    for (const service of serviceDocs) {
      await createDoc(service)
    }

    // Technologies
    console.log('\n─── Seeding Technologies ───')
    for (const tech of technologyDocs) {
      await createDoc(tech)
    }

    // FAQ Items
    console.log('\n─── Seeding FAQ Items ───')
    for (const faq of faqItemDocs) {
      await createDoc(faq)
    }

    // Team Members
    console.log('\n─── Seeding Team Members ───')
    for (const member of teamMemberDocs) {
      await createDoc(member)
    }

    // Legal Pages
    console.log('\n─── Seeding Legal Pages ───')
    for (const legal of legalPageDocs) {
      await createDoc(legal)
    }

    // Journey Stages
    console.log('\n─── Seeding Journey Stages ───')
    for (const stage of journeyStageDocs) {
      await createDoc(stage)
    }

    // Clean up old incorrectly-typed documents
    console.log('\n─── Cleaning up old documents ───')
    await deleteDoc('package-discovery')
    await deleteDoc('package-essential')
    await deleteDoc('package-premium')
    await deleteDoc('membership-silver')
    await deleteDoc('membership-gold')
    await deleteDoc('membership-platinum')

    // Packages (diagnostic)
    console.log('\n─── Seeding Diagnostic Packages ───')
    for (const pkg of packageDocs) {
      await createDoc(pkg)
    }

    // Memberships (as package type with category=membership)
    console.log('\n─── Seeding Memberships ───')
    for (const membership of membershipDocs) {
      await createDoc(membership)
    }

    console.log('\n✅ Sanity CMS seeding completed successfully!')
    console.log(`\n📊 Summary:`)
    console.log(`   • 7 singleton pages`)
    console.log(`   • ${serviceDocs.length} services`)
    console.log(`   • ${technologyDocs.length} technologies`)
    console.log(`   • ${faqItemDocs.length} FAQ items`)
    console.log(`   • ${teamMemberDocs.length} team members`)
    console.log(`   • ${legalPageDocs.length} legal pages`)
    console.log(`   • ${journeyStageDocs.length} journey stages`)
    console.log(`   • ${packageDocs.length} packages`)
    console.log(`   • ${membershipDocs.length} memberships`)

  } catch (error) {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run the seed function
seedSanity()
