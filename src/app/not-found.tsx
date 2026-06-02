import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityClient, siteSettingsQuery } from '@/lib/sanity'
import type { SiteSettings } from '@/lib/sanity/types'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Logo } from '@/components/shared/Logo'

export const metadata: Metadata = {
  title: 'გვერდი ვერ მოიძებნა | 404',
}

export default async function NotFound() {
  const settings = await sanityClient.fetch<SiteSettings>(
    siteSettingsQuery, {}, { next: { tags: ['sanity'] } }
  )

  const h1 = settings?.notFound_h1_ka || 'გვერდი ვერ მოიძებნა'
  const body = settings?.notFound_body_ka || 'სამწუხაროდ, თქვენ მიერ მოძიებული გვერდი არ არსებობს.'
  const cta = settings?.notFound_cta_ka || 'მთავარ გვერდზე დაბრუნება'

  return (
    <div className="flex flex-col min-h-screen">
      <Nav locale="ka" siteSettings={settings} />
      <main id="main-content" className="flex-1 bg-bone-white flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-10 opacity-60">
          <Logo />
        </div>

        <p className="text-8xl font-black text-dark-brown/10 mb-6 leading-none">404</p>

        <h1 className="text-2xl md:text-3xl font-black text-dark-brown mb-4">{h1}</h1>
        <p className="text-sm text-dark-brown/60 max-w-sm mb-10 leading-relaxed">{body}</p>

        <Link href="/" className="btn-primary">
          {cta}
        </Link>
      </main>
      <Footer locale="ka" siteSettings={settings} />
    </div>
  )
}
