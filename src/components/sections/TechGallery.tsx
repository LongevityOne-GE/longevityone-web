'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import type { Locale } from '@/lib/utils'

export interface GalleryImage {
  src: string
  alt_ka: string
  alt_en: string
  caption_ka?: string
  caption_en?: string
}

interface TechGalleryProps {
  images: GalleryImage[]
  locale: Locale
  priority?: boolean
  /** Auto-advance interval in milliseconds */
  interval?: number
}

// Auto-playing gallery. Uses object-contain so no image is ever cropped or
// zoomed; a blurred, dimmed cover of the same photo fills any letterbox space
// so mixed portrait/landscape sets still look intentional and premium.
export function TechGallery({
  images,
  locale,
  priority = false,
  interval = 5000,
}: TechGalleryProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = images.length

  const go = useCallback((i: number) => setIndex((i + count) % count), [count])
  const next = useCallback(() => setIndex((p) => (p + 1) % count), [count])
  const prev = useCallback(() => setIndex((p) => (p - 1 + count) % count), [count])

  useEffect(() => {
    if (paused || count <= 1) return
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }
    const id = setInterval(next, interval)
    return () => clearInterval(id)
  }, [paused, count, next, interval])

  const active = images[index]
  if (!active) return null

  const caption = locale === 'ka' ? active.caption_ka : active.caption_en

  return (
    <div
      className="group relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-dark-brown/[0.04] ring-1 ring-dark-brown/10 shadow-[0_30px_70px_-32px_rgba(66,41,34,0.5)]"
        role="group"
        aria-roledescription="carousel"
      >
        {images.map((img, i) => {
          const isActive = i === index
          const alt = locale === 'ka' ? img.alt_ka : img.alt_en
          return (
            <div
              key={img.src}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden={isActive ? undefined : true}
            >
              {/* Blurred backdrop fills letterbox space */}
              <Image
                src={img.src}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                className="object-cover scale-110 blur-2xl opacity-35"
              />
              {/* Foreground: full image, never cropped */}
              <Image
                src={img.src}
                alt={alt}
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                priority={priority && i === 0}
                className="relative object-contain"
              />
            </div>
          )
        })}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-bone-white/80 text-dark-brown backdrop-blur-sm ring-1 ring-dark-brown/10 opacity-0 transition-all duration-300 hover:bg-bone-white focus-visible:opacity-100 group-hover:opacity-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-bone-white/80 text-dark-brown backdrop-blur-sm ring-1 ring-dark-brown/10 opacity-0 transition-all duration-300 hover:bg-bone-white focus-visible:opacity-100 group-hover:opacity-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {caption && (
        <p className="mt-4 text-center text-[10px] uppercase tracking-[0.3em] text-dark-brown/50 font-light">
          {caption}
        </p>
      )}

      {count > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2.5">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              className="group flex items-center justify-center py-2 px-1.5"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-6 bg-burnt-orange'
                    : 'w-2 bg-dark-brown/20 group-hover:bg-dark-brown/40'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
