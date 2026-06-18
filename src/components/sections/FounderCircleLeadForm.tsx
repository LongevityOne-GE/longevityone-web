'use client'

import { useState, useId } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowRight, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/utils'

interface FounderCircleLeadFormProps {
  locale: Locale
  label: string
  triggerClassName?: string
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const copy = {
  ka: {
    tagline: 'დატოვეთ ნომერი და ჩვენი კონსიერჟი დაგიკავშირდებათ 24 საათში.',
    nameLabel: 'სახელი',
    phoneLabel: 'ტელეფონი',
    emailLabel: 'ელ. ფოსტა (სურვილისამებრ)',
    consentText: 'ვეთანხმები პერსონალური მონაცემების დამუშავებას',
    privacyHref: '/legal/privacy',
    submitLabel: 'გაგზავნა',
    loadingLabel: 'იგზავნება...',
    successMessage: 'მადლობა. ჩვენ დაგიკავშირდებით მალე.',
    errorMessage: 'დაფიქსირდა შეცდომა. გთხოვთ სცადოთ ხელახლა.',
    closeLabel: 'დახურვა',
  },
  en: {
    tagline: 'Leave your number and our concierge will call you within 24 hours.',
    nameLabel: 'Name',
    phoneLabel: 'Phone',
    emailLabel: 'Email (optional)',
    consentText: 'I consent to the processing of my personal data',
    privacyHref: '/en/legal/privacy',
    submitLabel: 'Send',
    loadingLabel: 'Sending...',
    successMessage: "Thank you. We'll be in touch shortly.",
    errorMessage: 'Something went wrong. Please try again.',
    closeLabel: 'Close',
  },
} as const

export function FounderCircleLeadForm({
  locale,
  label,
  triggerClassName,
}: FounderCircleLeadFormProps) {
  const t = copy[locale]
  const uid = useId()

  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState<FormState>('idle')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [company, setCompany] = useState('') // honeypot: must stay empty

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
    setCompany('')
    setFormState('idle')
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) resetForm()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    setFormState('submitting')
    try {
      const res = await fetch('/api/founder-circle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          lang: locale,
          consent: true,
          company,
        }),
      })

      if (!res.ok) {
        setFormState('error')
        return
      }

      setFormState('success')
    } catch {
      setFormState('error')
    }
  }

  const inputClass = cn(
    'bg-transparent border-b border-dark-brown/40 pb-2 w-full',
    'text-dark-brown placeholder:text-dark-brown/40 font-light',
    'focus:outline-none focus:border-dark-brown',
    'transition-colors duration-300',
  )

  const labelClass = 'block text-[11px] font-medium uppercase tracking-[0.15em] text-dark-brown/60 mb-2'

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
            'fixed left-1/2 top-1/2 z-50 w-full max-w-md',
            '-translate-x-1/2 -translate-y-1/2',
            'bg-bone-white p-8',
            'focus:outline-none',
            'data-[state=open]:animate-slide-up',
          )}
        >
          {/* Close button */}
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label={t.closeLabel}
              className="absolute right-4 top-4 p-2 text-dark-brown/50 hover:text-dark-brown transition-colors duration-200"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </Dialog.Close>

          <Dialog.Title className="text-heading font-bold text-dark-brown mb-3">
            Founder Circle 50
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
              {/* Honeypot: hidden from real users, attractive to bots */}
              <div
                aria-hidden="true"
                style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
              >
                <label>
                  Company
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </label>
              </div>
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
                      {locale === 'ka' ? 'კონფიდენციალურობის პოლიტიკა' : 'Privacy Policy'}
                    </Link>
                  </label>
                </div>
              </div>

              {formState === 'error' && (
                <p className="mt-5 text-xs text-burnt-orange">{t.errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className={cn(
                  'mt-8 w-full flex items-center justify-center',
                  'px-6 py-4 text-[11px] font-bold uppercase tracking-widest',
                  'bg-burnt-orange text-bone-white',
                  'transition-colors duration-300',
                  'hover:bg-dark-brown',
                  'disabled:opacity-40 disabled:cursor-not-allowed',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burnt-orange',
                )}
              >
                {formState === 'submitting' ? t.loadingLabel : t.submitLabel}
              </button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
