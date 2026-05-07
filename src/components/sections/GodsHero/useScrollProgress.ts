'use client'

import { useRef, useEffect, useCallback } from 'react'

/** Linear interpolation clamped to 0–1 */
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * Math.min(Math.max(t, 0), 1)
}

/** Map a value from one range to another, clamped */
function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return lerp(outMin, outMax, (value - inMin) / (inMax - inMin))
}

export interface GodLayer {
  name: 'hygieia' | 'discobolus' | 'asclepius' | 'apollo'
  src: { webm: string; mp4: string }
  enterStart: number
  enterEnd: number
  holdEnd: number
  exitEnd: number
  enterFrom: { x?: number; y?: number }
  exitTo: { x?: number; y?: number }
  className: string
}

export const GOD_LAYERS: GodLayer[] = [
  {
    name: 'hygieia',
    src: {
      webm: '/videos/gods/god-hygieia.webm',
      mp4: '/videos/gods/god-hygieia.mp4',
    },
    enterStart: 0.0,
    enterEnd: 0.1,
    holdEnd: 0.4,
    exitEnd: 0.55,
    enterFrom: { x: -80 },
    exitTo: { x: -120 },
    className: 'left-0 bottom-0 w-1/3 h-full object-contain object-bottom md:w-1/3 max-md:w-1/2',
  },
  {
    name: 'discobolus',
    src: {
      webm: '/videos/gods/god-discobolus.webm',
      mp4: '/videos/gods/god-discobolus.mp4',
    },
    enterStart: 0.03,
    enterEnd: 0.13,
    holdEnd: 0.43,
    exitEnd: 0.58,
    enterFrom: { x: 80 },
    exitTo: { x: 120 },
    className: 'right-0 bottom-0 w-1/3 h-full object-contain object-bottom md:w-1/3 max-md:w-1/2',
  },
  {
    name: 'asclepius',
    src: {
      webm: '/videos/gods/god-asclepius.webm',
      mp4: '/videos/gods/god-asclepius.mp4',
    },
    enterStart: 0.06,
    enterEnd: 0.18,
    holdEnd: 0.46,
    exitEnd: 0.6,
    enterFrom: { y: 60 },
    exitTo: { y: 80 },
    className:
      'left-1/2 -translate-x-1/2 bottom-0 w-1/3 h-full object-contain object-bottom md:block max-md:hidden',
  },
  {
    name: 'apollo',
    src: {
      webm: '/videos/gods/god-apollo.webm',
      mp4: '/videos/gods/god-apollo.mp4',
    },
    enterStart: 0.1,
    enterEnd: 0.22,
    holdEnd: 0.5,
    exitEnd: 0.64,
    enterFrom: { y: -60 },
    exitTo: { y: -80 },
    className:
      'left-1/2 -translate-x-1/2 top-0 w-1/4 h-auto object-contain md:block max-md:hidden',
  },
]

/** Text overlay scroll ranges */
const TEXT_ENTER_START = 0.0
const TEXT_ENTER_END = 0.08
const TEXT_EXIT_START = 0.5
const TEXT_EXIT_END = 0.62

interface UseScrollProgressOptions {
  sectionRef: React.RefObject<HTMLElement | null>
  stickyRef: React.RefObject<HTMLDivElement | null>
  videoRefs: React.RefObject<(HTMLVideoElement | null)[]>
  textRef: React.RefObject<HTMLDivElement | null>
  reducedMotion: boolean
}

export function useScrollProgress({
  sectionRef,
  stickyRef,
  videoRefs,
  textRef,
  reducedMotion,
}: UseScrollProgressOptions): void {
  const progressRef = useRef(0)
  const rafRef = useRef<number>(0)

  const updateStyles = useCallback(() => {
    const section = sectionRef.current
    const sticky = stickyRef.current
    if (!section || !sticky) return

    const rect = section.getBoundingClientRect()
    const sectionHeight = section.offsetHeight - window.innerHeight
    const rawProgress = -rect.top / sectionHeight
    progressRef.current = Math.min(Math.max(rawProgress, 0), 1)
    const p = progressRef.current

    // Update each god layer
    const videos = videoRefs.current
    if (videos) {
      GOD_LAYERS.forEach((layer, i) => {
        const el = videos[i]
        if (!el) return

        let opacity: number
        let tx = 0
        let ty = 0

        if (p < layer.enterStart) {
          opacity = 0
          tx = layer.enterFrom.x ?? 0
          ty = layer.enterFrom.y ?? 0
        } else if (p < layer.enterEnd) {
          // Entering
          opacity = mapRange(p, layer.enterStart, layer.enterEnd, 0, 1)
          tx = mapRange(p, layer.enterStart, layer.enterEnd, layer.enterFrom.x ?? 0, 0)
          ty = mapRange(p, layer.enterStart, layer.enterEnd, layer.enterFrom.y ?? 0, 0)
        } else if (p < layer.holdEnd) {
          // Held
          opacity = 1
          tx = 0
          ty = 0
        } else if (p < layer.exitEnd) {
          // Exiting
          opacity = mapRange(p, layer.holdEnd, layer.exitEnd, 1, 0)
          tx = mapRange(p, layer.holdEnd, layer.exitEnd, 0, layer.exitTo.x ?? 0)
          ty = mapRange(p, layer.holdEnd, layer.exitEnd, 0, layer.exitTo.y ?? 0)
        } else {
          opacity = 0
          tx = layer.exitTo.x ?? 0
          ty = layer.exitTo.y ?? 0
        }

        el.style.opacity = String(opacity)
        el.style.transform = `translate(${tx}px, ${ty}px)`
      })
    }

    // Update text overlay
    const textEl = textRef.current
    if (textEl) {
      let textOpacity: number
      if (p < TEXT_ENTER_START) {
        textOpacity = 0
      } else if (p < TEXT_ENTER_END) {
        textOpacity = mapRange(p, TEXT_ENTER_START, TEXT_ENTER_END, 0, 1)
      } else if (p < TEXT_EXIT_START) {
        textOpacity = 1
      } else if (p < TEXT_EXIT_END) {
        textOpacity = mapRange(p, TEXT_EXIT_START, TEXT_EXIT_END, 1, 0)
      } else {
        textOpacity = 0
      }
      textEl.style.opacity = String(textOpacity)
    }
  }, [sectionRef, stickyRef, videoRefs, textRef])

  useEffect(() => {
    if (reducedMotion) return

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updateStyles)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // Initial tick
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [reducedMotion, updateStyles])
}
