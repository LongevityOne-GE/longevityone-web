import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/metadata'

/**
 * Origin robots.txt. NOTE: production `/robots.txt` is currently served by
 * Cloudflare's managed robots (which also blocks AI crawlers), so this may be
 * shadowed until that is disabled. AI crawlers are intentionally NOT blocked
 * here — Phase 6 (GEO/AI search) will enable AI access at Cloudflare.
 */
// AI / answer-engine crawlers we explicitly welcome for GEO (Phase 6). These
// are allowed at the origin; the live block (if any) is enforced at Cloudflare.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Amazonbot',
  'Bytespider',
  'cohere-ai',
]

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/studio', '/api/', '/monitoring']
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
      // Explicitly allow AI crawlers to access public content (excludes the
      // same private paths). Signals intent at the origin for GEO/AI search.
      {
        userAgent: AI_CRAWLERS,
        allow: '/',
        disallow,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
