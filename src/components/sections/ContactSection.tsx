'use client'

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

  const address = locale === 'ka' ? settings?.address_ka : settings?.address_en
  const hours = locale === 'ka' ? settings?.openingHours_ka : settings?.openingHours_en

  return (
    <section className="py-20 md:py-32 bg-bone-white">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* details */}
          <div>
            <div className="space-y-10">
              {address && (
                <Reveal>
                  <div className="border-t border-dark-brown/20 pt-6">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-3">
                      {addressLabel}
                    </h3>
                    {settings?.maps_url ? (
                      <a
                        href={settings.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open in Google Maps"
                        className="group inline-flex items-start gap-2 text-sm text-dark-brown/75 leading-relaxed hover:text-burnt-orange transition-colors duration-200"
                      >
                        <svg className="mt-0.5 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <span className="underline underline-offset-2 decoration-dark-brown/30 group-hover:decoration-burnt-orange transition-colors duration-200">{address}</span>
                      </a>
                    ) : (
                      <p className="text-sm text-dark-brown/75 leading-relaxed">{address}</p>
                    )}
                  </div>
                </Reveal>
              )}

              {settings?.phone && (
                <Reveal delay={0.05}>
                  <div className="border-t border-dark-brown/20 pt-6">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-3">
                      {phoneLabel}
                    </h3>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-sm font-bold text-dark-brown hover:text-burnt-orange transition-colors duration-200"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </Reveal>
              )}

              {settings?.email && (
                <Reveal delay={0.1}>
                  <div className="border-t border-dark-brown/20 pt-6">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-3">
                      {emailLabel}
                    </h3>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-sm font-bold text-dark-brown hover:text-burnt-orange transition-colors duration-200"
                    >
                      {settings.email}
                    </a>
                  </div>
                </Reveal>
              )}

              {hours && hours.length > 0 && (
                <Reveal delay={0.15}>
                  <div className="border-t border-dark-brown/20 pt-6">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-3">
                      {hoursLabel}
                    </h3>
                    <ul className="space-y-1">
                      {hours.map((line, i) => (
                        <li key={i} className="text-sm text-dark-brown/75">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}
            </div>
          </div>

          {/* form */}
          <Reveal delay={0.1}>
            <div>
              <h2 className="text-2xl md:text-3xl font-black font-serif text-dark-brown mb-10">
                {formHeading}
              </h2>
              <ContactForm locale={locale} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
