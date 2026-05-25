import type { Locale } from '@/lib/utils'
import type { TeamMember } from '@/lib/sanity/types'
import { TeamMemberCard } from './TeamMemberCard'

interface TeamGridProps {
  locale: Locale
  members: TeamMember[]
  heading?: string | null
  subtext?: string | null
}

/** Plain grid wrapper rendering TeamMemberCard with consistent spacing. */
export function TeamGrid({ locale, members, heading, subtext }: TeamGridProps) {
  if (!members.length) return null

  return (
    <section className="pb-16 md:pb-24">
      {(heading || subtext) && (
        <div className="mb-12 md:mb-16">
          {heading && (
            <h2 className="font-serif text-3xl md:text-4xl text-dark-brown mb-4">
              {heading}
            </h2>
          )}
          {subtext && (
            <p className="text-dark-brown/70 max-w-xl">{subtext}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 lg:gap-14 items-start">
        {members.map((member, idx) => (
          <TeamMemberCard
            key={member._id}
            locale={locale}
            member={member}
            delay={0.08 * idx}
          />
        ))}
      </div>
    </section>
  )
}
