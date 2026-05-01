import { DM_Sans, Noto_Sans_Georgian, Playfair_Display, Allura } from 'next/font/google'

export const fontPrimary = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
  preload: true,
})

export const fontGeorgian = Noto_Sans_Georgian({
  subsets: ['georgian'],
  weight: ['300', '400', '600', '900'],
  variable: '--font-noto-georgian',
  display: 'swap',
  preload: true,
})

export const fontDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
  preload: false,
})

export const fontScript = Allura({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-allura',
  display: 'swap',
  preload: false,
})
