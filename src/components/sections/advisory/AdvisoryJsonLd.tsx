import type { Locale } from '@/lib/utils'
import type { AdvisoryBoardMember, AdvisoryBoardPage } from '@/lib/sanity/types'

interface AdvisoryJsonLdProps {
  locale: Locale
  page: AdvisoryBoardPage
  members: AdvisoryBoardMember[]
  baseUrl: string
}

/**
 * MedicalOrganization JSON-LD with medicalAdvisor array of Person objects.
 * NOT Physician schema — these are advisors, not treating clinicians.
 */
export function AdvisoryJsonLd({ locale, page, members, baseUrl }: AdvisoryJsonLdProps) {
  const pageUrl =
    locale === 'ka'
      ? `${baseUrl}/about/advisory-board`
      : `${baseUrl}/en/about/advisory-board`

  const advisors = members.map((m) => {
    const name = locale === 'ka' ? m.name_ka : m.name_en
    const jobTitle = locale === 'ka' ? m.title_ka : m.title_en
    const affiliation = locale === 'ka' ? m.affiliation_ka : m.affiliation_en
    const expertise = locale === 'ka' ? m.expertise_ka : m.expertise_en

    const person: Record<string, unknown> = {
      '@type': 'Person',
      name,
      jobTitle,
    }

    if (affiliation || m.affiliationCountry) {
      const org: Record<string, unknown> = { '@type': 'Organization' }
      if (affiliation) org.name = affiliation
      if (m.affiliationCountry) {
        org.address = {
          '@type': 'PostalAddress',
          addressCountry: m.affiliationCountry,
        }
      }
      person.affiliation = org
    }

    if (expertise && expertise.length > 0) {
      person.knowsAbout = expertise
    }

    if (m.profileUrl) {
      person.url = m.profileUrl
    }

    return person
  })

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: 'Longevity One',
    url: baseUrl,
    description:
      locale === 'ka'
        ? (page.heading_ka ?? 'სამეცნიერო საკონსულტაციო საბჭო')
        : (page.heading_en ?? 'Scientific Advisory Board'),
    mainEntityOfPage: pageUrl,
    medicalAdvisor: advisors,
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
