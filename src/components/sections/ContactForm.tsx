'use client'

import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Locale } from '@/lib/utils'
import { Turnstile, type TurnstileHandle } from '@/components/forms/Turnstile'

const messages = {
  ka: {
    nameMin: 'გთხოვთ, შეიყვანოთ სახელი და გვარი',
    emailInvalid: 'გთხოვთ, შეიყვანოთ სწორი ელ. ფოსტა',
    messageMin: 'შეტყობინება უნდა შეიცავდეს მინიმუმ 10 სიმბოლოს',
    tooLong: 'ძალიან გრძელი ტექსტი',
  },
  en: {
    nameMin: 'Please enter your full name',
    emailInvalid: 'Please enter a valid email address',
    messageMin: 'Message must be at least 10 characters',
    tooLong: 'Text is too long',
  },
} as const

function buildSchema(locale: Locale) {
  const m = messages[locale]
  return z.object({
    name: z.string().min(2, m.nameMin).max(120, m.tooLong),
    email: z.string().email(m.emailInvalid).max(254, m.tooLong),
    phone: z.string().max(40, m.tooLong).optional(),
    message: z.string().min(10, m.messageMin).max(5000, m.tooLong),
    // Honeypot — must remain empty.
    company: z.string().max(0).optional(),
  })
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>

interface ContactFormProps {
  locale: Locale
}

const copy = {
  ka: {
    name: 'სახელი და გვარი',
    email: 'ელ. ფოსტა',
    phone: 'ტელეფონი (არჩევითი)',
    message: 'შეტყობინება',
    send: 'გაგზავნა',
    sending: 'იგზავნება...',
    success: 'თქვენი შეტყობინება გაიგზავნა. მალე დაგიკავშირდებით.',
    error: 'შეცდომა. გთხოვთ, სცადოთ მოგვიანებით.',
    rateLimited: 'ძალიან ბევრი მოთხოვნა. გთხოვთ, სცადოთ რამდენიმე წუთში.',
    captcha: 'გთხოვთ, დაასრულოთ უსაფრთხოების შემოწმება.',
  },
  en: {
    name: 'Full Name',
    email: 'Email Address',
    phone: 'Phone (optional)',
    message: 'Message',
    send: 'Send Message',
    sending: 'Sending...',
    success: 'Your message has been sent. We will be in touch shortly.',
    error: 'Something went wrong. Please try again later.',
    rateLimited: 'Too many attempts. Please try again in a few minutes.',
    captcha: 'Please complete the security check.',
  },
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export function ContactForm({ locale }: ContactFormProps) {
  const t = copy[locale]
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error' | 'rateLimited' | 'captcha'
  >('idle')
  const [captchaToken, setCaptchaToken] = useState('')
  const turnstileRef = useRef<TurnstileHandle>(null)
  const schema = useMemo(() => buildSchema(locale), [locale])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setStatus('captcha')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, locale, turnstileToken: captchaToken }),
      })
      if (res.status === 429) {
        setStatus('rateLimited')
        turnstileRef.current?.reset()
        setCaptchaToken('')
        return
      }
      if (!res.ok) {
        console.error('[contact] submit failed', res.status)
        setStatus('error')
        turnstileRef.current?.reset()
        setCaptchaToken('')
        return
      }
      setStatus('success')
      reset()
    } catch (err) {
      console.error('[contact] network error', err)
      setStatus('error')
      turnstileRef.current?.reset()
      setCaptchaToken('')
    }
  }

  const inputClass =
    'w-full bg-transparent border-b border-dark-brown/25 py-3 text-sm text-dark-brown placeholder-dark-brown/40 focus:outline-none focus:border-burnt-orange transition-colors duration-200'
  const errorClass = 'text-xs text-burnt-orange mt-1'
  const srOnly = 'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 clip-0'

  if (status === 'success') {
    return (
      <div className="py-12 text-center">
        <p className="text-sm font-bold text-dark-brown">{t.success}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {/* Honeypot: hidden from real users, attractive to bots. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        <label>
          Company
          <input
            {...register('company')}
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div>
        <label htmlFor="contact-name" className={srOnly}>{t.name}</label>
        <input
          {...register('name')}
          id="contact-name"
          type="text"
          placeholder={t.name}
          className={inputClass}
          autoComplete="name"
          required
          aria-required="true"
        />
        {errors.name && <p className={errorClass} role="alert">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="contact-email" className={srOnly}>{t.email}</label>
        <input
          {...register('email')}
          id="contact-email"
          type="email"
          placeholder={t.email}
          className={inputClass}
          autoComplete="email"
          required
          aria-required="true"
        />
        {errors.email && <p className={errorClass} role="alert">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="contact-phone" className={srOnly}>{t.phone}</label>
        <input
          {...register('phone')}
          id="contact-phone"
          type="tel"
          placeholder={t.phone}
          className={inputClass}
          autoComplete="tel"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={srOnly}>{t.message}</label>
        <textarea
          {...register('message')}
          id="contact-message"
          rows={5}
          placeholder={t.message}
          className={`${inputClass} resize-none`}
          required
          aria-required="true"
        />
        {errors.message && <p className={errorClass} role="alert">{errors.message.message}</p>}
      </div>

      {TURNSTILE_SITE_KEY && (
        <Turnstile
          ref={turnstileRef}
          siteKey={TURNSTILE_SITE_KEY}
          onToken={(token) => {
            setCaptchaToken(token)
            if (token && status === 'captcha') setStatus('idle')
          }}
        />
      )}

      {status === 'error' && (
        <p className="text-xs text-burnt-orange">{t.error}</p>
      )}
      {status === 'rateLimited' && (
        <p className="text-xs text-burnt-orange">{t.rateLimited}</p>
      )}
      {status === 'captcha' && (
        <p className="text-xs text-burnt-orange">{t.captcha}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? t.sending : t.send}
      </button>
    </form>
  )
}
