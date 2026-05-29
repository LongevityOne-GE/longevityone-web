'use client'

import Image from 'next/image'
import type { Locale } from '@/lib/utils'
import type { SiteSettings } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { ContactForm } from '@/components/sections/ContactForm'

interface ContactSectionProps {
  locale: Locale
  settings: SiteSettings | null
}

export function ContactSection({ locale, settings }: ContactSectionProps) {
  const addressLabel = locale === 'ka' ? 'მისამართი' : 'Address'
  const phoneLabel = locale === 'ka' ? 'ტელეფონი' : 'Phone'
  const emailLabel = locale === 'ka' ? 'ელ. ფოსტა' : 'Email'
  const hoursLabel = locale === 'ka' ? 'სამუშაო საათები' : 'Opening Hours'
  const formHeading = locale === 'ka' ? 'გამოგვიგზავნეთ შეტყობინება' : 'Send Us a Message'
  const clinicLabel = locale === 'ka' ? 'ჩვენი კლინიკა' : 'Our clinic'
  const clinicPhotoAlt =
    locale === 'ka'
      ? 'Longevity One კლინიკის სივრცე'
      : 'Longevity One clinic interior'

  const address = locale === 'ka' ? settings?.address_ka : settings?.address_en
  const hours = locale === 'ka' ? settings?.openingHours_ka : settings?.openingHours_en
  const sanitizedAddress = address?.replace(/^\s*[-\u2013]\s*/, '') ?? address

  return (
    <section className="py-20 md:py-32 bg-bone-white">
      <div className="section-container">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-14 xl:gap-20 items-stretch">
          {/* details */}
          <Reveal className="h-full">
            <div className="bg-bone-white/95 backdrop-blur-sm rounded-[32px] border border-dark-brown/15 shadow-[0_40px_90px_rgba(66,41,34,0.18)] overflow-hidden flex flex-col h-full">
              <figure className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/clinic/main.jpeg"
                  alt={clinicPhotoAlt}
                  fill
                  sizes="(max-width: 1280px) 100vw, 50vw"
                  className="object-cover"
                  priority={false}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-dark-brown/55 via-dark-brown/10 to-transparent"
                />
                <figcaption className="absolute inset-x-8 bottom-8 flex items-center justify-between text-bone-white">
                  <span className="text-[11px] uppercase tracking-[0.32em] font-semibold">
                    {clinicLabel}
                  </span>
                  <span className="text-[11px] font-light tracking-[0.18em]">
                    Longevity One
                  </span>
                </figcaption>
              </figure>

              <div className="p-8 md:p-10 space-y-8">
                {address && (
                  <div className="flex gap-5 items-start">
                    <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-full bg-burnt-orange/10 text-burnt-orange">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2a7 7 0 0 0-7 7c0 4.6 5.58 10.83 6.3 11.58a1 1 0 0 0 1.4 0C13.42 19.83 19 13.6 19 9a7 7 0 0 0-7-7Zm0 10a3 3 0 1 1 3-3 3 3 0 0 1-3 3Z" />
                      </svg>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[11px] uppercase tracking-[0.32em] text-burnt-orange font-semibold">
                        {addressLabel}
                      </p>
                      {settings?.maps_url ? (
                        <a
                          href={settings.maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-start gap-3 text-dark-brown/80 leading-relaxed hover:text-burnt-orange transition-colors duration-200"
                        >
                          <svg className="mt-1 h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="m13 6 1.41 1.41L11.83 10H20v2h-8.17l2.58 2.59L13 16l-5-5z" />
                          </svg>
                          <span className="underline underline-offset-4 decoration-dark-brown/25 group-hover:decoration-burnt-orange">
                            {sanitizedAddress}
                          </span>
                        </a>
                      ) : (
                        <p className="text-dark-brown/75 leading-relaxed">{sanitizedAddress}</p>
                      )}

                      {hours && hours.length > 0 && (
                        <div className="rounded-[18px] border border-dark-brown/10 bg-dark-brown/[0.04] px-5 py-4">
                          <p className="text-[11px] uppercase tracking-[0.28em] font-semibold text-dark-brown/70">
                            {hoursLabel}
                          </p>
                          <ul className="mt-2 space-y-1 text-sm text-dark-brown/75">
                            {hours.map((line, idx) => (
                              <li key={idx}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  {settings?.phone && (
                    <div className="flex gap-4 items-start">
                      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-dark-brown/8 text-dark-brown">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 .94-.26 11.36 11.36 0 0 0 3 .4 1 1 0 0 1 1 1V21a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1h3.68a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .4 3 1 1 0 0 1-.26.94Z" />
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-burnt-orange font-semibold">
                          {phoneLabel}
                        </p>
                        <a
                          href={`tel:${settings.phone}`}
                          className="text-sm font-bold text-dark-brown hover:text-burnt-orange transition-colors duration-200"
                        >
                          {settings.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {settings?.email && (
                    <div className="flex gap-4 items-start">
                      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-dark-brown/8 text-dark-brown">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 2v.43l-8 5.33-8-5.33V6Zm-16 12V9.28l7.37 4.9a1 1 0 0 0 1.26 0L20 9.28V18Z" />
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-burnt-orange font-semibold">
                          {emailLabel}
                        </p>
                        <a
                          href={`mailto:${settings.email}`}
                          className="text-sm font-bold text-dark-brown hover:text-burnt-orange transition-colors duration-200"
                        >
                          {settings.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          {/* form */}
          <Reveal delay={0.12} className="h-full">
            <div className="bg-bone-white/90 backdrop-blur-sm rounded-[32px] border border-dark-brown/10 shadow-[0_32px_80px_rgba(66,41,34,0.14)] p-8 md:p-10 lg:p-12 h-full flex flex-col">
              <div className="mb-8 space-y-3">
                <span className="text-[11px] uppercase tracking-[0.32em] text-burnt-orange font-semibold">
                  {locale === 'ka' ? 'დაგვიკავშირდით' : 'Contact Longevity One'}
                </span>
                <h2 className="text-2xl md:text-3xl font-black font-serif text-dark-brown leading-tight">
                  {formHeading}
                </h2>
                <p className="text-sm text-dark-brown/70 leading-relaxed max-w-md">
                  {locale === 'ka'
                    ? 'მოითხოვეთ კონსულტაციის დრო ან დაგვისვით შეკითხვა და ჩვენი გუნდი მალევე დაგიკავშირდებათ.'
                    : 'Request a consultation slot or send a question and our team will follow up shortly.'}
                </p>
              </div>
              <ContactForm locale={locale} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
