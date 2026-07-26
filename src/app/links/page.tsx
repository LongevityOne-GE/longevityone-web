import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Links',
  description:
    'Longevity One — preventive & integrative medicine in Tbilisi. Call the clinic, visit our website, and follow us.',
}

// Link-in-bio landing. Standalone page (uses only the minimal root layout — no
// global header/footer), styled with the shared brand theme tokens (bone-white
// / dark-brown / burnt-orange) and Mersad, instead of the source file's inline
// fonts and one-off hex palette.

const CLINIC_PHONE_DISPLAY = '+995 511 70 88 88'
const CLINIC_PHONE_HREF = 'tel:+995511708888'

interface SocialLink {
  label: string
  href: string
  icon: React.ReactNode
}

// Same official brand-mark glyphs as the site footer (src/components/layout/Footer.tsx),
// so the icons match exactly wherever they appear on the site.
const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/longevityonegeo/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/longevityonee',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@longevityonegeo',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@longevityonegeo',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
        <path d="M16.6 5.82c-1.007-.986-1.564-2.336-1.564-3.82h-3.077v14.1a2.85 2.85 0 01-5.13 1.7 2.85 2.85 0 011.98-4.87c.28 0 .55.04.81.12V9.98a6.02 6.02 0 00-.81-.06 5.99 5.99 0 00-4.24 10.23 5.99 5.99 0 0010.24-4.24V8.5a9.09 9.09 0 005.31 1.7V7.11a5.99 5.99 0 01-3.51-1.29z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/longevityone-geo',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

const linkBase =
  'group flex items-center gap-3.5 rounded-sm border px-5 py-4 text-sm font-medium tracking-[0.01em] ' +
  'transition-all duration-200 active:scale-[0.985] motion-reduce:transition-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burnt-orange focus-visible:ring-offset-2 focus-visible:ring-offset-bone-white'

