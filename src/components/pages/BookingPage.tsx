'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import { cn } from '@/lib/utils'

// ─── Cal.com dynamic import - SSR must be false ───────────────────────────────
const Cal = dynamic(
  () => import('@calcom/embed-react').then((mod) => mod.default),
  { ssr: false, loading: () => <CalSkeleton /> }
)

// ─── Brand tokens - must match BRAND.md & globals.css ─────────────────────────
const BRAND = {
  bone:   '#E7DECC',
  brown:  '#422922',
  brownDark: '#2a1a14',
  brownLight: '#6b4a3a',
  orange: '#D45800',
} as const

// Cal.com CSS variables (light theme) mapped to brand palette.
// These pierce the embed iframe via cal("ui", { cssVarsPerTheme }).
const CAL_BRAND_VARS: Record<string, string> = {
  // Brand / accent - used by selected day, primary CTAs
  'cal-brand':            BRAND.brown,
  'cal-brand-emphasis':   BRAND.brownDark,
  'cal-brand-text':       BRAND.bone,
  'cal-brand-subtle':     BRAND.bone,
  'cal-brand-accent':     BRAND.orange,

  // Page / surface backgrounds
  'cal-bg':               BRAND.bone,
  'cal-bg-emphasis':      '#dccfb6', // bone, slightly darker for hover
  'cal-bg-subtle':        '#efe7d6',
  'cal-bg-muted':         '#f5efe2',
  'cal-bg-inverted':      BRAND.brown,

  // Borders
  'cal-border':           'rgba(66, 41, 34, 0.18)',
  'cal-border-subtle':    'rgba(66, 41, 34, 0.10)',
  'cal-border-muted':     'rgba(66, 41, 34, 0.08)',
  'cal-border-emphasis':  'rgba(66, 41, 34, 0.55)',
  'cal-border-booker':    'rgba(66, 41, 34, 0.12)',

  // Text
  'cal-text':             BRAND.brown,
  'cal-text-emphasis':    BRAND.brownDark,
  'cal-text-muted':       'rgba(66, 41, 34, 0.55)',
  'cal-text-subtle':      'rgba(66, 41, 34, 0.42)',
  'cal-text-inverted':    BRAND.bone,
  'cal-text-error':       BRAND.orange,
}

// ─── Types ────────────────────────────────────────────────────────────────────
type EventType = 'consultation' | 'followup' | 'pnoe'

const EVENT_TYPES: EventType[] = ['consultation', 'followup', 'pnoe']

// ─── Bilingual copy ───────────────────────────────────────────────────────────
const COPY = {
  ka: {
    eyebrow: 'პრევენციული მედიცინის ცენტრი',
    heading: 'კონსულტაციის დაჯავშნა',
    headingEn: 'Book a Consultation',
    subtitle: 'აირჩიეთ კონსულტაციის ტიპი და შეარჩიეთ თქვენთვის სასურველი დრო',
    tabs: {
      consultation: { name: 'საწყისი კონსულტაცია', duration: '60 წთ', description: 'პირველადი შეფასება და პერსონალიზებული გეგმის შედგენა' },
      followup: { name: 'განმეორებითი ვიზიტი', duration: '30 წთ', description: 'პროგრესის შეფასება და გეგმის კორექტირება' },
      pnoe: { name: 'PNOE შეფასება', duration: '45 წთ', description: 'მეტაბოლური ანალიზი სუნთქვის ტესტით' },
    },
    secure: 'თქვენი მონაცემები დაცულია',
    confirm: 'დადასტურება ელ-ფოსტაზე',
    fallback: 'კალენდარი ვერ ჩაიტვირთა',
    retry: 'სცადეთ ხელახლა',
    fallbackLink: 'გარე ბმულით გახსნა',
    back: 'მთავარი',
    contactCta: 'გაქვთ კითხვა?',
    contactLink: 'დაგვიკავშირდით',
  },
  en: {
    eyebrow: 'PREVENTIVE MEDICINE CENTER',
    heading: 'Book a Consultation',
    headingEn: null,
    subtitle: 'Select your consultation type and choose a time that works for you',
    tabs: {
      consultation: { name: 'Initial Consultation', duration: '60 min', description: 'Comprehensive assessment and personalized plan creation' },
      followup: { name: 'Follow-up', duration: '30 min', description: 'Progress review and plan adjustment' },
      pnoe: { name: 'PNOE Assessment', duration: '45 min', description: 'Metabolic analysis via breath testing' },
    },
    secure: 'Your data is secure',
    confirm: 'Confirmation sent to your email',
    fallback: 'Calendar could not load',
    retry: 'Try again',
    fallbackLink: 'Open booking page',
    back: 'Home',
    contactCta: 'Have questions?',
    contactLink: 'Contact us',
  },
} as const

