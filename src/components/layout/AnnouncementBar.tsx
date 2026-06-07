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
      setBarOffset(48) // updated to h-12 (48px)
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
    <div className="fixed inset-x-0 top-0 z-[60] h-12 bg-[#2a1a14]/95 backdrop-blur-xl shadow-lg transition-all duration-500">
      {/* Elegant gradient bottom border */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-burnt-orange/40 to-transparent" />
      
      <div className="relative mx-auto flex h-full max-w-[1400px] items-center justify-center px-12">
        <p className="flex items-center gap-3 sm:gap-5 text-[11px] uppercase tracking-[0.22em]">
          <span className="font-semibold tracking-[0.26em] text-transparent bg-clip-text bg-gradient-to-r from-bone-white to-bone-white/70 drop-shadow-sm">
            {t.name}
          </span>
          <span aria-hidden="true" className="hidden sm:inline-block h-4 w-px bg-bone-white/15" />
          <span className="hidden sm:inline text-bone-white/50 text-[10px] tracking-[0.25em]">
            {t.tagline}
          </span>
          
          <span aria-hidden="true" className="relative flex h-1.5 w-1.5 items-center justify-center ml-1">
            <span className="absolute inline-flex h-full w-full animate-ping bg-burnt-orange opacity-60" style={{ animationDuration: '3s' }} />
            <span className="relative inline-flex h-1.5 w-1.5 rotate-45 bg-burnt-orange" />
          </span>

          <Link
            href={href}
            className="group ml-1 flex items-center gap-2 rounded-full border border-burnt-orange/30 bg-burnt-orange/10 px-4 py-1.5 text-[9px] font-bold tracking-[0.2em] text-bone-white transition-all duration-300 hover:border-burnt-orange hover:bg-burnt-orange hover:shadow-[0_0_12px_rgba(212,88,0,0.4)]"
          >
            <span>{t.learnMore}</span>
            <span
              aria-hidden="true"
              className="text-bone-white/80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-bone-white"
            >
              →
            </span>
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t.dismissLabel}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-bone-white/40 transition-all duration-300 hover:border-bone-white/10 hover:bg-bone-white/5 hover:text-bone-white"
        >
          <X size={14} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
