import type { Locale } from '@/lib/utils'
import type { DiagnosticPackage } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { PackageCard } from '@/components/shared/PackageCard'

interface DiagnosticTiersProps {
  locale: Locale
  packages: DiagnosticPackage[]
  heading: string | null | undefined
  subtext: string | null | undefined
}

export function DiagnosticTiers({ locale, packages, heading, subtext }: DiagnosticTiersProps) {
  const prefix = locale === 'en' ? '/en' : ''
  const bookingHref = `${prefix}/booking?type=consultation`
  if (!packages.length) return null

  return (
    <section className="py-20 md:py-32 bg-bone-white">
      <div className="section-container">
        {(heading || subtext) && (
          <div className="text-center mb-16">
            {heading && (
              <Reveal>
                <h2 className="text-3xl md:text-4xl font-black font-serif text-dark-brown mb-4">
                  {heading}
                </h2>
              </Reveal>
            )}
            {subtext && (
              <Reveal delay={0.1}>
                <p className="text-dark-brown/70 max-w-xl mx-auto">{subtext}</p>
              </Reveal>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {packages.map((pkg, idx) => (
            <PackageCard
              key={pkg._id}
              locale={locale}
              name={locale === 'ka' ? pkg.name_ka : pkg.name_en}
              price={pkg.price}
              priceLabel={locale === 'ka' ? pkg.priceLabel_ka : pkg.priceLabel_en}
              tagline={locale === 'ka' ? pkg.tagline_ka : pkg.tagline_en}
              includes={locale === 'ka' ? pkg.includes_ka : pkg.includes_en}
              ctaLabel={locale === 'ka' ? pkg.cta_label_ka : pkg.cta_label_en}
              isFeatured={pkg.isFeatured}
              variant="light"
              delay={0.1 * idx}
              bookingHref={bookingHref}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
