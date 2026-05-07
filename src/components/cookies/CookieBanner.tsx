'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import { hasConsented, readConsent, writeConsent } from '@/lib/cookies'

interface CookieBannerStrings {
  title: string
  body: string
  accept: string
  reject: string
  manage: string
  privacyHref: string
}

interface CookieBannerProps {
  locale: Locale
  strings: CookieBannerStrings
}

const categoryLabels = {
  ka: {
    essential: 'აუცილებელი',
    essentialDesc: 'საიტის გამართული მუშაობისათვის საჭირო ქუქი-ფაილები. ყოველთვის ჩართულია.',
    analytics: 'ანალიტიკა',
    analyticsDesc: 'გვეხმარება ვიგებთ, როგორ იყენებთ საიტს, რათა გავაუმჯობესოთ გამოცდილება (Google Analytics, PostHog).',
    marketing: 'მარკეტინგი',
    marketingDesc: 'გამოიყენება პერსონალიზებული შინაარსისა და სარეკლამო კამპანიების სამართავად.',
    savePrefs: 'პარამეტრების შენახვა',
    prefsTitle: 'ქუქი-ფაილების მართვა',
    alwaysOn: 'ყოველთვის ჩართული',
  },
  en: {
    essential: 'Essential',
    essentialDesc: 'Required for the site to function correctly. Always active.',
    analytics: 'Analytics',
    analyticsDesc: 'Help us understand how you use the site so we can improve your experience (Google Analytics, PostHog).',
    marketing: 'Marketing',
    marketingDesc: 'Used for personalised content and advertising campaigns.',
    savePrefs: 'Save Preferences',
    prefsTitle: 'Manage Cookies',
    alwaysOn: 'Always on',
  },
}

function Toggle({
  checked,
  onChange,
  disabled,
  id,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  id: string
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent
        transition-colors duration-200 focus:outline-none focus-visible:ring-2
        focus-visible:ring-burnt-orange focus-visible:ring-offset-2
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${checked ? 'bg-burnt-orange' : 'bg-dark-brown/20'}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow
          ring-0 transition-transform duration-200
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  )
}

function PreferencesModal({
  locale,
  initialAnalytics,
  initialMarketing,
  onSave,
  onClose,
}: {
  locale: Locale
  initialAnalytics: boolean
  initialMarketing: boolean
  onSave: (analytics: boolean, marketing: boolean) => void
  onClose: () => void
}) {
  const l = categoryLabels[locale]
  const [analytics, setAnalytics] = useState(initialAnalytics)
  const [marketing, setMarketing] = useState(initialMarketing)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Focus trap
  useEffect(() => {
    closeRef.current?.focus()
    const el = dialogRef.current
    if (!el) return
    const focusable = Array.from(el.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ))
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first && last) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last && first) { e.preventDefault(); first.focus() }
      }
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prefs-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-brown/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-lg bg-bone-white rounded-lg shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-dark-brown/10">
          <h2 id="prefs-title" className="text-base font-black font-serif text-dark-brown">
            {l.prefsTitle}
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={locale === 'ka' ? 'დახურვა' : 'Close'}
            className="text-dark-brown/40 hover:text-dark-brown transition-colors p-1 rounded focus-visible:ring-2 focus-visible:ring-burnt-orange focus-visible:outline-none"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        {/* Categories */}
        <div className="divide-y divide-dark-brown/10 px-6">
          {/* Essential */}
          <div className="py-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-dark-brown">{l.essential}</p>
              <p className="text-xs text-dark-brown/60 mt-1 leading-relaxed">{l.essentialDesc}</p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end gap-1">
              <Toggle id="toggle-essential" checked={true} onChange={() => {}} disabled />
              <span className="text-[10px] font-bold uppercase tracking-widest text-dark-brown/40">{l.alwaysOn}</span>
            </div>
          </div>

          {/* Analytics */}
          <div className="py-5 flex items-start justify-between gap-4">
            <div>
              <label htmlFor="toggle-analytics" className="text-sm font-bold text-dark-brown cursor-pointer">{l.analytics}</label>
              <p className="text-xs text-dark-brown/60 mt-1 leading-relaxed">{l.analyticsDesc}</p>
            </div>
            <div className="flex-shrink-0 mt-0.5">
              <Toggle id="toggle-analytics" checked={analytics} onChange={setAnalytics} />
            </div>
          </div>

          {/* Marketing */}
          <div className="py-5 flex items-start justify-between gap-4">
            <div>
              <label htmlFor="toggle-marketing" className="text-sm font-bold text-dark-brown cursor-pointer">{l.marketing}</label>
              <p className="text-xs text-dark-brown/60 mt-1 leading-relaxed">{l.marketingDesc}</p>
            </div>
            <div className="flex-shrink-0 mt-0.5">
              <Toggle id="toggle-marketing" checked={marketing} onChange={setMarketing} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-dark-brown/10">
          <button
            onClick={() => onSave(analytics, marketing)}
            className="w-full btn-primary justify-center"
          >
            {l.savePrefs}
          </button>
        </div>
      </div>
    </div>
  )
}

export function CookieBanner({ locale, strings }: CookieBannerProps) {
  const [visible, setVisible] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!hasConsented()) setVisible(true)
  }, [])

  function acceptAll() {
    writeConsent(true, true)
    setVisible(false)
  }

  function rejectAll() {
    writeConsent(false, false)
    setVisible(false)
  }

  function savePrefs(analytics: boolean, marketing: boolean) {
    writeConsent(analytics, marketing)
    setShowPrefs(false)
    setVisible(false)
  }

  if (!mounted || !visible) return null

  const existing = readConsent()

  return (
    <>
      {/* Banner */}
      <div
        role="region"
        aria-label={locale === 'ka' ? 'ქუქი-ფაილების შეტყობინება' : 'Cookie notice'}
        className="fixed bottom-0 left-0 right-0 z-[100] bg-dark-brown text-bone-white"
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 py-4 md:py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
          {/* Text */}
          <div className="flex-1 min-w-0">
            {strings.title && (
              <p className="text-sm font-bold mb-1">{strings.title}</p>
            )}
            <p className="text-xs text-bone-white/70 leading-relaxed">
              {strings.body}{' '}
              <Link
                href={strings.privacyHref}
                className="underline underline-offset-2 hover:text-bone-white transition-colors"
              >
                {locale === 'ka' ? 'კონფიდენციალურობის პოლიტიკა' : 'Privacy Policy'}
              </Link>
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
            <button
              onClick={rejectAll}
              className="text-[11px] font-bold uppercase tracking-widest text-bone-white/60 hover:text-bone-white transition-colors py-2 px-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bone-white rounded"
            >
              {strings.reject}
            </button>
            <button
              onClick={() => setShowPrefs(true)}
              className="text-[11px] font-bold uppercase tracking-widest text-bone-white/60 hover:text-bone-white transition-colors py-2 px-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bone-white rounded"
            >
              {strings.manage}
            </button>
            <button
              onClick={acceptAll}
              className="text-[11px] font-bold uppercase tracking-widest bg-burnt-orange hover:bg-bone-white hover:text-dark-brown transition-colors py-2 px-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bone-white rounded"
            >
              {strings.accept}
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPrefs && (
        <PreferencesModal
          locale={locale}
          initialAnalytics={existing?.analytics ?? false}
          initialMarketing={existing?.marketing ?? false}
          onSave={savePrefs}
          onClose={() => setShowPrefs(false)}
        />
      )}
    </>
  )
}
