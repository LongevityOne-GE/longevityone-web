import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/metadata'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Longevity One - Preventive Medicine Center in Tbilisi',
    short_name: 'Longevity One',
    description:
      'Preventive medicine and longevity clinic in Tbilisi, Georgia focused on biological age, diagnostics, metabolic health, and personalized health programs.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#E7DECC',
    theme_color: '#E7DECC',
    lang: 'ka-GE',
    categories: ['health', 'medical', 'lifestyle'],
    icons: [
      {
        src: `${SITE_URL}/icon.svg`,
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: `${SITE_URL}/apple-icon.png`,
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
