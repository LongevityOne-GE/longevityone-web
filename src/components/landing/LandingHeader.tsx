import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import { Logo } from '@/components/shared/Logo'
import { CALL_CTA_LABEL } from '@/lib/features'
import { LANDING_SECTIONS, landingPath } from './sections'

interface LandingHeaderProps {
  locale: Locale
}

/**
 * Header for the ad landing page: logo, a jump link to each section on the
 * page, the language switch, and the call-request button. Replaces the main
 * site navigation, which would lead ad visitors away from the form.
 */
export function LandingHeader({ locale }: LandingHeaderProps) {
  const other: Locale = locale === 'ka' ? 'en' : 'ka'

  return (
    <header className="sticky top-0 z-40 border-b border-dark-brown/10 bg-bone-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-3 md:px-8">
        <a href="#top" className="flex-shrink-0" aria-label="Longevity One">
          <Logo />
        </a>

        <nav
          aria-label={locale === 'ka' ? 'გვერდის სექციები' : 'Page sections'}
          className="hidden items-center gap-7 lg:flex"
        >
          {LANDING_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-dark-brown/70 transition-colors hover:text-burnt-orange"
            >
              {s.label[locale]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href={landingPath(other)}
            hrefLang={other}
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-dark-brown/60 transition-colors hover:text-dark-brown"
          >
            {other === 'en' ? 'EN' : 'ქარ'}
          </Link>
          <a
            href="#contact"
            className="whitespace-nowrap bg-burnt-orange px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-bone-white transition-colors hover:bg-dark-brown md:px-5 md:tracking-[0.2em]"
          >
            {CALL_CTA_LABEL[locale]}
          </a>
        </div>
      </div>

      {/* Mobile: the same section links as a scrollable row. */}
      <nav
        aria-label={locale === 'ka' ? 'გვერდის სექციები' : 'Page sections'}
        className="flex gap-6 overflow-x-auto border-t border-dark-brown/5 px-5 py-2.5 lg:hidden"
      >
        {LANDING_SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] text-dark-brown/70"
          >
            {s.label[locale]}
          </a>
        ))}
      </nav>
    </header>
  )
}
