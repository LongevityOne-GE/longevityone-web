import type { MetadataRoute } from 'next'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.longevityone.ge'

// Marketing-page routes that should appear in both locales (ka default, en prefixed).
const LOCALE_ROUTES: Array<{
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
}> = [
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
  { path: '/booking', priority: 0.7, changeFrequency: 'monthly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return LOCALE_ROUTES.flatMap((route) => [
    {
      url: `${SITE_URL}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          ka: `${SITE_URL}${route.path}`,
          en: `${SITE_URL}/en${route.path === '/' ? '' : route.path}`,
        },
      },
    },
    {
      url: `${SITE_URL}/en${route.path === '/' ? '' : route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          ka: `${SITE_URL}${route.path}`,
          en: `${SITE_URL}/en${route.path === '/' ? '' : route.path}`,
        },
      },
    },
  ])
}
