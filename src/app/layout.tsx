import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { mersad, fontGeorgian } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://longevityone.ge'
  ),
  title: {
    default: 'Longevity One - პრევენციული მედიცინის ცენტრი, თბილისი',
    template: '%s | Longevity One',
  },
  description:
    'Longevity One - პრევენციული მედიცინის ცენტრი თბილისში. მოწინავე დიაგნოსტიკა, პერსონალიზებული პროგრამები, სამეცნიერო სიზუსტე.',
  openGraph: {
    type: 'website',
    siteName: 'Longevity One',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
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
