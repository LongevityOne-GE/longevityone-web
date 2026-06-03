'use client'

import { localizedTechName, type Locale } from '@/lib/utils'
import type { Technology } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { TechGallery, type GalleryImage } from '@/components/sections/TechGallery'

interface TechSectionProps {
  locale: Locale
  tech: Technology
  index: number
}

// ─── Gallery configuration ────────────────────────────────────────────────────
// Real clinic + explainer imagery, keyed by Sanity _id so it survives
// schema/slug changes. Each section renders an auto-playing gallery. Image order
// is curated by content: device/action hero first, then setting, then science.
const GALLERIES: Record<string, GalleryImage[]> = {
  'tech-pnoe': [
    {
      src: '/images/technologies/pnoe-vo2-test.jpeg',
      alt_ka: 'VO₂ Max ტესტი მეტაბოლური ნიღბით',
      alt_en: 'VO₂ Max test in progress with a metabolic mask',
      caption_ka: 'VO₂ Max ტესტირება — მეტაბოლიზმის გაზომვა',
      caption_en: 'VO₂ Max testing — live metabolic measurement',
    },
    {
      src: '/images/technologies/pnoe-vo2-bike.jpg',
      alt_ka: 'სტაციონარული ველოსიპედი VO₂ Max ტესტირებისთვის',
      alt_en: 'Stationary bike used for VO₂ Max testing',
      caption_ka: 'კალიბრებული ერგომეტრი ტესტისთვის',
      caption_en: 'Calibrated ergometer for the test',
    },
    {
      src: '/images/technologies/pnoe-breath.jpeg',
      alt_ka: 'სუნთქვისა და ჟანგბადის ანალიზის ილუსტრაცია',
      alt_en: 'Illustration of breath and oxygen analysis',
      caption_ka: 'როგორ ზომავს სუნთქვის ანალიზი მეტაბოლიზმს',
      caption_en: 'How breath analysis maps your metabolism',
    },
    {
      src: '/images/technologies/pnoe-cardio.jpeg',
      alt_ka: 'გულ-სისხლძარღვთა და უჯრედული ენერგიის ილუსტრაცია',
      alt_en: 'Cardiovascular and cellular energy illustration',
      caption_ka: 'გულ-სისხლძარღვთა ჯანმრთელობა უჯრედულ დონეზე',
      caption_en: 'Cardiovascular fitness at the cellular level',
    },
  ],

  'tech-ihht': [
    {
      src: '/images/technologies/IHHT1.jpg',
      alt_ka: 'Celloxy მოწყობილობა — IHHT სისტემა',
      alt_en: 'Celloxy device — the IHHT delivery system',
      caption_ka: 'Celloxy — კონტროლირებადი ჰიპოქსიურ-ჰიპეროქსიური სისტემა',
      caption_en: 'Celloxy — controlled hypoxic-hyperoxic system',
    },
    {
      src: '/images/technologies/IHHT3.jpg',
      alt_ka: 'IHHT თერაპიის ოთახი Longevity One-ში',
      alt_en: 'IHHT therapy room at Longevity One',
      caption_ka: 'IHHT თერაპიის ოთახი',
      caption_en: 'The IHHT therapy suite',
    },
    {
      src: '/images/technologies/IHHT2.jpg',
      alt_ka: 'Celloxy მოწყობილობა სამკურნალო სავარძელთან',
      alt_en: 'Celloxy device beside the treatment recliner',
      caption_ka: 'კომფორტული მკურნალობის გარემო',
      caption_en: 'Comfort-first treatment setup',
    },
    {
      src: '/images/technologies/IHHT4.jpeg',
      alt_ka: 'უჯრედისა და მისი მიტოქონდრიების ილუსტრაცია',
      alt_en: 'Illustration of a cell and its mitochondria',
      caption_ka: 'მიტოქონდრიებზე ზემოქმედება — უჯრედის ენერგოსადგურები',
      caption_en: "Targeting the mitochondria — your cells' power plants",
    },
    {
      src: '/images/technologies/IHHT5.jpeg',
      alt_ka: 'IHHT სარგებელი: გულ-სისხლძარღვთა, კოგნიტური, ენერგია, აღდგენა',
      alt_en: 'IHHT benefits: cardiovascular, cognitive, energy, recovery',
      caption_ka: 'რას ავარჯიშებს IHHT',
      caption_en: 'What IHHT trains',
    },
  ],

  'tech-truediagnostic': [
    {
      src: '/images/technologies/EPIGENETIC3.jpg',
      alt_ka: 'საათი, რომელიც გადადის დნმ-ის სპირალში',
      alt_en: 'A clock dissolving into a DNA helix — biological age',
      caption_ka: 'თქვენი ბიოლოგიური ასაკი დნმ-ში',
      caption_en: 'Your biological age, written in your DNA',
    },
    {
      src: '/images/technologies/EPIGENETIC2.jpg',
      alt_ka: 'TruAge + TruHealth ტესტირების ნაკრები',
      alt_en: 'TruAge + TruHealth testing kit',
      caption_ka: 'TrueDiagnostic TruAge ნაკრები',
      caption_en: 'TrueDiagnostic TruAge test kit',
    },
    {
      src: '/images/technologies/EPIGENETIC1.jpg',
      alt_ka: 'პროცესი: სისხლის ნიმუში, სექვენირება, მეთილირების ანალიზი, ანგარიში',
      alt_en: 'Process: blood sample, sequencing, methylation analysis, report',
      caption_ka: 'ნიმუშიდან ბიოლოგიური ასაკის ანგარიშამდე',
      caption_en: 'From sample to biological age report',
    },
    {
      src: '/images/technologies/epigenetic5.jpg',
      alt_ka: 'დნმ-ის მეთილირება — CH₃ მეთილის ჯგუფები',
      alt_en: 'DNA methylation — CH₃ methyl groups across the genome',
      caption_ka: '900,000+ მეთილირების უბანი გაზომილი',
      caption_en: '900,000+ methylation sites measured',
    },
    {
      src: '/images/technologies/EPIGENETIC4.jpg',
      alt_ka: 'დნმ-ის ორმაგი სპირალი',
      alt_en: 'DNA double helix',
      caption_ka: 'თქვენი დნმ-ის მეთილირების ანალიზი',
      caption_en: 'Methylation analysis of your DNA',
    },
  ],

  'tech-red-light': [
    {
      src: '/images/technologies/red-light1.jpg',
      alt_ka: 'სრული სხეულის წითელი სინათლის თერაპია',
      alt_en: 'Full-body red light therapy session',
      caption_ka: 'სრული სხეულის ფოტობიომოდულაცია',
      caption_en: 'Full-body photobiomodulation',
    },
    {
      src: '/images/technologies/red-light2.jpg',
      alt_ka: 'წითელი სინათლე ააქტიურებს უჯრედის მიტოქონდრიებს',
      alt_en: 'Red light activating cellular mitochondria',
      caption_ka: 'სინათლე ასტიმულირებს მიტოქონდრიებს',
      caption_en: 'Light energising the mitochondria',
    },
    {
      src: '/images/technologies/red-light4.jpeg',
      alt_ka: 'მოდუნებული წითელი სინათლის სეანსი სახისთვის',
      alt_en: 'Relaxing red light facial session',
      caption_ka: 'მშვიდი, აღმდგენი სეანსები',
      caption_en: 'Calm, restorative sessions',
    },
    {
      src: '/images/technologies/red-light5.jpeg',
      alt_ka: 'წითელი სინათლის თერაპიის სეანსი',
      alt_en: 'Red light therapy session',
      caption_ka: 'აღდგენა და რეგენერაცია',
      caption_en: 'Recovery and regeneration',
    },
    {
      src: '/images/technologies/red-light3.jpeg',
      alt_ka: 'ჯანსაღი, მბრწყინავი კანი',
      alt_en: 'Healthy, glowing skin',
      caption_ka: 'კანის ელასტიურობა და კოლაგენი',
      caption_en: 'Skin elasticity and collagen support',
    },
  ],

  'tech-enbiosis': [
    {
      src: '/images/technologies/microbiome7.jpeg',
      alt_ka: 'ნაწლავის მიკრობიომი',
      alt_en: 'Gut microbiome in the intestinal tract',
      caption_ka: 'ნაწლავის შინაგანი ეკოსისტემა',
      caption_en: "Your gut's internal ecosystem",
    },
    {
      src: '/images/technologies/MICROBIOME1.jpeg',
      alt_ka: 'ნაწლავის ლორწოვანისა და ბაქტერიების მიკროსკოპული ხედი',
      alt_en: 'Microscopic view of the gut lining and bacteria',
      caption_ka: 'სად ცხოვრობს მიკრობიომი',
      caption_en: 'Where your microbiome lives',
    },
    {
      src: '/images/technologies/MICROBIOME2.jpeg',
      alt_ka: 'ნაწლავის ბაქტერიების მრავალფეროვანი კოლონია',
      alt_en: 'Diverse colony of gut bacteria',
      caption_ka: 'მრავალფეროვანი, დაბალანსებული ფლორა',
      caption_en: 'A diverse, balanced flora',
    },
    {
      src: '/images/technologies/MICROBIOME3.jpeg',
      alt_ka: 'საჭმლის მომნელებელი სისტემის ილუსტრაცია',
      alt_en: 'Illustration of the digestive system and microbes',
      caption_ka: 'ნაწლავის ჯანმრთელობა — მთელი სხეულის ჯანმრთელობა',
      caption_en: 'Gut health drives whole-body health',
    },
    {
      src: '/images/technologies/MICROBIOME5.jpeg',
      alt_ka: 'მიკრობიომის სახეობების კატალოგი',
      alt_en: 'Catalogue of microbiome species',
      caption_ka: 'ასობით სახეობა, ზუსტად სექვენირებული',
      caption_en: 'Hundreds of species, precisely sequenced',
    },
  ],
}

