import type { Locale } from '@/lib/utils'
import type { MembershipPackage } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { PackageCard } from '@/components/shared/PackageCard'

interface MembershipPlansProps {
  locale: Locale
  memberships: MembershipPackage[]
  heading: string | null | undefined
}

export function MembershipPlans({ locale, memberships, heading }: MembershipPlansProps) {
  const prefix = locale === 'en' ? '/en' : ''
  const bookingHref = `${prefix}/booking?type=consultation`
  if (!memberships.length) return null

  const defaultHeading = locale === 'ka' ? 'საწევრო პროგრამები' : 'Membership Programmes'
  const eyebrow = locale === 'ka' ? 'ყოველთვიური წევრობა' : 'Monthly membership'

  return (
    <section id="memberships" className="scroll-mt-32 py-20 md:py-32 bg-dark-brown text-bone-white relative overflow-hidden isolate">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/videos/team-bg.mp4" type="video/mp4" />
      </video>
      {/* Dark tint so cards stay readable */}
      <div
        className="absolute inset-0 pointer-events-none bg-dark-brown/70"
        aria-hidden="true"
      />
      {/* Top fade from dark-brown for a smooth handoff from the section above */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-48 md:h-64 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(66,41,34,1) 0%, rgba(66,41,34,0) 100%)',
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
            <h2 className="text-3xl md:text-4xl font-black text-bone-white">
              {heading || defaultHeading}
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 md:items-start">
          {memberships.map((pkg, idx) => {
            // Same positional rule as DiagnosticTiers — middle card is the
            // "Most Popular" badge owner.
            const isMiddle = memberships.length >= 3 && idx === Math.floor(memberships.length / 2)
            return (
              <PackageCard
                key={pkg._id}
                locale={locale}
                name={locale === 'ka' ? pkg.name_ka : pkg.name_en}
                price={pkg.price}
                priceLabel={locale === 'ka' ? pkg.priceLabel_ka : pkg.priceLabel_en}
                priceSuffix={locale === 'ka' ? pkg.priceSuffix_ka : pkg.priceSuffix_en}
                tagline={locale === 'ka' ? pkg.tagline_ka : pkg.tagline_en}
                includes={locale === 'ka' ? pkg.includes_ka : pkg.includes_en}
                ctaLabel={locale === 'ka' ? pkg.cta_label_ka : pkg.cta_label_en}
                isFeatured={isMiddle}
                variant="dark"
                delay={0.1 * idx}
                bookingHref={bookingHref}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
