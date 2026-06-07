'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Locale } from '@/lib/utils'

interface FounderCircleModalProps {
  locale: Locale
}

const MODAL_SEEN_KEY = 'fc50_modal_seen'
const BAR_DISMISSED_KEY = 'fc50_bar_dismissed'
const MIN_DELAY_MS = 30_000

const content = {
  ka: {
    label: 'ექსკლუზიური შეთავაზება',
    heading: 'დამფუძნებელთა წრე 50',
    body: 'პირველ 50 წევრს ვთავაზობთ სრულ წვდომას Longevity One-ის სერვისებზე - ექიმის პირდაპირი ხაზით, ულიმიტო თერაპიებით და წლიური ეპიგენეტიკური ტესტით.',
    price: '3 500 ლარი / წელი',
    ctaPrimary: 'გახდი Founder Circle 50-ის წევრი',
    ctaSecondary: 'გადავხედავ მოგვიანებით',
    dialogLabel: 'დამფუძნებელთა წრე 50',
  },
  en: {
    label: 'Exclusive Offer',
    heading: 'Founder Circle 50',
    body: 'We are offering the first 50 members full access to Longevity One - with a direct physician line, unlimited therapies, and an annual epigenetic test.',
    price: '3,500 GEL / year',
    ctaPrimary: 'Join Founder Circle 50',
    ctaSecondary: "I'll look later",
    dialogLabel: 'Founder Circle 50',
  },
} as const

export function FounderCircleModal({ locale }: FounderCircleModalProps) {
  const t = content[locale]
  const prefix = locale === 'en' ? '/en' : ''
  const bookingHref = `${prefix}/booking?type=consultation`
  const reduceMotion = useReducedMotion()

  const [open, setOpen] = useState(false)
  const armedRef = useRef(false)
  const sectionSeenRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Preview affordance: open immediately with ?fc50=preview (bypasses all guards).
    if (new URLSearchParams(window.location.search).get('fc50') === 'preview') {
      setOpen(true)
      return
    }

    if (sessionStorage.getItem(MODAL_SEEN_KEY)) return
    if (sessionStorage.getItem(BAR_DISMISSED_KEY) === 'true') return

    const armTimer = window.setTimeout(() => {
      armedRef.current = true
    }, MIN_DELAY_MS)

    // If the user scrolls the FounderCircle section into view, they've seen
    // the offer - suppress the modal entirely.
    const section = document.getElementById('founder-circle')
    let observer: IntersectionObserver | undefined
    if (section) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) sectionSeenRef.current = true
          }
        },
        { threshold: 0.2 },
      )
      observer.observe(section)
    }

    const onMouseLeave = (event: MouseEvent) => {
      if (event.clientY > 0) return
      if (!armedRef.current) return
      if (sectionSeenRef.current) return
      if (sessionStorage.getItem(MODAL_SEEN_KEY)) return
      if (sessionStorage.getItem(BAR_DISMISSED_KEY) === 'true') return

      sessionStorage.setItem(MODAL_SEEN_KEY, 'true')
      setOpen(true)
    }

    document.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.clearTimeout(armTimer)
      observer?.disconnect()
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  // Lock body scroll + ESC to close while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t.dialogLabel}
            className="relative w-full max-w-lg overflow-hidden border-t-2 border-burnt-orange bg-bone-white p-10 md:p-12"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none select-none absolute -top-10 -right-2 font-black leading-none text-dark-brown/[0.04] text-[180px]"
            >
              50
            </span>

            <div className="relative">
              <div className="flex items-center gap-4">
                <span aria-hidden="true" className="h-px w-8 bg-burnt-orange" />
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-burnt-orange">
                  {t.label}
                </p>
              </div>

              <h2 className="mt-6 text-3xl md:text-4xl font-light leading-tight text-dark-brown">
                {t.heading}
              </h2>

              <p className="mt-6 text-sm leading-relaxed text-dark-brown/70">{t.body}</p>

              <div className="mt-8 border-t border-dark-brown/10 pt-6">
                <span className="block text-2xl md:text-3xl font-light text-burnt-orange">
                  {t.price}
                </span>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href={bookingHref}
                  onClick={() => setOpen(false)}
                  className="group inline-flex w-full items-center justify-between gap-6 bg-burnt-orange px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-bone-white transition-colors duration-300 hover:bg-dark-brown"
                >
                  <span>{t.ctaPrimary}</span>
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full items-center justify-center border border-dark-brown/30 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-dark-brown/80 transition-colors duration-300 hover:border-dark-brown hover:text-dark-brown"
                >
                  {t.ctaSecondary}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
