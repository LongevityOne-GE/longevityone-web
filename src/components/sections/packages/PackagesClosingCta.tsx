'use client'

import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import { Reveal } from '@/components/animations/Reveal'
import { LeadCaptureForm } from '@/components/sections/LeadCaptureForm'

interface PackagesClosingCtaProps {
  locale: Locale
}

export function PackagesClosingCta({ locale }: PackagesClosingCtaProps) {
  const prefix = locale === 'en' ? '/en' : ''
  const eyebrow = locale === 'ka' ? 'გადაწყვეტილება გიჭირთ?' : 'Not sure where to start?'
  const heading =
    locale === 'ka'
      ? 'დაჯავშნეთ საკონსულტაციო ზარი'
      : 'Book a consultation and we will guide you'
  const body =
    locale === 'ka'
      ? 'მოკლე ზარზე ჩვენი გუნდი დაგეხმარებათ შეარჩიოთ თქვენს მიზნებზე მორგებული პაკეტი - ან ცალკეული პროცედურა. საიტზე წარმოდგენილია მხოლოდ ძირითადი პროგრამები - სრული სერვისებისა და ფასების შესახებ ინფორმაციას ზარის დროს მიიღებთ.'
      : "On a short call, our team will help you choose the package - or individual procedure - that fits your goals. The site shows only our main programmes; for the full range of services and pricing, we'll walk you through it on the call."
  const primary   = locale === 'ka' ? 'კონსულტაციის დაჯავშნა' : 'Book a consultation'
  const secondary = locale === 'ka' ? 'დაგვიკავშირდით'        : 'Contact us'

  return (
    <section className="relative isolate bg-dark-brown text-bone-white py-20 md:py-28 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none opacity-35"
      >
        <source src="/videos/longevity-helix-v2.mp4" type="video/mp4" />
      </video>
      <div aria-hidden="true" className="absolute inset-0 bg-dark-brown/75 pointer-events-none" />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 55% at center, rgba(66,41,34,0.55) 0%, rgba(66,41,34,0) 70%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-16 md:h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(66,41,34,0.6) 0%, rgba(66,41,34,0) 100%)' }}
      />
      <div className="section-container relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.28em] text-burnt-orange font-bold mb-5">
              {eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-6">
              {heading}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-bone-white/70 text-[15px] md:text-base leading-[1.75] mb-10 max-w-xl mx-auto">
              {body}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* PRIMARY — lead capture form */}
              <LeadCaptureForm
                locale={locale}
                source="final_cta"
                label={primary}
                triggerClassName="bg-burnt-orange text-white border border-burnt-orange hover:bg-bone-white hover:text-dark-brown hover:border-bone-white w-full sm:w-auto backdrop-blur-none"
              />
              {/* SECONDARY — contact link */}
              <Link
                href={`${prefix}/contact`}
                className="text-[11px] uppercase tracking-[0.18em] font-medium text-bone-white/80 border-b border-bone-white/30 pb-px hover:text-bone-white hover:border-bone-white transition-colors duration-200"
              >
                {secondary} →
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
