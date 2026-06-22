'use client'

import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import type { SiteSettings } from '@/lib/sanity/types'
import { Logo } from '@/components/shared/Logo'
import { Reveal } from '@/components/animations/Reveal'

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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

  return (
    <footer className="bg-bone-white pt-16 md:pt-32 pb-12 md:pb-16 px-4 md:px-16 border-t border-dark-brown/10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-20 [&>div]:min-w-0">
        <Reveal>
        <div>
          <Logo variant="full" />
          <div className="mt-10 flex gap-3">
            {siteSettings?.socialFacebook && (
              <a
                href={siteSettings.socialFacebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-dark-brown/15 text-dark-brown/60 hover:border-burnt-orange hover:text-burnt-orange hover:scale-110 transition-all duration-200"
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
                className="flex items-center justify-center w-10 h-10 rounded-full border border-dark-brown/15 text-dark-brown/60 hover:border-burnt-orange hover:text-burnt-orange hover:scale-110 transition-all duration-200"
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
                className="flex items-center justify-center w-10 h-10 rounded-full border border-dark-brown/15 text-dark-brown/60 hover:border-burnt-orange hover:text-burnt-orange hover:scale-110 transition-all duration-200"
              >
                <LinkedinIcon />
              </a>
            )}
          </div>
        </div>
        </Reveal>

        <Reveal delay={0.1}>
        <div className="space-y-6">
          <h2 className="font-bold uppercase text-xs tracking-widest">
            {locale === 'ka' ? 'კონტაქტი' : 'Contact'}
          </h2>
          <div className="text-sm font-light space-y-4">
            {address && (
              siteSettings?.maps_url ? (
                <a
                  href={siteSettings.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open in Google Maps"
                  className="group flex items-start gap-1.5 hover:text-burnt-orange transition-colors duration-200"
                >
                  <svg className="mt-0.5 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span className="underline underline-offset-2 decoration-dark-brown/30 group-hover:decoration-burnt-orange transition-colors duration-200">{address}</span>
                </a>
              ) : (
                <p>{address}</p>
              )
            )}
            {hours && <p>{hours}</p>}
            {(siteSettings?.phone || siteSettings?.email) && (
              <p className="font-bold">
                {siteSettings.phone && (
                  <a href={`tel:${siteSettings.phone.replace(/\s/g, '')}`} className="hover:text-burnt-orange transition-colors">
                    {siteSettings.phone}
                  </a>
                )}
                {siteSettings.email && (
                  <><br /><a href={`mailto:${siteSettings.email}`} className="text-burnt-orange font-normal hover:underline">{siteSettings.email}</a></>
                )}
              </p>
            )}
          </div>
        </div>
        </Reveal>

        <Reveal delay={0.2}>
        <div className="space-y-6">
          <h2 className="font-bold uppercase text-xs tracking-widest">
            {locale === 'ka' ? 'ნავიგაცია' : 'Menu'}
          </h2>
          <ul className="text-sm font-medium space-y-3">
            <li><Link href={`${prefix}/about`} className="hover:text-burnt-orange transition-colors uppercase">{locale === 'ka' ? 'ჩვენს შესახებ' : 'About Us'}</Link></li>
            <li><Link href={`${prefix}/services`} className="hover:text-burnt-orange transition-colors uppercase">{locale === 'ka' ? 'სერვისები' : 'Services'}</Link></li>
            <li><Link href={`${prefix}/technologies`} className="hover:text-burnt-orange transition-colors uppercase">{locale === 'ka' ? 'ტექნოლოგია' : 'Technology'}</Link></li>
            <li><Link href={`${prefix}/packages`} className="hover:text-burnt-orange transition-colors uppercase">{locale === 'ka' ? 'პაკეტები' : 'Packages'}</Link></li>
          </ul>
        </div>
        </Reveal>

        <Reveal delay={0.3}>
        <div className="space-y-6">
          <h2 className="font-bold uppercase text-xs tracking-widest">
            {locale === 'ka' ? 'ინფორმაცია' : 'Legal'}
          </h2>
          <ul className="text-sm font-medium space-y-3">
            <li><Link href={`${prefix}/faq`} className="hover:text-burnt-orange transition-colors uppercase">{locale === 'ka' ? 'ხშირი კითხვები' : 'FAQ'}</Link></li>
            <li><Link href={`${prefix}/legal/privacy`} className="hover:text-burnt-orange transition-colors uppercase">{locale === 'ka' ? 'კონფიდენციალურობა' : 'Privacy Policy'}</Link></li>
            <li><Link href={`${prefix}/legal/terms`} className="hover:text-burnt-orange transition-colors uppercase">{locale === 'ka' ? 'წესები და პირობები' : 'Terms'}</Link></li>
            <li><Link href={`${prefix}/legal/cookies`} className="hover:text-burnt-orange transition-colors uppercase">{locale === 'ka' ? 'ქუქი-ფაილები' : 'Cookies'}</Link></li>
          </ul>
        </div>
        </Reveal>
      </div>

      <div className="max-w-[1400px] mx-auto mt-32 pt-10 border-t border-dark-brown/10 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-dark-brown/40 uppercase tracking-widest">
        {copyright && <p>{copyright}</p>}
      </div>
    </footer>
  )
}
