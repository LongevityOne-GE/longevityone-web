import type { Metadata } from 'next'
import { LenisProvider } from './providers/LenisProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Longevity One',
  description: 'Luxury longevity medical clinic in Tbilisi, Georgia',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ka">
      <body>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
