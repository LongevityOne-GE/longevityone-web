import { createServiceClient } from '@/lib/supabase/server'
import { LEAD_STATUSES, STATUS_FILTERS, type StatusFilter } from './lead-status'

// Re-exported so server-side callers can keep importing from one place.
export {
  LEAD_STATUSES,
  STATUS_LABELS,
  STATUS_FILTERS,
  type LeadStatus,
  type StatusFilter,
} from './lead-status'

/**
 * Shared lead querying for the admin dashboard and its CSV export, so the table
 * on screen and the file the ad manager downloads can never disagree.
 */

export const LEAD_COLUMNS =
  'id, name, phone, email, lang, source, form_type, created_at, ' +
  'status, notes, status_updated_at, submitted_from, ' +
  'utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid, fbclid, landing_page, referrer, ' +
  'last_utm_source, last_utm_medium, last_utm_campaign, last_gclid, last_fbclid, touch_count'

export interface LeadRow {
  id: string
  name: string
  phone: string
  email: string | null
  lang: string
  source: string | null
  form_type: string
  created_at: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  gclid: string | null
  fbclid: string | null
  landing_page: string | null
  referrer: string | null
  last_utm_source: string | null
  last_utm_medium: string | null
  last_utm_campaign: string | null
  last_gclid: string | null
  last_fbclid: string | null
  touch_count: number | null
  status: string
  notes: string | null
  status_updated_at: string | null
  submitted_from: string | null
}

export const FORM_FILTERS = ['all', 'lead_form', 'contact_form'] as const
export type FormFilter = (typeof FORM_FILTERS)[number]

export const RANGE_PRESETS = ['7d', '30d', '90d', 'all'] as const
export type RangePreset = (typeof RANGE_PRESETS)[number]


export interface LeadFilters {
  range: RangePreset
  form: FormFilter
  status: StatusFilter
  /** Explicit dates override the preset when both are supplied. */
  from?: string
  to?: string
}

/** Parse untrusted query params into a safe filter set. */
export function parseFilters(params: Record<string, string | string[] | undefined>): LeadFilters {
  const one = (v: string | string[] | undefined): string | undefined =>
    Array.isArray(v) ? v[0] : v

  const rawRange = one(params.range)
  const rawForm = one(params.form)
  const rawStatus = one(params.status)
  const from = one(params.from)
  const to = one(params.to)
  const isDate = (v?: string) => Boolean(v && /^\d{4}-\d{2}-\d{2}$/.test(v))

  return {
    range: (RANGE_PRESETS as readonly string[]).includes(rawRange ?? '')
      ? (rawRange as RangePreset)
      : '30d',
    form: (FORM_FILTERS as readonly string[]).includes(rawForm ?? '')
      ? (rawForm as FormFilter)
      : 'all',
    status: (STATUS_FILTERS as readonly string[]).includes(rawStatus ?? '')
      ? (rawStatus as StatusFilter)
      : 'all',
    from: isDate(from) ? from : undefined,
    to: isDate(to) ? to : undefined,
  }
}

/** Resolve filters into an inclusive ISO window, or null for no lower bound. */
export function resolveWindow(filters: LeadFilters): { fromIso: string | null; toIso: string | null } {
  if (filters.from && filters.to) {
    return {
      fromIso: new Date(`${filters.from}T00:00:00.000Z`).toISOString(),
      // Inclusive of the whole end day.
      toIso: new Date(`${filters.to}T23:59:59.999Z`).toISOString(),
    }
  }

  if (filters.range === 'all') return { fromIso: null, toIso: null }

  const days = filters.range === '7d' ? 7 : filters.range === '90d' ? 90 : 30
  return {
    fromIso: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
    toIso: null,
  }
}

/** Hard ceiling so one query can never pull the whole table into memory. */
export const MAX_ROWS = 5000

export async function fetchLeads(
  filters: LeadFilters,
  limit = MAX_ROWS,
): Promise<{ rows: LeadRow[]; error: string | null }> {
  const { fromIso, toIso } = resolveWindow(filters)

  // Service client: RLS grants nobody access to this table, so reads must use
  // the service role. It stays server-side and is never sent to the browser.
  let query = createServiceClient()
    .from('founder_circle_leads')
    .select(LEAD_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (fromIso) query = query.gte('created_at', fromIso)
  if (toIso) query = query.lte('created_at', toIso)
  if (filters.form !== 'all') query = query.eq('form_type', filters.form)
  if (filters.status !== 'all') query = query.eq('status', filters.status)

  const { data, error } = await query

  if (error) {
    // Log the failure, never the rows - they contain enquiry PII.
    console.error('[admin] leads query failed', error.message)
    return { rows: [], error: 'query_failed' }
  }

  return { rows: (data ?? []) as unknown as LeadRow[], error: null }
}

export interface LeadStats {
  total: number
  leadForm: number
  contactForm: number
  fromCampaigns: number
  booked: number
  /** Share of leads in this period that became a booking, as a percentage. */
  bookedRate: number
  awaitingContact: number
  topCampaigns: Array<{ campaign: string; count: number }>
  /** Per campaign: how many leads, and how many of them booked. */
  campaignOutcomes: Array<{ campaign: string; leads: number; booked: number }>
}

/** Summary counts for the dashboard header. */
export function summarise(rows: LeadRow[]): LeadStats {
  const counts = new Map<string, { leads: number; booked: number }>()

  for (const row of rows) {
    // Last touch is what Google Ads and Meta attribute on, so the dashboard
    // reports on the same basis and the two can be reconciled.
    const campaign = row.last_utm_campaign ?? row.utm_campaign
    if (!campaign) continue
    const entry = counts.get(campaign) ?? { leads: 0, booked: 0 }
    entry.leads += 1
    if (row.status === 'booked') entry.booked += 1
    counts.set(campaign, entry)
  }

  const booked = rows.filter((r) => r.status === 'booked').length

  const campaignOutcomes = [...counts.entries()]
    .map(([campaign, v]) => ({ campaign, leads: v.leads, booked: v.booked }))
    // Booked first: the campaigns that produced patients matter more than the
    // ones that merely produced leads.
    .sort((a, b) => b.booked - a.booked || b.leads - a.leads)
    .slice(0, 8)

  return {
    total: rows.length,
    leadForm: rows.filter((r) => r.form_type === 'lead_form').length,
    contactForm: rows.filter((r) => r.form_type === 'contact_form').length,
    fromCampaigns: rows.filter(
      (r) => r.utm_source || r.last_utm_source || r.gclid || r.fbclid,
    ).length,
    booked,
    bookedRate: rows.length > 0 ? Math.round((booked / rows.length) * 100) : 0,
    awaitingContact: rows.filter((r) => r.status === 'new').length,
    topCampaigns: campaignOutcomes.map((c) => ({ campaign: c.campaign, count: c.leads })),
    campaignOutcomes,
  }
}
