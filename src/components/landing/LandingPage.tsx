import Image from 'next/image'
import type { Locale } from '@/lib/utils'
import type {
  AboutPage,
  HomeFounder,
  HomePageData,
  SanityReview,
  SiteSettings,
  Technology,
} from '@/lib/sanity/types'
import type { ActivePromotion } from '@/lib/promotions'
import { renderMultiline } from '@/lib/text'
import { localizedTechName } from '@/lib/utils'
import { LeadCaptureForm } from '@/components/sections/LeadCaptureForm'
import { ReviewsSection } from '@/components/sections/reviews/ReviewsSection'
import { PhoneLink } from '@/components/shared/PhoneLink'
import { CALL_CTA_LABEL } from '@/lib/features'
import { LandingHeader } from './LandingHeader'

interface LandingPageProps {
  locale: Locale
  homePage: HomePageData | null
  about: AboutPage | null
  technologies: Technology[]
  team: HomeFounder[]
  reviews: SanityReview[]
  settings: SiteSettings | null
  promotion: ActivePromotion | null
}

const COPY = {
  ka: {
    proceduresHeading: 'რა პროცედურებს გთავაზობთ',
    teamHeading: 'ჩვენი გუნდი',
    contactHeading: 'დაიწყეთ დღესვე',
    contactTagline: 'მოითხოვეთ ზარი, ან დაგვირეკეთ პირდაპირ.',
  },
  en: {
    proceduresHeading: 'Procedures we offer',
    teamHeading: 'Our team',
    contactHeading: 'Start today',
    contactTagline: 'Request a call, or call us directly.',
  },
} as const

/** The orange call-request button, shared by the hero and the closing section. */
const CTA_BUTTON =
  'mt-8 w-full sm:w-auto sm:min-w-[260px] justify-center gap-3 bg-burnt-orange px-8 py-4 text-white hover:bg-dark-brown'
const CTA_BUTTON_ON_DARK =
  'w-full sm:w-auto sm:min-w-[260px] justify-center gap-3 bg-burnt-orange px-8 py-4 text-white hover:bg-bone-white hover:text-dark-brown'

/** Offsets in-page anchors so a section heading is not hidden under the sticky header. */
const ANCHOR = 'scroll-mt-32 lg:scroll-mt-24'

/**
 * One-page landing for paid traffic: what LongevityOne is with a call-request
 * button right under it, then the procedures offered, about, team, reviews and
 * a closing call to action. The form opens in a popup. No links lead off the page.
 * Content comes from the same Sanity documents as the main site.
 */
