import type { Locale } from '@/lib/utils'
import type { PackagesData, SimplePackage } from '@/lib/sanity/types'
import { JsonLd } from '@/components/seo/JsonLd'

interface PackagesJsonLdProps {
  locale: Locale
  packages: PackagesData
}

const PROVIDER = {
  '@type': 'MedicalClinic',
  name: 'Longevity One',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '4a Tamarashvili St',
    addressLocality: 'Tbilisi',
    addressCountry: 'GE',
  },
} as const

function offer(price: number, name: string) {
  return {
    '@type': 'Offer',
    name,
    price: price,
    priceCurrency: 'GEL',
    availability: 'https://schema.org/InStock',
  }
}

function serviceNode(name: string, offers: Array<Record<string, unknown>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    provider: PROVIDER,
    areaServed: { '@type': 'City', name: 'Tbilisi' },
    ...(offers.length === 1 ? { offers: offers[0] } : { offers }),
  }
}

/** Group session docs into one Service per therapy, tiers as Offers. */
function sessionServices(sessions: SimplePackage[], locale: Locale): Array<Record<string, unknown>> {
  const groups = new Map<string, { name: string; offers: Array<Record<string, unknown>> }>()
  for (const s of sessions) {
    if (s.price == null) continue
    const key = s.tagline_en ?? s.name_en ?? s._id
    const name = (locale === 'ka' ? s.tagline_ka : s.tagline_en) ?? key
    const tier = (locale === 'ka' ? s.name_ka : s.name_en) ?? ''
    if (!groups.has(key)) groups.set(key, { name, offers: [] })
    groups.get(key)!.offers.push(offer(s.price, `${name} — ${tier}`))
  }
  return [...groups.values()].map((g) => serviceNode(g.name, g.offers))
}

/**
 * Additive Service + Offer structured data for the newly-added Metabolic Audit
 * and Individual Session pricing. Emits nothing for locales/sections without
 * data, and does not touch any pre-existing structured data on the page.
 */
export function PackagesJsonLd({ locale, packages }: PackagesJsonLdProps) {
  const nodes: Array<Record<string, unknown>> = []

  const audit = packages.metabolicAudit ?? []
  if (audit.length > 0) {
    const auditName = locale === 'ka' ? 'მეტაბოლური აუდიტი' : 'Metabolic Audit'
    const offers = audit
      .filter((i) => i.price != null)
      .map((i) => offer(i.price as number, (locale === 'ka' ? i.name_ka : i.name_en) ?? auditName))
    if (offers.length > 0) nodes.push(serviceNode(auditName, offers))
  }

  nodes.push(...sessionServices(packages.sessions ?? [], locale))

  if (nodes.length === 0) return null
  return <JsonLd data={nodes} />
}
