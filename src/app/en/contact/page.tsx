import type { Metadata } from 'next'
import { sanityClient, siteSettingsQuery } from '@/lib/sanity'
import type { SiteSettings } from '@/lib/sanity/types'
import { ContactPage } from '@/components/pages/ContactPage'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  locale: 'en',
  path: '/contact',
  title: 'Contact: Tbilisi, 4a Tamarashvili St',
  description:
    'Contact Longevity One. Address: 4a Tamarashvili St, Tbilisi · Tel: +995 511 70 88 88 · Daily 09:00–21:00.',
})

export default async function EnContactPage() {
  const settings = await sanityClient.fetch<SiteSettings>(
    siteSettingsQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  return <ContactPage locale="en" settings={settings ?? null} />
}
