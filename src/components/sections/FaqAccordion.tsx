'use client'

import { useState } from 'react'
import type { Locale } from '@/lib/utils'
import type { FaqItem } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { PortableTextRenderer } from '@/components/shared/PortableTextRenderer'

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
    <section className="py-20 md:py-32 bg-bone-white">
      <div className="section-container max-w-3xl">
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
