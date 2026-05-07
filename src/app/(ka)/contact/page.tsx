import type { Metadata } from 'next'
import { sanityClient, siteSettingsQuery } from '@/lib/sanity'
import type { SiteSettings } from '@/lib/sanity/types'
import { ContactPage } from '@/components/pages/ContactPage'

export const metadata: Metadata = {
  title: 'კონტაქტი',
}

export default async function KaContactPage() {
  const settings = await sanityClient.fetch<SiteSettings>(
    siteSettingsQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  return <ContactPage locale="ka" settings={settings ?? null} />
}
