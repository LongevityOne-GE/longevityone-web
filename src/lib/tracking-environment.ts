/**
 * Where marketing and analytics tags may run.
 *
 * Preview deployments and local dev share the production Sanity content and
 * look identical to the live site, so any tag that ran there would pollute the
 * GA4 property, the Google Ads conversion count and the Meta dataset with test
 * traffic. Tags therefore load only on a production build served from the real
 * domain - both conditions, so neither a preview aliased to a longevityone.ge
 * subdomain nor the production build reached via its *.vercel.app URL counts.
 */
const PRODUCTION_HOSTNAMES = new Set(['longevityone.ge', 'www.longevityone.ge'])

/**
 * NEXT_PUBLIC_VERCEL_ENV is inlined at build time. Vercel provides it when
 * "Automatically expose System Environment Variables" is enabled for the
 * project. Fails closed: unset (local dev, or the setting turned off) means no
 * tags.
 */
export function isProductionBuild(): boolean {
  return process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
}

export function isProductionHostname(hostname: string): boolean {
  return PRODUCTION_HOSTNAMES.has(hostname.toLowerCase())
}

/** Browser-only: true when tags may load on the current page. Server code
 * (the Conversions API) uses isProductionBuild alone, as it has no hostname. */
export function isTrackingEnvironment(): boolean {
  if (typeof window === 'undefined') return false
  return isProductionBuild() && isProductionHostname(window.location.hostname)
}
