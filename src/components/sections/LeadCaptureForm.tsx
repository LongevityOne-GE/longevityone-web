'use client'

import { useState, useId, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowRight, X } from 'lucide-react'
import Link from 'next/link'
import { getAttribution } from '@/lib/attribution'
import { readConsent } from '@/lib/cookies'
import { getVisitorId } from '@/lib/visitor-id'
import { markLeadPending, trackLeadFormOpen } from '@/lib/analytics-events'
import { Turnstile, type TurnstileHandle } from '@/components/forms/Turnstile'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/utils'

// ─── Props ────────────────────────────────────────────────────────────────────
interface LeadCaptureFormProps {
  locale: Locale
  source: string
  heading?: string
  label: string
  triggerClassName?: string
}

type FormState = 'idle' | 'submitting' | 'success' | 'error' | 'captcha'

// ─── Generic default headings ─────────────────────────────────────────────────
const DEFAULT_HEADINGS: Record<Locale, string> = {
  ka: 'დაგვიკავშირდით',
  en: 'Get in Touch',
}

// ─── Bilingual copy ───────────────────────────────────────────────────────────
const COPY = {
  ka: {
    tagline:        'დატოვეთ ნომერი და ჩვენი კონსიერჟი დაგიკავშირდებათ 24 საათში.',
    nameLabel:      'სახელი',
    phoneLabel:     'ტელეფონი',
    emailLabel:     'ელ. ფოსტა (სურვილისამებრ)',
    consentText:    'ვეთანხმები პერსონალური მონაცემების დამუშავებას',
    privacyHref:    '/legal/privacy',
    privacyLabel:   'კონფიდენციალურობის პოლიტიკა',
    submitLabel:    'გაგზავნა',
    loadingLabel:   'იგზავნება...',
    successMessage: 'მადლობა. ჩვენ დაგიკავშირდებით მალე.',
    errorMessage:   'დაფიქსირდა შეცდომა. გთხოვთ სცადოთ ხელახლა.',
    closeLabel:     'დახურვა',
    captcha:        'გთხოვთ, დაასრულოთ უსაფრთხოების შემოწმება.',
  },
  en: {
    tagline:        'Leave your number and our concierge will call you within 24 hours.',
    nameLabel:      'Name',
    phoneLabel:     'Phone',
    emailLabel:     'Email (optional)',
    consentText:    'I consent to the processing of my personal data',
    privacyHref:    '/en/legal/privacy',
    privacyLabel:   'Privacy Policy',
    submitLabel:    'Send',
    loadingLabel:   'Sending...',
    successMessage: "Thank you. We'll be in touch shortly.",
    errorMessage:   'Something went wrong. Please try again.',
    closeLabel:     'Close',
    captcha:        'Please complete the security check.',
  },
} as const

// ─── Shared style helpers ─────────────────────────────────────────────────────
const inputClass = cn(
  'bg-transparent border-b border-dark-brown/40 pb-2 w-full',
  'text-dark-brown placeholder:text-dark-brown/40 font-light',
  'focus:outline-none focus:border-dark-brown transition-colors duration-300',
)
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

const labelClass = 'block text-[11px] font-medium uppercase tracking-[0.15em] text-dark-brown/60 mb-2'

// ─── Component ────────────────────────────────────────────────────────────────
export function LeadCaptureForm({
  locale,
  source,
  heading,
  label,
  triggerClassName,
}: LeadCaptureFormProps) {
  const t = COPY[locale]
  const uid = useId()
  const dialogTitle = heading ?? DEFAULT_HEADINGS[locale]

  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState<FormState>('idle')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const turnstileRef = useRef<TurnstileHandle>(null)

  const canSubmit =
    formState !== 'submitting' &&
    name.trim().length >= 2 &&
    phone.trim().length >= 6 &&
    consent

  function resetForm() {
    setName('')
    setPhone('')
    setEmail('')
    setConsent(false)
    setCaptchaToken('')
    turnstileRef.current?.reset()
    setFormState('idle')
  }

  function handleOpenChange(next: boolean) {
    if (next && !open) trackLeadFormOpen(source)
    setOpen(next)
    if (!next) resetForm()
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

      // Navigate to a real URL so GTM can trigger on the page view as well as
      // on the dataLayer event. The flag is what tells /thank-you this view
      // followed an actual submission, so a later reload cannot re-count it.
      const payload = (await res.json().catch(() => ({}))) as { eventId?: string }
      markLeadPending(source, payload.eventId ?? null)
      setOpen(false)
      // A full page load, not a client-side route change: GTM's Page View
      // trigger only fires on real loads, so a URL trigger on /thank-you would
      // otherwise never fire. The pending flag survives the reload.
      window.location.assign(locale === 'en' ? '/en/thank-you' : '/thank-you')
    } catch {
      setFormState('error')
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={cn(
            'group relative flex items-center justify-between',
            'bg-bone-white/95 backdrop-blur-md px-6 py-5',
            'text-[11px] font-bold uppercase tracking-[0.25em] text-dark-brown',
            'transition-all duration-500 hover:bg-burnt-orange hover:text-bone-white',
            triggerClassName,
          )}
        >
          <span className="relative z-10">{label}</span>
          <ArrowRight
            size={16}
            aria-hidden="true"
            className="relative z-10 transition-transform duration-500 group-hover:translate-x-1.5"
          />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-dark-brown/70 data-[state=open]:animate-fade-in" />
        <Dialog.Content
          aria-describedby={`${uid}-tagline`}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full max-w-md px-4',
            '-translate-x-1/2 -translate-y-1/2',
            'focus:outline-none',
            'data-[state=open]:animate-slide-up',
          )}
        >
          <div className="bg-bone-white p-8">
            {/* Close button */}
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t.closeLabel}
                className="absolute right-6 top-6 p-2 text-dark-brown/50 hover:text-dark-brown transition-colors duration-200"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </Dialog.Close>

            <Dialog.Title className="text-heading font-bold text-dark-brown mb-3">
              {dialogTitle}
            </Dialog.Title>

            <p
              id={`${uid}-tagline`}
              className="text-sm font-light text-dark-brown/70 mb-8 leading-relaxed"
            >
              {t.tagline}
            </p>

            {formState === 'success' ? (
              <p className="text-base font-light text-dark-brown py-8 text-center">
                {t.successMessage}
              </p>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col gap-7">
                  {/* Name */}
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

                  {/* Phone */}
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

                  {/* Email (optional) */}
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
                  <p className="mt-5 text-xs text-burnt-orange">{t.errorMessage}</p>
                )}

                {formState === 'captcha' && (
                  <p className="mt-5 text-xs text-burnt-orange">{t.captcha}</p>
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
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
