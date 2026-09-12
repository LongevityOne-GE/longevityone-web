import { withSentryConfig } from '@sentry/nextjs'
import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // HSTS at the app level for defense in depth (Cloudflare also sets it at the edge).
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Cal.com, Google Tag Manager, PostHog, Cloudflare Turnstile.
      // GTM loads tag scripts from *.googletagmanager.com and Meta Pixel from
      // connect.facebook.net; without these the ad manager's tags fail silently.
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cal.eu https://www.cal.eu https://www.googletagmanager.com https://*.googletagmanager.com https://connect.facebook.net https://eu.posthog.com https://*.posthog.com https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://cal.eu https://www.cal.eu",
      // Sanity CDN, GA4 tracking pixel, and the conversion pixels fired by
      // Google Ads (doubleclick, google.com/.ge) and Meta.
      "img-src 'self' data: blob: https://cdn.sanity.io https://images.unsplash.com https://cal.eu https://www.cal.eu https://www.google-analytics.com https://www.googletagmanager.com https://*.googletagmanager.com https://googleads.g.doubleclick.net https://www.google.com https://www.google.ge https://www.facebook.com",
      "font-src 'self' data: https://fonts.gstatic.com https://cal.eu https://www.cal.eu",
      // API calls: Supabase, Sanity, Cal, GA4, PostHog, Sentry tunnel, Turnstile
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.sanity.io https://cal.eu https://www.cal.eu https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.googletagmanager.com https://*.googletagmanager.com https://googleads.g.doubleclick.net https://connect.facebook.net https://www.facebook.com https://eu.posthog.com https://*.eu.posthog.com https://*.posthog.com https://*.ingest.de.sentry.io https://challenges.cloudflare.com",
      // Google Maps embed on the contact page (classic ?output=embed, no API key).
      // td.doubleclick.net is Google Ads remarketing; googletagmanager.com is the
      // GTM Preview/Debug pane the ad manager needs to verify her own tags.
      "frame-src 'self' https://cal.eu https://www.cal.eu https://challenges.cloudflare.com https://www.google.com https://td.doubleclick.net https://www.googletagmanager.com",
      // Cloudflare Turnstile + Sentry session replay spawn Web Workers from blob: URLs
      "worker-src 'self' blob:",
      // Lock down legacy injection vectors not covered by default-src.
      "base-uri 'self'",
      "object-src 'none'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  // Canonical URL form: no trailing slash (Next default, made explicit). Canonicals
  // emitted by src/lib/seo/metadata.ts match this so /page and /page/ don't both index.
  trailingSlash: false,
  experimental: {
    optimizePackageImports: ['framer-motion', '@sanity/ui', 'lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
      {
        // Editorial fallback cover images used by the blog (see BlogGrid).
        protocol: 'https',
        hostname: 'images.unsplash.com',
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
