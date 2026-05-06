import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import type { SiteSettings } from '@/lib/sanity/types'
import { Logo } from '@/components/shared/Logo'
import { BookingButton } from '@/components/booking'

const navLinks = [
  { ka: 'მთავარი', en: 'Home', href: '/' },
  { ka: 'ჩვენს შესახებ', en: 'About', href: '/about' },
  { ka: 'სერვისები', en: 'Services', href: '/services' },
  { ka: 'მეცნიერება და ტექნოლოგია', en: 'Science & Technology', href: '/technologies' },
  { ka: 'პაკეტები', en: 'Packages', href: '/packages' },
  { ka: 'კორპორატიული', en: 'Corporate', href: '/corporate' },
  { ka: 'სტატიები', en: 'Blog', href: '/blog' },
  { ka: 'ხშირი კითხვები', en: 'FAQ', href: '/faq' },
  { ka: 'კონტაქტი', en: 'Contact', href: '/contact' },
]

interface NavProps {
  locale: Locale
  siteSettings?: SiteSettings | null
  pathname?: string
}

export function Nav({ locale, siteSettings, pathname = '/' }: NavProps) {
  const prefix = locale === 'en' ? '/en' : ''
  const ctaLabel = locale === 'ka'
    ? siteSettings?.nav_cta_ka
    : siteSettings?.nav_cta_en

  // Build language-switch URLs preserving current path
  const kaPath = locale === 'en'
    ? (pathname.startsWith('/en') ? pathname.slice(3) || '/' : pathname)
    : pathname
  const enPath = locale === 'en'
    ? pathname
    : `/en${pathname === '/' ? '' : pathname}`

  return (
    <>
      <style>{`
        .nav-toggle[open] .nav-icon-open { display: none; }
        .nav-toggle:not([open]) .nav-icon-close { display: none; }
        .nav-toggle summary { list-style: none; }
        .nav-toggle summary::-webkit-details-marker { display: none; }
        .nav-toggle summary::marker { display: none; }
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
      <nav className="fixed top-0 w-full z-50 bg-bone-white/95 backdrop-blur-sm py-4 px-4 md:px-12 lg:px-16 border-b border-dark-brown/5" aria-label={locale === 'ka' ? 'მთავარი ნავიგაცია' : 'Main navigation'}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <Link href={`${prefix}/`} className="flex-shrink-0">
            <Logo />
          </Link>

          <div className="hidden xl:flex items-center gap-3 flex-1 justify-center min-w-0">
            {navLinks.map((link) => (
              <Link
                key={link.en}
                href={`${prefix}${link.href}`}
                className="text-[10px] font-medium uppercase tracking-[0.05em] text-dark-brown hover:text-burnt-orange transition-colors whitespace-nowrap"
              >
                {locale === 'ka' ? link.ka : link.en}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest">
              <Link
                href={kaPath}
                aria-current={locale === 'ka' ? 'true' : undefined}
                className={locale === 'ka' ? 'text-burnt-orange' : 'text-dark-brown/40 hover:text-dark-brown/70 transition-colors'}
              >
                GE
              </Link>
              <span className="text-dark-brown/20" aria-hidden="true">/</span>
              <Link
                href={enPath}
                aria-current={locale === 'en' ? 'true' : undefined}
                className={locale === 'en' ? 'text-burnt-orange' : 'text-dark-brown/40 hover:text-dark-brown/70 transition-colors'}
              >
                EN
              </Link>
            </div>

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

            <details className="xl:hidden nav-toggle relative">
              <summary
                className="p-2 cursor-pointer text-dark-brown hover:text-burnt-orange transition-colors"
                aria-label={locale === 'ka' ? 'მენიუს გახსნა' : 'Open menu'}
              >
                <svg className="nav-icon-open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" />
                </svg>
                <svg className="nav-icon-close" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </summary>

              <div className="fixed left-0 right-0 top-[60px] bg-bone-white border-t border-dark-brown/10 py-8 px-6 md:px-12 flex flex-col gap-3 shadow-lg z-50">
                {navLinks.map((link) => (
                  <Link
                    key={link.en}
                    href={`${prefix}${link.href}`}
                    className="text-sm font-medium uppercase tracking-[0.1em] text-dark-brown hover:text-burnt-orange transition-colors py-1"
                  >
                    {locale === 'ka' ? link.ka : link.en}
                  </Link>
                ))}

                <div className="pt-4 mt-2 border-t border-dark-brown/10 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm font-bold">
                    <Link
                      href={kaPath}
                      aria-current={locale === 'ka' ? 'true' : undefined}
                      className={locale === 'ka' ? 'text-burnt-orange' : 'text-dark-brown/40'}
                    >
                      GE
                    </Link>
                    <span className="text-dark-brown/20" aria-hidden="true">/</span>
                    <Link
                      href={enPath}
                      aria-current={locale === 'en' ? 'true' : undefined}
                      className={locale === 'en' ? 'text-burnt-orange' : 'text-dark-brown/40'}
                    >
                      EN
                    </Link>
                  </div>
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
            </details>
          </div>
        </div>
      </nav>
    </>
  )
}
