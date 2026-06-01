'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import type { FaqItem } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { PortableTextRenderer } from '@/components/shared/PortableTextRenderer'

interface FaqAccordionProps {
  locale: Locale
  items: FaqItem[]
}

// Decorative general photos placed in the outer gutters, alternating sides
// down the page. Low opacity + desaturation keeps the centered text readable.
const DECOR_IMAGES = [
  {
    src: '/images/blog images/NEW/cropped/general3.png',
    position: 'mr-auto -ml-12 md:-ml-20', // Left
    width: 'w-48 md:w-72 max-h-[18rem]',
    rotate: 'rotate-6',
  },
  {
    src: '/images/blog images/NEW/cropped/general2.png',
    position: 'mx-auto', // Center
    width: 'w-44 md:w-64 max-h-[16rem]',
    rotate: '-rotate-6',
  },
  {
    src: '/images/blog images/NEW/cropped/general4.jpg',
    position: 'ml-auto -mr-12 md:-mr-20', // Right
    width: 'w-44 md:w-64 max-h-[16rem]',
    rotate: 'rotate-3',
  },
  {
    src: '/images/blog images/NEW/cropped/general5.jpg',
    position: 'mx-auto', // Center
    width: 'w-44 md:w-60 max-h-[15rem]',
    rotate: '-rotate-3',
  },
]

const CATEGORY_LABELS: Record<string, { ka: string; en: string }> = {
  general: { ka: 'ზოგადი', en: 'General' },
  pricing: { ka: 'ფასები', en: 'Pricing' },
  results: { ka: 'შედეგები', en: 'Results' },
  services: { ka: 'სერვისები', en: 'Services' },
  therapies: { ka: 'თერაპიები', en: 'Therapies' },
  booking: { ka: 'ჯავშანი', en: 'Booking' },
  diagnostics: { ka: 'დიაგნოსტიკა', en: 'Diagnostics' },
  membership: { ka: 'წევრობა', en: 'Membership' },
  journey: { ka: 'პაციენტის გზა', en: 'Journey' },
  longevity: { ka: 'დღეგრძელობა', en: 'Longevity' },
  metabolic: { ka: 'მეტაბოლური', en: 'Metabolic' },
  technologies: { ka: 'ტექნოლოგიები', en: 'Technologies' },
}

