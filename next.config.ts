import { withSentryConfig } from '@sentry/nextjs'
import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Cal.com + Google Tag Manager + PostHog scripts
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cal.eu https://www.cal.eu https://www.googletagmanager.com https://eu.posthog.com",
      "style-src 'self' 'unsafe-inline' https://cal.eu https://www.cal.eu",
      // GA4 tracking pixel + Sanity CDN
      "img-src 'self' data: blob: https://cdn.sanity.io https://images.unsplash.com https://cal.eu https://www.cal.eu https://www.google-analytics.com https://www.googletagmanager.com",
      "font-src 'self' data: https://fonts.gstatic.com https://cal.eu https://www.cal.eu",
      // API calls: Supabase, Sanity, Cal, GA4, PostHog, Sentry tunnel
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.sanity.io https://cal.eu https://www.cal.eu https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://eu.posthog.com https://*.eu.posthog.com https://*.ingest.de.sentry.io",
      "frame-src 'self' https://cal.eu https://www.cal.eu",
      "frame-ancestors 'none'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion', '@sanity/ui', 'lucide-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  org: 'longevityone',
  project: 'javascript-nextjs',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  sourcemaps: { disable: false },
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
})
