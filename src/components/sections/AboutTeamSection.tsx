'use client'

import type { Locale } from '@/lib/utils'
import type { TeamMember } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface AboutTeamSectionProps {
  locale: Locale
  members: TeamMember[]
}

export function AboutTeamSection({ locale, members }: AboutTeamSectionProps) {
  if (!members.length) return null

  const sectionLabel = locale === 'ka' ? 'გუნდი' : 'The Team'
  const heading =
    locale === 'ka'
      ? 'ექიმები, რომელთა ხელშიც გადადიხართ.'
      : 'The physicians you are entrusting yourself to.'
  const subhead =
    locale === 'ka'
      ? 'ცოდნა, რომელიც ათწლეულებში დაგროვდა. ყურადღება, რომელიც ერთ პაციენტს ეთმობა.'
      : 'Knowledge built over decades. Attention given to one patient at a time.'

  return (
    <section className="relative bg-bone-white text-dark-brown py-24 md:py-40 overflow-hidden">
      {/* Subtle decorative top rule */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-24 bg-burnt-orange/40" />

      <div className="section-container">
        <div className="max-w-3xl mb-20 md:mb-28">
          <Reveal>
            <span className="block text-[11px] uppercase tracking-[0.3em] text-burnt-orange font-bold mb-6">
              {sectionLabel}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-dark-brown">
              {heading}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 text-lg md:text-xl text-dark-brown/65 leading-relaxed max-w-2xl">
              {subhead}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 lg:gap-14 items-start">
          {members.map((member, idx) => (
            <PortraitCard
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

function PortraitCard({
  locale,
  member,
  delay,
}: {
  locale: Locale
  member: TeamMember
  delay: number
}) {
  const name = (locale === 'ka' ? member.name : (member.name_en || member.name)) || ''
  const role = locale === 'ka' ? member.role_ka : member.role_en
  const tagline = locale === 'ka' ? member.tagline_ka : member.tagline_en
  const bio = locale === 'ka' ? member.bio_ka : member.bio_en
  const isFounder = member.isFounder === true
  const founderLabel = locale === 'ka' ? 'თანადამფუძნებელი' : 'Co-Founder'

  return (
    <Reveal delay={delay}>
      <article className="group flex flex-col h-full">
        {/* Portrait — identical 3:4 frame, faces anchored to upper-center */}
        <div className="relative aspect-[3/4] overflow-hidden bg-dark-brown/[0.04] mb-7">
          {member.photo?.asset?.url ? (
            <img
              src={member.photo.asset.url}
              alt={name}
              className="w-full h-full object-cover object-[center_20%] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-serif text-[7rem] text-dark-brown/15 leading-none">
                {name.charAt(0) || '·'}
              </span>
            </div>
          )}

          {isFounder && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-bone-white/95 backdrop-blur-sm">
              <span className="text-[10px] uppercase tracking-[0.25em] text-burnt-orange font-bold">
                {founderLabel}
              </span>
            </div>
          )}
        </div>

        {/* Tagline — fixed height block so hairline + name align across all cards */}
        <div className="min-h-[5.5rem] md:min-h-[6rem] mb-5">
          {tagline && (
            <p className="font-serif italic text-xl md:text-2xl leading-snug text-dark-brown">
              “{tagline}”
            </p>
          )}
        </div>

        {/* Hairline */}
        <div className="h-px w-10 bg-burnt-orange mb-5" />

        {/* Name + role — fixed slot keeps bios starting at same Y across cards */}
        <div className="min-h-[4.5rem]">
          <h3 className="font-serif text-2xl text-dark-brown leading-tight">{name}</h3>
          {role && (
            <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-dark-brown/55 font-bold">
              {role}
            </p>
          )}
        </div>

        {/* Bio */}
        {bio && (
          <p className="mt-5 text-[15px] leading-relaxed text-dark-brown/75">
            {bio}
          </p>
        )}

        {/* Credentials */}
        {member.credentials && member.credentials.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-5">
            {member.credentials.map((c, i) => (
              <span
                key={i}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark-brown/50 border border-dark-brown/15 px-2 py-0.5"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </article>
    </Reveal>
  )
}
