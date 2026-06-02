import type { Locale } from '@/lib/utils'
import type { SimplePackage } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface AddOnsProps {
  locale: Locale
  addons: SimplePackage[]
}

export function AddOns({ locale, addons }: AddOnsProps) {
  if (!addons.length) return null

  const eyebrow = locale === 'ka' ? 'სურვილისამებრ' : 'Optional'
  const heading = locale === 'ka' ? 'დამატებითი ლაბორატორიული ტესტები' : 'Add-On Lab Tests'
  const subtext =
    locale === 'ka'
      ? 'ნებისმიერ პაკეტს ან წევრობას დაამატეთ სიღრმისეული საერთაშორისო ტესტი.'
      : 'Layer a deeper international test onto any package or membership.'
  const priceNote = locale === 'ka' ? 'ნებისმიერ პაკეტზე დამატებით' : 'added to any package'

  return (
    <section
      id="add-ons"
      className="scroll-mt-32 bg-bone-white py-20 md:py-28 border-t border-dark-brown/10"
    >
      <div className="section-container max-w-5xl">
        <div className="mb-12 text-center">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.28em] text-burnt-orange font-bold mb-4">
              {eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-dark-brown mb-4">
              {heading}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-dark-brown/70 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              {subtext}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {addons.map((addon, idx) => {
            const name = locale === 'ka' ? addon.name_ka : addon.name_en
            const description = locale === 'ka' ? addon.tagline_ka : addon.tagline_en
            const priceLabel = locale === 'ka' ? addon.priceLabel_ka : addon.priceLabel_en
            return (
              <Reveal key={addon._id} delay={0.1 + idx * 0.08} className="h-full">
                <div className="h-full flex flex-col border border-dark-brown/15 rounded-sm p-8 hover:border-burnt-orange/40 transition-colors duration-300">
                  <h3 className="font-serif text-lg md:text-xl font-semibold text-dark-brown mb-3">
                    {name}
                  </h3>
                  {description && (
                    <p className="text-sm text-dark-brown/65 leading-relaxed mb-8 flex-grow">
                      {description}
                    </p>
                  )}
                  <div className="flex items-baseline gap-2 pt-5 border-t border-dark-brown/10">
                    <span className="text-2xl font-bold text-burnt-orange italic">
                      {addon.price != null ? (
                        <>
                          +{addon.price.toLocaleString()}{' '}
                          <span className="text-xs font-sans font-bold uppercase tracking-widest not-italic">
                            {locale === 'ka' ? 'ლარი' : 'GEL'}
                          </span>
                        </>
                      ) : (
                        priceLabel
                      )}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-dark-brown/45">
                      {priceNote}
                    </span>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
