import type { Locale } from '@/lib/utils'
import type { SiteSettings, BlogPostDetail, BlogAuthor } from '@/lib/sanity/types'
import { SITE_URL, localizedUrl } from './metadata'

/** Stable @ids so all schema blocks reference one canonical entity graph. */
export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const CONTACT_PAGE_ID = `${SITE_URL}/contact#webpage`

/** Real brand wordmark (raster, 1773×676) — Organization/publisher logo. */
const BRAND_LOGO_URL = `${SITE_URL}/images/hero-brand.png`
/** Generated 1200×630 OG card — used as the organization image. */
const OG_IMAGE_URL = `${SITE_URL}/opengraph-image`

// Authoritative NAP (mirrors CLAUDE.md) — used when a Sanity field is absent.
// postalCode left blank until verified (see Phase 5 / GBP); never guessed.
const NAP = {
  name: 'Longevity One',
  phone: '+995511708888',
  email: 'info@longevityone.ge',
  street_ka: 'თამარაშვილის 4ა',
  street_en: '4a Tamarashvili St',
  city: 'Tbilisi',
  region: 'Tbilisi',
  postalCode: '',
  country: 'GE',
} as const

const ogLang = (locale: Locale) => (locale === 'ka' ? 'ka-GE' : 'en-US')

const KNOWS_ABOUT = [
  'longevity medicine',
  'preventive medicine',
  'biological age testing',
  'metabolic health',
  'VO2 Max testing',
  'microbiome testing',
  'personalized health programs',
  'executive health checkups',
  'დღეგრძელობა',
  'პრევენციული მედიცინა',
  'ბიოლოგიური ასაკი',
]

const AREA_SERVED = [
  { '@type': 'Country', name: 'Georgia' },
  { '@type': 'City', name: 'Tbilisi' },
  { '@type': 'AdministrativeArea', name: 'Tbilisi, Georgia' },
]

type Schema = Record<string, unknown>

/**
 * Extract { latitude, longitude } from a Google Maps URL. Prefers the precise
 * point (`?q=lat,lng` query or `!3dlat!4dlng` place data) over the `@lat,lng`
 * viewport centre, since the viewport can sit ~1km off the actual pin.
 */
function parseGeo(mapsUrl?: string | null): { latitude: number; longitude: number } | null {
  if (!mapsUrl) return null
  const patterns = [
    /[?&](?:q|query)=(-?\d+\.\d+),(-?\d+\.\d+)/, // ?q=lat,lng — explicit point
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, // place data lat/lng
    /@(-?\d+\.\d+),(-?\d+\.\d+)/, // @lat,lng — viewport centre (fallback)
  ]
  for (const re of patterns) {
    const m = mapsUrl.match(re)
    if (m && m[1] && m[2]) {
      return { latitude: parseFloat(m[1]), longitude: parseFloat(m[2]) }
    }
  }
  return null
}

/**
 * MedicalClinic (Organization) — the central entity. NAP from siteSettings with
 * CLAUDE.md fallbacks; opening hours are Daily 09:00–21:00 per the brand source
 * of truth. Geo coordinates are intentionally omitted until verified in Phase 5.
 */
