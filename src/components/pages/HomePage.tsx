'use client'

import type { Locale } from '@/lib/utils'
import type {
  HomePageData,
  HomeService,
  HomeTech,
  HomePackage,
  HomeMembership,
} from '@/lib/sanity/types'
import { Hero } from '@/components/sections/Hero'
import { Journey } from '@/components/sections/Journey'
import { Pillars } from '@/components/sections/Pillars'
import { Science } from '@/components/sections/Science'
import { Pricing } from '@/components/sections/Pricing'
import { Team } from '@/components/sections/Team'
import { CTA } from '@/components/sections/CTA'

interface HomePageProps {
  locale: Locale
  homePage?: HomePageData | null
  services?: HomeService[] | null
  technologies?: HomeTech[] | null
  packages?: HomePackage[] | null
  memberships?: HomeMembership[] | null
}

export function HomePage({
  locale,
  homePage,
  services,
  technologies,
  packages,
}: HomePageProps) {
  return (
    <main className="flex flex-col">
      <Hero locale={locale} data={homePage} />
      <Journey locale={locale} data={homePage} />
      <Pillars locale={locale} services={services} data={homePage} />
      <Science locale={locale} technologies={technologies} data={homePage} />
      <Pricing locale={locale} packages={packages} data={homePage} />
      <Team locale={locale} data={homePage} />
      <CTA locale={locale} data={homePage} />
    </main>
  )
}
