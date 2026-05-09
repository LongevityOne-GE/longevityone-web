import type { Locale } from '@/lib/utils'
import type { HomePackage, HomePageData } from '@/lib/sanity/types'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { PackageCard } from '@/components/shared/PackageCard'

interface PricingProps {
  locale: Locale
  packages?: HomePackage[] | null
  data?: HomePageData | null
}

export function Pricing({ locale, packages, data }: PricingProps) {
  const prefix = locale === 'en' ? '/en' : ''
  const bookingHref = `${prefix}/booking?type=consultation`
  const pkgs = packages ?? []

  return (
    
    <section className="relative py-16 md:py-32 bg-bone-white border-y border-dark-brown/5 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
      >
        <source src="/videos/DNA_boomerang.webm" type="video/webm" />
        <source src="/videos/DNA_boomerang.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 section-container text-center mb-24">
        <SectionHeader
          locale={locale}
          titleKa={data?.packages_heading_ka}
          titleEn={data?.packages_heading_en}
          subtitleKa={data?.packages_subtext_ka}
          subtitleEn={data?.packages_subtext_en}
        />
      </div>
      

      {pkgs.length > 0 && (
        <div className="relative z-10 section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {pkgs.map((pkg, idx) => (
              <PackageCard
                key={pkg._id}
                locale={locale}
                name={locale === 'ka' ? pkg.name_ka : pkg.name_en}
                price={pkg.price}
                includes={locale === 'ka' ? pkg.includes_ka : pkg.includes_en}
                isFeatured={pkg.isFeatured}
                variant="light"
                delay={0.12 * idx}
                bookingHref={bookingHref}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
