'use client'

import type { Locale } from '@/lib/utils'
import { Reveal } from '@/components/animations/Reveal'

interface SectionHeaderProps {
  locale: Locale
  eyebrowKa?: string | null
  eyebrowEn?: string | null
  titleKa?: string | null
  titleEn?: string | null
  subtitleKa?: string | null
  subtitleEn?: string | null
}

export function SectionHeader({
  locale,
  eyebrowKa,
  eyebrowEn,
  titleKa,
  titleEn,
  subtitleKa,
  subtitleEn,
}: SectionHeaderProps) {
  const eyebrow = locale === 'ka' ? eyebrowKa : eyebrowEn
  const title = locale === 'ka' ? titleKa : titleEn
  const subtitle = locale === 'ka' ? subtitleKa : subtitleEn

  if (!title) return null

  return (
    <div className="mb-16">
      {eyebrow && (
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
      )}
      <Reveal delay={0.1}>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-dark-brown mb-4">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.25}>
          <p className="text-lg font-light text-dark-brown/70 leading-relaxed">
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  )
}
