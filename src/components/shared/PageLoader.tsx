'use client'

import { useEffect, useState } from 'react'

const MIN_VISIBLE_MS = 750
const FADE_MS = 550

/**
 * Full-screen bone-white overlay with the brand mark, shown on initial page
 * load. SSR-rendered so it appears in the very first paint, before hydration.
 * After `window.load` fires (and a small minimum-display threshold), it fades
 * out and unmounts. Subsequent client-side route changes do NOT replay it.
 *
 * Honours `prefers-reduced-motion` via CSS in globals.css.
 */
export function PageLoader() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'gone'>('visible')

  // Trigger fade-out on window.load (or immediately if already complete).
  useEffect(() => {
    const timers: number[] = []
    const start = performance.now()

    const onReady = () => {
      const elapsed = performance.now() - start
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed)
      timers.push(window.setTimeout(() => setPhase('fading'), wait))
      timers.push(window.setTimeout(() => setPhase('gone'), wait + FADE_MS))
    }

    if (document.readyState === 'complete') {
      onReady()
    } else {
      window.addEventListener('load', onReady, { once: true })
    }

    return () => {
      timers.forEach((t) => clearTimeout(t))
      window.removeEventListener('load', onReady)
    }
  }, [])

  // Lock scroll while the loader is on screen.
  useEffect(() => {
    if (phase === 'gone') return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
    }
  }, [phase])

  if (phase === 'gone') return null

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
