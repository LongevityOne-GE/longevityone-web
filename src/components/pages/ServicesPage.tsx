'use client'

import type { Locale } from '@/lib/utils'
import type { ServiceDetail } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'
import { ServiceSideNav } from '@/components/sections/ServiceSideNav'
import { ServiceSection } from '@/components/sections/ServiceSection'

interface ServicesPageProps {
  locale: Locale
  services: ServiceDetail[]
}

export function ServicesPage({ locale, services }: ServicesPageProps) {
  const title = locale === 'ka' ? 'სერვისები' : 'Services'
  const subtitle =
    locale === 'ka'
      ? 'სამ მეცნიერებაზე დაფუძნებული პროგრამა, რომელიც მორგებულია თქვენი ჯანმრთელობის მიზნებზე.'
      : 'Three science-backed programmes tailored to your health goals.'

  return (
    <main id="main-content" className="flex flex-col">
      <PageHero locale={locale} title={title} subtitle={subtitle} />
      <ServiceSideNav locale={locale} services={services} />
      {services.map((service, idx) => (
        <ServiceSection key={service._id} locale={locale} service={service} index={idx} />
      ))}
    </main>
  )
}
