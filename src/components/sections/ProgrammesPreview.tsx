import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import type { HomePackage, HomePageData } from '@/lib/sanity/types'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Reveal } from '@/components/animations/Reveal'

interface ProgrammesPreviewProps {
  locale: Locale
  packages?: HomePackage[] | null
  data?: HomePageData | null
}

export function ProgrammesPreview({ locale, packages, data }: ProgrammesPreviewProps) {
  const prefix = locale === 'en' ? '/en' : ''
  const packagesHref = `${prefix}/packages`
  const pkgs = packages ?? []

  const viewAll =
    locale === 'ka'
      ? 'ნახე ყველა პროგრამა და ფასი'
      : 'Explore programmes & pricing'
  const learnMore = locale === 'ka' ? 'გაიგე მეტი' : 'Learn more'

  return (
    <section className="relative py-16 md:py-32 bg-bone-white border-y border-dark-brown/5 overflow-hidden isolate">
      {/* Blurred amphora-pour background video — clearly visible */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ filter: 'blur(6px) saturate(1.3)', transform: 'scale(1.06)' }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-100"
        >
          <source src="/videos/amphora-pour-v2.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Behind-text scrims only — keep the rest of the video fully clear */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 28% at center 18%, rgba(231,222,204,0.85) 0%, rgba(231,222,204,0) 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 35% at center 65%, rgba(231,222,204,0.7) 0%, rgba(231,222,204,0) 70%)',
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

      <div className="section-container relative z-10 text-center mb-16 md:mb-20">
        <SectionHeader
          locale={locale}
          titleKa={data?.packages_heading_ka}
          titleEn={data?.packages_heading_en}
          subtitleKa={data?.packages_subtext_ka}
          subtitleEn={data?.packages_subtext_en}
        />
      </div>

      {pkgs.length > 0 && (
        <div className="section-container relative z-10">
          {/* Lightweight programmes strip — name + tagline only, no per-item CTA */}
          <ul className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dark-brown/10 border-y border-dark-brown/10">
            {pkgs.map((pkg, idx) => {
              const name = locale === 'ka' ? pkg.name_ka : pkg.name_en
              const includes = (locale === 'ka' ? pkg.includes_ka : pkg.includes_en) ?? []
              const tagline = includes[0] ?? null

              return (
                <Reveal key={pkg._id} delay={0.1 * idx}>
                  <li className="py-10 md:py-14 px-6 md:px-10 text-left h-full">
                    <span
                      aria-hidden="true"
                      className="block text-xs font-bold tracking-[0.3em] text-burnt-orange/80 mb-5"
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black font-serif text-dark-brown leading-tight mb-4">
                      {name}
                    </h3>
                    {tagline && (
                      <p className="text-base text-dark-brown/70 leading-relaxed max-w-sm mb-6">
                        {tagline}
                      </p>
                    )}
                    <Link
                      href={packagesHref}
                      className="inline-flex items-center gap-2 group/link text-burnt-orange text-xs uppercase tracking-[0.2em] font-bold"
                    >
                      <span className="border-b border-transparent group-hover/link:border-burnt-orange transition-colors duration-300">
                        {learnMore}
                      </span>
                      <span className="leading-none transition-transform duration-300 group-hover/link:translate-x-1">
                        →
                      </span>
                    </Link>
                  </li>
                </Reveal>
              )
            })}
          </ul>

          {/* Single section-level CTA → /packages */}
          <Reveal delay={0.25}>
            <div className="text-center mt-14 md:mt-20">
              <Link
                href={packagesHref}
                className="inline-flex items-center gap-3 group text-dark-brown"
              >
                <span className="h-px w-8 bg-burnt-orange transition-all duration-300 group-hover:w-14" />
                <span className="text-xs uppercase tracking-[0.3em] font-bold">
                  {viewAll}
                </span>
                <span className="text-burnt-orange text-lg leading-none transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      )}
    </section>
  )
}
