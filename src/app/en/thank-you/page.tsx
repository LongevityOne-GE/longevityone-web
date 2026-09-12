import type { Metadata } from 'next'
import { sanityClient, siteSettingsQuery } from '@/lib/sanity'
import type { SiteSettings } from '@/lib/sanity/types'
import { ThankYouPage } from '@/components/pages/ThankYouPage'
import { buildMetadata } from '@/lib/seo/metadata'

// Conversion confirmation. Deliberately absent from sitemap.ts and marked
// noindex: it exists so GTM can trigger on a real URL, not for search engines.
export const metadata: Metadata = buildMetadata({
  locale: 'en',
  path: '/thank-you',
  title: 'Thank You',
  description: 'We have received your request.',
  noindex: true,
})

export default async function EnThankYouPage() {
  const settings = await sanityClient.fetch<SiteSettings>(
    siteSettingsQuery,
    {},
    { next: { tags: ['sanity'] } },
  )
  return <ThankYouPage locale="en" settings={settings ?? null} />
}
