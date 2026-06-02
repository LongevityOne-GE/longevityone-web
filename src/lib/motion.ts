'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * SSR-safe hook that returns true when the user has opted into reduced motion.
 * Use this to gate non-essential animations in components where CSS media
 * queries are not enough (e.g. JS-driven parallax, counters, GSAP scenes).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  return reduced
}

/**
 * Tracks vertical scroll progress as a value in [0, 1].
 * - Without a ref: progress across the whole document (0 at top, 1 at bottom).
 * - With a ref: progress of the element entering (0) to leaving (1) the viewport.
 *
 * Uses rAF-throttled scroll listener and respects reduced-motion by
 * freezing at the current value (still returns accurate position on load).
 */
export function useScrollProgress(
  ref?: React.RefObject<HTMLElement | null>
): number {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const compute = () => {
      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect()
        const vh = window.innerHeight || 1
        // 0 when element top enters bottom of viewport, 1 when element bottom leaves top
        const total = rect.height + vh
        const travelled = vh - rect.top
        setProgress(Math.min(1, Math.max(0, travelled / total)))
      } else {
        const doc = document.documentElement
        const max = (doc.scrollHeight - window.innerHeight) || 1
        setProgress(Math.min(1, Math.max(0, window.scrollY / max)))
      }
    }

    const onScroll = () => {
      if (rafRef.current != null) return
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null
        compute()
      })
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [ref])

  return progress
}

/**
 * Returns true once the referenced element has entered the viewport at least once.
 * Useful for triggering one-shot reveals, counters, and lazy heavy animations.
 */
export function useInView(
  ref: React.RefObject<Element | null>,
  options?: IntersectionObserverInit
): boolean {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2, ...options }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, options])

  return inView
}