export function organizationSchema(settings: SiteSettings | null, locale: Locale): Schema {
  const name =
    (locale === 'ka' ? settings?.clinicName_ka : settings?.clinicName_en) || NAP.name
  const description = (locale === 'ka' ? settings?.tagline_ka : settings?.tagline_en) || undefined
  const streetAddress =
    (locale === 'ka' ? settings?.address_ka : settings?.address_en) ||
    (locale === 'ka' ? NAP.street_ka : NAP.street_en)
  const image = settings?.og_image?.asset?.url
  const sameAs = [
    settings?.socialFacebook,
    settings?.socialInstagram,
    settings?.socialLinkedIn,
  ].filter((v): v is string => Boolean(v))

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': ORG_ID,
    name,
    alternateName: ['Longevity One Tbilisi', 'Longevity One Clinic', 'Longevity One Georgia'],
    url: SITE_URL,
    telephone: (settings?.phone || NAP.phone).replace(/\s+/g, ''),
    email: settings?.email || NAP.email,
    ...(description ? { description } : {}),
    image: image || OG_IMAGE_URL,
    logo: BRAND_LOGO_URL,
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality: NAP.city,
      addressRegion: NAP.region,
      ...(NAP.postalCode ? { postalCode: NAP.postalCode } : {}),
      addressCountry: NAP.country,
    },
    ...(settings?.maps_url ? { hasMap: settings.maps_url } : {}),
    ...(() => {
      const geo = parseGeo(settings?.maps_url)
      return geo ? { geo: { '@type': 'GeoCoordinates', ...geo } } : {}
    })(),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '09:00',
      closes: '21:00',
    },
    // 'PublicHealth' is the closest valid MedicalSpecialty enum member;
    // "preventive medicine" positioning lives in the description.
    medicalSpecialty: 'PublicHealth',
    availableLanguage: ['Georgian', 'English'],
    areaServed: AREA_SERVED,
    knowsAbout: KNOWS_ABOUT,
    priceRange: '$$$',
    ...(sameAs.length ? { sameAs } : {}),
  }
}

/** WebSite entity, linked to the organization as publisher. */
export function websiteSchema(locale: Locale): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: NAP.name,
    alternateName: ['Longevity One Tbilisi', 'Longevity One Clinic', 'Longevity One Georgia'],
    inLanguage: ogLang(locale),
    publisher: { '@id': ORG_ID },
  }
}

/** BreadcrumbList from locale-agnostic { name, path } items (path '/' = home). */
export function breadcrumbSchema(
  items: Array<{ name: string; path: string }>,
  locale: Locale,
): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: localizedUrl(locale, item.path),
    })),
  }
}

export function contactPageSchema(settings: SiteSettings | null, locale: Locale): Schema[] {
  const pageUrl = localizedUrl(locale, '/contact')
  const streetAddress =
    (locale === 'ka' ? settings?.address_ka : settings?.address_en) ||
    (locale === 'ka' ? NAP.street_ka : NAP.street_en)
  const phone = (settings?.phone || NAP.phone).replace(/\s+/g, '')
  const email = settings?.email || NAP.email

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      '@id': locale === 'ka' ? CONTACT_PAGE_ID : `${SITE_URL}/en/contact#webpage`,
      url: pageUrl,
      name: locale === 'ka' ? 'კონტაქტი' : 'Contact Longevity One',
      inLanguage: ogLang(locale),
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': ORG_ID },
      mainEntity: { '@id': ORG_ID },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'PostalAddress',
      '@id': `${pageUrl}#address`,
      streetAddress,
      addressLocality: NAP.city,
      addressRegion: NAP.region,
      addressCountry: NAP.country,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPoint',
      '@id': `${pageUrl}#contact-point`,
      telephone: phone,
      email,
      contactType: 'customer service',
      areaServed: AREA_SERVED,
      availableLanguage: ['Georgian', 'English'],
    },
    breadcrumbSchema(
      [
        { name: locale === 'ka' ? 'მთავარი' : 'Home', path: '/' },
        { name: locale === 'ka' ? 'კონტაქტი' : 'Contact', path: '/contact' },
      ],
      locale,
    ),
  ]
}

/**
 * Build a credentialed Person from a clinic team member (author or reviewer) —
 * the core YMYL E-E-A-T signal. Returns null when no usable name exists.
 */
function personFromContributor(
  c: BlogAuthor | null | undefined,
  locale: Locale,
): Schema | null {
  const name = (locale === 'ka' ? c?.name : c?.name_en || c?.name) || ''
  if (!name) return null
  const jobTitle = locale === 'ka' ? c?.role_ka : c?.role_en
  const specialty = locale === 'ka' ? c?.specialty_ka : c?.specialty_en
  const creds = c?.credentials
  return {
    '@type': 'Person',
    name,
    ...(jobTitle ? { jobTitle } : {}),
    ...(specialty ? { knowsAbout: specialty } : {}),
    ...(creds && creds.length
      ? {
          hasCredential: creds.map((cr) => ({
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: cr,
          })),
        }
      : {}),
    worksFor: { '@id': ORG_ID },
  }
}

