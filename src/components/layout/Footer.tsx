'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/lib/utils'
import type { SiteSettings } from '@/lib/sanity/types'
import { Logo } from '@/components/shared/Logo'
import { Reveal } from '@/components/animations/Reveal'

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

interface FooterProps {
  locale: Locale
  siteSettings?: SiteSettings | null
}

export function Footer({ locale, siteSettings }: FooterProps) {
  const prefix = locale === 'en' ? '/en' : ''

  const address = locale === 'ka' ? siteSettings?.address_ka : siteSettings?.address_en
  const hours = locale === 'ka'
    ? siteSettings?.openingHours_ka?.[0]
    : siteSettings?.openingHours_en?.[0]
  const copyright = locale === 'ka'
    ? siteSettings?.footer_copyright_ka
    : siteSettings?.footer_copyright_en

  const hasSocials = siteSettings?.socialFacebook || siteSettings?.socialInstagram || siteSettings?.socialLinkedIn

  return (
    <footer className="relative bg-dark-brown text-bone-white overflow-hidden">

      {/* Watermark logo mark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-8 opacity-[0.04]" aria-hidden="true">
        <Image
          src="/logos/logo-mark.svg"
          alt=""
          width={520}
          height={520}
          className="w-[420px] h-[420px] md:w-[520px] md:h-[520px] brightness-[100] invert"
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 pt-16 md:pt-24 pb-10 md:pb-14">

        {/* Top row — brand + tagline */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 md:pb-16 border-b border-bone-white/10">
            <div>
              <Logo variant="full" inverted />
              {hasSocials && (
                <div className="mt-8 flex gap-2.5">
                  {siteSettings?.socialFacebook && (
                    <a
                      href={siteSettings.socialFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on Facebook"
                      className="flex items-center justify-center w-9 h-9 rounded-full border border-bone-white/20 text-bone-white/60 hover:border-burnt-orange hover:text-burnt-orange hover:scale-110 transition-all duration-200"
                    >
                      <FacebookIcon />
                    </a>
                  )}
                  {siteSettings?.socialInstagram && (
                    <a
                      href={siteSettings.socialInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on Instagram"
                      className="flex items-center justify-center w-9 h-9 rounded-full border border-bone-white/20 text-bone-white/60 hover:border-burnt-orange hover:text-burnt-orange hover:scale-110 transition-all duration-200"
                    >
                      <InstagramIcon />
                    </a>
                  )}
                  {siteSettings?.socialLinkedIn && (
                    <a
                      href={siteSettings.socialLinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on LinkedIn"
                      className="flex items-center justify-center w-9 h-9 rounded-full border border-bone-white/20 text-bone-white/60 hover:border-burnt-orange hover:text-burnt-orange hover:scale-110 transition-all duration-200"
                    >
                      <LinkedinIcon />
                    </a>
                  )}
                </div>
              )}
            </div>

            {siteSettings?.tagline_en && (
              <p className="text-bone-white/40 text-sm font-light italic tracking-wide md:text-right max-w-xs">
                {locale === 'ka' ? siteSettings.tagline_ka : siteSettings.tagline_en}
              </p>
            )}
          </div>
        </Reveal>

        {/* Main columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 pt-12 md:pt-16">

          {/* Contact */}
          <Reveal delay={0.05}>
            <div className="space-y-5">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-burnt-orange">
                {locale === 'ka' ? 'კონტაქტი' : 'Contact'}
              </h2>
              <div className="space-y-3 text-sm text-bone-white/60 font-light leading-relaxed">
                {address && (
                  siteSettings?.maps_url ? (
                    <a
                      href={siteSettings.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open in Google Maps"
                      className="group flex items-start gap-2 hover:text-bone-white transition-colors duration-200"
                    >
                      <svg className="mt-0.5 shrink-0 text-burnt-orange/70 group-hover:text-burnt-orange transition-colors" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <span className="underline underline-offset-2 decoration-bone-white/20 group-hover:decoration-bone-white/60 transition-colors duration-200">{address}</span>
                    </a>
                  ) : (
                    <p>{address}</p>
                  )
                )}
                {hours && <p>{hours}</p>}
                {siteSettings?.phone && (
                  <a
                    href={`tel:${siteSettings.phone.replace(/\s/g, '')}`}
                    className="block font-medium text-bone-white/80 hover:text-burnt-orange transition-colors duration-200"
                  >
                    {siteSettings.phone}
                  </a>
                )}
                {siteSettings?.email && (
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="block text-burnt-orange hover:text-burnt-orange/80 transition-colors duration-200"
                  >
                    {siteSettings.email}
                  </a>
                )}
              </div>
            </div>
          </Reveal>

          {/* Menu */}
          <Reveal delay={0.1}>
            <div className="space-y-5">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-burnt-orange">
                {locale === 'ka' ? 'ნავიგაცია' : 'Menu'}
              </h2>
              <ul className="space-y-2.5 text-sm font-light text-bone-white/60">
                {[
                  { href: `${prefix}/about`, ka: 'ჩვენს შესახებ', en: 'About Us' },
                  { href: `${prefix}/services`, ka: 'სერვისები', en: 'Services' },
                  { href: `${prefix}/technologies`, ka: 'ტექნოლოგია', en: 'Technology' },
                  { href: `${prefix}/packages`, ka: 'პაკეტები', en: 'Packages' },
                ].map(item => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="hover:text-bone-white transition-colors duration-200 uppercase tracking-wide"
                    >
                      {locale === 'ka' ? item.ka : item.en}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Legal */}
          <Reveal delay={0.15}>
            <div className="space-y-5">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-burnt-orange">
                {locale === 'ka' ? 'ინფორმაცია' : 'Legal'}
              </h2>
              <ul className="space-y-2.5 text-sm font-light text-bone-white/60">
                {[
                  { href: `${prefix}/faq`, ka: 'ხშირი კითხვები', en: 'FAQ' },
                  { href: `${prefix}/legal/privacy`, ka: 'კონფიდენციალურობა', en: 'Privacy Policy' },
                  { href: `${prefix}/legal/terms`, ka: 'წესები და პირობები', en: 'Terms' },
                ].map(item => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="hover:text-bone-white transition-colors duration-200 uppercase tracking-wide"
                    >
                      {locale === 'ka' ? item.ka : item.en}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

        </div>

        {/* Bottom bar */}
        <div className="mt-16 md:mt-20 pt-8 border-t border-bone-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold text-bone-white/25 uppercase tracking-widest">
          {copyright && <p>{copyright}</p>}
          <p>{locale === 'ka' ? 'გაკეთებულია სიყვარულით' : 'Made with care · Tbilisi, Georgia'}</p>
        </div>

      </div>
    </footer>
  )
}
