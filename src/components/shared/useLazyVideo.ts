'use client'

import { useEffect, useRef } from 'react'

/**
 * Defers a background video's download AND playback until it scrolls near the
 * viewport. The <video> must render with `preload="none"` and NO `autoPlay`;
 * this hook calls play() (which triggers the download) on first intersection.
 *
 * - Cuts initial page weight: off-screen videos never download until approached.
 * - LCP-friendly: a `poster` paints instantly while bytes are deferred.
 * - Respects prefers-reduced-motion: never autoplays, leaving the poster shown.
 */
export function useLazyVideo<T extends HTMLVideoElement = HTMLVideoElement>(
  rootMargin = '300px',
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const play = () => {
      const playback = el.play()
      if (playback && typeof playback.catch === 'function') playback.catch(() => {})
    }

    // Defer the heavy video bytes until the page is loaded + idle so they never
    // contend with the LCP paint (the poster carries the visual until then).
    // Above-the-fold videos intersect immediately but still wait for load/idle.
    const startWhenIdle = () => {
      const schedule = () => {
        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(play, { timeout: 2000 })
        } else {
          window.setTimeout(play, 200)
        }
      }
      if (document.readyState === 'complete') schedule()
      else window.addEventListener('load', schedule, { once: true })
    }

    if (!('IntersectionObserver' in window)) {
      startWhenIdle()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            startWhenIdle()
            observer.disconnect()
            break
          }
        }
      },
      { rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return ref
}
