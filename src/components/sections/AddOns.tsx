import type { Locale } from '@/lib/utils'
import type { SimplePackage } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface AddOnsProps {
  locale: Locale
  addons: SimplePackage[]
}

export function AddOns({ locale, addons }: AddOnsProps) {
  if (!addons.length) return null

  const heading = locale === 'ka' ? 'სადიაგნოსტიკო ტესტები' : 'Diagnostic Tests'
  const priceNote = locale === 'ka' ? 'ნებისმიერ პაკეტზე დამატებით' : 'added to any package'

  return (
    <section
      id="add-ons"
      className="relative isolate scroll-mt-32 py-20 md:py-28 border-t border-dark-brown/10 overflow-hidden"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      >
        <source src="/videos/longevity-one-vascular-hud-loop.mp4" type="video/mp4" />
      </video>
      <div aria-hidden="true" className="absolute inset-0 bg-bone-white/55 backdrop-blur-[0.5px]" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-20 md:h-28 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(241,237,229,0) 0%, rgba(241,237,229,0.35) 40%, rgba(241,237,229,0.8) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-16 md:h-24 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(241,237,229,0) 0%, rgba(241,237,229,0.3) 60%, rgba(241,237,229,0.75) 100%)',
        }}
      />
      <div className="section-container relative z-10 max-w-5xl">
        <div className="mb-12 text-center">
          <Reveal delay={0.05}>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-dark-brown mb-4">
              {heading}
            </h2>
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