// ─── Section ─────────────────────────────────────────────────────────────────
export function TechSection({ locale, tech, index }: TechSectionProps) {
  const textFirst = index % 2 === 0
  const displayName = localizedTechName(tech, locale)
  const tagline = locale === 'ka' ? tech.tagline_ka : tech.tagline_en
  const whatItIs = locale === 'ka' ? tech.whatItIs_ka : tech.whatItIs_en
  const howItWorks = locale === 'ka' ? tech.howItWorks_ka : tech.howItWorks_en
  const whatItShows = locale === 'ka' ? tech.whatItShows_ka : tech.whatItShows_en
  const yourBenefit = locale === 'ka' ? tech.yourBenefit_ka : tech.yourBenefit_en

  const detailLabel1 = locale === 'ka' ? 'რა არის' : 'What It Is'
  const detailLabel2 = howItWorks
    ? (locale === 'ka' ? 'როგორ მუშაობს' : 'How It Works')
    : (locale === 'ka' ? 'რას აჩვენებს' : 'What It Shows')
  const detailValue2 = howItWorks || whatItShows
  const detailLabel3 = locale === 'ka' ? 'თქვენი სარგებელი' : 'Your Benefit'

  const benefits = (locale === 'ka' ? tech.benefits_ka : tech.benefits_en) ?? []
  const benefitsLabel = locale === 'ka' ? 'სარგებელი' : 'Benefits'

  const gallery = GALLERIES[tech._id] ?? []
  const hasGallery = gallery.length > 0
  // PNOE is the first gallery after the page hero — flag it for priority loading.
  const isFirstSection = tech._id === 'tech-pnoe'

  const details: Array<{ label: string; value: string | null | undefined }> = [
    { label: detailLabel1, value: whatItIs },
    { label: detailLabel2, value: detailValue2 },
    { label: detailLabel3, value: yourBenefit },
  ]

  // ─── Reusable text column ──────────────────────────────────────────────
  const textColumn = (
    <div>
      <Reveal>
        <p className="eyebrow">{displayName}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-dark-brown mb-8">
          {tagline}
        </h2>
      </Reveal>
      <div className="space-y-6">
        {details.map((d, i) =>
          d.value ? (
            <Reveal key={d.label} delay={0.2 + i * 0.05}>
              <div className="border-t border-dark-brown/20 pt-5">
                <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-2">
                  {d.label}
                </h4>
                <p className="text-sm text-dark-brown/80 leading-relaxed">{d.value}</p>
              </div>
            </Reveal>
          ) : null,
        )}
        {benefits.length > 0 && (
          <Reveal delay={0.35}>
            <div className="border-t border-dark-brown/20 pt-5">
              <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-4">
                {benefitsLabel}
              </h4>
              <ul className="space-y-2">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-dark-brown/80 leading-relaxed">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-burnt-orange/60" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  )

  // ─── Text-only fallback (no gallery configured yet) ────────────────────
  if (!hasGallery) {
    return (
      <section
        id={tech.anchor}
        className="min-h-screen flex items-center py-20 md:py-32 border-t border-dark-brown/10 first:border-t-0 bg-bone-white"
      >
        <div className="section-container w-full max-w-3xl mx-auto text-center">
          <Reveal>
            <p className="eyebrow">{displayName}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-dark-brown mb-8">
              {tagline}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {details.map((d) =>
              d.value ? (
                <div key={d.label} className="border-t border-dark-brown/20 pt-6">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-3">
                    {d.label}
                  </h4>
                  <p className="text-sm text-dark-brown/80 leading-relaxed">{d.value}</p>
                </div>
              ) : null,
            )}
          </div>
          {benefits.length > 0 && (
            <div className="mt-10 border-t border-dark-brown/20 pt-8 max-w-3xl mx-auto">
              <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-5 text-left">
                {benefitsLabel}
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-left">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-dark-brown/80 leading-relaxed">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-burnt-orange/60" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    )
  }

  // ─── Default: alternating two-column (text + auto-playing gallery) ──────
  return (
    <section
      id={tech.anchor}
      className="min-h-screen flex items-center py-20 md:py-32 border-t border-dark-brown/10 first:border-t-0 bg-bone-white"
    >
      <div className="section-container w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className={textFirst ? 'lg:order-1' : 'lg:order-2'}>{textColumn}</div>
          <div className={textFirst ? 'lg:order-2' : 'lg:order-1'}>
            <Reveal delay={0.15}>
              <TechGallery images={gallery} locale={locale} priority={isFirstSection} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
