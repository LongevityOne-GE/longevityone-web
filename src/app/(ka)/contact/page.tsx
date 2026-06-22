import type { Metadata } from 'next'
import { sanityClient, siteSettingsQuery } from '@/lib/sanity'
import type { SiteSettings } from '@/lib/sanity/types'
import { ContactPage } from '@/components/pages/ContactPage'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  locale: 'ka',
  path: '/contact',
  title: 'კონტაქტი — თბილისი, თამარაშვილის 4ა',
  description:
    'დაგვიკავშირდით Longevity One-ს. მისამართი: თამარაშვილის 4ა, თბილისი · ტელ: +995 511 70 88 88 · ყოველდღე 09:00–21:00.',
})

export default async function KaContactPage() {
  const settings = await sanityClient.fetch<SiteSettings>(
    siteSettingsQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  return <ContactPage locale="ka" settings={settings ?? null} />
}
