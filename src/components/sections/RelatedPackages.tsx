import type { Locale } from '@/lib/utils'
import type { ServiceDetail } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { PackageCard } from '@/components/shared/PackageCard'

interface RelatedPackagesProps {
  locale: Locale
  packages: ServiceDetail['relatedPackages']
}

export function RelatedPackages({ locale, packages }: RelatedPackagesProps) {
  if (!packages || packages.length === 0) return null

  const heading = locale === 'ka' ? 'რეკომენდებული პაკეტები' : 'Recommended Packages'
  const selectLabel = locale === 'ka' ? 'არჩევა' : 'Learn More'
  const packagesHref = locale === 'en' ? '/en/packages' : '/packages'

  return (
    <section className="py-20 md:py-28 bg-bone-white border-t border-dark-brown/10">
      <div className="section-container">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-black text-dark-brown mb-12">
            {heading}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, idx) => (
            <PackageCard
              key={pkg._id}
              locale={locale}
              name={locale === 'ka' ? pkg.name_ka : pkg.name_en}
              price={pkg.price}
              priceLabel={locale === 'ka' ? pkg.priceLabel_ka : pkg.priceLabel_en}
              ctaLabel={selectLabel}
              variant="light"
              delay={0.1 * idx}
              bookingHref={packagesHref}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
