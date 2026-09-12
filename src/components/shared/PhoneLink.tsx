'use client'

import type { ReactNode } from 'react'
import { trackPhoneClick } from '@/lib/analytics-events'

interface PhoneLinkProps {
  /** Full phone number. Non-digits are stripped for the tel: href. */
  phone: string
  /** Where this link lives, reported as phone_click_source. */
  source: string
  className?: string
  children: ReactNode
}

/**
 * A `tel:` link that reports the tap to the dataLayer.
 *
 * The site is in calls-only mode, so a phone tap is the main conversion and
 * needs to be countable in GA4 / Google Ads. Centralised here so every phone
 * number on the site is tracked the same way and none is missed.
 */
export function PhoneLink({ phone, source, className, children }: PhoneLinkProps) {
  return (
    <a
      href={`tel:${phone.replace(/[^+\d]/g, '')}`}
      className={className}
      onClick={() => trackPhoneClick(source)}
    >
      {children}
    </a>
  )
}
