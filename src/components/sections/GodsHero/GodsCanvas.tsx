'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { GOD_LAYERS, useScrollProgress } from './useScrollProgress'
import type { GodLayer } from './useScrollProgress'

export function GodsCanvas() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const stickyRef = useRef<HTMLDivElement | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const textRef = useRef<HTMLDivElement | null>(null)

  const [reducedMotion, setReducedMotion] = useState(false)

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // IntersectionObserver — play/pause videos when section enters/leaves viewport
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        const videos = videoRefs.current
        if (entry === undefined || !videos) return
        if (entry.isIntersecting) {
          videos.forEach((v) => {
            if (v && v.paused) void v.play()
          })
        } else {
          videos.forEach((v) => {
            if (v && !v.paused) v.pause()
          })
        }
      },
      { threshold: 0 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Set video ref by index
  const setVideoRef = useCallback(
    (index: number) => (el: HTMLVideoElement | null) => {
      videoRefs.current[index] = el
    },
    [],
  )

  // Scroll-driven animation
  useScrollProgress({
    sectionRef,
    stickyRef,
    videoRefs,
    textRef,
    reducedMotion,
  })

  // Reduced-motion: 100vh section, all visible, no animation
  const sectionHeight = reducedMotion ? 'h-screen' : 'h-[500vh] md:h-[500vh] max-md:h-[300vh]'

  return (
    <section ref={sectionRef} className={`relative ${sectionHeight}`}>
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-bone-white"
        role="img"
        aria-label="LongevityOne — Greek gods and goddesses representing health, longevity, athletic performance and medical precision"
      >
        {/* Monogram watermark */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
          <Image
            src="/logos/logo-mark.svg"
            alt=""
            width={800}
            height={800}
            className="w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-[0.06]"
            aria-hidden="true"
            priority
          />
        </div>

        {/* Video layers */}
        <div aria-hidden="true">
          {GOD_LAYERS.map((layer: GodLayer, i: number) => (
            <video
              key={layer.name}
              ref={setVideoRef(i)}
              className={`absolute ${layer.className}`}
              style={{
                willChange: 'opacity, transform',
                opacity: reducedMotion ? 1 : 0,
                transform: reducedMotion ? 'none' : undefined,
              }}
              autoPlay
              muted
              playsInline
              loop
              preload="none"
              poster=""
            >
              <source src={layer.src.webm} type="video/webm" />
              <source src={layer.src.mp4} type="video/mp4" />
            </video>
          ))}
        </div>

        {/* Text overlay */}
        {/* TODO: Sanity — heading and CTA content will come from Sanity */}
        <div
          ref={textRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none max-md:justify-end max-md:pb-[30%] md:justify-center"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          <div className="text-center px-4">
            <h1 className="font-serif text-5xl md:text-7xl text-dark-brown text-center leading-tight">
              სიცოცხლის ხელოვნება
            </h1>
            <p className="font-serif text-xl md:text-2xl text-dark-brown/70 text-center mt-2 tracking-wide">
              THE ART OF LIVING LONGER
            </p>

            <div className="mt-6 pointer-events-auto">
              <a
                href="#booking"
                className="inline-block bg-burnt-orange text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-dark-brown transition-colors"
              >
                კონსულტაციის დაჯავშნა →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
