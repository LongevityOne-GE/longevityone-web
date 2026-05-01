'use client'

import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // Connect Lenis to GSAP so ScrollTrigger pinning works correctly
    lenis.on('scroll', ScrollTrigger.update)
    const rafCallback = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(rafCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(rafCallback)
    }
  }, [])

  return <>{children}</>
}
