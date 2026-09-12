import { ATTRIBUTION_KEYS, hasAttribution, type ValidatedAttribution } from './attribution'

/**
 * Renders campaign attribution into the staff notification emails.
 *
 * Shared by both form routes so the two inboxes show the same thing, and so
 * the ad manager can read attribution straight from the email even when the
 * database write failed.
 */

/** Labels staff see, rather than raw column names. */
const LABELS: Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>> = {
  utm_source: 'First touch - source',
  utm_medium: 'First touch - medium',
  utm_campaign: 'First touch - campaign',
  utm_content: 'First touch - content',
  utm_term: 'First touch - term',
  gclid: 'First touch - Google click ID',
  fbclid: 'First touch - Meta click ID',
  landing_page: 'First touch - landing page',
  referrer: 'First touch - referrer',
  last_utm_source: 'Last touch - source',
  last_utm_medium: 'Last touch - medium',
  last_utm_campaign: 'Last touch - campaign',
  last_utm_content: 'Last touch - content',
  last_utm_term: 'Last touch - term',
  last_gclid: 'Last touch - Google click ID',
  last_fbclid: 'Last touch - Meta click ID',
  last_landing_page: 'Last touch - landing page',
  last_referrer: 'Last touch - referrer',
  touch_count: 'Visits before converting',
}

const NONE = 'none (direct or organic)'

function present(attribution: ValidatedAttribution) {
  return ATTRIBUTION_KEYS.filter((key) => attribution[key] !== undefined && attribution[key] !== null)
}

/** HTML block for the notification email. `escape` is the caller's escaper. */
export function attributionHtml(
  attribution: ValidatedAttribution,
  escape: (input: string) => string,
): string {
  if (!hasAttribution(attribution)) {
    return `<p><strong>Campaign attribution:</strong> ${NONE}</p>`
  }

  const rows = present(attribution)
    .map(
      (key) =>
        `<p><strong>${escape(LABELS[key] ?? key)}:</strong> ${escape(String(attribution[key]))}</p>`,
    )
    .join('')

  return `<h3>Campaign attribution</h3>${rows}`
}

/** Plain-text equivalent, for the text part of the same email. */
export function attributionText(attribution: ValidatedAttribution): string {
  if (!hasAttribution(attribution)) {
    return `\nCampaign attribution: ${NONE}\n`
  }

  const rows = present(attribution)
    .map((key) => `${LABELS[key] ?? key}: ${String(attribution[key])}`)
    .join('\n')

  return `\nCampaign attribution:\n${rows}\n`
}
