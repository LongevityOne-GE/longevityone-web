import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/metadata'

/**
 * Origin robots.txt. NOTE: production `/robots.txt` is currently served by
 * Cloudflare's managed robots (which also blocks AI crawlers), so this may be
 * shadowed until that is disabled. AI crawlers are intentionally NOT blocked
 * here — Phase 6 (GEO/AI search) will enable AI access at Cloudflare.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/api/', '/monitoring'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
