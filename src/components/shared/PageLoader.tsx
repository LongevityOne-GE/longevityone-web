'use client'

import { useEffect, useState } from 'react'

/**
 * Industry-standard "delay + min-duration" loader pattern (à la React Suspense,
 * Material guidelines, NN/g):
 *
 *   • SHOW_AFTER_MS  - only reveal the loader if the page is *still* loading
 *                      after this threshold (fast/cached loads → no loader).
 *   • MIN_VISIBLE_MS - once shown, keep it visible at least this long to
 *                      prevent strobing.
 *   • FADE_MS        - quick fade-out.
 */
const SHOW_AFTER_MS = 200
const MIN_VISIBLE_MS = 400
const FADE_MS = 250

type Phase = 'pending' | 'visible' | 'fading' | 'gone'

/**
 * Full-screen bone-white overlay with the brand mark, shown only when initial
 * load takes long enough to warrant feedback. Subsequent client-side route
 * changes do NOT replay it. Honours `prefers-reduced-motion`.
 */
export function PageLoader() {
  const [phase, setPhase] = useState<Phase>('pending')

  useEffect(() => {
    const timers: number[] = []
    const startedAt = performance.now()
    let shownAt: number | null = null

    // Reveal the loader only if we're still waiting after SHOW_AFTER_MS.
    const showTimer = window.setTimeout(() => {
      if (document.readyState !== 'complete') {
        shownAt = performance.now()
        setPhase('visible')
      }
    }, SHOW_AFTER_MS)
    timers.push(showTimer)

    const onReady = () => {
      // If we never showed the loader, skip straight to gone.
      if (shownAt === null) {
        clearTimeout(showTimer)
        setPhase('gone')
        return
      }
      // Honour the minimum-visible window, then fade.
      const elapsedVisible = performance.now() - shownAt
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsedVisible)
      timers.push(window.setTimeout(() => setPhase('fading'), wait))
      timers.push(window.setTimeout(() => setPhase('gone'), wait + FADE_MS))
    }

    if (document.readyState === 'complete') {
      // Page already loaded by the time we mounted - don't show at all.
      clearTimeout(showTimer)
      setPhase('gone')
    } else {
      window.addEventListener('load', onReady, { once: true })
    }

    // Reference startedAt so it isn't flagged unused (kept for future tuning).
    void startedAt

    return () => {
      timers.forEach((t) => clearTimeout(t))
      window.removeEventListener('load', onReady)
    }
  }, [])

  // Lock scroll only while the loader is actually visible.
  useEffect(() => {
    if (phase !== 'visible' && phase !== 'fading') return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
    }
  }, [phase])

  if (phase === 'gone' || phase === 'pending') return null

  return (
    <div
      className={`page-loader fixed inset-0 z-[9999] bg-bone-white flex items-center justify-center ${
        phase === 'fading' ? 'page-loader--leaving' : ''
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      data-loader-phase={phase}
    >
      <div className="page-loader__inner">
        <div className="page-loader__mark" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/logo-mark.svg"
            alt=""
            width={96}
            height={106}
            draggable={false}
          />
        </div>
        <div className="page-loader__wordmark" aria-hidden="true">
          <span>LONGEVITY</span>
          <span>ONE</span>
        </div>
      </div>
    </div>
  )
}
