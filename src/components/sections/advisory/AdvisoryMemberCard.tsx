import Image from 'next/image'
import type { Locale } from '@/lib/utils'
import type { AdvisoryBoardMember } from '@/lib/sanity/types'
import { AdvisoryMemberDialog } from './AdvisoryMemberDialog'

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

const CHAIR_LABEL = { ka: 'თავმჯდომარე', en: 'Chair' } as const
const BIO_TRIGGER = { ka: 'სრული ბიოგრაფია', en: 'Full biography' } as const

export function AdvisoryMemberCard({ locale, member }: AdvisoryMemberCardProps) {
  const name = locale === 'ka' ? member.name_ka : member.name_en
  const title = locale === 'ka' ? member.title_ka : member.title_en
  const affiliation = locale === 'ka' ? member.affiliation_ka : member.affiliation_en
  const expertise = locale === 'ka' ? member.expertise_ka : member.expertise_en
  const altText =
    locale === 'ka'
      ? (member.photo?.alt_ka ?? name)
      : (member.photo?.alt_en ?? name)
  const isChair = member.boardRole === 'chair'

  return (
    <article
      className={`group bg-bone-white flex flex-col ${
        isChair ? 'border border-dark-brown/20' : 'border border-dark-brown/8'
      } transition-[border-color] duration-500 hover:border-dark-brown/30`}
    >
      {/* Portrait — 4:5 cinematic crop */}
      <div className="relative aspect-[4/5] overflow-hidden bg-dark-brown/5">
        {member.photo?.asset?.url ? (
          <Image
            src={member.photo.asset.url}
            alt={altText}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.03]"
            style={{
              objectPosition: hotspotToObjectPosition(member.photo.hotspot),
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
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

      {/* Card body */}
      <div className="flex flex-col flex-1 p-6">
        {/* Chair eyebrow — editorial restraint: small text, no badge */}
        {isChair && (
          <p className="text-[10px] uppercase tracking-[0.24em] text-dark-brown/40 font-medium mb-2">
            {CHAIR_LABEL[locale]}
          </p>
        )}

        {/* Credentials */}
        {member.credentials && member.credentials.length > 0 && (
          <p className="text-[11px] uppercase tracking-[0.18em] text-burnt-orange font-medium mb-3">
            {member.credentials.join(' · ')}
          </p>
        )}

        {/* Name */}
        <h3 className="text-xl font-serif font-semibold text-dark-brown leading-snug mb-1">
          {name}
        </h3>

        {/* Board title */}
        <p className="text-[13px] text-dark-brown/75 font-medium mb-1">{title}</p>

        {/* Affiliation */}
        {affiliation && (
          <p className="text-[12px] text-dark-brown/50 italic mb-4">{affiliation}</p>
        )}

        {/* Expertise tags */}
        {expertise && expertise.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {expertise.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-dark-brown/70
                           bg-light-blue/30 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Dialog trigger — Client Component */}
        <div className="mt-auto pt-2">
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
