'use client'

import { useEffect, useState } from 'react'
import type { Locale } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  getConsentedReviews,
  reviewText,
  reviewName,
  reviewService,
  formatRelativeDate,
  type Review,
} from '@/lib/reviews'
import { Reveal } from '@/components/animations/Reveal'
import { GodVideo } from '@/components/shared/GodVideo'
import { ReviewsJsonLd } from '@/components/sections/reviews/ReviewsJsonLd'

interface ReviewsSectionProps {
  locale: Locale
  /** Auto-advance interval in milliseconds. */
  interval?: number
}

/** Same destination as the "Leave us a review" link on /links. */
const GOOGLE_REVIEW_URL = 'https://g.page/r/CeUnX0YVBOYEEBM/review'

const COPY = {
  ka: {
    eyebrow: 'შეფასებები',
    heading: 'რას ამბობენ ჩვენი პაციენტები',
    onGoogle: 'იხილეთ Google-ზე',
    ratingLabel: (n: number) => `შეფასება: ${n} / 5`,
    prev: 'წინა შეფასებები',
    next: 'შემდეგი შეფასებები',
    goTo: (n: number) => `გადადით ${n}-ე ჯგუფზე`,
  },
  en: {
    eyebrow: 'Reviews',
    heading: 'What our patients say',
    onGoogle: 'Read on Google',
    ratingLabel: (n: number) => `Rated ${n} out of 5`,
    prev: 'Previous reviews',
    next: 'Next reviews',
    goTo: (n: number) => `Go to slide ${n}`,
  },
} as const

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={cn(
            'h-[15px] w-[15px]',
            star <= rating ? 'text-burnt-orange' : 'text-bone-white/20',
          )}
        >
          <path d="M12 2.4l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.47l-5.9 3.1 1.13-6.57L2.45 9.34l6.6-.96L12 2.4z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review, locale }: { review: Review; locale: Locale }) {
  const t = COPY[locale]
  const relativeDate = formatRelativeDate(review.date, locale)

  return (
    <article className="relative flex h-full w-full flex-col overflow-hidden rounded-sm border border-bone-white/12 bg-bone-white/[0.04] p-7 transition-colors duration-300 hover:border-burnt-orange/35 md:p-8">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 right-4 select-none font-serif text-[110px] leading-none text-burnt-orange/[0.07]"
      >
        &rdquo;
      </span>

      <div className="relative flex items-center justify-between gap-3">
        <Stars rating={review.rating} label={t.ratingLabel(review.rating)} />
        {review.source === 'google' && (
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener"
            aria-label={t.onGoogle}
            title={t.onGoogle}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-bone-white/25 font-serif text-[12px] leading-none text-bone-white/60 transition-colors duration-200 hover:border-burnt-orange hover:text-burnt-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burnt-orange"
          >
            G
          </a>
        )}
      </div>

      {/* The review itself is the content — shown in full, never truncated. */}
      <blockquote className="relative mt-5 flex-1 text-[15px] leading-[1.75] text-bone-white/85">
        {reviewText(review, locale)}
      </blockquote>

      <footer className="relative mt-7 border-t border-bone-white/12 pt-5">
        <p className="font-serif text-base font-semibold text-bone-white">
          {reviewName(review, locale)}
        </p>
        <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-bone-white/50">
          {reviewService(review, locale)}
          {relativeDate && (
            <span suppressHydrationWarning className="text-bone-white/35">
              {' · '}
              {relativeDate}
            </span>
          )}
        </p>
      </footer>
    </article>
  )
}

function ArrowButton({
  direction,
  label,
  onClick,
}: {
  direction: 'prev' | 'next'
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-bone-white/25 text-bone-white/70 transition-colors duration-200 hover:border-burnt-orange hover:text-burnt-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burnt-orange"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={direction === 'prev' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
      </svg>
    </button>
  )
}

