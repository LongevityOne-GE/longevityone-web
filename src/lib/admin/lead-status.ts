/**
 * Lead outcome vocabulary.
 *
 * Deliberately free of any server import. The status dropdown and the notes
 * field are client components, and pulling these constants from the query
 * module would drag `next/headers` and the Supabase service client into the
 * browser bundle.
 */

/** Lead outcomes, in pipeline order. */
export const LEAD_STATUSES = ['new', 'contacted', 'booked', 'not_interested'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

/** Labels shown in the dashboard and written to the CSV export. */
export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  booked: 'Booked',
  not_interested: 'Not interested',
}

export const STATUS_FILTERS = ['all', ...LEAD_STATUSES] as const
export type StatusFilter = (typeof STATUS_FILTERS)[number]
