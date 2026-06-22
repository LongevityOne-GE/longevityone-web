import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import type { HomePackage, HomePageData } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { GodVideo } from '@/components/shared/GodVideo'

interface ProgrammesPreviewProps {
  locale: Locale
  packages?: HomePackage[] | null
  data?: HomePageData | null
}

export function ProgrammesPreview({ locale }: ProgrammesPreviewProps) {
  const prefix = locale === 'en' ? '/en' : ''
  const packagesHref = `${prefix}/packages`

  const headline =
    locale === 'ka'
      ? 'ინვესტიცია თქვენს მომავალში'
      : 'An investment in your future'
  const subtext =
    locale === 'ka'
      ? 'პროგრამები შემუშავებულია თქვენი ჯანმრთელობისა და დღეგრძელობის ყველა ეტაპისთვის.'
      : 'Programmes designed for every stage of your health and longevity journey.'
  const cta =
    locale === 'ka' ? 'ნახეთ პროგრამები' : 'Explore programmes'

  return (
    <section className="relative py-16 md:py-32 bg-bone-white border-y border-dark-brown/5 overflow-hidden isolate">
      {/* Blurred amphora-pour background video - clearly visible */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ filter: 'blur(6px) saturate(1.3)', transform: 'scale(1.06)' }}
      >
        <GodVideo src="/videos/amphora-pour-v2.mp4" />
      </div>

      {/* Behind-text scrim - concentrated wash directly under the headline */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at center 50%, rgba(231,222,204,0.92) 0%, rgba(231,222,204,0.7) 45%, rgba(231,222,204,0) 80%)',
        }}
      />

      {/* Soft top/bottom edge fades for smooth handoff with neighbour sections */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-24 md:h-32 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(231,222,204,0.95) 0%, rgba(231,222,204,0) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 md:h-32 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to top, rgba(231,222,204,0.95) 0%, rgba(231,222,204,0) 100%)',
        }}
      />

      <div className="section-container relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal delay={0.08}>
            <h2 className="font-black leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-6xl text-dark-brown">
              {headline}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-dark-brown/75">
              {subtext}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-10">
              <Link href={packagesHref} className="btn-primary">
                <span>{cta}</span>
                <span className="ml-3">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