export function FaqAccordion({ locale, items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  if (!items.length) return null

  function getCategoryLabel(slug: string): string {
    const entry = CATEGORY_LABELS[slug]
    if (entry) return locale === 'ka' ? entry.ka : entry.en
    return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const grouped = items.reduce<Record<string, FaqItem[]>>((acc, item) => {
    const cat = item.category || 'general'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  const categories = Object.keys(grouped)
  const prefix = locale === 'en' ? '/en' : ''

  return (
    <section className="relative py-20 md:py-28 bg-bone-white overflow-hidden">
      {/* Subtle editorial texture — general images bleeding off the left/right
         edges at very low opacity, desaturated to bone tones. They live in the
         outer gutters so the centered content stays fully readable on top. */}
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 w-full h-full z-0 overflow-hidden flex flex-col justify-between py-12 md:py-24 min-h-[1400px]">
        {DECOR_IMAGES.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt=""
            className={`select-none object-cover flex-shrink-0 ${img.position} ${img.width} ${img.rotate} opacity-[0.07]`}
            style={{ filter: 'saturate(0.5) brightness(1.05)' }}
          />
        ))}
      </div>

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-12 lg:gap-20 max-w-5xl mx-auto">
          {/* ─── Sticky category navigator (desktop) / horizontal chips (mobile) ─── */}
          {categories.length > 1 && (
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="hidden lg:block text-[10px] uppercase tracking-[0.2em] font-bold text-dark-brown/40 mb-5">
                {locale === 'ka' ? 'კატეგორიები' : 'Categories'}
              </p>
              <nav
                aria-label={locale === 'ka' ? 'FAQ კატეგორიები' : 'FAQ categories'}
                className="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0"
              >
                {categories.map((category) => (
                  <a
                    key={category}
                    href={`#faq-${category}`}
                    className="whitespace-nowrap text-xs uppercase tracking-[0.08em] font-medium text-dark-brown/70 border border-dark-brown/15 lg:border-0 lg:border-l-2 lg:border-transparent px-4 py-2 lg:py-1.5 lg:pl-4 hover:text-burnt-orange hover:border-burnt-orange/40 lg:hover:border-burnt-orange transition-colors duration-200 rounded-sm lg:rounded-none"
                  >
                    {getCategoryLabel(category)}
                  </a>
                ))}
              </nav>
            </aside>
          )}

          {/* ─── Accordion content ─── */}
          <div className={categories.length > 1 ? '' : 'lg:col-span-2 max-w-3xl mx-auto w-full'}>
            {Object.entries(grouped).map(([category, categoryItems]) => (
              <div
                key={category}
                id={`faq-${category}`}
                className="mb-14 last:mb-0 scroll-mt-28"
              >
                <Reveal>
                  <h2 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-6">
                    {getCategoryLabel(category)}
                  </h2>
                </Reveal>

                <div className="divide-y divide-dark-brown/10 border-t border-dark-brown/10">
                  {categoryItems.map((item, idx) => {
                    const question = locale === 'ka' ? item.question_ka : item.question_en
                    const answer = locale === 'ka' ? item.answer_ka : item.answer_en
                    const isOpen = openId === item._id

                    return (
                      <Reveal key={item._id} delay={0.04 * idx}>
                        <div>
                          <button
                            onClick={() => setOpenId(isOpen ? null : item._id)}
                            className="w-full flex items-center justify-between gap-6 py-5 md:py-6 text-left group"
                            aria-expanded={isOpen}
                          >
                            <span className="text-base md:text-lg font-semibold text-dark-brown group-hover:text-burnt-orange transition-colors duration-200">
                              {question}
                            </span>
                            <span
                              className={`text-burnt-orange flex-shrink-0 text-xl font-bold transition-transform duration-300 ${
                                isOpen ? 'rotate-45' : 'rotate-0'
                              }`}
                              aria-hidden="true"
                            >
                              +
                            </span>
                          </button>

                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isOpen ? 'max-h-[600px] opacity-100 pb-6' : 'max-h-0 opacity-0'
                            }`}
                          >
                            {answer && answer.length > 0 && (
                              <div className="text-dark-brown/75 [&_p]:text-dark-brown/75 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 max-w-2xl">
                                <PortableTextRenderer value={answer} />
                              </div>
                            )}
                          </div>
                        </div>
                      </Reveal>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* ─── Still have questions? — editorial contact CTA ─── */}
            <Reveal>
              <div className="mt-16 border-t border-dark-brown/10 pt-12 flex flex-col items-start gap-5">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-dark-brown mb-2">
                    {locale === 'ka'
                      ? 'ვერ იპოვეთ პასუხი?'
                      : 'Still have questions?'}
                  </h3>
                  <p className="text-sm text-dark-brown/70 leading-relaxed max-w-md">
                    {locale === 'ka'
                      ? 'ჩვენი გუნდი სიამოვნებით გიპასუხებთ ნებისმიერ შეკითხვაზე და დაგეხმარებათ სწორი გადაწყვეტილების მიღებაში.'
                      : 'Our team is glad to answer any question and help you make the right decision for your health.'}
                  </p>
                </div>
                <Link
                  href={`${prefix}/contact`}
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-medium text-dark-brown border-b border-dark-brown/30 pb-px hover:text-burnt-orange hover:border-burnt-orange transition-colors duration-200 group"
                >
                  <span>{locale === 'ka' ? 'დაგვიკავშირდით' : 'Contact us'}</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
