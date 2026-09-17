'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { CONSENT_KEY, CONSENT_VERSION, readConsent, type CookieConsent } from '@/lib/cookies'
import { captureAttribution } from '@/lib/attribution'
import { trackMetaPageView, trackVirtualPageView } from '@/lib/analytics-events'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID
const PH_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const PH_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.posthog.com'

/**
 * Google Consent Mode v2 bootstrap.
 *
 * Runs before any Google tag and denies every storage type up front. Google
 * tags then load in cookieless mode: they set no cookies and store no
 * identifiers, but still send anonymous pings that let Google model the
 * conversions it cannot observe.
 *
 * Why this matters: previously no Google tag loaded at all until consent, so
 * every visitor who declined was completely invisible and Google Ads saw no
 * conversion whatsoever. With Consent Mode the declining visitors are still
 * modelled, which is both more accurate and the configuration Google requires
 * for ad personalisation in the EEA.
 *
 * This deliberately differs from the older "no Google script before consent"
 * rule. PostHog has no equivalent mechanism and so remains fully
 * gated below - it does not load at all without consent.
 */
const CONSENT_DEFAULT_SNIPPET = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', true);

  // Returning visitors already chose in the cookie banner. Apply that choice
  // here, synchronously, before GTM loads. Waiting for React to apply it left
  // every page's first hits in "denied" mode: GA4 sent them cookieless, so they
  // never appeared in Realtime and a lead submitted on landing was lost there.
  try {
    var c = JSON.parse(localStorage.getItem('${CONSENT_KEY}') || 'null');
    if (c && c.version === ${CONSENT_VERSION}) {
      var ad = c.marketing ? 'granted' : 'denied';
      var an = c.analytics ? 'granted' : 'denied';
      gtag('consent', 'update', {
        ad_storage: ad,
        ad_user_data: ad,
        ad_personalization: ad,
        analytics_storage: an,
        functionality_storage: an,
        personalization_storage: ad,
        security_storage: 'granted'
      });
    }
  } catch (e) {}
`

interface AnalyticsProps {
  /**
   * Meta Pixel ID, passed from the server layout so the dataset ID lives in one
   * env var (META_PIXEL_ID) shared with the Conversions API.
   */
  metaPixelId?: string
}

/** Only digits: the ID is interpolated into an inline script. */
function safePixelId(id?: string): string | null {
  return id && /^\d{5,20}$/.test(id) ? id : null
}

export function Analytics({ metaPixelId }: AnalyticsProps = {}) {
  const [consent, setConsent] = useState<CookieConsent | null>(null)
  const pixelId = safePixelId(metaPixelId)
  const pathname = usePathname()
  const isFirstPath = useRef(true)

  useEffect(() => {
    // The first load is a real page view that GTM already sees. Meta's is sent
    // from here (queued until the Pixel loads) so it carries an event_id shared
    // with its Conversions API copy.
    if (isFirstPath.current) {
      isFirstPath.current = false
      trackMetaPageView()
      return
    }
    trackVirtualPageView(pathname)
  }, [pathname])

  useEffect(() => {
    // Snapshot the campaign that brought this visitor in. Stored for 90 days so
    // a visitor who returns days later still converts against the right ad.
    captureAttribution()

    setConsent(readConsent())

    function onConsent(e: Event) {
      setConsent((e as CustomEvent<CookieConsent>).detail)
    }
    window.addEventListener('lo:consent', onConsent)
    return () => window.removeEventListener('lo:consent', onConsent)
  }, [])

  const analyticsEnabled = consent?.analytics === true
  const marketingEnabled = consent?.marketing === true

  // Tell Google the moment consent changes, so tags upgrade from cookieless
  // pings to full measurement without a page reload.
  useEffect(() => {
    if (!consent || typeof window === 'undefined' || !window.gtag) return
    window.gtag('consent', 'update', {
      ad_storage: marketingEnabled ? 'granted' : 'denied',
      ad_user_data: marketingEnabled ? 'granted' : 'denied',
      ad_personalization: marketingEnabled ? 'granted' : 'denied',
      analytics_storage: analyticsEnabled ? 'granted' : 'denied',
      functionality_storage: analyticsEnabled ? 'granted' : 'denied',
      personalization_storage: marketingEnabled ? 'granted' : 'denied',
      security_storage: 'granted',
    })
  }, [consent, analyticsEnabled, marketingEnabled])

  return (
    <>
      {/* Consent defaults must execute before any Google tag. */}
      <Script id="consent-mode-default" strategy="beforeInteractive">
        {CONSENT_DEFAULT_SNIPPET}
      </Script>

      {/* Google Tag Manager. Preferred once the container exists: the ad
          manager then adds and edits tags in GTM without a code deploy. */}
      {GTM_ID && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      )}

      {/* Direct GA4. Only when there is no GTM container, so GA4 is never
          loaded twice and page views are not double counted. */}
      {!GTM_ID && GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {/* Meta Pixel. Loads only with MARKETING consent: it sets advertising
          cookies and has no cookieless mode. Queued calls (the first PageView,
          the thank-you page's FormSubmit) are flushed once it initialises. Do
          not also add the Pixel in GTM, or every event is sent twice. */}
      {marketingEnabled && pixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            (window.__loMeta || []).forEach(function (a) { fbq.apply(null, a); });
            window.__loMeta = [];
          `}
        </Script>
      )}

      {/* PostHog has no consent-mode equivalent, so it stays fully gated and
          does not load at all without analytics consent. */}
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
