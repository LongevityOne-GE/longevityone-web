import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { mersad, fontGeorgian } from './fonts'
import { SITE_URL } from '@/lib/seo/metadata'
import './globals.css'

export const metadata: Metadata = {
  // Canonical origin is `www` — every relative URL (incl. the default OG image
  // from app/opengraph-image.tsx) resolves against this host.
  metadataBase: new URL(SITE_URL),
  applicationName: 'Longevity One',
  creator: 'Longevity One',
  publisher: 'Longevity One',
  category: 'health',
  manifest: '/manifest.webmanifest',
  title: {
    default: 'Longevity One - პრევენციული მედიცინის ცენტრი, თბილისი',
    template: '%s | Longevity One',
  },
  description:
    'Longevity One - პრევენციული მედიცინის ცენტრი თბილისში. მოწინავე დიაგნოსტიკა, პერსონალიზებული პროგრამები, სამეცნიერო სიზუსტე.',
  openGraph: {
    type: 'website',
    siteName: 'Longevity One',
    // Default OG image is provided by app/opengraph-image.tsx (1200×630, on `www`).
    // Per-page metadata may override openGraph.images (e.g. blog cover images).
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

export const viewport: Viewport = {
  themeColor: '#E7DECC',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const hdrs = await headers()
  const lang = hdrs.get('x-lang') ?? 'ka'

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={[
        mersad.variable,
        fontGeorgian.variable,
      ].join(' ')}
    >
      <body>
        {children}
      </body>
    </html>
  )
}
