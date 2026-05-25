'use client'

import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import type { TeamData } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'
import { FoundersGrid } from '@/components/sections/FoundersGrid'
import { ClinicTeam } from '@/components/sections/ClinicTeam'

interface TeamPageProps {
  locale: Locale
  data: TeamData | null
}

const ADVISORY_COPY = {
  ka: {
    label: 'სამეცნიერო საკონსულტაციო საბჭოს ნახვა',
    href: '/about/advisory-board',
  },
  en: {
    label: 'View our advisory board',
    href: '/about/advisory-board',
  },
} as const

export function TeamPage({ locale, data }: TeamPageProps) {
  const title =
    (locale === 'ka' ? data?.page?.h1_ka : data?.page?.h1_en) ||
    (locale === 'ka' ? 'ჩვენი გუნდი' : 'Our Team')

  const prefix = locale === 'en' ? '/en' : ''
  const { label, href } = ADVISORY_COPY[locale]

  return (
    <main className="flex flex-col">
      <PageHero locale={locale} title={title} />
      <FoundersGrid locale={locale} founders={data?.founders ?? []} page={data?.page ?? null} />
      <ClinicTeam locale={locale} team={data?.team ?? []} page={data?.page ?? null} />

      {/* Cross-link to advisory board */}
      <div className="bg-bone-white border-t border-dark-brown/8 py-12 md:py-16">
        <div className="section-container text-center">
          <Link
            href={`${prefix}${href}`}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-medium
                       text-dark-brown/60 hover:text-burnt-orange transition-colors duration-200 group"
          >
            {label}
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </main>
  )
}
