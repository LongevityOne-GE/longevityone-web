'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { Locale } from '@/lib/utils'

interface AnnouncementBarProps {
  locale: Locale
}

const DISMISS_KEY = 'fc50_dismissed'
const SESSION_KEY = 'fc50_bar_dismissed'
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

const content = {
  ka: {
    name: 'დამფუძნებელთა წრე 50',
    tagline: 'პირველი 50 წევრისთვის',
    learnMore: 'გაიგეთ მეტი',
    dismissLabel: 'დახურვა',
  },
  en: {
    name: 'Founder Circle 50',
    tagline: 'For the first 50 members',
    learnMore: 'Learn More',
    dismissLabel: 'Dismiss',
  },
} as const

function setBarOffset(px: number) {
  document.documentElement.style.setProperty('--fc50-bar', `${px}px`)
}

export function AnnouncementBar({ locale }: AnnouncementBarProps) {
  const t = content[locale]
  const href = locale === 'en' ? '/en#founder-circle' : '/#founder-circle'

  // Start hidden to avoid hydration mismatch; reveal after checking storage.
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(DISMISS_KEY)
    const dismissedAt = raw ? Number(raw) : 0
    const stillDismissed =
      Number.isFinite(dismissedAt) && dismissedAt > 0 && Date.now() - dismissedAt < SEVEN_DAYS_MS

    if (!stillDismissed) {
      setVisible(true)
      setBarOffset(44)
    }

    return () => setBarOffset(0)
  }, [])

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
    sessionStorage.setItem(SESSION_KEY, 'true')
    setVisible(false)
    setBarOffset(0)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-11 border-b border-bone-white/10 bg-dark-brown text-bone-white">
      <div className="relative mx-auto flex h-full max-w-[1400px] items-center justify-center px-12">
        <p className="flex items-center gap-3 sm:gap-4 text-[11px] uppercase tracking-[0.22em]">
          <span className="font-semibold tracking-[0.26em] text-bone-white">{t.name}</span>
          <span aria-hidden="true" className="hidden sm:inline-block h-3 w-px bg-bone-white/25" />
          <span className="hidden sm:inline text-bone-white/55">{t.tagline}</span>
          <span aria-hidden="true" className="inline-block h-1 w-1 rotate-45 bg-burnt-orange" />
          <Link
            href={href}
            className="group relative inline-flex items-center gap-1.5 font-bold text-bone-white"
          >
            <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-burnt-orange after:transition-[width] after:duration-300 after:ease-out group-hover:after:w-full">
              {t.learnMore}
            </span>
            <span
              aria-hidden="true"
              className="text-burnt-orange transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t.dismissLabel}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center text-bone-white/60 transition-colors duration-200 hover:text-bone-white"
        >
          <X size={15} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
