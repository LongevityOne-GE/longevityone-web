'use client'

import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import type { Locale } from '@/lib/utils'
import type { TeamMember } from '@/lib/sanity/types'

interface TeamMemberDialogProps {
  locale: Locale
  member: TeamMember
  triggerLabel: string
}

export function TeamMemberDialog({
  locale,
  member,
  triggerLabel,
}: TeamMemberDialogProps) {
  const name = (locale === 'ka' ? member.name : (member.name_en || member.name)) || ''
  const role = locale === 'ka' ? member.role_ka : member.role_en
  const specialty = locale === 'ka' ? member.specialty_ka : member.specialty_en
  const pullQuote =
    (locale === 'ka' ? member.pullQuote_ka : member.pullQuote_en) ||
    (locale === 'ka' ? member.tagline_ka : member.tagline_en)
  const fullBio = locale === 'ka' ? member.fullBio_ka : member.fullBio_en
  const closeLabel = locale === 'ka' ? 'დახურვა' : 'Close'

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="mt-5 text-[11px] uppercase tracking-[0.18em] font-medium text-burnt-orange
                     hover:text-dark-brown transition-colors duration-200 flex items-center gap-2 group
                     border-b border-burnt-orange/30 hover:border-dark-brown/40 pb-px self-start"
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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-dark-brown/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content
          aria-describedby={`team-bio-${member._id}`}
          className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] max-w-4xl max-h-[90vh] overflow-y-auto
                     bg-bone-white border border-dark-brown/10 flex flex-col lg:flex-row
                     data-[state=open]:animate-in data-[state=closed]:animate-out
                     data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                     data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
                     data-[state=closed]:duration-200 data-[state=open]:duration-300"
        >
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
            {member.photo?.asset?.url && (
              <div className="relative w-full lg:w-[340px] flex-shrink-0 aspect-[4/5] lg:aspect-auto lg:min-h-[480px]">
                <Image
                  src={member.photo.asset.url}
                  alt={name}
                  fill
                  className="object-cover object-[center_20%]"
                  sizes="(max-width: 1024px) 100vw, 340px"
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

              {/* Name — Dialog title */}
              <Dialog.Title className="text-2xl md:text-3xl font-semibold text-dark-brown leading-snug mb-1">
                {name}
              </Dialog.Title>

              {/* Role */}
              {role && (
                <p className="text-sm text-dark-brown/80 font-medium mb-1">{role}</p>
              )}

              {/* Specialty (analogue of advisory affiliation) */}
              {specialty && (
                <p className="text-sm text-dark-brown/55 italic mb-6">{specialty}</p>
              )}

              {/* Pull quote — team-specific addition */}
              {pullQuote && (
                <blockquote className="italic text-lg md:text-xl leading-snug text-dark-brown/85 border-l-2 border-burnt-orange pl-4 my-4">
                  “{pullQuote}”
                </blockquote>
              )}

              {/* Full bio */}
              {fullBio && fullBio.length > 0 && (
                <div
                  id={`team-bio-${member._id}`}
                  className="prose prose-sm max-w-none text-dark-brown/80 leading-relaxed
                             prose-p:mb-3 prose-p:text-dark-brown/80"
                >
                  <PortableText value={fullBio as Parameters<typeof PortableText>[0]['value']} />
                </div>
              )}
            </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
