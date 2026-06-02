'use client'

import type { Locale } from '@/lib/utils'
import type { ServiceDetail } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'
import { ServiceBody } from '@/components/sections/ServiceBody'
import { ServiceDifferentiator } from '@/components/sections/ServiceDifferentiator'
import { RelatedPackages } from '@/components/sections/RelatedPackages'

interface ServicePageProps {
  locale: Locale
  service: ServiceDetail | null
}

export function ServicePage({ locale, service }: ServicePageProps) {
  if (!service) {
    return (
      <main className="flex flex-col">
        <PageHero
          locale={locale}
          title={locale === 'ka' ? 'სერვისი ვერ მოიძებნა' : 'Service Not Found'}
        />
      </main>
    )
  }

  const title = locale === 'ka' ? service.title_ka : service.title_en
  const summary = locale === 'ka' ? service.summary_ka : service.summary_en
  const differentiator = locale === 'ka' ? service.differentiator_ka : service.differentiator_en

  return (
    <main className="flex flex-col">
      <PageHero
        locale={locale}
        title={title || ''}
        subtitle={summary}
      />
      <ServiceBody locale={locale} service={service} />
      <ServiceDifferentiator locale={locale} differentiator={differentiator} />
      <RelatedPackages locale={locale} packages={service.relatedPackages} />
    </main>
  )
}
