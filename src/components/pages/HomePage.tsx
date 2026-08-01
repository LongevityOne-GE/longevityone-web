'use client'

import type { Locale } from '@/lib/utils'
import type {
  HomePageData,
  HomeService,
  HomeTech,
  HomePackage,
  HomeMembership,
  HomeFounder,
} from '@/lib/sanity/types'
import { Hero } from '@/components/sections/Hero'
import { FounderCircleBanner } from '@/components/sections/FounderCircleBanner'
import { Journey } from '@/components/sections/Journey'
import { Pillars } from '@/components/sections/Pillars'
import { Science } from '@/components/sections/Science'
import { ProgrammesPreview } from '@/components/sections/ProgrammesPreview'
import { Team } from '@/components/sections/Team'
import { ReviewsSection } from '@/components/sections/reviews/ReviewsSection'
import { CTA } from '@/components/sections/CTA'

interface HomePageProps {
  locale: Locale
  homePage?: HomePageData | null
  services?: HomeService[] | null
  technologies?: HomeTech[] | null
  packages?: HomePackage[] | null
  memberships?: HomeMembership[] | null
  founders?: HomeFounder[] | null
}

export function HomePage({
  locale,
  homePage,
  services,
  technologies,
  packages,
  founders,
}: HomePageProps) {
  return (
    <main className="flex flex-col">
      <Hero locale={locale} data={homePage} />
      <Journey locale={locale} data={homePage} />
      <Pillars locale={locale} services={services} data={homePage} />
      <FounderCircleBanner locale={locale} />
      <Science locale={locale} technologies={technologies} data={homePage} />
      <ProgrammesPreview locale={locale} packages={packages} data={homePage} />
      <Team locale={locale} data={homePage} founders={founders} />
      {/* Renders nothing until a consented review exists in content/reviews.json */}
      <ReviewsSection locale={locale} />
      <CTA locale={locale} data={homePage} />
    </main>
  )
}
