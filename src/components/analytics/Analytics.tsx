'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { readConsent, type CookieConsent } from '@/lib/cookies'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const PH_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const PH_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.posthog.com'

export function Analytics() {
  const [consent, setConsent] = useState<CookieConsent | null>(null)

  useEffect(() => {
    // Read initial consent from localStorage
    setConsent(readConsent())

    // Re-evaluate whenever the banner fires an update
    function onConsent(e: Event) {
      setConsent((e as CustomEvent<CookieConsent>).detail)
    }
    window.addEventListener('lo:consent', onConsent)
    return () => window.removeEventListener('lo:consent', onConsent)
  }, [])

  const analyticsEnabled = consent?.analytics === true

  return (
    <>
      {/* ── Google Analytics 4 ────────────────────────────────── */}
      {analyticsEnabled && GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {/* ── PostHog ───────────────────────────────────────────── */}
      {analyticsEnabled && PH_KEY && (
        <Script id="posthog-init" strategy="afterInteractive">
          {`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId setPersonPropertiesForFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init('${PH_KEY}', {
              api_host: '${PH_HOST}',
              person_profiles: 'identified_only',
              capture_pageview: true,
            });
          `}
        </Script>
      )}
    </>
  )
}