export function ReviewsSection({ locale, interval = 6500 }: ReviewsSectionProps) {
  const reviews = getConsentedReviews()
  const count = reviews.length

  const [perView, setPerView] = useState(1)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  // How many plaques share the row at the current breakpoint (1 / 2 / 3).
  useEffect(() => {
    const compute = () => {
      if (typeof window === 'undefined') return
      if (window.matchMedia('(min-width: 1024px)').matches) setPerView(3)
      else if (window.matchMedia('(min-width: 640px)').matches) setPerView(2)
      else setPerView(1)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  // Last valid starting position — the row slides one card at a time and stops
  // once the final card is flush with the right edge (no trailing blank space).
  const maxIndex = Math.max(0, count - perView)

  // Derived during render rather than clamped via an effect: when the viewport
  // shrinks (perView drops) a stale index would otherwise overshoot the track.
  const safeIndex = Math.min(index, maxIndex)

  const next = () => setIndex((p) => (Math.min(p, maxIndex) >= maxIndex ? 0 : Math.min(p, maxIndex) + 1))
  const prev = () => setIndex((p) => (p <= 0 ? maxIndex : Math.min(p, maxIndex) - 1))

  // Auto-rotate, matching the technologies gallery: pauses on hover/focus and
  // never runs for visitors who have asked for reduced motion. Depends only on
  // primitives so the timer is not torn down and rebuilt on every render.
  useEffect(() => {
    if (paused || maxIndex === 0) return
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }
    const id = setInterval(() => {
      setIndex((p) => (Math.min(p, maxIndex) >= maxIndex ? 0 : Math.min(p, maxIndex) + 1))
    }, interval)
    return () => clearInterval(id)
  }, [paused, maxIndex, interval])

  // Zero consented reviews → the section does not exist at all.
  if (count === 0) return null

  const t = COPY[locale]
  const hasCarousel = maxIndex > 0

  return (
    <section className="relative overflow-hidden bg-dark-brown py-24 text-bone-white md:py-32">
      {/* DNA helix loop — the same background animation used by the packages
          page sections. Heavily tinted so the plaques stay legible. */}
      <GodVideo
        src={{ webm: '/videos/DNA_boomerang.webm', mp4: '/videos/DNA_boomerang.mp4' }}
        overlay="tint"
        tint="dark"
        tintOpacity={0.82}
      />

      <div className="section-container relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-burnt-orange">
              {t.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-black leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-6xl text-bone-white">
              {t.heading}
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <div
            className="mt-14 md:mt-16"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            {/* Single row — the track slides one card at a time. Slides use
                padding + a negative track margin rather than `gap`, so each
                slide stays an exact 1/perView fraction and the translate maths
                lands precisely on a card boundary. */}
            <div
              className="overflow-hidden"
              role="group"
              aria-roledescription="carousel"
              aria-label={t.heading}
            >
              <div
                className="-mx-2.5 flex items-stretch transition-transform duration-700 ease-out md:-mx-3"
                style={{ transform: `translateX(-${safeIndex * (100 / perView)}%)` }}
              >
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="w-full shrink-0 px-2.5 sm:w-1/2 md:px-3 lg:w-1/3"
                  >
                    <ReviewCard review={review} locale={locale} />
                  </div>
                ))}
              </div>
            </div>

            {hasCarousel && (
              <div className="mt-8 flex items-center justify-center gap-5">
                <ArrowButton direction="prev" label={t.prev} onClick={prev} />

                <div className="flex items-center gap-2">
                  {Array.from({ length: maxIndex + 1 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={t.goTo(i + 1)}
                      aria-current={i === safeIndex ? 'true' : undefined}
                      className="group flex items-center justify-center p-1.5"
                    >
                      <span
                        className={cn(
                          'block h-2 rounded-full transition-all duration-300',
                          i === safeIndex
                            ? 'w-6 bg-burnt-orange'
                            : 'w-2 bg-bone-white/25 group-hover:bg-bone-white/45',
                        )}
                      />
                    </button>
                  ))}
                </div>

                <ArrowButton direction="next" label={t.next} onClick={next} />
              </div>
            )}
          </div>
        </Reveal>
      </div>

      <ReviewsJsonLd locale={locale} reviews={reviews} />
    </section>
  )
}
