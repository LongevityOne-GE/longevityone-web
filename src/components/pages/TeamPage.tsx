'use client'

import Link from 'next/link'
import type { Locale } from '@/lib/utils'
import type { TeamData } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'
import { TeamGrid } from '@/components/sections/team/TeamGrid'

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

  const founders = data?.founders ?? []
  const team = data?.team ?? []
  const page = data?.page ?? null

  const foundersHeading = locale === 'ka' ? page?.founders_heading_ka : page?.founders_heading_en
  const foundersSubtext = locale === 'ka' ? page?.founders_subtext_ka : page?.founders_subtext_en
  const clinicHeading =
    (locale === 'ka' ? page?.clinic_team_heading_ka : page?.clinic_team_heading_en) ||
    (locale === 'ka' ? 'კლინიკის გუნდი' : 'Clinic Team')

  return (
    <main className="flex flex-col">
      <PageHero locale={locale} title={title} />

      <section className="bg-bone-white py-16 md:py-24">
        <div className="section-container">
          <TeamGrid
            locale={locale}
            members={founders}
            heading={foundersHeading || (locale === 'ka' ? 'დამფუძნებლები' : 'The Founders')}
            subtext={foundersSubtext}
          />
          <TeamGrid
            locale={locale}
            members={team}
            heading={clinicHeading}
          />
        </div>
      </section>

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
