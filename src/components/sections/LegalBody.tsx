'use client'

import type { Locale } from '@/lib/utils'
import type { LegalPage } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { PortableTextRenderer } from '@/components/shared/PortableTextRenderer'

interface LegalBodyProps {
  locale: Locale
  page: LegalPage
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function LegalBody({ locale, page }: LegalBodyProps) {
  const body = locale === 'ka' ? page.body_ka : page.body_en

  return (
    <section className="py-16 md:py-24 bg-bone-white">
      <div className="section-container max-w-2xl">
        {page.lastUpdated && (
          <Reveal>
            <p className="text-xs uppercase tracking-widest font-bold text-dark-brown/40 mb-12">
              {locale === 'ka' ? 'განახლდა' : 'Last updated'}: {formatDate(page.lastUpdated)}
            </p>
          </Reveal>
        )}
        {body && body.length > 0 && (
          <Reveal delay={0.1}>
            <PortableTextRenderer value={body} />
          </Reveal>
        )}
      </div>
    </section>
  )
}
