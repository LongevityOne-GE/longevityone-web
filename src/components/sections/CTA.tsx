import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import type { HomePageData } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface CTAProps {
  locale: Locale
  data?: HomePageData | null
}

export function CTA({ locale, data }: CTAProps) {
  const prefix = locale === 'en' ? '/en' : ''
  const bookingHref = `${prefix}/booking?type=consultation`
  const heading = locale === 'ka' ? data?.cta_heading_ka : data?.cta_heading_en
  const subtext = locale === 'ka' ? data?.cta_subtext_ka : data?.cta_subtext_en
  const button = locale === 'ka' ? data?.cta_button_ka : data?.cta_button_en

  return (
    <section className="py-20 md:py-40 relative overflow-hidden bg-black text-bone-white text-center">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/videos/video1_boomerang.webm" type="video/webm" />
        <source src="/videos/video1_boomerang.mp4" type="video/mp4" />
      </video>
      <div className="section-container relative z-10 max-w-4xl">
        {heading && (
          <Reveal>
            <h2
              className="text-3xl sm:text-5xl md:text-8xl font-black mb-6 md:mb-8 leading-none font-serif"
              dangerouslySetInnerHTML={{ __html: heading.replace(/\n/g, '<br />') }}
            />
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
            <Link
              href={bookingHref}
              className="btn-primary w-full sm:w-auto sm:min-w-[300px]"
            >
              {button} <span>→</span>
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  )
}
