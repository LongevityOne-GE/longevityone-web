'use client'

import type { Locale } from '@/lib/utils'
import type { PackagesData, HomePageData } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'
import { PackagesNav, type PackagesNavItem } from '@/components/sections/packages/PackagesNav'
import { PricingJourney } from '@/components/sections/packages/PricingJourney'
import { PackagesClosingCta } from '@/components/sections/packages/PackagesClosingCta'
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
  const title = locale === 'ka' ? 'ჩვენი პროგრამები' : 'Our Programmes'
  const subtitle =
    locale === 'ka'
      ? 'კონკრეტულ მიზნებზე მორგებული სამედიცინო და ტექნოლოგიური პროტოკოლები თქვენი ცხოვრების ხარისხის გასაუმჯობესებლად.'
      : 'Medical and technological protocols tailored to your specific goals, designed to enhance your quality of life.'

  const hasDiagnostic = (packages?.diagnostic?.length ?? 0) > 0
  const hasMemberships = (packages?.memberships?.length ?? 0) > 0
  const hasAddons = (packages?.addons?.length ?? 0) > 0
  const hasSessions = (packages?.sessions?.length ?? 0) > 0

  // Build navigator only from sections that actually have content.
  const navItems: PackagesNavItem[] = [
    hasDiagnostic && { id: 'diagnostics', label: locale === 'ka' ? 'დიაგნოსტიკა' : 'Diagnostics' },
    // hasMemberships && { id: 'memberships', label: locale === 'ka' ? 'წევრობა' : 'Memberships' },
    hasAddons && { id: 'add-ons', label: locale === 'ka' ? 'დამატებები' : 'Add-ons' },
    // hasSessions && { id: 'sessions', label: locale === 'ka' ? 'სესიები' : 'Sessions' },
  ].filter((x): x is PackagesNavItem => Boolean(x))

  return (
    <main className="flex flex-col">
      <PageHero locale={locale} title={title} subtitle={subtitle} />

      <PricingJourney locale={locale} />

      <DiagnosticTiers
        locale={locale}
        packages={packages?.diagnostic ?? []}
        heading={locale === 'ka' ? homeData?.packages_heading_ka : homeData?.packages_heading_en}
        subtext={locale === 'ka' ? homeData?.packages_subtext_ka : homeData?.packages_subtext_en}
      />
      {/* 
      <MembershipPlans
        locale={locale}
        memberships={packages?.memberships ?? []}
        heading={locale === 'ka' ? homeData?.membership_heading_ka : homeData?.membership_heading_en}
      />
      */}
      <AddOns locale={locale} addons={packages?.addons ?? []} />
      {/* 
      <SessionPacks locale={locale} sessions={packages?.sessions ?? []} />
      */}

      <PackagesClosingCta locale={locale} />
    </main>
  )
}
