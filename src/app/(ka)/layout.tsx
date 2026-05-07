import { sanityClient, siteSettingsQuery } from '@/lib/sanity'
import type { SiteSettings } from '@/lib/sanity/types'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CookieBanner } from '@/components/cookies/CookieBanner'
import { Analytics } from '@/components/analytics/Analytics'

export default async function KaLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await sanityClient.fetch<SiteSettings>(
    siteSettingsQuery, {}, { next: { tags: ['sanity'] } }
  )

  const cookieStrings = {
    title: siteSettings?.cookie_title_ka ?? 'ჩვენ ვიყენებთ ქუქი-ფაილებს',
    body: siteSettings?.cookie_body_ka ?? 'ჩვენ ვიყენებთ ქუქი-ფაილებს თქვენი გამოცდილების გასაუმჯობესებლად.',
    accept: siteSettings?.cookie_accept_ka ?? 'ყველას მიღება',
    reject: siteSettings?.cookie_reject_ka ?? 'უარყოფა',
    manage: siteSettings?.cookie_manage_ka ?? 'პარამეტრები',
    privacyHref: '/legal/privacy',
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Nav locale="ka" siteSettings={siteSettings} />
        <div id="main-content" className="flex flex-col flex-1">
          {children}
        </div>
        <Footer locale="ka" siteSettings={siteSettings} />
      </div>
      <CookieBanner locale="ka" strings={cookieStrings} />
      <Analytics />
    </>
  )
}
