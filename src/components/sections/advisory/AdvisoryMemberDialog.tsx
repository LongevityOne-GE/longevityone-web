'use client'

import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import type { Locale } from '@/lib/utils'
import type { AdvisoryBoardMember } from '@/lib/sanity/types'
import { getAdvisoryPhotoOverride, overrideAdvisoryTitle } from './photoOverrides'

interface AdvisoryMemberDialogProps {
  locale: Locale
  member: AdvisoryBoardMember
  triggerLabel: string
}

/** Derive CSS object-position from Sanity hotspot (0–1 range → percentage). */
function hotspotToObjectPosition(
  hotspot?: { x: number; y: number } | null,
): string {
  if (!hotspot) return '50% 20%'
  return `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
}

export function AdvisoryMemberDialog({
  locale,
  member,
  triggerLabel,
}: AdvisoryMemberDialogProps) {
  const name = locale === 'ka' ? member.name_ka : member.name_en
  const rawTitle = locale === 'ka' ? member.title_ka : member.title_en
  const title = overrideAdvisoryTitle(locale, rawTitle)
  const affiliation = locale === 'ka' ? member.affiliation_ka : member.affiliation_en
  const bio = locale === 'ka' ? member.bio_ka : member.bio_en
  const altText =
    locale === 'ka'
      ? (member.photo?.alt_ka ?? name)
      : (member.photo?.alt_en ?? name)
  const photoOverride = getAdvisoryPhotoOverride(member)
  const photoSrc = photoOverride ?? member.photo?.asset?.url
  const blurDataURL = photoOverride ? undefined : member.photo?.asset?.metadata?.lqip
  const viewProfileLabel = locale === 'ka' ? 'სრული პროფილის ნახვა' : 'View full profile'
  const closeLabel = locale === 'ka' ? 'დახურვა' : 'Close'

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="mt-5 text-[11px] uppercase tracking-[0.18em] font-medium text-burnt-orange
                     hover:text-dark-brown transition-colors duration-200 flex items-center gap-2 group"
          aria-label={`${triggerLabel} - ${name}`}
        >
          {triggerLabel}
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-dark-brown/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Panel — Dialog.Content IS the modal box so Radix's
            click-outside-to-close fires properly when the user taps
            the dimmed overlay area. */}
        <Dialog.Content
          aria-describedby={`bio-${member._id}`}
          className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] max-w-4xl max-h-[90vh] overflow-y-auto
                     bg-bone-white border border-dark-brown/10 flex flex-col lg:flex-row
                     data-[state=open]:animate-in data-[state=closed]:animate-out
                     data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                     data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
                     data-[state=closed]:duration-200 data-[state=open]:duration-300"
        >
            {/* Close button */}
            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 z-10 p-2 text-dark-brown/50 hover:text-dark-brown
                           transition-colors duration-200"
                aria-label={closeLabel}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </Dialog.Close>

            {/* Portrait — left col on desktop */}
            {photoSrc && (
              <div className="relative w-full lg:w-[340px] flex-shrink-0 aspect-[4/5] lg:aspect-auto lg:min-h-[480px]">
                <Image
                  src={photoSrc}
                  alt={altText}
                  fill
                  className="object-cover"
                  style={{ objectPosition: hotspotToObjectPosition(member.photo?.hotspot) }}
                  sizes="(max-width: 1024px) 100vw, 340px"
                  placeholder={blurDataURL ? 'blur' : undefined}
                  blurDataURL={blurDataURL}
                />
              </div>
            )}

            {/* Content — right col on desktop */}
            <div className="flex flex-col p-8 lg:p-10 lg:overflow-y-auto">
              {/* Credentials */}
              {member.credentials && member.credentials.length > 0 && (
                <p className="text-[11px] uppercase tracking-[0.2em] text-burnt-orange font-medium mb-3">
                  {member.credentials.join(' · ')}
                </p>
              )}

              {/* Name — screen reader reads this as Dialog title */}
              <Dialog.Title className="text-2xl md:text-3xl font-semibold text-dark-brown leading-snug mb-1">
                {name}
              </Dialog.Title>

              {/* Title */}
              <p className="text-sm text-dark-brown/80 font-medium mb-1">{title}</p>

              {/* Affiliation */}
              {affiliation && (
                <p className="text-sm text-dark-brown/55 italic mb-6">{affiliation}</p>
              )}

              {/* Bio from Portable Text */}
              {bio && bio.length > 0 && (
                <div
                  id={`bio-${member._id}`}
                  className="prose prose-sm max-w-none text-dark-brown/80 leading-relaxed
                             prose-p:mb-3 prose-p:text-dark-brown/80"
                >
                  <PortableText value={bio as Parameters<typeof PortableText>[0]['value']} />
                </div>
              )}

              {/* External profile link */}
              {member.profileUrl && (
                <a
                  href={member.profileUrl}
                  target="_blank"
                  rel="noopener"
                  className="mt-6 self-start text-[11px] uppercase tracking-[0.18em] font-medium
                             text-dark-brown border-b border-dark-brown/30 pb-px
                             hover:text-burnt-orange hover:border-burnt-orange transition-colors duration-200"
                >
                  {viewProfileLabel} ↗
                </a>
              )}
            </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
