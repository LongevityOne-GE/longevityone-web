'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/utils'
import type { SiteSettings } from '@/lib/sanity/types'
import { Logo } from '@/components/shared/Logo'
import { BookingButton } from '@/components/booking'
import { useScrollProgress } from '@/lib/motion'
import { LanguageSwitcher } from './LanguageSwitcher'

interface NavChild {
  ka: string
  en: string
  href: string
}

interface NavLink {
  ka: string
  en: string
  href: string
  children?: NavChild[]
}

const navLinks: NavLink[] = [
  { ka: 'მთავარი', en: 'Home', href: '/' },
  {
    ka: 'ჩვენს შესახებ', en: 'About', href: '/about',
    children: [
      { ka: 'კლინიკის შესახებ', en: 'About the Clinic', href: '/about' },
      { ka: 'სამეცნიერო საბჭო', en: 'Advisory Board', href: '/about/advisory-board' },
    ],
  },
  { ka: 'სერვისები', en: 'Services', href: '/services' },
  { ka: 'ტექნოლოგია', en: 'Technology', href: '/technologies' },
  { ka: 'პაკეტები', en: 'Packages', href: '/packages' },
  { ka: 'კორპორატიული', en: 'Corporate', href: '/corporate' },
  { ka: 'პაციენტის გზა', en: 'Patient Journey', href: '/journey' },
  { ka: 'სტატიები', en: 'Blog', href: '/blog' },
  { ka: 'FAQ', en: 'FAQ', href: '/faq' },
  { ka: 'კონტაქტი', en: 'Contact', href: '/contact' },
]

interface NavProps {
  locale: Locale
  siteSettings?: SiteSettings | null
}

