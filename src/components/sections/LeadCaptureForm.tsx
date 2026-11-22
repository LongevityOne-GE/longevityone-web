'use client'

import { useState, useId } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowRight, X } from 'lucide-react'
import { trackLeadFormOpen } from '@/lib/analytics-events'
import { LeadForm } from '@/components/forms/LeadForm'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/utils'

interface LeadCaptureFormProps {
  locale: Locale
  source: string
  heading?: string
  label: string
  triggerClassName?: string
}

const DEFAULT_HEADINGS: Record<Locale, string> = {
  ka: 'დაგვიკავშირდით',
  en: 'Get in Touch',
}

const COPY = {
  ka: {
    tagline:    'დატოვეთ ნომერი და ჩვენი კონსიერჟი დაგიკავშირდებათ 24 საათში.',
    closeLabel: 'დახურვა',
  },
  en: {
    tagline:    'Leave your number and our concierge will call you within 24 hours.',
    closeLabel: 'Close',
  },
} as const

/** A button that opens the call-request form in a dialog. */
export function LeadCaptureForm({
  locale,
  source,
  heading,
  label,
  triggerClassName,
}: LeadCaptureFormProps) {
  const t = COPY[locale]
  const uid = useId()
  const [open, setOpen] = useState(false)

  function handleOpenChange(next: boolean) {
    if (next && !open) trackLeadFormOpen(source)
    // Closing unmounts the form, which also clears whatever was typed.
    setOpen(next)
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
              {heading ?? DEFAULT_HEADINGS[locale]}
            </Dialog.Title>

            <p
              id={`${uid}-tagline`}
              className="text-sm font-light text-dark-brown/70 mb-8 leading-relaxed"
            >
              {t.tagline}
            </p>

            <LeadForm locale={locale} source={source} onSubmitted={() => setOpen(false)} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
