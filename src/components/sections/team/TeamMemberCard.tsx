import Image from 'next/image'
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
 * Shared portrait card used on /about (curated subset) and /team (full grid).
 * Visual treatment is intentionally identical to AdvisoryMemberCard so the
 * physician roster reads as one design family across the whole site —
 * bordered frame, 4:5 cinematic portrait, top hairline ornament inside the
 * body, hover-lift with soft shadow. Content slots differ from the advisory
 * card: team cards lead with a pull-quote (founder voice), advisory cards
 * lead with credentials.
 */
function overridePullQuote(locale: Locale, quote?: string | null): string | undefined {
  if (!quote) return quote ?? undefined
  if (locale === 'ka') {
    return quote
      .replace(
        'ამერიკული სამედიცინო სტანდარტები, ქართულ მიწაზე გამოყენებული',
        'საქართველოში გამოყენებული ამერიკული სამედიცინო სტანდარტები.',
      )
      .replace('ექიმი, რომელიც კარს თვითონ გხვდებათ', 'ექიმი რომელიც გხვდებათ კარს მიღმა')
  }
  return quote
}

export function TeamMemberCard({ locale, member, delay = 0 }: TeamMemberCardProps) {
  const name = (locale === 'ka' ? member.name : (member.name_en || member.name)) || ''
  const role = locale === 'ka' ? member.role_ka : member.role_en
  const rawPullQuote =
    (locale === 'ka' ? member.pullQuote_ka : member.pullQuote_en) ||
    (locale === 'ka' ? member.tagline_ka : member.tagline_en)
  const pullQuote = overridePullQuote(locale, rawPullQuote)
  const bio = locale === 'ka' ? member.bio_ka : member.bio_en
  const fullBio = locale === 'ka' ? member.fullBio_ka : member.fullBio_en
  const hasFullBio = Array.isArray(fullBio) && fullBio.length > 0
  const isFounder = member.isFounder === true
  const founderLabel = locale === 'ka' ? 'თანადამფუძნებელი' : 'Co-Founder'

  return (
    <Reveal delay={delay} className="h-full">
      <article
        className={`group bg-bone-white flex flex-col h-full
                    transition-all duration-500 ease-out
                    hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(66,41,34,0.35)]
                    ${
                      isFounder
                        ? 'border border-dark-brown/20 hover:border-dark-brown/40'
                        : 'border border-dark-brown/10 hover:border-dark-brown/30'
                    }`}
      >
        {/* Portrait — 4:5 cinematic crop, top-anchored focus for face composition */}
        <div className="relative aspect-[4/5] overflow-hidden bg-dark-brown/[0.04]">
          {member.photo?.asset?.url ? (
            <Image
              src={member.photo.asset.url}
              alt={name}
              fill
              loading="lazy"
              className="object-cover object-[center_18%] transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[7rem] text-dark-brown/15 leading-none">
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

        {/* Card body */}
        <div className="flex flex-col flex-1 p-7 md:p-8">
          {/* Top hairline ornament — same accent used by the advisory cards */}
          <span aria-hidden="true" className="block h-px w-8 bg-burnt-orange/60 mb-5" />

          {/* Editorial pull-quote — founders' voice (skipped if no quote) */}
          {pullQuote && (
            <p className="italic text-lg md:text-xl leading-snug text-dark-brown mb-5">
              &ldquo;{pullQuote}&rdquo;
            </p>
          )}

          {/* Name */}
          <h3 className="text-xl md:text-2xl text-dark-brown leading-tight">
            {name}
          </h3>

          {/* Role */}
          {role && (
            <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-dark-brown/55 font-bold">
              {role}
            </p>
          )}

          {/* Short bio */}
          {bio && (
            <p className="mt-4 text-[14px] md:text-[15px] leading-relaxed text-dark-brown/75">
              {bio}
            </p>
          )}

          {/* Credentials chips */}
          {member.credentials && member.credentials.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {member.credentials.map((c, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark-brown/55 border border-dark-brown/15 px-2 py-0.5"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* Full biography modal trigger — anchored to the bottom of the card */}
          {hasFullBio && (
            <div className="mt-auto pt-5">
              <TeamMemberDialog
                locale={locale}
                member={member}
                triggerLabel={BIO_TRIGGER[locale]}
              />
            </div>
          )}
        </div>
      </article>
    </Reveal>
  )
}
