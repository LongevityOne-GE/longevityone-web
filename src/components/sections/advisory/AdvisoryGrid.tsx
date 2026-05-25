import type { Locale } from '@/lib/utils'
import type { AdvisoryBoardMember } from '@/lib/sanity/types'
import { AdvisoryMemberCard } from './AdvisoryMemberCard'
import { Reveal } from '@/components/animations/Reveal'

interface AdvisoryGridProps {
  locale: Locale
  members: AdvisoryBoardMember[]
  heading?: string | null
}

/**
 * Renders a labelled grid section. If heading is null/empty the heading
 * element is suppressed (used for the combined single-section fallback).
 */
export function AdvisoryGrid({ locale, members, heading }: AdvisoryGridProps) {
  if (members.length === 0) return null

  return (
    <section className="pb-16 md:pb-24">
      {heading && (
        <Reveal className="mb-10 md:mb-14">
          <h2 className="text-[11px] uppercase tracking-[0.22em] text-dark-brown/50 font-medium border-b border-dark-brown/10 pb-4">
            {heading}
          </h2>
        </Reveal>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {members.map((member, i) => (
          <Reveal key={member._id} delay={i * 0.08}>
            <AdvisoryMemberCard locale={locale} member={member} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