// ─── Tab icons ────────────────────────────────────────────────────────────────
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function FollowupIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M1 4v6h6" />
      <path d="M3.51 15a9 9 0 1 0 .49-3.77" />
    </svg>
  )
}

function PnoeIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

const TAB_ICONS: Record<EventType, (props: { className?: string }) => React.ReactElement> = {
  consultation: ClockIcon,
  followup: FollowupIcon,
  pnoe: PnoeIcon,
}


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

// ─── Calendar embed with linkReady/linkFailed handling ───────────────────────
const CAL_TIMEOUT_MS = 45_000

function CalEmbed({
  activeEventType,
  copy,
  locale,
}: {
  activeEventType: EventType
  copy: typeof COPY['ka'] | typeof COPY['en']
  locale: Locale
}) {
  // 'loading' until linkReady fires; 'failed' on linkFailed or timeout.
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading')
  // Bump on retry to remount the <Cal> component and restart the timeout.
  const [retryNonce, setRetryNonce] = useState(0)

  // Unique namespace per (event-type, retry) pair. Cal.com keeps per-namespace
  // SDK state on window.Cal; reusing a namespace across remounts leaves the
  // `iframeReady` flag set but `iframe` null, which causes Cal's internal
  // queue flush to throw `iframe doesn't exist`. A fresh namespace per mount
  // gives the SDK a clean slate.
  const namespace = `lo-${activeEventType}-${retryNonce}`

  // Apply brand styling, listen for linkReady/linkFailed, and arm a fallback timer.
  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null
    type CalApi = (cmd: string, arg?: unknown) => void
    let calRef: CalApi | null = null

    const UI_CONFIG = {
      hideEventTypeDetails: true,
      theme: 'light' as const,
      layout: 'month_view' as const,
      cssVarsPerTheme: {
        light: CAL_BRAND_VARS,
        dark:  CAL_BRAND_VARS,
      },
      styles: {
        branding: { brandColor: BRAND.brown },
        body: { background: BRAND.bone },
        eventTypeListItem: { background: BRAND.bone, color: BRAND.brown },
        enabledDateButton: { background: 'transparent', color: BRAND.brown },
        disabledDateButton: { background: 'transparent', color: 'rgba(66,41,34,0.25)' },
        availabilityDatePicker: { background: BRAND.bone, color: BRAND.brown },
      },
    }

    const safeApplyUi = (cal: CalApi) => {
      try { cal('ui', UI_CONFIG) } catch { /* iframe not ready yet - linkReady will retry */ }
    }

    const onReady = () => {
      if (cancelled) return
      if (timer) { clearTimeout(timer); timer = null }
      // Re-apply UI now that iframe definitely exists.
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

        // Listeners first - these never touch the iframe, so they're safe.
        cal('on', { action: 'linkReady',  callback: onReady  })
        cal('on', { action: 'linkFailed', callback: onFailed })

        // Try to apply UI proactively. If iframe isn't created yet, this no-ops
        // and onReady will reapply once linkReady fires.
        safeApplyUi(cal)

        // Poll briefly in case linkReady fires faster than our listener attaches.
        // Bounded retries; harmless if iframe is already styled.
        let attempts = 0
        const retry = setInterval(() => {
          if (cancelled || attempts >= 8) { clearInterval(retry); return }
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
            href={`https://www.cal.eu/longevityone/${activeEventType}`}
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
          calLink={`longevityone/${activeEventType}?lang=${locale}&defaultCountry=GE`}
          calOrigin="https://www.cal.eu"
          embedJsUrl="https://www.cal.eu/embed/embed.js"
          style={{ width: '100%', height: '100%', minHeight: '650px', overflow: 'scroll' }}
          config={{
            layout: 'month_view',
            theme: 'light',
            hideEventTypeDetails: '1',
            // Locale forwarding - Cal.com forwards unknown config keys to the
            // booker iframe as query params. Both `lang` and `embedLocale` are
            // observed in Cal.com's locale-detection code paths.
            lang: locale,
            embedLocale: locale,
            // Default the phone-number country picker to Georgia (+995).
            // Users can still change it from the country dropdown.
            country: 'GE',
            defaultCountry: 'GE',
          }}
        />
      </Suspense>
    </div>
  )
}

// ─── Inner component that reads searchParams ──────────────────────────────────
function BookingPageInner({ locale }: { locale: Locale }) {
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type')
  const initialType: EventType =
    typeParam && EVENT_TYPES.includes(typeParam as EventType)
      ? (typeParam as EventType)
      : 'consultation'

  const [activeEventType, setActiveEventType] = useState<EventType>(initialType)
  const copy = COPY[locale]
  const prefix = locale === 'en' ? '/en' : ''

  return (
    <>
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

          {/* ── Two-column layout ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-12 items-start">

            {/* ── Left sidebar: event type cards ────────────────────────── */}
            <div className="flex flex-col gap-3">
              {EVENT_TYPES.map((et) => {
                const isActive = activeEventType === et
                const tab = copy.tabs[et]
                const Icon = TAB_ICONS[et]
                return (
                  <button
                    key={et}
                    type="button"
                    onClick={() => setActiveEventType(et)}
                    className={cn(
                      'relative flex items-start gap-4 p-5 border text-left rounded-sm',
                      'transition-all duration-200 ease-out cursor-pointer',
                      isActive
                        ? 'bg-dark-brown border-dark-brown'
                        : 'bg-transparent border-dark-brown/15 hover:border-dark-brown/40'
                    )}
                  >
                    <div className={cn(
                      'flex-shrink-0 mt-0.5 transition-colors duration-200',
                      isActive ? 'text-burnt-orange' : 'text-dark-brown/40'
                    )}>
                      <Icon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className={cn(
                            'text-[12px] tracking-[0.1em] uppercase font-bold leading-tight',
                            isActive ? 'text-bone-white' : 'text-dark-brown'
                          )}
                        >
                          {tab.name}
                        </span>
                        <span
                          className={cn(
                            'text-[11px] tracking-[0.05em] flex-shrink-0',
                            isActive ? 'text-bone-white/60' : 'text-dark-brown/40'
                          )}
                        >
                          {tab.duration}
                        </span>
                      </div>
                      <p
                        className={cn(
                          'text-[13px] mt-1.5 leading-relaxed',
                          isActive ? 'text-bone-white/70' : 'text-dark-brown/50'
                        )}
                      >
                        {tab.description}
                      </p>
                    </div>
                    {isActive && (
                      <span className="absolute left-0 top-4 bottom-4 w-[3px] bg-burnt-orange rounded-r-full" />
                    )}
                  </button>
                )
              })}

              {/* ── Contact CTA ────────────────────────────────────────── */}
              <div className="mt-4 pt-4 border-t border-dark-brown/10">
                <p className="text-[13px] text-dark-brown/50 mb-1">{copy.contactCta}</p>
                <Link
                  href={`${prefix}/contact`}
                  className="text-[12px] tracking-[0.1em] uppercase font-semibold text-burnt-orange hover:text-dark-brown transition-colors underline underline-offset-4 decoration-burnt-orange/30 hover:decoration-dark-brown/30"
                >
                  {copy.contactLink} →
                </Link>
              </div>
            </div>

            {/* ── Right side: calendar embed ────────────────────────────── */}
            <div className="relative bg-bone-white min-h-[650px]">
              <CalEmbed key={activeEventType} activeEventType={activeEventType} copy={copy} locale={locale} />
              {/* Mask the Cal.com branding footer with a bone overlay.
                  Sized to cover the powered-by strip at the bottom of the iframe. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-bone-white"
              />
            </div>
          </div>

          {/* ── Footer trust bar ───────────────────────────────────────── */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-[11px] tracking-[0.05em] text-dark-brown/40">
            <div className="flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-dark-brown/30"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>{copy.secure}</span>
            </div>
            <span className="hidden sm:inline text-dark-brown/20">|</span>
            <div className="flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-dark-brown/30"
                aria-hidden="true"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>{copy.confirm}</span>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}

// ─── Main export with Suspense boundary for useSearchParams ───────────────────
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
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-12">
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-24 bg-dark-brown/[0.06] animate-pulse rounded" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
            <div className="h-[650px] bg-dark-brown/[0.04] animate-pulse rounded" />
          </div>
        </div>
      </section>
    }>
      <BookingPageInner locale={locale} />
    </Suspense>
  )
}
