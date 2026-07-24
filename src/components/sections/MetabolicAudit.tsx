import type { Locale } from '@/lib/utils'
import type { MetabolicAuditItem } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface MetabolicAuditProps {
  locale: Locale
  items: MetabolicAuditItem[]
}

const COPY = {
  ka: {
    eyebrow: 'ერთჯერადი',
    heading: 'მეტაბოლური აუდიტი',
    unit: 'ლარი',
    bothNote: 'მოიცავს ორივე ტესტს',
  },
  en: {
    eyebrow: 'One-time',
    heading: 'Metabolic Audit',
    unit: 'GEL',
    bothNote: 'Includes both tests',
  },
} as const

function Price({ value, unit, size }: { value: number; unit: string; size: 'lg' | 'xl' }) {
  return (
    <span className="whitespace-nowrap text-burnt-orange">
      <span className={`${size === 'xl' ? 'text-4xl md:text-5xl' : 'text-2xl'} font-bold italic`}>
        {value.toLocaleString()}
      </span>{' '}
      <span className="text-xs font-sans font-bold uppercase tracking-widest not-italic">{unit}</span>
    </span>
  )
}

export function MetabolicAudit({ locale, items }: MetabolicAuditProps) {
  if (!items.length) return null
  const t = COPY[locale]

  const featured = items.find((i) => i.isFeatured) ?? items[items.length - 1]
  if (!featured) return null
  const components = items.filter((i) => i._id !== featured._id)

  const nameOf = (i: MetabolicAuditItem) => (locale === 'ka' ? i.name_ka : i.name_en) ?? ''

  return (
    <section
      id="metabolic-audit"
      className="relative isolate scroll-mt-32 py-20 md:py-28 border-t border-dark-brown/10 overflow-hidden"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      >
        <source src="/videos/metabolic-audit-bg.mp4" type="video/mp4" />
      </video>
      <div aria-hidden="true" className="absolute inset-0 bg-bone-white/55 backdrop-blur-[0.5px]" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-16 md:h-24 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(241,237,229,0) 0%, rgba(241,237,229,0.3) 60%, rgba(241,237,229,0.75) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-20 md:h-28 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(241,237,229,0) 0%, rgba(241,237,229,0.35) 40%, rgba(241,237,229,0.8) 100%)',
        }}
      />
      <div className="section-container relative z-10 max-w-5xl">
        <div className="mb-12 text-center">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.28em] text-burnt-orange font-bold mb-4">
              {t.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-dark-brown">
              {t.heading}
            </h2>
          </Reveal>
        </div>

        {/* Featured: the combined audit (primary item) */}
        {featured && featured.price != null && (
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-6 border border-burnt-orange/40 rounded-sm p-8 md:p-10 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-dark-brown">
                  {nameOf(featured)}
                </h3>
                <p className="mt-2 text-sm text-dark-brown/60">{t.bothNote}</p>
              </div>
              <div className="shrink-0">
                <Price value={featured.price} unit={t.unit} size="xl" />
              </div>
            </div>
          </Reveal>
        )}

        {/* The two component tests */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {components.map((item, idx) =>
            item.price != null ? (
              <Reveal key={item._id} delay={0.15 + idx * 0.08} className="h-full">
                <div className="h-full flex items-center justify-between gap-4 border border-dark-brown/15 rounded-sm p-7 hover:border-burnt-orange/40 transition-colors duration-300">
                  <h3 className="text-sm md:text-base font-medium text-dark-brown leading-snug">
                    {nameOf(item)}
                  </h3>
                  <Price value={item.price} unit={t.unit} size="lg" />
                </div>
              </Reveal>
            ) : null,
          )}
        </div>
      </div>
    </section>
  )
}
