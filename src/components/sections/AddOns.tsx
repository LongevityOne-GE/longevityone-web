'use client'

import type { Locale } from '@/lib/utils'
import type { SimplePackage } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface AddOnsProps {
  locale: Locale
  addons: SimplePackage[]
}

export function AddOns({ locale, addons }: AddOnsProps) {
  if (!addons.length) return null

  const heading = locale === 'ka' ? 'დამატებითი სერვისები' : 'Add-On Services'

  return (
    <section className="py-20 md:py-28 bg-bone-white border-t border-dark-brown/10">
      <div className="section-container max-w-3xl">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-black text-dark-brown mb-10">
            {heading}
          </h2>
        </Reveal>

        <ul className="divide-y divide-dark-brown/10">
          {addons.map((addon, idx) => {
            const name = locale === 'ka' ? addon.name_ka : addon.name_en
            const priceLabel = locale === 'ka' ? addon.priceLabel_ka : addon.priceLabel_en
            return (
              <Reveal key={addon._id} delay={0.05 * idx}>
                <li className="flex items-center justify-between py-5">
                  <span className="text-sm font-medium text-dark-brown">{name}</span>
                  <span className="text-sm font-bold text-burnt-orange italic ml-4 shrink-0">
                    {addon.price != null ? (
                      <>
                        {addon.price.toLocaleString()}{' '}
                        <span className="text-xs font-sans font-bold uppercase tracking-widest not-italic">{locale === 'ka' ? 'ლარი' : 'GEL'}</span>
                      </>
                    ) : priceLabel}
                  </span>
                </li>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
