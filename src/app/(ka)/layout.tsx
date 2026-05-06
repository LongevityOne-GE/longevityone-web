import { headers } from 'next/headers'
import { sanityClient, siteSettingsQuery } from '@/lib/sanity'
import type { SiteSettings } from '@/lib/sanity/types'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

export default async function KaLayout({ children }: { children: React.ReactNode }) {
  const [siteSettings, hdrs] = await Promise.all([
    sanityClient.fetch<SiteSettings>(siteSettingsQuery, {}, { next: { tags: ['sanity'] } }),
    headers(),
  ])
  const pathname = hdrs.get('x-pathname') ?? '/'

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Nav locale="ka" siteSettings={siteSettings} pathname={pathname} />
        <div id="main-content" className="flex flex-col flex-1">
          {children}
        </div>
        <Footer locale="ka" siteSettings={siteSettings} />
      </div>
    </>
  )
}
