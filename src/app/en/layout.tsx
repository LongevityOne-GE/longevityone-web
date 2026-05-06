import { headers } from 'next/headers'
import { sanityClient, siteSettingsQuery } from '@/lib/sanity'
import type { SiteSettings } from '@/lib/sanity/types'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

export default async function EnLayout({ children }: { children: React.ReactNode }) {
  const [siteSettings, hdrs] = await Promise.all([
    sanityClient.fetch<SiteSettings>(siteSettingsQuery, {}, { next: { tags: ['sanity'] } }),
    headers(),
  ])
  const pathname = hdrs.get('x-pathname') ?? '/en'

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Nav locale="en" siteSettings={siteSettings} pathname={pathname} />
        <div id="main-content" className="flex flex-col flex-1">
          {children}
        </div>
        <Footer locale="en" siteSettings={siteSettings} />
      </div>
    </>
  )
}
