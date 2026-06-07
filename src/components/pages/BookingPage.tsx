'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { Locale } from '@/lib/utils'

// ─── Cal.com dynamic import - SSR must be false ───────────────────────────────
const Cal = dynamic(
  () => import('@calcom/embed-react').then((mod) => mod.default),
  { ssr: false, loading: () => <CalSkeleton /> }
)

// ─── Brand tokens - must match BRAND.md & globals.css ─────────────────────────
const BRAND = {
  bone:      '#E7DECC',
  brown:     '#422922',
  brownDark: '#2a1a14',
  orange:    '#D45800',
} as const

// Cal.com CSS variables (light theme) mapped to brand palette.
const CAL_BRAND_VARS: Record<string, string> = {
  'cal-brand':            BRAND.brown,
  'cal-brand-emphasis':   BRAND.brownDark,
  'cal-brand-text':       BRAND.bone,
  'cal-brand-subtle':     BRAND.bone,
  'cal-brand-accent':     BRAND.orange,
  'cal-bg':               BRAND.bone,
  'cal-bg-emphasis':      '#dccfb6',
  'cal-bg-subtle':        '#efe7d6',
  'cal-bg-muted':         '#f5efe2',
  'cal-bg-inverted':      BRAND.brown,
  'cal-border':           'rgba(66, 41, 34, 0.18)',
  'cal-border-subtle':    'rgba(66, 41, 34, 0.10)',
  'cal-border-muted':     'rgba(66, 41, 34, 0.08)',
  'cal-border-emphasis':  'rgba(66, 41, 34, 0.55)',
  'cal-border-booker':    'rgba(66, 41, 34, 0.12)',
  'cal-text':             BRAND.brown,
  'cal-text-emphasis':    BRAND.brownDark,
  'cal-text-muted':       'rgba(66, 41, 34, 0.55)',
  'cal-text-subtle':      'rgba(66, 41, 34, 0.42)',
  'cal-text-inverted':    BRAND.bone,
  'cal-text-error':       BRAND.orange,
}

// Cal.com embed UI config — stable constant, no per-render allocation.
const CAL_UI_CONFIG = {
  hideEventTypeDetails: true,
  theme: 'light' as const,
  layout: 'month_view' as const,
  cssVarsPerTheme: { light: CAL_BRAND_VARS, dark: CAL_BRAND_VARS },
  styles: {
    branding: { brandColor: BRAND.brown },
    body: { background: BRAND.bone },
    eventTypeListItem: { background: BRAND.bone, color: BRAND.brown },
    enabledDateButton: { background: 'transparent', color: BRAND.brown },
    disabledDateButton: { background: 'transparent', color: 'rgba(66,41,34,0.25)' },
    availabilityDatePicker: { background: BRAND.bone, color: BRAND.brown },
  },
} as const

