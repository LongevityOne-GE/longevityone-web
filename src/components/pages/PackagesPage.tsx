'use client'

import type { Locale } from '@/lib/utils'
import type { PackagesData, HomePageData } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'
import { DiagnosticTiers } from '@/components/sections/DiagnosticTiers'
import { MembershipPlans } from '@/components/sections/MembershipPlans'
import { AddOns } from '@/components/sections/AddOns'
import { SessionPacks } from '@/components/sections/SessionPacks'

interface PackagesPageProps {
  locale: Locale
  packages: PackagesData | null
  homeData: HomePageData | null
}

export function PackagesPage({ locale, packages, homeData }: PackagesPageProps) {
  const title = locale === 'ka' ? 'პაკეტები და ფასები' : 'Packages & Pricing'
  const subtitle =
    locale === 'ka'
      ? 'მოირგეთ პროგრამა, რომელიც ზუსტად თქვენს მიზნებსა და გრაფიკს შეესაბამება.'
      : 'Choose a programme tailored to your goals and schedule.'

  return (
    <main className="flex flex-col">
      <PageHero locale={locale} title={title} subtitle={subtitle} />
      <DiagnosticTiers
        locale={locale}
        packages={packages?.diagnostic ?? []}
        heading={locale === 'ka' ? homeData?.packages_heading_ka : homeData?.packages_heading_en}
        subtext={locale === 'ka' ? homeData?.packages_subtext_ka : homeData?.packages_subtext_en}
      />
      <MembershipPlans
        locale={locale}
        memberships={packages?.memberships ?? []}
        heading={locale === 'ka' ? homeData?.membership_heading_ka : homeData?.membership_heading_en}
      />
      <AddOns locale={locale} addons={packages?.addons ?? []} />
      <SessionPacks locale={locale} sessions={packages?.sessions ?? []} />
    </main>
  )
}
