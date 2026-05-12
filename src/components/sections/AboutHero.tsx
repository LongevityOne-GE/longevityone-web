'use client'

import { useEffect, useRef } from 'react'

export function AboutHero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2
    }
  }, [])

  return (
    <section
      className="relative w-full overflow-hidden bg-dark-brown"
      aria-label="Longevity One brand film"
    >
      <div className="relative aspect-video w-full max-h-[100vh]">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="metadata"
          poster="/images/about/about-hero-poster.jpg"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/about/about-hero.webm" type="video/webm" />
          <source src="/videos/about/about-hero.mp4" type="video/mp4" />
        </video>

        {/* Soft fade into the next section so the transition feels deliberate */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-b from-transparent to-bone-white pointer-events-none"
          aria-hidden="true"
        />

        {/* Scroll cue */}
        <div className="absolute bottom-10 inset-x-0 flex justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-1 animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/60"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
