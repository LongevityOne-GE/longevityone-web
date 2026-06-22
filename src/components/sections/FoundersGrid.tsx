'use client'

import Image from 'next/image'
import type { Locale } from '@/lib/utils'
import type { TeamMember, TeamData } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface FoundersGridProps {
  locale: Locale
  founders: TeamMember[]
  page: TeamData['page']
}

export function FoundersGrid({ locale, founders, page }: FoundersGridProps) {
  const heading = locale === 'ka' ? page?.founders_heading_ka : page?.founders_heading_en
  const subtext = locale === 'ka' ? page?.founders_subtext_ka : page?.founders_subtext_en
  const groupPhoto = page?.founders_group_photo

  if (!founders.length && !groupPhoto) return null

  return (
    <section className="py-20 md:py-32 bg-bone-white">
      <div className="section-container">
        {(heading || subtext) && (
          <div className="mb-16">
            {heading && (
              <Reveal>
                <h2 className="text-3xl md:text-4xl font-black text-dark-brown mb-4">
                  {heading}
                </h2>
              </Reveal>
            )}
            {subtext && (
              <Reveal delay={0.1}>
                <p className="text-dark-brown/70 max-w-xl">{subtext}</p>
              </Reveal>
            )}
          </div>
        )}

        {groupPhoto?.asset?.url && (
          <Reveal>
            <div className="relative mb-16 rounded-lg overflow-hidden h-[260px] sm:h-[360px] md:h-[480px]">
              <Image
                src={groupPhoto.asset.url}
                alt={heading || 'Founders'}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          </Reveal>
        )}

        {founders.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {founders.map((member, idx) => (
              <FounderCard key={member._id} locale={locale} member={member} delay={0.08 * idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function FounderCard({
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
  const specialty = locale === 'ka' ? member.specialty_ka : member.specialty_en

  return (
    <Reveal delay={delay}>
      <div className="text-center">
        <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-dark-brown/5">
          {member.photo?.asset?.url ? (
            <Image
              src={member.photo.asset.url}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl font-black text-dark-brown/20">
                {name.charAt(0) || '?'}
              </span>
            </div>
          )}
        </div>
        <h3 className="text-sm font-bold text-dark-brown leading-snug">{name}</h3>
        {role && <p className="text-xs text-burnt-orange font-bold uppercase tracking-wider mt-1">{role}</p>}
        {specialty && <p className="text-xs text-dark-brown/55 mt-1 leading-snug">{specialty}</p>}
      </div>
    </Reveal>
  )
}
