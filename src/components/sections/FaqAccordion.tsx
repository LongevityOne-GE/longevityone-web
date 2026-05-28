'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Locale } from '@/lib/utils'
import type { FaqItem } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { PortableTextRenderer } from '@/components/shared/PortableTextRenderer'

const DECOR_IMAGES = [
  {
    src: '/images/blog images/NEW/cropped/general3.png',
    side: 'left' as const,
    topPct: 3,
    width: 'w-36 sm:w-48 md:w-64 lg:w-80 xl:w-96',
    offset: '-translate-x-10 sm:-translate-x-8 md:-translate-x-6 lg:-translate-x-10 xl:-translate-x-16',
    rotate: '-rotate-[11deg]',
    opacity: 'opacity-45 md:opacity-50',
  },
  {
    src: '/images/blog images/NEW/cropped/general2.png',
    side: 'right' as const,
    topPct: 18,
    width: 'w-40 sm:w-56 md:w-72 lg:w-[22rem] xl:w-[28rem]',
    offset: 'translate-x-10 sm:translate-x-8 md:translate-x-6 lg:translate-x-12 xl:translate-x-20',
    rotate: 'rotate-[9deg]',
    opacity: 'opacity-45 md:opacity-55',
  },
  {
    src: '/images/blog images/NEW/cropped/general4.jpg',
    side: 'left' as const,
    topPct: 42,
    width: 'w-40 sm:w-56 md:w-72 lg:w-[22rem] xl:w-[26rem]',
    offset: '-translate-x-12 sm:-translate-x-10 md:-translate-x-8 lg:-translate-x-16 xl:-translate-x-24',
    rotate: 'rotate-[7deg]',
    opacity: 'opacity-45 md:opacity-50',
  },
  {
    src: '/images/blog images/NEW/cropped/general5.jpg',
    side: 'right' as const,
    topPct: 64,
    width: 'w-36 sm:w-48 md:w-64 lg:w-80 xl:w-[24rem]',
    offset: 'translate-x-8 sm:translate-x-6 md:translate-x-4 lg:translate-x-10 xl:translate-x-16',
    rotate: '-rotate-[12deg]',
    opacity: 'opacity-45 md:opacity-55',
  },
  {
    src: '/images/blog images/NEW/cropped/general3.png',
    side: 'left' as const,
    topPct: 82,
    width: 'w-28 sm:w-40 md:w-52 lg:w-64 xl:w-80',
    offset: '-translate-x-6 sm:-translate-x-4 md:-translate-x-2 lg:-translate-x-6 xl:-translate-x-10',
    rotate: 'rotate-[14deg]',
    opacity: 'opacity-40 md:opacity-45',
  },
]

interface FaqAccordionProps {
  locale: Locale
  items: FaqItem[]
}

export function FaqAccordion({ locale, items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  if (!items.length) return null

  const categoryLabels: Record<string, { ka: string; en: string }> = {
    general: { ka: 'ზოგადი', en: 'General' },
    pricing: { ka: 'ფასები', en: 'Pricing' },
    results: { ka: 'შედეგები', en: 'Results' },
    services: { ka: 'სერვისები', en: 'Services' },
    therapies: { ka: 'თერაპიები', en: 'Therapies' },
    booking: { ka: 'ჯავშანი', en: 'Booking' },
    diagnostics: { ka: 'დიაგნოსტიკა', en: 'Diagnostics' },
    membership: { ka: 'წევრობა', en: 'Membership' },
  }

  function getCategoryLabel(slug: string): string {
    const entry = categoryLabels[slug]
    if (entry) return locale === 'ka' ? entry.ka : entry.en
    return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const grouped = items.reduce<Record<string, FaqItem[]>>((acc, item) => {
    const cat = item.category || 'general'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  return (
    <section className="relative py-20 md:py-32 bg-bone-white overflow-hidden">
      {/* Scattered editorial decoration - hidden on small screens, eases off-center on larger screens */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {DECOR_IMAGES.map((img, i) => (
          <div
            key={i}
            className={`absolute ${img.side === 'left' ? 'left-0' : 'right-0'} ${img.opacity}`}
            style={{ top: `${img.topPct}%` }}
          >
            <div className={`${img.width} ${img.offset} ${img.rotate} transition-transform duration-700`}>
              <Image
                src={img.src}
                alt=""
                width={520}
                height={520}
                className="w-full h-auto rounded-sm shadow-[0_8px_24px_rgba(66,41,34,0.12)]"
                sizes="(max-width: 640px) 200px, (max-width: 1024px) 320px, (max-width: 1280px) 384px, 448px"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="section-container max-w-3xl relative z-10">
        {Object.entries(grouped).map(([category, categoryItems]) => (
          <div key={category} className="mb-16 last:mb-0">
            <Reveal>
              <h2 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-8">
                {getCategoryLabel(category)}
              </h2>
            </Reveal>

            <div className="space-y-0 divide-y divide-dark-brown/10 border-t border-dark-brown/10">
              {categoryItems.map((item, idx) => {
                const question = locale === 'ka' ? item.question_ka : item.question_en
                const answer = locale === 'ka' ? item.answer_ka : item.answer_en
                const isOpen = openId === item._id

                return (
                  <Reveal key={item._id} delay={0.04 * idx}>
                    <div>
                      <button
                        onClick={() => setOpenId(isOpen ? null : item._id)}
                        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                        aria-expanded={isOpen}
                      >
                        <span className="text-base md:text-lg font-semibold text-dark-brown group-hover:text-burnt-orange transition-colors duration-200">
                          {question}
                        </span>
                        <span
                          className={`text-burnt-orange flex-shrink-0 text-xl font-bold transition-transform duration-300 ${
                            isOpen ? 'rotate-45' : 'rotate-0'
                          }`}
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
                          <div className="text-dark-brown/75 [&_p]:text-dark-brown/75 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0">
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
      </div>
    </section>
  )
}
