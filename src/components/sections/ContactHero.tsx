'use client'

export function ContactHero() {
  return (
    <section
      className="relative w-full overflow-hidden bg-dark-brown"
      aria-label="Longevity One contact film"
    >
      <div className="relative aspect-video w-full max-h-[100vh]">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/contact/contact-hero-poster.jpg"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/contact/contact-hero.webm" type="video/webm" />
          <source src="/videos/contact/contact-hero.mp4" type="video/mp4" />
        </video>

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
