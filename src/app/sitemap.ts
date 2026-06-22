import type { MetadataRoute } from 'next'
import { sanityClient, blogSitemapQuery, legalSitemapQuery } from '@/lib/sanity'
import { BOOKING_ENABLED } from '@/lib/features'
import { localizedUrl, languageAlternates } from '@/lib/seo/metadata'
import type { Locale } from '@/lib/utils'

type ChangeFreq = MetadataRoute.Sitemap[number]['changeFrequency']

interface RouteDef {
  path: string
  priority: number
  changeFrequency: ChangeFreq
}

// Marketing routes present in both locales (ka default, en prefixed).
// Service detail routes (/services/[slug]) are intentionally excluded — they
// 307-redirect to /services#slug and must not appear in the sitemap.
const STATIC_ROUTES: RouteDef[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about/advisory-board', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/services', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/journey', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/packages', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/technologies', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/team', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/corporate', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/faq', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
  ...(BOOKING_ENABLED
    ? [{ path: '/booking', priority: 0.7, changeFrequency: 'monthly' as const }]
    : []),
]

const LEGAL_PAGE_TYPES = ['privacy', 'terms', 'cookies', 'medical-disclaimer'] as const
const LOCALES: Locale[] = ['ka', 'en']

/** One entry per locale for a path, each carrying the shared hreflang map. */
function localeEntries(
  path: string,
  lastModified: Date,
  changeFrequency: ChangeFreq,
  priority: number,
): MetadataRoute.Sitemap {
  const languages = languageAlternates(path)
  return LOCALES.map((locale) => ({
    url: localizedUrl(locale, path),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries = STATIC_ROUTES.flatMap((r) =>
    localeEntries(r.path, now, r.changeFrequency, r.priority),
  )

  // Published blog posts (drafts excluded via the client's 'published' perspective).
  const posts = await sanityClient
    .fetch<Array<{ slug: string; _updatedAt: string; publishedAt?: string }>>(
      blogSitemapQuery,
      {},
      { next: { tags: ['sanity'] } },
    )
    .catch(
      () => [] as Array<{ slug: string; _updatedAt: string; publishedAt?: string }>,
    )
  const blogEntries = posts
    .filter((p) => p.slug)
    .flatMap((p) =>
      localeEntries(
        `/blog/${p.slug}`,
        new Date(p._updatedAt ?? p.publishedAt ?? now),
        'monthly',
        0.5,
      ),
    )

  // Legal pages: routes are the 4 known types; lastmod comes from Sanity _updatedAt.
  const legalDocs = await sanityClient
    .fetch<Array<{ pageType: string; _updatedAt: string }>>(
      legalSitemapQuery,
      {},
      { next: { tags: ['sanity'] } },
    )
    .catch(() => [] as Array<{ pageType: string; _updatedAt: string }>)
  const legalUpdated = new Map(legalDocs.map((d) => [d.pageType, d._updatedAt]))
  const legalEntries = LEGAL_PAGE_TYPES.flatMap((pt) =>
    localeEntries(`/legal/${pt}`, new Date(legalUpdated.get(pt) ?? now), 'yearly', 0.3),
  )

  return [...staticEntries, ...blogEntries, ...legalEntries]
}
