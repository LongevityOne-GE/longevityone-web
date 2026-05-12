'use client'

/**
 * Full-bleed cinematic intro video for the About page.
 *
 * Plays through once and rests on the final frame (the baked-in
 * "Longevity One — The Art of Living Longer" logo card). No loop —
 * the film has a clear narrative arc, so the last frame is the
 * intended resting state.
 */
export function AboutHero() {
  return (
    <section
      className="relative w-full overflow-hidden bg-dark-brown"
      aria-label="Longevity One brand film"
    >
      <div className="relative aspect-video w-full max-h-[100vh]">
        <video
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
      </div>
    </section>
  )
}
