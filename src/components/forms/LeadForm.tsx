'use client'

import { useState, useId, useRef } from 'react'
import Link from 'next/link'
import { getAttribution } from '@/lib/attribution'
import { readConsent } from '@/lib/cookies'
import { getVisitorId } from '@/lib/visitor-id'
import { markLeadPending, trackLeadFormOpen } from '@/lib/analytics-events'
import { Turnstile, type TurnstileHandle } from '@/components/forms/Turnstile'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/utils'

interface LeadFormProps {
  locale: Locale
  /** Where on the site the form sits; stored with the lead and sent to analytics. */
  source: string
  /**
   * Inline forms have no "open" moment, so the funnel's form-open event fires
   * on first focus instead. The popup fires it itself when it opens.
   */
  trackOpenOnFocus?: boolean
  /** Called right before navigating to the thank-you page. */
  onSubmitted?: () => void
}

type FormState = 'idle' | 'submitting' | 'error' | 'captcha'

const COPY = {
  ka: {
    nameLabel:    'სახელი',
    phoneLabel:   'ტელეფონი',
    emailLabel:   'ელ. ფოსტა (სურვილისამებრ)',
    consentText:  'ვეთანხმები პერსონალური მონაცემების დამუშავებას',
    privacyHref:  '/legal/privacy',
    privacyLabel: 'კონფიდენციალურობის პოლიტიკა',
    submitLabel:  'გაგზავნა',
    loadingLabel: 'იგზავნება...',
    errorMessage: 'დაფიქსირდა შეცდომა. გთხოვთ სცადოთ ხელახლა.',
    captcha:      'გთხოვთ, დაასრულოთ უსაფრთხოების შემოწმება.',
  },
  en: {
    nameLabel:    'Name',
    phoneLabel:   'Phone',
    emailLabel:   'Email (optional)',
    consentText:  'I consent to the processing of my personal data',
    privacyHref:  '/en/legal/privacy',
    privacyLabel: 'Privacy Policy',
    submitLabel:  'Send',
    loadingLabel: 'Sending...',
    errorMessage: 'Something went wrong. Please try again.',
    captcha:      'Please complete the security check.',
  },
} as const

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

/**
 * The call-request form: name, phone, optional email, consent, Turnstile.
 * Posts to /api/founder-circle and, on success, does a full page load to the
 * thank-you page so GTM can trigger on the URL. Used inside the popup
 * (LeadCaptureForm) and inline on the ad landing page.
 */
export function LeadForm({
  locale,
  source,
  trackOpenOnFocus = false,
  onSubmitted,
}: LeadFormProps) {
  const t = COPY[locale]
  const uid = useId()

  const [formState, setFormState] = useState<FormState>('idle')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const turnstileRef = useRef<TurnstileHandle>(null)
  const openTracked = useRef(false)

  const inputClass = cn(
    'bg-transparent border-b border-dark-brown/40 pb-2 w-full',
    'text-dark-brown placeholder:text-dark-brown/40 font-light',
    'focus:outline-none focus:border-dark-brown transition-colors duration-300',
  )
  const labelClass = 'block text-[11px] font-medium uppercase tracking-[0.15em] text-dark-brown/60 mb-2'

  const canSubmit =
    formState !== 'submitting' &&
    name.trim().length >= 2 &&
    phone.trim().length >= 6 &&
    consent

  function handleFocus() {
    if (!trackOpenOnFocus || openTracked.current) return
    openTracked.current = true
    trackLeadFormOpen(source)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    // Turnstile guards this endpoint against bot spam, which would otherwise
    // pollute the conversion data campaigns are optimised against.
    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setFormState('captcha')
      return
    }

    setFormState('submitting')
    try {
      const res = await fetch('/api/founder-circle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    name.trim(),
          phone:   phone.trim(),
          email:   email.trim(),
          lang:    locale,
          consent: true,
          source,
          turnstileToken: captchaToken,
          // Which campaign brought this visitor in, captured on landing.
          ...getAttribution(),
          // The page this was submitted from. Gives the marketer service-level
          // interest with nothing for staff to remember to fill in.
          submitted_from:
            typeof window !== 'undefined' ? window.location.pathname : undefined,
          // Server only reports to Meta when marketing consent was granted.
          marketing_consent: readConsent()?.marketing === true,
          visitor_id: getVisitorId(),
        }),
      })

      if (!res.ok) {
        setFormState('error')
        turnstileRef.current?.reset()
        setCaptchaToken('')
        return
      }

      // The pending flag is what tells /thank-you this view followed an actual
      // submission, so a later reload cannot re-count it.
      const payload = (await res.json().catch(() => ({}))) as { eventId?: string }
      markLeadPending(source, payload.eventId ?? null)
      onSubmitted?.()
      // A full page load, not a client-side route change: GTM's Page View
      // trigger only fires on real loads, so a URL trigger on /thank-you would
      // otherwise never fire. The pending flag survives the reload.
      window.location.assign(locale === 'en' ? '/en/thank-you' : '/thank-you')
    } catch {
      setFormState('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} onFocus={handleFocus} noValidate>
      <div className="flex flex-col gap-7">
        <div>
          <label htmlFor={`${uid}-name`} className={labelClass}>
            {t.nameLabel}
          </label>
          <input
            id={`${uid}-name`}
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${uid}-phone`} className={labelClass}>
            {t.phoneLabel}
          </label>
          <input
            id={`${uid}-phone`}
            type="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${uid}-email`} className={labelClass}>
            {t.emailLabel}
          </label>
          <input
            id={`${uid}-email`}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* GDPR consent */}
        <div className="flex items-start gap-3 pt-1">
          <input
            id={`${uid}-consent`}
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-burnt-orange cursor-pointer"
          />
          <label
            htmlFor={`${uid}-consent`}
            className="text-xs font-light text-dark-brown/70 leading-relaxed cursor-pointer"
          >
            {t.consentText}{' '}
            <Link
              href={t.privacyHref}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-dark-brown transition-colors"
            >
              {t.privacyLabel}
            </Link>
          </label>
        </div>
      </div>

      {TURNSTILE_SITE_KEY && (
        <div className="mt-6">
          <Turnstile
            ref={turnstileRef}
            siteKey={TURNSTILE_SITE_KEY}
            onToken={(token) => {
              setCaptchaToken(token)
              if (token && formState === 'captcha') setFormState('idle')
            }}
          />
        </div>
      )}

      {formState === 'error' && (
        <p className="mt-5 text-xs text-burnt-orange" role="alert">
          {t.errorMessage}
        </p>
      )}

      {formState === 'captcha' && (
        <p className="mt-5 text-xs text-burnt-orange" role="alert">
          {t.captcha}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className={cn(
          'mt-8 w-full flex items-center justify-center',
          'px-6 py-4 text-[11px] font-bold uppercase tracking-widest',
          'bg-burnt-orange text-bone-white transition-colors duration-300',
          'hover:bg-dark-brown',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burnt-orange',
        )}
      >
        {formState === 'submitting' ? t.loadingLabel : t.submitLabel}
      </button>
    </form>
  )
}
