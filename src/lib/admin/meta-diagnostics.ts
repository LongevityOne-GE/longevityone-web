/**
 * Live check of the Meta Conversions API credentials.
 *
 * Everything the browser does can be watched directly, but the server's call to
 * Meta cannot: it happens inside a serverless function, and a bad token fails
 * silently by design so a broken ad platform can never break a lead. That left
 * "is the Conversions API actually working" as a question nobody could answer
 * without reading Meta's dashboards. This answers it from the server itself.
 *
 * Read-only: it asks Meta about the dataset rather than sending a conversion,
 * so running it never pollutes reporting with fake leads.
 */

const GRAPH = 'https://graph.facebook.com/v21.0'

export interface MetaCheck {
  /** Both credentials present in the environment. */
  configured: boolean
  pixelIdPresent: boolean
  tokenPresent: boolean
  /** Meta accepted the token and it can read this dataset. */
  credentialsValid: boolean
  datasetId?: string
  datasetName?: string
  /** When Meta last received ANY event for this dataset, browser or server. */
  lastFiredTime?: string
  /** Meta's own error, when it rejected us. */
  error?: string
}

export async function checkMetaConversionsApi(): Promise<MetaCheck> {
  const pixelId = process.env.META_PIXEL_ID
  const token = process.env.META_CONVERSIONS_API_TOKEN

  const base: MetaCheck = {
    configured: Boolean(pixelId && token),
    pixelIdPresent: Boolean(pixelId),
    tokenPresent: Boolean(token),
    credentialsValid: false,
  }

  if (!pixelId || !token) return base

  try {
    const res = await fetch(
      `${GRAPH}/${encodeURIComponent(pixelId)}?fields=id,name,last_fired_time&access_token=${encodeURIComponent(token)}`,
      { cache: 'no-store' },
    )
    const body = (await res.json()) as {
      id?: string
      name?: string
      last_fired_time?: string
      error?: { message?: string; code?: number }
    }

    if (!res.ok || body.error) {
      return {
        ...base,
        // Meta's message names the actual problem: expired token, wrong
        // dataset, missing permission. Never includes the token itself.
        error: body.error?.message ?? `Meta returned ${res.status}`,
      }
    }

    return {
      ...base,
      credentialsValid: true,
      datasetId: body.id,
      datasetName: body.name,
      lastFiredTime: body.last_fired_time,
    }
  } catch (err) {
    return { ...base, error: err instanceof Error ? err.message : 'Request failed' }
  }
}
