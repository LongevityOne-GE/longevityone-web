import type { Metadata, Viewport } from 'next'
import { fontPrimary, fontGeorgian, fontDisplay, fontScript } from './fonts'
import { LenisProvider } from './providers/LenisProvider'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://longevityone.ge'
  ),
  title: {
    default: 'Longevity One — Luxury Longevity Clinic, Tbilisi',
    template: '%s | Longevity One',
  },
  description:
    'Longevity One is a luxury preventive medicine and longevity clinic in Tbilisi, Georgia. Advanced diagnostics, personalised programmes, world-class care.',
  openGraph: {
    type: 'website',
    locale: 'ka_GE',
    alternateLocale: 'en_US',
    siteName: 'Longevity One',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export const viewport: Viewport = {
  themeColor: '#E7DECC',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ka"
      className={[
        fontPrimary.variable,
        fontGeorgian.variable,
        fontDisplay.variable,
        fontScript.variable,
      ].join(' ')}
    >
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
