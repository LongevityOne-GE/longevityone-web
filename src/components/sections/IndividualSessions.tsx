import type { Locale } from '@/lib/utils'
import type { SimplePackage } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface IndividualSessionsProps {
  locale: Locale
  sessions: SimplePackage[]
}

interface Cell {
  count: number
  label: string
  price: number
}
interface ServiceRow {
  key: string
  label: string
  cells: Cell[]
}

function parseCount(value: string | null): number {
  const match = value?.match(/\d+/)
  return match ? Number.parseInt(match[0], 10) : 0
}

/** Group flat session docs into one row per service, columns = session counts. */
function buildRows(sessions: SimplePackage[], locale: Locale): ServiceRow[] {
  const groups = new Map<string, ServiceRow>()
  for (const s of sessions) {
    const key = s.tagline_en ?? s.name_en ?? s._id
    const label = (locale === 'ka' ? s.tagline_ka : s.tagline_en) ?? key
    const cellLabel = (locale === 'ka' ? s.name_ka : s.name_en) ?? ''
    const count = parseCount(s.name_en ?? s.name_ka)
    if (!groups.has(key)) groups.set(key, { key, label, cells: [] })
    groups.get(key)!.cells.push({ count, label: cellLabel, price: s.price ?? 0 })
  }
  const rows = [...groups.values()]
  for (const row of rows) row.cells.sort((a, b) => a.count - b.count)
  return rows
}

const COPY = {
  ka: {
    eyebrow: 'სესიები',
    heading: 'ცალკეული სესიები',
    service: 'სერვისი',
    unit: 'ლარი',
  },
  en: {
    eyebrow: 'Sessions',
    heading: 'Individual Sessions',
    service: 'Service',
    unit: 'GEL',
  },
} as const

export function IndividualSessions({ locale, sessions }: IndividualSessionsProps) {
  if (!sessions.length) return null

  const t = COPY[locale]
  const rows = buildRows(sessions, locale)
  const columns = rows[0]?.cells ?? []

  return (
    <section
      id="individual-sessions"
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
        <source src="/videos/individual-sessions-bg.mp4" type="video/mp4" />
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

        {/* ── Desktop: comparison table ── */}
        <Reveal delay={0.12}>
          <div className="hidden md:block border border-dark-brown/12 rounded-sm overflow-hidden">
            <div
              className="grid items-center bg-dark-brown/[0.04] border-b border-dark-brown/12"
              style={{ gridTemplateColumns: `1.4fr repeat(${columns.length}, 1fr)` }}
            >
              <div className="px-6 py-4 text-[11px] uppercase tracking-[0.16em] font-bold text-dark-brown/55">
                {t.service}
              </div>
              {columns.map((col) => (
                <div
                  key={col.count}
                  className="px-6 py-4 text-center text-[11px] uppercase tracking-[0.12em] font-bold text-dark-brown/70"
                >
                  {col.label}
                </div>
              ))}
            </div>
            {rows.map((row, ri) => (
              <div
                key={row.key}
                className={`grid items-center ${ri < rows.length - 1 ? 'border-b border-dark-brown/10' : ''}`}
                style={{ gridTemplateColumns: `1.4fr repeat(${columns.length}, 1fr)` }}
              >
                <div className="px-6 py-5 text-sm font-semibold text-dark-brown">{row.label}</div>
                {row.cells.map((cell) => (
                  <div key={cell.count} className="px-6 py-5 text-center">
                    <span className="text-lg font-bold text-burnt-orange italic">
                      {cell.price.toLocaleString()}
                    </span>{' '}
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-dark-brown/50 not-italic">
                      {t.unit}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── Mobile: one card per service ── */}
        <div className="md:hidden space-y-5">
          {rows.map((row, ri) => (
            <Reveal key={row.key} delay={0.08 * ri}>
              <div className="border border-dark-brown/15 rounded-sm p-6">
                <p className="text-sm font-bold text-dark-brown mb-4">{row.label}</p>
                <ul className="divide-y divide-dark-brown/10">
                  {row.cells.map((cell) => (
                    <li key={cell.count} className="flex items-center justify-between py-3">
                      <span className="text-sm text-dark-brown/70">{cell.label}</span>
                      <span className="text-base font-bold text-burnt-orange italic">
                        {cell.price.toLocaleString()}{' '}
                        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-dark-brown/50 not-italic">
                          {t.unit}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
