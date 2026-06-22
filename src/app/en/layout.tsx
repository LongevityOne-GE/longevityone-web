import { sanityClient, siteSettingsQuery } from '@/lib/sanity'
import type { SiteSettings } from '@/lib/sanity/types'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CookieBanner } from '@/components/cookies/CookieBanner'
import { Analytics } from '@/components/analytics/Analytics'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationSchema, websiteSchema } from '@/lib/seo/schema'

export default async function EnLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await sanityClient.fetch<SiteSettings>(
    siteSettingsQuery, {}, { next: { tags: ['sanity'] } }
  )

  const cookieStrings = {
    title: siteSettings?.cookie_title_en ?? 'We use cookies',
    body: siteSettings?.cookie_body_en ?? 'We use cookies to improve your experience.',
    accept: siteSettings?.cookie_accept_en ?? 'Accept All',
    reject: siteSettings?.cookie_reject_en ?? 'Reject All',
    manage: siteSettings?.cookie_manage_en ?? 'Manage Preferences',
    privacyHref: '/en/legal/cookies',
  }

  return (
    <>
      <JsonLd data={[organizationSchema(siteSettings, 'en'), websiteSchema('en')]} />
      <div className="flex flex-col min-h-screen">
        <AnnouncementBar locale="en" />
        <Nav locale="en" siteSettings={siteSettings} />
        <div id="main-content" className="flex flex-col flex-1">
          {children}
        </div>
        <Footer locale="en" siteSettings={siteSettings} />
      </div>
      <CookieBanner locale="en" strings={cookieStrings} />
      <Analytics />
    </>
  )
}
