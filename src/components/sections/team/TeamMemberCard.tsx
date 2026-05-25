'use client'

import type { Locale } from '@/lib/utils'
import type { TeamMember } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { TeamMemberDialog } from './TeamMemberDialog'

interface TeamMemberCardProps {
  locale: Locale
  member: TeamMember
  delay?: number
}

const BIO_TRIGGER = { ka: 'სრული ბიოგრაფია', en: 'Full biography' } as const

/**
 * Shared portrait card used on both /about (curated subset) and /team (full grid).
 * Visual treatment intentionally distinct from advisory board: pull-quote on top,
 * CO-FOUNDER badge for founders. Modal trigger only renders when fullBio has content.
 */
export function TeamMemberCard({ locale, member, delay = 0 }: TeamMemberCardProps) {
  const name = (locale === 'ka' ? member.name : (member.name_en || member.name)) || ''
  const role = locale === 'ka' ? member.role_ka : member.role_en
  const pullQuote =
    (locale === 'ka' ? member.pullQuote_ka : member.pullQuote_en) ||
    (locale === 'ka' ? member.tagline_ka : member.tagline_en)
  const bio = locale === 'ka' ? member.bio_ka : member.bio_en
  const fullBio = locale === 'ka' ? member.fullBio_ka : member.fullBio_en
  const hasFullBio = Array.isArray(fullBio) && fullBio.length > 0
  const isFounder = member.isFounder === true
  const founderLabel = locale === 'ka' ? 'თანადამფუძნებელი' : 'Co-Founder'

  return (
    <Reveal delay={delay}>
      <article className="group flex flex-col h-full">
        {/* Portrait - 3:4 cinematic frame, faces anchored to upper-center */}
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

        {/* Pull-quote - fixed-height block so the hairline + name align across cards */}
        <div className="min-h-[5.5rem] md:min-h-[6rem] mb-5">
          {pullQuote && (
            <p className="font-serif italic text-xl md:text-2xl leading-snug text-dark-brown">
              “{pullQuote}”
            </p>
          )}
        </div>

        {/* Hairline */}
        <div className="h-px w-10 bg-burnt-orange mb-5" />

        {/* Name + role */}
        <div className="min-h-[4.5rem]">
          <h3 className="font-serif text-2xl text-dark-brown leading-tight">{name}</h3>
          {role && (
            <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-dark-brown/55 font-bold">
              {role}
            </p>
          )}
        </div>

        {/* Short bio */}
        {bio && (
          <p className="mt-5 text-[15px] leading-relaxed text-dark-brown/75">
            {bio}
          </p>
        )}

        {/* Credentials chips */}
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

        {/* Full biography modal trigger - only when fullBio has content */}
        {hasFullBio && (
          <TeamMemberDialog
            locale={locale}
            member={member}
            triggerLabel={BIO_TRIGGER[locale]}
          />
        )}
      </article>
    </Reveal>
  )
}
