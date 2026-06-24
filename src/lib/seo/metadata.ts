import type { Metadata } from 'next'
import type { Locale } from '@/lib/utils'

/**
 * Canonical site origin — `www`, no trailing slash. Single source of truth for
 * every absolute URL the app emits (canonical, hreflang, OG, sitemap, robots).
 * The live apex `longevityone.ge` redirects to `www`, so canonicals MUST be www
 * to avoid pointing crawlers at a redirecting host.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.longevityone.ge'
).replace(/\/+$/, '')

/** Open Graph locale codes per app locale. */
const OG_LOCALE: Record<Locale, string> = { ka: 'ka_GE', en: 'en_US' }

const DEFAULT_KEYWORDS: Record<Locale, string[]> = {
  ka: [
    'დღეგრძელობა',
    'longevity',
    'longevity clinic Georgia',
    'longevity center Tbilisi',
    'პრევენციული მედიცინა',
    'ბიოლოგიური ასაკი',
    'ჯანმრთელობის შემოწმება თბილისში',
    'პერსონალიზებული მედიცინა',
    'მეტაბოლური ჯანმრთელობა',
    'VO2 Max ტესტი',
    'მიკრობიომი',
    'Longevity One',
    'longevityone.ge',
  ],
  en: [
    'longevity Georgia',
    'longevity clinic Georgia',
    'longevity center Tbilisi',
    'preventive medicine Tbilisi',
    'biological age test Georgia',
    'executive health check Tbilisi',
    'personalized medicine Georgia',
    'metabolic health clinic',
    'VO2 Max test Tbilisi',
    'microbiome testing Georgia',
    'Longevity One',
    'longevityone.ge',
  ],
}

/**
 * Absolute canonical URL for a locale-agnostic path.
 * `path` starts with '/', e.g. '/about' or '/'. The Georgian (`ka`) locale is the
 * default and has no prefix; English (`en`) is prefixed with `/en`.
 */
export function localizedUrl(locale: Locale, path: string): string {
  // No trailing slash (matches next.config trailingSlash:false) so the sitemap
  // URL and the rendered canonical are byte-identical, incl. the bare-origin home.
  const normalized = path === '/' ? '' : `/${path.replace(/^\/+|\/+$/g, '')}`
  return locale === 'en' ? `${SITE_URL}/en${normalized}` : `${SITE_URL}${normalized}`
}

/**
 * hreflang alternates for a path: self + reciprocal + `x-default`.
 * `x-default` points at the Georgian (default, unprefixed) version.
 */
export function languageAlternates(path: string): Record<string, string> {
  return {
    ka: localizedUrl('ka', path),
    en: localizedUrl('en', path),
    'x-default': localizedUrl('ka', path),
  }
}

/**
 * Turn a raw Sanity CDN image URL into a 1200×630 social-card URL via Sanity's
 * image pipeline params. Returns undefined when no URL is given (caller then
 * falls back to the site-default OG image from app/opengraph-image.tsx).
 */
export function toOgImage(url?: string | null): string | undefined {
  if (!url) return undefined
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}w=1200&h=630&fit=crop&auto=format`
}

export interface BuildMetadataInput {
  locale: Locale
  /** Locale-agnostic route path starting with '/', e.g. '/about' or '/'. */
  path: string
  title?: string | null
  description?: string | null
  /**
   * Use the title verbatim, bypassing the root `%s | Longevity One` template.
   * Set on the homepage where the title already contains the brand.
   */
  titleAbsolute?: boolean
  /** Absolute OG image URL (e.g. a Sanity cover at 1200×630). Omit to inherit the site default. */
  image?: string | null
  /** OG type — 'website' (default) or 'article'. */
  type?: 'website' | 'article'
  keywords?: string[]
  /** ISO timestamps for article OG (blog posts). */
  publishedTime?: string | null
  modifiedTime?: string | null
}

/**
 * Build a complete, canonical, bilingual `Metadata` object: title/description,
 * self-referencing canonical, reciprocal hreflang + x-default, and Open Graph
 * (absolute url, og:locale + alternate). The single place page metadata is shaped.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  titleAbsolute = false,
  image,
  type = 'website',
  keywords,
  publishedTime,
  modifiedTime,
}: BuildMetadataInput): Metadata {
  const canonical = localizedUrl(locale, path)
  const cleanTitle = title?.trim() || undefined
  const cleanDescription = description?.trim() || undefined
  // Per-page image (e.g. a blog cover) or the site-default OG card. Set
  // explicitly because the app/opengraph-image.tsx file convention does not
  // inject og:image when a page provides its own openGraph object.
  const ogImage = image ?? `${SITE_URL}/opengraph-image`

  const openGraph: Metadata['openGraph'] = {
    type,
    url: canonical,
    locale: OG_LOCALE[locale],
    alternateLocale: locale === 'ka' ? OG_LOCALE.en : OG_LOCALE.ka,
    title: cleanTitle,
    description: cleanDescription,
    images: [{ url: ogImage, width: 1200, height: 630 }],
    ...(type === 'article'
      ? {
          publishedTime: publishedTime ?? undefined,
          modifiedTime: modifiedTime ?? undefined,
        }
      : {}),
  }

  return {
    title: cleanTitle
      ? titleAbsolute
        ? { absolute: cleanTitle }
        : cleanTitle
      : undefined,
    description: cleanDescription,
    keywords: [...DEFAULT_KEYWORDS[locale], ...(keywords ?? [])],
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph,
    twitter: { card: 'summary_large_image', images: [ogImage] },
  }
}
