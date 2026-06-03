import type { Locale } from '@/lib/utils'
import type { SimplePackage } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface SessionPacksProps {
  locale: Locale
  sessions: SimplePackage[]
}

interface Cell {
  count: number
  label: string
  price: number
  saving: number // percent, 0 if none
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
    const price = s.price ?? 0
    if (!groups.has(key)) groups.set(key, { key, label, cells: [] })
    groups.get(key)!.cells.push({ count, label: cellLabel, price, saving: 0 })
  }
  const rows = [...groups.values()]
  for (const row of rows) {
    row.cells.sort((a, b) => a.count - b.count)
    const base = row.cells[0]
    if (base && base.count > 0) {
      const perUnit = base.price / base.count
      for (const cell of row.cells) {
        const expected = perUnit * cell.count
        const saving = expected > 0 ? 1 - cell.price / expected : 0
        cell.saving = saving > 0.005 ? Math.round(saving * 100) : 0
      }
    }
  }
  return rows
}

export function SessionPacks({ locale, sessions }: SessionPacksProps) {
  if (!sessions.length) return null

  const rows = buildRows(sessions, locale)
  const columns = rows[0]?.cells ?? []
  const gel = locale === 'ka' ? 'ლარი' : 'GEL'

  const eyebrow = locale === 'ka' ? 'ცალკეული სესიები' : 'Separate sessions'
  const heading = locale === 'ka' ? 'სესიების პაკეტები' : 'Session Packs'
  const subtext =
    locale === 'ka'
      ? 'მეტი სესია — მეტი დაზოგვა. ფასები ერთ სესიაზე მცირდება პაკეტის ზრდასთან ერთად.'
      : 'The more sessions you book, the lower the per-session price.'

  return (
    <section
      id="sessions"
      className="relative isolate scroll-mt-32 py-20 md:py-28 border-t border-dark-brown/10 overflow-hidden"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none opacity-15 mix-blend-multiply"
      >
        <source src="/videos/DNA_boomerang.webm" type="video/webm" />
        <source src="/videos/DNA_boomerang.mp4" type="video/mp4" />
      </video>
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(241,237,229,0.92) 0%, rgba(241,237,229,0.65) 20%, rgba(241,237,229,0.65) 80%, rgba(241,237,229,0.94) 100%)',
        }}
      />
      <div className="section-container relative z-10 max-w-5xl">
        <div className="mb-12 text-center">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.28em] text-burnt-orange font-bold mb-4">
              {eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-dark-brown mb-4">
              {heading}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-dark-brown/70 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              {subtext}
            </p>
          </Reveal>
        </div>

        {/* ── Desktop: comparison table ── */}
        <Reveal delay={0.12}>
          <div className="hidden md:block border border-dark-brown/12 rounded-sm overflow-hidden">
            {/* Header row */}
            <div
              className="grid items-center bg-dark-brown/[0.04] border-b border-dark-brown/12"
              style={{ gridTemplateColumns: `1.4fr repeat(${columns.length}, 1fr)` }}
            >
              <div className="px-6 py-4 text-[11px] uppercase tracking-[0.16em] font-bold text-dark-brown/55">
                {locale === 'ka' ? 'სერვისი' : 'Service'}
              </div>
              {columns.map((col) => (
                <div key={col.count} className="px-6 py-4 text-center">
                  <span className="block text-[11px] uppercase tracking-[0.12em] font-bold text-dark-brown/70">
                    {col.label}
                  </span>
                  {col.saving > 0 && (
                    <span className="mt-1 inline-block text-[10px] font-bold text-burnt-orange">
                      −{col.saving}%
                    </span>
                  )}
                </div>
              ))}
            </div>
            {/* Service rows */}
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
                      {gel}
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
                      <span className="text-sm text-dark-brown/70">
                        {cell.label}
                        {cell.saving > 0 && (
                          <span className="ml-2 text-[10px] font-bold text-burnt-orange">
                            −{cell.saving}%
                          </span>
                        )}
                      </span>
                      <span className="text-base font-bold text-burnt-orange italic">
                        {cell.price.toLocaleString()}{' '}
                        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-dark-brown/50 not-italic">
                          {gel}
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
