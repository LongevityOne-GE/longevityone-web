import type { Metadata } from 'next'
import { sanityClient, siteSettingsQuery } from '@/lib/sanity'
import type { SiteSettings } from '@/lib/sanity/types'
import { ThankYouPage } from '@/components/pages/ThankYouPage'
import { buildMetadata } from '@/lib/seo/metadata'

// Conversion confirmation. Deliberately absent from sitemap.ts and marked
// noindex: it exists so GTM can trigger on a real URL, not for search engines.
export const metadata: Metadata = buildMetadata({
  locale: 'ka',
  path: '/thank-you',
  title: 'მადლობა',
  description: 'თქვენი მოთხოვნა მიღებულია.',
  noindex: true,
})

export default async function KaThankYouPage() {
  const settings = await sanityClient.fetch<SiteSettings>(
    siteSettingsQuery,
    {},
    { next: { tags: ['sanity'] } },
  )
  return <ThankYouPage locale="ka" settings={settings ?? null} />
}