// ─── Bilingual copy ───────────────────────────────────────────────────────────
const COPY = {
  ka: {
    eyebrow:     'პრევენციული მედიცინის ცენტრი',
    heading:     'დაჯავშნეთ ვიზიტი',
    subtitle:    'აირჩიეთ თქვენთვის სასურველი დრო. ჩვენი გუნდი დაგიკავშირდებათ ვიზიტის დეტალების შესათანხმებლად.',
    secure:      'თქვენი მონაცემები დაცულია',
    confirm:     'დადასტურება ელ-ფოსტაზე',
    fallback:    'კალენდარი ვერ ჩაიტვირთა',
    retry:       'სცადეთ ხელახლა',
    fallbackLink:'გარე ბმულით გახსნა',
    back:        'მთავარი',
    contactCta:  'გაქვთ კითხვა?',
    contactLink: 'დაგვიკავშირდით',
  },
  en: {
    eyebrow:     'PREVENTIVE MEDICINE CENTER',
    heading:     'Book a Visit',
    subtitle:    'Choose a time that suits you. Our team will contact you to arrange the details of your visit.',
    secure:      'Your data is secure',
    confirm:     'Confirmation sent to your email',
    fallback:    'Calendar could not load',
    retry:       'Try again',
    fallbackLink:'Open booking page',
    back:        'Home',
    contactCta:  'Have questions?',
    contactLink: 'Contact us',
  },
} as const

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function CalSkeleton() {
  return (
    <div className="p-8 flex flex-col gap-5">
      <div className="flex justify-between items-center mb-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-3 w-20 rounded bg-dark-brown/[0.08] animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-3">
        {Array.from({ length: 35 }, (_, i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-sm bg-dark-brown/[0.06] animate-pulse"
            style={{ animationDelay: `${i * 30}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Calendar embed ───────────────────────────────────────────────────────────
const CAL_TIMEOUT_MS = 45_000
const CAL_EVENT_SLUG = 'visit'

function CalEmbed({
  copy,
  locale,
}: {
  copy: typeof COPY['ka'] | typeof COPY['en']
  locale: Locale
}) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading')
  // Bumped on retry to give the Cal SDK a fresh namespace each time.
  const [retryNonce, setRetryNonce] = useState(0)
  const namespace = `lo-visit-${retryNonce}`

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null
    type CalApi = (cmd: string, arg?: unknown) => void
    let calRef: CalApi | null = null

    const safeApplyUi = (cal: CalApi) => {
      try { cal('ui', CAL_UI_CONFIG) } catch { /* iframe not ready yet — linkReady will retry */ }
    }

    const onReady = () => {
      if (cancelled) return
      if (timer) { clearTimeout(timer); timer = null }
      if (calRef) safeApplyUi(calRef)
      setStatus('ready')
    }
    const onFailed = () => {
      if (cancelled) return
      if (timer) { clearTimeout(timer); timer = null }
      setStatus('failed')
    }

    ;(async () => {
      try {
        const { getCalApi } = await import('@calcom/embed-react')
        const cal = (await getCalApi({
          namespace,
          embedJsUrl: 'https://www.cal.eu/embed/embed.js',
        })) as unknown as CalApi
        if (cancelled) return
        calRef = cal
        cal('on', { action: 'linkReady',  callback: onReady  })
        cal('on', { action: 'linkFailed', callback: onFailed })
        safeApplyUi(cal)
        let attempts = 0
        const pollTimer = setInterval(() => {
          if (cancelled || attempts >= 8) { clearInterval(pollTimer); return }
          attempts += 1
          safeApplyUi(cal)
        }, 400)
      } catch {
        if (!cancelled) setStatus('failed')
      }
    })()

    timer = setTimeout(() => { if (!cancelled) setStatus('failed') }, CAL_TIMEOUT_MS)

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      if (calRef) {
        try { calRef('off', { action: 'linkReady',  callback: onReady  }) } catch { /* ignore */ }
        try { calRef('off', { action: 'linkFailed', callback: onFailed }) } catch { /* ignore */ }
      }
    }
  }, [namespace])

  if (status === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
        <p className="text-sm text-dark-brown/70">{copy.fallback}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => { setStatus('loading'); setRetryNonce((n) => n + 1) }}
            className="btn-secondary"
          >
            {copy.retry}
          </button>
          <a
            href={`https://www.cal.eu/longevityone/${CAL_EVENT_SLUG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            {copy.fallbackLink}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {status === 'loading' && (
        <div className="absolute inset-0 z-10 bg-bone-white">
          <CalSkeleton />
        </div>
      )}
      <Suspense fallback={<CalSkeleton />}>
        <Cal
          key={namespace}
          namespace={namespace}
          calLink={`longevityone/${CAL_EVENT_SLUG}?lang=${locale}&defaultCountry=GE`}
          calOrigin="https://www.cal.eu"
          embedJsUrl="https://www.cal.eu/embed/embed.js"
          style={{ width: '100%', height: '100%', minHeight: '650px', overflow: 'scroll' }}
          config={{
            layout: 'month_view',
            theme: 'light',
            hideEventTypeDetails: '1',
            lang: locale,
            embedLocale: locale,
            country: 'GE',
            defaultCountry: 'GE',
          }}
        />
      </Suspense>
    </div>
  )
}

// ─── Inner component with Suspense boundary for useSearchParams ───────────────
// Any ?type= param in old links is intentionally ignored — all visitors land
// on the unified "visit" embed, so existing CTAs across the site keep working.
function BookingPageInner({ locale }: { locale: Locale }) {
  useSearchParams() // keeps Next.js Suspense boundary requirement satisfied
  const copy = COPY[locale]
  const prefix = locale === 'en' ? '/en' : ''

  return (
    <section className="min-h-screen pt-28 pb-20 md:pt-32 md:pb-28">
      <div className="section-container">

        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-dark-brown/50">
            <li>
              <Link href={`${prefix}/`} className="hover:text-dark-brown transition-colors">
                {copy.back}
              </Link>
            </li>
            <li aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-dark-brown/30">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </li>
            <li className="text-dark-brown font-semibold">{copy.heading}</li>
          </ol>
        </nav>

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="mb-10 md:mb-14">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-dark-brown">
            {copy.heading}
          </h1>
          <p className="mt-3 text-dark-brown/70 max-w-xl text-base">
            {copy.subtitle}
          </p>
        </div>

        {/* ── Calendar embed ─────────────────────────────────────────── */}
        <div className="relative bg-bone-white min-h-[650px]">
          <CalEmbed copy={copy} locale={locale} />
          {/* Masks the Cal.com branded footer strip */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-bone-white" />
        </div>

        {/* ── Contact link ───────────────────────────────────────────── */}
        <div className="mt-6 text-center">
          <span className="text-[13px] text-dark-brown/50">{copy.contactCta} </span>
          <Link
            href={`${prefix}/contact`}
            className="text-[12px] tracking-[0.1em] uppercase font-semibold text-burnt-orange hover:text-dark-brown transition-colors underline underline-offset-4 decoration-burnt-orange/30 hover:decoration-dark-brown/30"
          >
            {copy.contactLink} →
          </Link>
        </div>

        {/* ── Footer trust bar ───────────────────────────────────────── */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-[11px] tracking-[0.05em] text-dark-brown/40">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-dark-brown/30" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>{copy.secure}</span>
          </div>
          <span className="hidden sm:inline text-dark-brown/20">|</span>
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-dark-brown/30" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{copy.confirm}</span>
          </div>
        </div>

      </div>
    </section>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
interface BookingPageProps {
  locale: Locale
}

export function BookingPage({ locale }: BookingPageProps) {
  return (
    <Suspense fallback={
      <section className="min-h-screen pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="section-container">
          <div className="h-8 w-48 bg-dark-brown/[0.06] animate-pulse rounded mb-10" />
          <div className="h-12 w-96 bg-dark-brown/[0.08] animate-pulse rounded mb-4" />
          <div className="h-5 w-64 bg-dark-brown/[0.06] animate-pulse rounded mb-14" />
          <div className="h-[650px] bg-dark-brown/[0.04] animate-pulse rounded" />
        </div>
      </section>
    }>
      <BookingPageInner locale={locale} />
    </Suspense>
  )
}
