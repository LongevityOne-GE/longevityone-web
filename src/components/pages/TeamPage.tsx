'use client'

import type { Locale } from '@/lib/utils'
import type { TeamData } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'
import { FoundersGrid } from '@/components/sections/FoundersGrid'
import { ClinicTeam } from '@/components/sections/ClinicTeam'

interface TeamPageProps {
  locale: Locale
  data: TeamData | null
}

export function TeamPage({ locale, data }: TeamPageProps) {
  const title =
    (locale === 'ka' ? data?.page?.h1_ka : data?.page?.h1_en) ||
    (locale === 'ka' ? 'ჩვენი გუნდი' : 'Our Team')

  return (
    <main className="flex flex-col">
      <PageHero locale={locale} title={title} />
      <FoundersGrid locale={locale} founders={data?.founders ?? []} page={data?.page ?? null} />
      <ClinicTeam locale={locale} team={data?.team ?? []} page={data?.page ?? null} />
    </main>
  )
}