export function Nav({ locale, siteSettings }: NavProps) {
  const prefix = locale === 'en' ? '/en' : ''
  const ctaLabel = locale === 'ka'
    ? siteSettings?.nav_cta_ka
    : siteSettings?.nav_cta_en

  const rawPath = usePathname() ?? '/'
  const currentPath = rawPath.startsWith('/en')
    ? (rawPath.slice(3) || '/')
    : rawPath
  const isActive = (href: string) =>
    href === '/' ? currentPath === '/' : currentPath === href || currentPath.startsWith(`${href}/`)

  // Scroll-driven nav state: progress bar + solid/blur background + hide on scroll down.
  const progress = useScrollProgress()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lastYRef = useRef(0)

  // Close mobile menu on route change.
  useEffect(() => {
    setMobileOpen(false)
  }, [rawPath])

  // Close on ESC + lock body scroll while open.
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [mobileOpen])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 80)
      const delta = y - lastYRef.current
      // Only hide after clearing the hero and when scrolling down meaningfully.
      if (y > 200 && delta > 6) setHidden(true)
      else if (delta < -6 || y < 100) setHidden(false)
      lastYRef.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style>{`
        .skip-link {
          position: absolute;
          left: -9999px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }
        .skip-link:focus {
          position: fixed;
          top: 0;
          left: 0;
          width: auto;
          height: auto;
          padding: 0.5rem 1rem;
          background: #2C1810;
          color: #E7DECC;
          font-size: 0.875rem;
          font-weight: bold;
          z-index: 9999;
          text-decoration: none;
        }
      `}</style>
      <a href="#main-content" className="skip-link">
        {locale === 'ka' ? 'მთავარ კონტენტზე გადასვლა' : 'Skip to main content'}
      </a>
      <nav
        className={`fixed top-[var(--fc50-bar,0px)] w-full z-50 py-4 px-4 md:px-12 lg:px-16 border-b transition-[transform,background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-out will-change-transform ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        } ${
          scrolled
            ? 'bg-bone-white/70 backdrop-blur-lg border-dark-brown/10 shadow-sm'
            : 'bg-bone-white/95 backdrop-blur-sm border-dark-brown/5'
        }`}
        aria-label={locale === 'ka' ? 'მთავარი ნავიგაცია' : 'Main navigation'}
      >
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 h-[2px] bg-burnt-orange origin-left transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <Link href={`${prefix}/`} className="flex-shrink-0">
            <Logo />
          </Link>

          <div className="hidden xl:flex items-center gap-3 flex-1 justify-center min-w-0">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              if (link.children && link.children.length > 0) {
                const anyChildActive = link.children.some((c) => isActive(c.href))
                return (
                  <div key={link.en} className="relative group/dropdown">
                    <Link
                      href={`${prefix}${link.href}`}
                      aria-current={active ? 'page' : undefined}
                      className={`text-[10px] font-medium uppercase tracking-[0.05em] hover:text-burnt-orange transition-colors whitespace-nowrap flex items-center gap-1 ${active || anyChildActive ? 'text-burnt-orange' : 'text-dark-brown'}`}
                    >
                      {locale === 'ka' ? link.ka : link.en}
                      <svg width="8" height="5" viewBox="0 0 8 5" fill="currentColor" aria-hidden="true" className="opacity-50 transition-transform duration-200 group-hover/dropdown:rotate-180">
                        <path d="M0 0.5L4 4.5L8 0.5" stroke="currentColor" strokeWidth="1" fill="none"/>
                      </svg>
                    </Link>
                    {/* Dropdown */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 pointer-events-none group-hover/dropdown:opacity-100 group-hover/dropdown:pointer-events-auto transition-[opacity,transform] duration-200 group-hover/dropdown:translate-y-0 translate-y-1 z-50">
                      <div className="bg-bone-white border border-dark-brown/10 shadow-sm min-w-[180px] py-1">
                        {link.children.map((child) => {
                          const childActive = isActive(child.href)
                          return (
                            <Link
                              key={child.href}
                              href={`${prefix}${child.href}`}
                              aria-current={childActive ? 'page' : undefined}
                              className={`block px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.08em] hover:text-burnt-orange hover:bg-dark-brown/4 transition-colors whitespace-nowrap ${childActive ? 'text-burnt-orange' : 'text-dark-brown'}`}
                            >
                              {locale === 'ka' ? child.ka : child.en}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              }
              return (
                <Link
                  key={link.en}
                  href={`${prefix}${link.href}`}
                  aria-current={active ? 'page' : undefined}
                  className={`text-[10px] font-medium uppercase tracking-[0.05em] hover:text-burnt-orange transition-colors whitespace-nowrap ${active ? 'text-burnt-orange' : 'text-dark-brown'}`}
                >
                  {locale === 'ka' ? link.ka : link.en}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <LanguageSwitcher
              locale={locale}
              className="hidden sm:flex items-center text-[11px] font-bold uppercase tracking-widest"
            />

            {ctaLabel && (
              <BookingButton
                lang={locale}
                variant="primary"
                size="sm"
                className="hidden sm:inline-flex bg-burnt-orange hover:bg-dark-brown whitespace-nowrap"
              >
                {ctaLabel}
              </BookingButton>
            )}

            <div className="xl:hidden relative">
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-menu"
                aria-label={
                  mobileOpen
                    ? locale === 'ka' ? 'მენიუს დახურვა' : 'Close menu'
                    : locale === 'ka' ? 'მენიუს გახსნა' : 'Open menu'
                }
                className="p-2 cursor-pointer text-dark-brown hover:text-burnt-orange transition-colors"
              >
                {mobileOpen ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Mobile menu: backdrop + panel ────────────────────────────────
         Backdrop sits below the menu panel and closes the menu on click,
         giving the expected "tap-outside-to-dismiss" behaviour. Each
         link inside the panel also closes on click. ESC + route change
         both close (handled in useEffect above). */}
      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label={locale === 'ka' ? 'მენიუს დახურვა' : 'Close menu'}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-dark-brown/40 backdrop-blur-sm xl:hidden animate-in fade-in duration-200"
          />
          <div
            id="mobile-nav-menu"
            role="dialog"
            aria-modal="true"
            aria-label={locale === 'ka' ? 'მთავარი ნავიგაცია' : 'Main navigation'}
            className="fixed left-0 right-0 top-[60px] z-50 bg-bone-white border-t border-dark-brown/10 py-8 px-6 md:px-12 flex flex-col gap-3 shadow-lg xl:hidden max-h-[calc(100vh-60px)] overflow-y-auto animate-in slide-in-from-top-2 fade-in duration-200"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <div key={link.en}>
                  <Link
                    href={`${prefix}${link.href}`}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm font-medium uppercase tracking-[0.1em] hover:text-burnt-orange transition-colors py-1 ${active ? 'text-burnt-orange' : 'text-dark-brown'}`}
                  >
                    {locale === 'ka' ? link.ka : link.en}
                  </Link>
                  {link.children && link.children.map((child) => {
                    const childActive = isActive(child.href)
                    return (
                      <Link
                        key={child.href}
                        href={`${prefix}${child.href}`}
                        aria-current={childActive ? 'page' : undefined}
                        onClick={() => setMobileOpen(false)}
                        className={`block pl-4 mt-1 text-xs font-medium uppercase tracking-[0.1em] hover:text-burnt-orange transition-colors py-0.5 border-l border-dark-brown/15 ${childActive ? 'text-burnt-orange' : 'text-dark-brown/60'}`}
                      >
                        {locale === 'ka' ? child.ka : child.en}
                      </Link>
                    )
                  })}
                </div>
              )
            })}

            <div className="pt-4 mt-2 border-t border-dark-brown/10 flex items-center justify-between">
              <LanguageSwitcher
                locale={locale}
                className="flex items-center text-sm font-bold"
              />
              {ctaLabel && (
                <BookingButton
                  lang={locale}
                  variant="primary"
                  size="sm"
                  className="sm:hidden bg-burnt-orange hover:bg-dark-brown whitespace-nowrap"
                >
                  {ctaLabel}
                </BookingButton>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
