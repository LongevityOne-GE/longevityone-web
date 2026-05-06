import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityClient, servicesQuery } from '@/lib/sanity'
import type { Service } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Three science-backed preventive medicine programmes — Longevity, Metabolic Health, and Elite Performance.',
}

export default async function EnServicesIndexPage() {
  const services = await sanityClient.fetch<Service[]>(
    servicesQuery,
    {},
    { next: { tags: ['sanity'] } }
  )

  return (
    <main id="main-content" className="flex flex-col">
      <PageHero
        locale="en"
        title="Services"
        subtitle="Three science-backed programmes tailored to your health goals."
      />
      <section className="py-20 md:py-32 bg-bone-white">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                key={service._id}
                href={`/en/services/${service.slug}`}
                className="group block border border-dark-brown/10 rounded-lg p-8 hover:border-burnt-orange transition-colors duration-300"
              >
                <h2 className="text-xl font-black font-serif text-dark-brown group-hover:text-burnt-orange transition-colors duration-200 mb-4">
                  {service.title_en || service.title_ka}
                </h2>
                {(service.summary_en || service.summary_ka) && (
                  <p className="text-sm text-dark-brown/65 leading-relaxed mb-6">
                    {service.summary_en || service.summary_ka}
                  </p>
                )}
                <span className="text-xs uppercase tracking-widest font-bold text-burnt-orange">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
