'use client'

import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import type { SiteSettings } from '@/lib/sanity/types'
import { Logo } from '@/components/shared/Logo'
import { Reveal } from '@/components/animations/Reveal'

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function LinkedinIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
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
          <div className="mt-10 flex space-x-4">
            {siteSettings?.socialFacebook ? (
              <a href={siteSettings.socialFacebook} className="hover:text-burnt-orange transition-colors"><FacebookIcon size={20} /></a>
            ) : null}
            {siteSettings?.socialInstagram ? (
              <a href={siteSettings.socialInstagram} className="hover:text-burnt-orange transition-colors"><InstagramIcon size={20} /></a>
            ) : null}
            {siteSettings?.socialLinkedIn ? (
              <a href={siteSettings.socialLinkedIn} className="hover:text-burnt-orange transition-colors"><LinkedinIcon size={20} /></a>
            ) : null}
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
                  className="hover:text-burnt-orange transition-colors duration-200"
                >
                  {address}
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
