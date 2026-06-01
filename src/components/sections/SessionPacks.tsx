'use client'

import type { Locale } from '@/lib/utils'
import type { SimplePackage } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface SessionPacksProps {
  locale: Locale
  sessions: SimplePackage[]
}

export function SessionPacks({ locale, sessions }: SessionPacksProps) {
  if (!sessions.length) return null

  const heading = locale === 'ka' ? 'სესიების პაკეტები' : 'Session Packs'

  return (
    <section className="py-20 md:py-28 bg-bone-white border-t border-dark-brown/10">
      <div className="section-container max-w-3xl">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-black text-dark-brown mb-10">
            {heading}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sessions.map((session, idx) => {
            const name = locale === 'ka' ? session.name_ka : session.name_en
            const priceLabel = locale === 'ka' ? session.priceLabel_ka : session.priceLabel_en
            return (
              <Reveal key={session._id} delay={0.08 * idx}>
                <div className="border border-dark-brown/15 rounded-sm p-6 hover:border-burnt-orange/40 transition-colors duration-300">
                  <p className="text-sm font-bold text-dark-brown mb-3">{name}</p>
                  <p className="text-2xl font-bold text-burnt-orange italic">
                    {session.price != null ? (
                      <>
                        {session.price.toLocaleString()}{' '}
                        <span className="text-xs font-sans font-bold uppercase tracking-widest not-italic">{locale === 'ka' ? 'ლარი' : 'GEL'}</span>
                      </>
                    ) : priceLabel}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
