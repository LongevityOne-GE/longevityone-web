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
      </div>
    </section>
  )
}
