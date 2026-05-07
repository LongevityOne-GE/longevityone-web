'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Locale } from '@/lib/utils'

interface LanguageSwitcherProps {
  locale: Locale
  className?: string
  itemClassName?: string
}

export function LanguageSwitcher({ locale, className, itemClassName }: LanguageSwitcherProps) {
  const pathname = usePathname()

  const kaHref = locale === 'en'
    ? (pathname.startsWith('/en') ? pathname.slice(3) || '/' : pathname)
    : pathname

  const enHref = locale === 'en'
    ? pathname
    : `/en${pathname === '/' ? '' : pathname}`

  return (
    <div className={className}>
      <Link
        href={kaHref}
        aria-current={locale === 'ka' ? 'true' : undefined}
        className={`${itemClassName ?? ''} ${locale === 'ka' ? 'text-burnt-orange' : 'text-dark-brown/40 hover:text-dark-brown/70 transition-colors'}`}
      >
        GE
      </Link>
      <span className="text-dark-brown/20 mx-1.5" aria-hidden="true">/</span>
      <Link
        href={enHref}
        aria-current={locale === 'en' ? 'true' : undefined}
        className={`${itemClassName ?? ''} ${locale === 'en' ? 'text-burnt-orange' : 'text-dark-brown/40 hover:text-dark-brown/70 transition-colors'}`}
      >
        EN
      </Link>
    </div>
  )
}
