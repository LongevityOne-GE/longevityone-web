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
  const bookingHref = `${prefix}/booking`
  if (!packages.length) return null

  const eyebrow = locale === 'ka' ? 'პაკეტები' : 'Packages'
  const defaultHeading = locale === 'ka' ? 'დიაგნოსტიკური პაკეტები' : 'Diagnostic Packages'

  return (
    <section id="diagnostics" className="scroll-mt-32 py-20 md:py-32 bg-bone-white relative overflow-hidden isolate">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/videos/longevity-one-medical-light-bg.mp4" type="video/mp4" />
      </video>
      {/* Smooth fade into and out of adjacent bone-white sections */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-64 md:h-80 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(231,222,204,1) 0%, rgba(231,222,204,0.85) 30%, rgba(231,222,204,0) 100%)',
        }}
      />
      {/* Bottom fades into bone-white (instead of dark-brown) to match the AddOns section */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-64 md:h-80 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to top, rgba(231,222,204,1) 0%, rgba(231,222,204,0.85) 30%, rgba(231,222,204,0) 100%)',
        }}
      />

      <div className="section-container relative z-10">
        <div className="text-center mb-16">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.28em] text-burnt-orange font-bold mb-4">
              {eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-3xl md:text-4xl font-black text-dark-brown mb-4">
              {heading || defaultHeading}
            </h2>
          </Reveal>
          {subtext && (
            <Reveal delay={0.1}>
              <p className="text-dark-brown/70 max-w-xl mx-auto">{subtext}</p>
            </Reveal>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 md:items-start">
          {packages.map((pkg, idx) => {
            // "Most Popular" rides the middle card of the row, irrespective of
            // Sanity's isFeatured flag — keeps the visual hierarchy fixed even
            // if the clinic reorders tiers.
            const isMiddle = packages.length >= 3 && idx === Math.floor(packages.length / 2)
            return (
              <PackageCard
                key={pkg._id}
                locale={locale}
                name={locale === 'ka' ? pkg.name_ka : pkg.name_en}
                price={pkg.price}
                priceLabel={locale === 'ka' ? pkg.priceLabel_ka : pkg.priceLabel_en}
                tagline={locale === 'ka' ? pkg.tagline_ka : pkg.tagline_en}
                description={locale === 'ka' ? pkg.goal_ka : pkg.goal_en}
                includes={locale === 'ka' ? pkg.includes_ka : pkg.includes_en}
                ctaLabel={locale === 'ka' ? pkg.cta_label_ka : pkg.cta_label_en}
                isFeatured={isMiddle}
                variant="light"
                delay={0.1 * idx}
                bookingHref={bookingHref}
                leadFormSource="packages"
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