export function LandingPage({
  locale,
  homePage,
  about,
  technologies,
  team,
  reviews,
  settings,
  promotion,
}: LandingPageProps) {
  const t = COPY[locale]
  const pick = <T,>(ka: T, en: T): T => (locale === 'ka' ? ka : en)

  const h1 = pick(homePage?.hero_h1_ka, homePage?.hero_h1_en)
  const whatWeAre = pick(homePage?.hero_h2_ka, homePage?.hero_h2_en)
  const body = pick(homePage?.hero_body_ka, homePage?.hero_body_en)
  const aboutHeading = pick(about?.h1_ka, about?.h1_en)
  const pillars = about?.why_pillars ?? []
  const phone = settings?.phone

  return (
    <>
      <LandingHeader locale={locale} />

      <main id="top" className="flex flex-col">
        {promotion && (
          <div className="bg-dark-brown px-5 py-6 text-center text-bone-white md:py-8">
            <p className="text-3xl font-black tracking-tight text-burnt-orange md:text-5xl">
              {promotion.headline}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-bone-white/80 md:text-sm">
              {promotion.detail}
            </p>
          </div>
        )}

        {/* What LongevityOne is, with the call-request button right under it. */}
        <section className="bg-bone-white py-12 md:py-20">
          <div className="section-container">
            <div className="max-w-3xl">
              {h1 && (
                <h1 className="mb-6 text-3xl font-black leading-[1.1] text-dark-brown sm:text-4xl lg:text-5xl">
                  {renderMultiline(h1)}
                </h1>
              )}
              {whatWeAre && (
                <p className="mb-5 text-lg font-semibold leading-relaxed text-dark-brown md:text-xl">
                  {whatWeAre}
                </p>
              )}
              {body && (
                <p className="text-base font-light leading-relaxed text-dark-brown/75 md:text-lg">
                  {body}
                </p>
              )}
              <LeadCaptureForm
                locale={locale}
                source="landing_hero"
                label={CALL_CTA_LABEL[locale]}
                triggerClassName={CTA_BUTTON}
              />
            </div>
          </div>
        </section>

        <div id="services" className={ANCHOR}>
          {technologies.length > 0 && (
            <section className="border-t border-dark-brown/10 bg-bone-white py-16 md:py-24">
              <div className="section-container">
                <h2 className="mb-12 text-3xl font-black text-dark-brown md:text-5xl">
                  {t.proceduresHeading}
                </h2>
                <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                  {technologies.map((tech) => (
                    <div key={tech._id} className="border-t border-dark-brown/20 pt-6">
                      <h3 className="mb-2 text-lg font-bold text-dark-brown">
                        {localizedTechName(tech, locale)}
                      </h3>
                      <p className="text-sm font-light leading-relaxed text-dark-brown/75">
                        {pick(tech.tagline_ka, tech.tagline_en)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        {pillars.length > 0 && (
          <section id="about" className={`${ANCHOR} border-t border-dark-brown/10 bg-bone-white py-16 md:py-28`}>
            <div className="section-container">
              {aboutHeading && (
                <h2 className="mb-12 text-3xl font-black leading-tight text-dark-brown md:mb-16 md:text-5xl">
                  {renderMultiline(aboutHeading)}
                </h2>
              )}
              <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                {pillars.map((p) => (
                  <div key={p.title_en} className="border-t border-dark-brown/20 pt-6">
                    <h3 className="mb-3 text-lg font-bold text-dark-brown">
                      {pick(p.title_ka, p.title_en)}
                    </h3>
                    <p className="text-sm font-light leading-relaxed text-dark-brown/75">
                      {pick(p.body_ka, p.body_en)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}


        {team.length > 0 && (
          <section id="team" className={`${ANCHOR} bg-bone-white py-16 md:py-28`}>
            <div className="section-container">
              <h2 className="mb-12 text-3xl font-black text-dark-brown md:mb-16 md:text-5xl">
                {t.teamHeading}
              </h2>
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {team.map((m) => {
                  const name = pick(m.name, m.name_en || m.name)
                  const photo = m.photo?.asset?.url
                  return (
                    <div key={m._id}>
                      <div className="relative mb-5 aspect-[4/5] overflow-hidden bg-dark-brown/5">
                        {photo && (
                          <Image
                            src={photo}
                            alt={name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <p className="text-lg font-bold text-dark-brown">{name}</p>
                      <p className="mt-1 text-sm font-light text-dark-brown/70">
                        {pick(m.role_ka, m.role_en)}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {reviews.length > 0 && (
          <div id="reviews" className={ANCHOR}>
            <ReviewsSection locale={locale} reviews={reviews} />
          </div>
        )}

        <section id="contact" className={`${ANCHOR} bg-dark-brown py-16 text-center text-bone-white md:py-24`}>
          <div className="section-container max-w-2xl">
            {promotion && (
              <p className="mb-4 text-xl font-black text-burnt-orange md:text-2xl">
                {promotion.headline}
              </p>
            )}
            <h2 className="mb-5 text-4xl font-black leading-tight md:text-6xl">
              {t.contactHeading}
            </h2>
            <p className="mb-8 text-base font-light leading-relaxed text-bone-white/75 md:text-lg">
              {t.contactTagline}
            </p>
            <div className="flex flex-col items-center gap-6">
              <LeadCaptureForm
                locale={locale}
                source="landing_final"
                label={CALL_CTA_LABEL[locale]}
                triggerClassName={CTA_BUTTON_ON_DARK}
              />
              {phone && (
                <PhoneLink
                  phone={phone}
                  source="landing_contact"
                  className="text-2xl font-bold text-bone-white transition-colors hover:text-burnt-orange md:text-3xl"
                >
                  {phone}
                </PhoneLink>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