export default function LinksPage() {
  return (
    <main className="flex justify-center bg-bone-white text-dark-brown">
      <div className="relative w-full max-w-[460px] overflow-hidden px-7 pb-10 pt-14">
        {/* Concentric-ring emblem — echoes the site's circular motif, quietly behind the content */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-36 -top-32 h-[380px] w-[380px]">
          <svg viewBox="0 0 380 380" className="h-full w-full">
            <circle cx="190" cy="190" r="188" fill="none" stroke="currentColor" strokeWidth="1" className="text-dark-brown opacity-[0.055]" />
            <circle cx="190" cy="190" r="150" fill="none" stroke="currentColor" strokeWidth="1" className="text-dark-brown opacity-[0.055]" />
            <circle cx="140" cy="150" r="96" fill="none" stroke="currentColor" strokeWidth="1" className="text-dark-brown opacity-[0.055]" />
          </svg>
        </div>

        <div className="relative z-10">
          {/* Crest + wordmark — always shown together per brand guidelines */}
          <div className="mb-7 flex items-center justify-center gap-3">
            <img
              src="/logos/logo-mark.svg"
              alt=""
              width={30}
              height={33}
              style={{ width: 30, height: 'auto', maxHeight: 33 }}
            />
            <span className="text-xl font-normal tracking-[0.01em] text-dark-brown">
              LongevityOne
            </span>
          </div>

          <h1 className="mb-2.5 text-center font-serif text-[34px] font-semibold leading-[1.05] tracking-[0.01em]">
            The <span className="text-burnt-orange">Art</span> of
            <br />
            Living Longer
          </h1>
          <p className="mx-auto mb-8 max-w-[300px] text-center text-[13.5px] leading-relaxed text-dark-brown/60">
            Preventive &amp; integrative medicine, Tbilisi.
          </p>

          <div aria-hidden="true" className="mx-auto mb-8 h-px w-[34px] bg-dark-brown/15" />

          <div className="flex flex-col gap-3">
            {/* Primary CTA — call. Phone is the single conversion action per brand rule. */}
            <a
              href={CLINIC_PHONE_HREF}
              className={`${linkBase} border-burnt-orange bg-burnt-orange text-bone-white hover:bg-dark-brown hover:border-dark-brown`}
            >
              <span className="flex h-[19px] w-[19px] flex-none items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <span className="flex-1">
                Call the clinic
                <span className="mt-px block text-[11.5px] font-normal text-bone-white/70">
                  {CLINIC_PHONE_DISPLAY} · 09:00–21:00 daily
                </span>
              </span>
              <span aria-hidden="true" className="flex-none opacity-60 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>

            {/* Website */}
            <a
              href="https://longevityone.ge"
              target="_blank"
              rel="noopener"
              className={`${linkBase} border-dark-brown/15 bg-white/40 text-dark-brown hover:border-burnt-orange/40 hover:bg-white/70`}
            >
              <span className="flex h-[19px] w-[19px] flex-none items-center justify-center text-dark-brown/70 transition-colors duration-200 group-hover:text-burnt-orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
                </svg>
              </span>
              <span className="flex-1">
                Visit our website
                <span className="mt-px block text-[11.5px] font-normal text-dark-brown/60">
                  Services, packages, technology
                </span>
              </span>
              <span aria-hidden="true" className="flex-none opacity-35 transition-transform duration-200 group-hover:translate-x-1 group-hover:opacity-70">→</span>
            </a>

            {/* Directions */}
            <a
              href="https://www.google.com/maps/place/LongevityOne/@41.7129569,44.7490121,706m/data=!3m2!1e3!4b1!4m6!3m5!1s0x404473b5f4bab215:0x4e60415465f27e5!8m2!3d41.7129569!4d44.7490121!16s%2Fg%2F11zgf0h5lw!5m1!1e1!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDcyMi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener"
              className={`${linkBase} border-dark-brown/15 bg-white/40 text-dark-brown hover:border-burnt-orange/40 hover:bg-white/70`}
            >
              <span className="flex h-[19px] w-[19px] flex-none items-center justify-center text-dark-brown/70 transition-colors duration-200 group-hover:text-burnt-orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
                  <path d="M12 22s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <span className="flex-1">
                Get directions
                <span className="mt-px block text-[11.5px] font-normal text-dark-brown/60">
                  Tamarashvili 4a, Tbilisi
                </span>
              </span>
              <span aria-hidden="true" className="flex-none opacity-35 transition-transform duration-200 group-hover:translate-x-1 group-hover:opacity-70">→</span>
            </a>

            {/* Email */}
            <a
              href="mailto:info@longevityone.ge"
              className={`${linkBase} border-dark-brown/15 bg-white/40 text-dark-brown hover:border-burnt-orange/40 hover:bg-white/70`}
            >
              <span className="flex h-[19px] w-[19px] flex-none items-center justify-center text-dark-brown/70 transition-colors duration-200 group-hover:text-burnt-orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
                  <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
                  <path d="M3.5 6.5l8.5 6 8.5-6" />
                </svg>
              </span>
              <span className="flex-1">
                Email us
                <span className="mt-px block text-[11.5px] font-normal text-dark-brown/60">
                  info@longevityone.ge
                </span>
              </span>
              <span aria-hidden="true" className="flex-none opacity-35 transition-transform duration-200 group-hover:translate-x-1 group-hover:opacity-70">→</span>
            </a>

            <p className="mb-1 ml-1 mt-4 text-[10.5px] uppercase tracking-[0.16em] text-dark-brown/60">
              Follow us
            </p>

            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener"
                className={`${linkBase} border-dark-brown/15 bg-white/40 text-dark-brown hover:border-burnt-orange/40 hover:bg-white/70`}
              >
                <span className="flex h-[19px] w-[19px] flex-none items-center justify-center text-dark-brown/70 transition-colors duration-200 group-hover:text-burnt-orange">
                  {link.icon}
                </span>
                <span className="flex-1">{link.label}</span>
                <span aria-hidden="true" className="flex-none opacity-35 transition-transform duration-200 group-hover:translate-x-1 group-hover:opacity-70">→</span>
              </a>
            ))}

            {/* Google review */}
            <a
              href="https://g.page/r/CeUnX0YVBOYEEBM/review"
              target="_blank"
              rel="noopener"
              className={`${linkBase} mt-4 border-dark-brown/15 bg-white/40 text-dark-brown hover:border-burnt-orange/40 hover:bg-white/70`}
            >
              <span className="flex h-[19px] w-[19px] flex-none items-center justify-center text-dark-brown/70 transition-colors duration-200 group-hover:text-burnt-orange">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
                  <path d="M12 2l2.9 6.26L21.5 9l-5 4.87L17.8 21 12 17.6 6.2 21l1.3-7.13-5-4.87 6.6-.74L12 2z" />
                </svg>
              </span>
              <span className="flex-1">
                Leave us a review
                <span className="mt-px block text-[11.5px] font-normal text-dark-brown/60">
                  Share your experience on Google
                </span>
              </span>
              <span aria-hidden="true" className="flex-none opacity-35 transition-transform duration-200 group-hover:translate-x-1 group-hover:opacity-70">→</span>
            </a>
          </div>

          <footer className="mt-11 text-center">
            <p className="text-[11.5px] leading-relaxed text-dark-brown/60">
              Tamarashvili 4a, Entrance 3, Floor 3, Apt 50, Tbilisi
            </p>
            <p className="mt-1.5 text-[11px] text-dark-brown/60 opacity-70">
              Every day, 09:00–21:00
            </p>
          </footer>
        </div>
      </div>
    </main>
  )
}
