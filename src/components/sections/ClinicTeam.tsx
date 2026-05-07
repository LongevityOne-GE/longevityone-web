'use client'

import type { Locale } from '@/lib/utils'
import type { TeamMember, TeamData } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface ClinicTeamProps {
  locale: Locale
  team: TeamMember[]
  page: TeamData['page']
}

export function ClinicTeam({ locale, team, page }: ClinicTeamProps) {
  if (!team.length) return null

  const heading =
    (locale === 'ka' ? page?.clinic_team_heading_ka : page?.clinic_team_heading_en) ||
    (locale === 'ka' ? 'კლინიკის გუნდი' : 'Clinic Team')

  return (
    <section className="py-20 md:py-32 bg-dark-brown text-bone-white">
      <div className="section-container">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-black font-serif text-bone-white mb-16">
            {heading}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {team.map((member, idx) => {
            const name = (locale === 'ka' ? member.name : (member.name_en || member.name)) || ''
            const role = locale === 'ka' ? member.role_ka : member.role_en
            const specialty = locale === 'ka' ? member.specialty_ka : member.specialty_en
            const bio = locale === 'ka' ? member.bio_ka : member.bio_en

            return (
              <Reveal key={member._id} delay={0.08 * idx}>
                <div className="flex gap-5">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-bone-white/10">
                    {member.photo?.asset?.url ? (
                      <img
                        src={member.photo.asset.url}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xl font-black text-bone-white/30 font-serif">
                          {name.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-sm font-bold text-bone-white leading-snug">{name}</h3>
                    {role && (
                      <p className="text-xs text-burnt-orange font-bold uppercase tracking-wider mt-1">
                        {role}
                      </p>
                    )}
                    {specialty && (
                      <p className="text-xs text-bone-white/55 mt-1 leading-snug">{specialty}</p>
                    )}
                    {bio && (
                      <p className="text-xs text-bone-white/60 mt-3 leading-relaxed line-clamp-3">
                        {bio}
                      </p>
                    )}
                    {member.credentials && member.credentials.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {member.credentials.map((c, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-bold uppercase tracking-widest text-bone-white/40 border border-bone-white/15 rounded-sm px-2 py-0.5"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