/** BlogPosting for a blog article, linked to the organization as publisher. */
export function articleSchema(post: BlogPostDetail, locale: Locale): Schema {
  const headline = (locale === 'ka' ? post.title_ka : post.title_en) || ''
  const description = (locale === 'ka' ? post.excerpt_ka : post.excerpt_en) || undefined
  // Serve the cover at ≥1200px wide per Google's Article image recommendation
  // (Sanity resizes; sources below 1200px are upscaled).
  const rawImage = post.coverImage?.asset?.url
  const image = rawImage ? `${rawImage}?w=1200&auto=format&q=80` : undefined
  const updated = (post as BlogPostDetail & { _updatedAt?: string })._updatedAt

  // Author = the authoring physician (Person). Falls back to the Organization
  // only until an author is assigned in Sanity.
  const author =
    personFromContributor(post.author, locale) ??
    { '@type': 'Organization', name: NAP.name, '@id': ORG_ID }
  const reviewer = personFromContributor(post.medicalReviewer, locale)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: localizedUrl(locale, `/blog/${post.slug}`),
    headline,
    ...(description ? { description } : {}),
    ...(image ? { image } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(updated || post.publishedAt
      ? { dateModified: updated || post.publishedAt }
      : {}),
    author,
    ...(reviewer ? { reviewedBy: reviewer } : {}),
    publisher: { '@id': ORG_ID },
    inLanguage: ogLang(locale),
  }
}

/** FAQPage from question/answer pairs (already localised by the caller). */
export function faqSchema(
  items: Array<{ question: string; answer: string }>,
  locale: Locale,
): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: ogLang(locale),
    mainEntity: items
      .filter((it) => it.question && it.answer)
      .map((it) => ({
        '@type': 'Question',
        name: it.question,
        acceptedAnswer: { '@type': 'Answer', text: it.answer },
      })),
  }
}

/** Physician entries for clinic team members, affiliated with the organization. */
export function physiciansSchema(
  members: Array<{ name: string; jobTitle?: string | null; specialty?: string | null }>,
): Schema[] {
  return members
    .filter((m) => m.name)
    .map((m) => ({
      '@context': 'https://schema.org',
      '@type': 'Physician',
      name: m.name,
      ...(m.jobTitle ? { jobTitle: m.jobTitle } : {}),
      ...(m.specialty ? { medicalSpecialty: m.specialty } : {}),
      worksFor: { '@id': ORG_ID },
    }))
}

/** MedicalBusiness service offerings for the services page. */
export function servicesSchema(
  services: Array<{ name: string; description?: string | null; path: string }>,
  locale: Locale,
): Schema[] {
  return services
    .filter((s) => s.name)
    .map((s) => ({
      '@context': 'https://schema.org',
      '@type': 'MedicalProcedure',
      name: s.name,
      ...(s.description ? { description: s.description } : {}),
      url: localizedUrl(locale, s.path),
      provider: { '@id': ORG_ID },
      areaServed: AREA_SERVED,
      medicalSpecialty: 'PublicHealth',
    }))
}

/**
 * MedicalProcedure entries for the diagnostic technologies on /technologies.
 * Each links to its on-page anchor (#pnoe, #truediagnostic, …). MedicalProcedure
 * is valid for both diagnostic tests and therapies (IHHT, Red Light).
 */
export function technologiesSchema(
  technologies: Array<{ name: string; description?: string | null; anchor: string }>,
  locale: Locale,
): Schema[] {
  return technologies
    .filter((t) => t.name)
    .map((t) => ({
      '@context': 'https://schema.org',
      '@type': 'MedicalProcedure',
      name: t.name,
      ...(t.description ? { description: t.description } : {}),
      url: localizedUrl(locale, `/technologies#${t.anchor}`),
      provider: { '@id': ORG_ID },
      areaServed: AREA_SERVED,
      medicalSpecialty: 'PublicHealth',
    }))
}
