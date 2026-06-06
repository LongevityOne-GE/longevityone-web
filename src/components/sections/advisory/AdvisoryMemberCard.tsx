import Image from 'next/image'
import type { Locale } from '@/lib/utils'
import type { AdvisoryBoardMember } from '@/lib/sanity/types'
import { AdvisoryMemberDialog } from './AdvisoryMemberDialog'
import { getAdvisoryPhotoOverride, overrideAdvisoryTitle } from './photoOverrides'

interface AdvisoryMemberCardProps {
  locale: Locale
  member: AdvisoryBoardMember
}

/** Derive CSS object-position from Sanity hotspot (0–1 range → percentage). */
function hotspotToObjectPosition(
  hotspot?: { x: number; y: number } | null,
): string {
  if (!hotspot) return '50% 20%'
  return `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
}

const BIO_TRIGGER = { ka: 'სრული ბიოგრაფია', en: 'Full biography' } as const

export function AdvisoryMemberCard({ locale, member }: AdvisoryMemberCardProps) {
  const name = locale === 'ka' ? member.name_ka : member.name_en
  const rawTitle = locale === 'ka' ? member.title_ka : member.title_en
  const title = overrideAdvisoryTitle(locale, rawTitle)
  const affiliation = locale === 'ka' ? member.affiliation_ka : member.affiliation_en
  const expertise = locale === 'ka' ? member.expertise_ka : member.expertise_en
  const altText =
    locale === 'ka'
      ? (member.photo?.alt_ka ?? name)
      : (member.photo?.alt_en ?? name)
  const isChair = member.boardRole === 'chair'
  const photoOverride = getAdvisoryPhotoOverride(member)
  const photoSrc = photoOverride ?? member.photo?.asset?.url
  const blurDataURL = photoOverride ? undefined : member.photo?.asset?.metadata?.lqip

  return (
    <article
      className={`group bg-bone-white flex flex-col h-full
                  transition-all duration-500 ease-out
                  hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(66,41,34,0.35)]
                  ${
                    isChair
                      ? 'border border-dark-brown/20 hover:border-dark-brown/40'
                      : 'border border-dark-brown/10 hover:border-dark-brown/30'
                  }`}
    >
      {/* Portrait — 4:5 cinematic crop, matches team member cards */}
      <div className="relative aspect-[4/5] overflow-hidden bg-dark-brown/[0.04]">
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt={altText}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.04]"
            style={{
              objectPosition: hotspotToObjectPosition(member.photo?.hotspot),
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            placeholder={blurDataURL ? 'blur' : undefined}
            blurDataURL={blurDataURL}
          />
        ) : (
          // Placeholder when photo not yet uploaded
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-dark-brown/20 text-xs uppercase tracking-widest">
              {locale === 'ka' ? 'ფოტო მალე' : 'Photo coming'}
            </span>
          </div>
        )}
      </div>

      {/* Card body — same padding rhythm as TeamMemberCard */}
      <div className="flex flex-col flex-1 p-7 md:p-8">
        {/* Top hairline ornament */}
        <span aria-hidden="true" className="block h-px w-8 bg-burnt-orange/60 mb-5" />

        {/* Credentials */}
        {member.credentials && member.credentials.length > 0 && (
          <p className="text-[11px] uppercase tracking-[0.18em] text-burnt-orange font-medium mb-3">
            {member.credentials.join(' · ')}
          </p>
        )}

        {/* Name */}
        <h3 className="text-xl md:text-2xl font-semibold text-dark-brown leading-tight">
          {name}
        </h3>

        {/* Board title */}
        {title && (
          <p className="mt-2 text-[13px] text-dark-brown/75 font-medium">{title}</p>
        )}

        {/* Affiliation */}
        {affiliation && (
          <p className="mt-1 text-[12px] text-dark-brown/55 italic">{affiliation}</p>
        )}

        {/* Expertise tags */}
        {expertise && expertise.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {expertise.map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase tracking-[0.12em] text-dark-brown/70 bg-light-blue/30 font-medium px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Dialog trigger — anchored to the bottom of the card */}
        <div className="mt-auto pt-5">
          <AdvisoryMemberDialog
            locale={locale}
            member={member}
            triggerLabel={BIO_TRIGGER[locale]}
          />
        </div>
      </div>
    </article>
  )
}
