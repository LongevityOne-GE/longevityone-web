'use client'

import type { Locale } from '@/lib/utils'
import type { TeamMember } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { TeamMemberCard } from './team/TeamMemberCard'

interface AboutTeamSectionProps {
  locale: Locale
  members: TeamMember[]
}

export function AboutTeamSection({ locale, members }: AboutTeamSectionProps) {
  if (!members.length) return null

  const heading = locale === 'ka' ? 'Longevity One-ის გუნდი' : 'The Longevity One Team'

  return (
    <section className="relative bg-bone-white text-dark-brown py-20 md:py-28 overflow-hidden">
      {/* Subtle decorative top rule */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-24 bg-burnt-orange/40" />

      <div className="section-container">
        <Reveal>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-dark-brown text-center mb-14 md:mb-20">
            {heading}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 lg:gap-14 items-start">
          {members.map((member, idx) => (
            <TeamMemberCard
              key={member._id}
              locale={locale}
              member={member}
              delay={0.1 * idx}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
