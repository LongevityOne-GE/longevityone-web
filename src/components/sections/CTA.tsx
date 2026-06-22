import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { HomePageData } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { GodVideo } from '@/components/shared/GodVideo'
import { LeadCaptureForm } from '@/components/sections/LeadCaptureForm'
import { BOOKING_ENABLED, CALL_CTA_LABEL } from '@/lib/features'
import { renderMultiline } from '@/lib/text'

interface CTAProps {
  locale: Locale
  data?: HomePageData | null
}

export function CTA({ locale, data }: CTAProps) {
  const prefix = locale === 'en' ? '/en' : ''
  const bookingHref = `${prefix}/booking`
  const heading = locale === 'ka' ? data?.cta_heading_ka : data?.cta_heading_en
  const subtext = locale === 'ka' ? data?.cta_subtext_ka : data?.cta_subtext_en
  const button = locale === 'ka' ? data?.cta_button_ka : data?.cta_button_en

  return (
    <section className="py-20 md:py-40 relative overflow-hidden bg-black text-bone-white text-center">
      <GodVideo
        src={{ webm: '/videos/video1_boomerang.webm', mp4: '/videos/video1_boomerang.mp4' }}
      />
      <div className="section-container relative z-10 max-w-4xl">
        {heading && (
          <Reveal>
            <h2
              className="text-3xl sm:text-5xl md:text-6xl font-black mb-6 md:mb-8 leading-none"
            >
              {renderMultiline(heading)}
            </h2>
          </Reveal>
        )}

        {subtext && (
          <Reveal delay={0.15}>
            <div className="max-w-xl mx-auto mb-16 space-y-4">
              <p className="text-lg">{subtext}</p>
            </div>
          </Reveal>
        )}

        {button && (
          <Reveal delay={0.3}>
            <div className="flex justify-center">
              {BOOKING_ENABLED ? (
                <Link
                  href={bookingHref}
                  className="btn-primary w-full sm:w-auto sm:min-w-[300px]"
                >
                  {button} <span>→</span>
                </Link>
              ) : (
                <LeadCaptureForm
                  locale={locale}
                  source="cta"
                  label={CALL_CTA_LABEL[locale]}
                  triggerClassName={cn(
                    'w-full sm:w-auto sm:min-w-[300px] justify-center gap-3',
                    'bg-burnt-orange text-white hover:bg-bone-white hover:text-dark-brown px-8 py-4',
                    'text-[11px] tracking-[0.15em]'
                  )}
                />
              )}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
