import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAllowedAdmin } from '@/lib/admin/allowlist'
import {
  fetchLeads,
  parseFilters,
  summarise,
  STATUS_FILTERS,
  STATUS_LABELS,
  type LeadFilters,
  type LeadRow,
} from '@/lib/admin/leads-query'
import { LeadStatusSelect } from '@/components/admin/LeadStatusSelect'
import { LeadNotes } from '@/components/admin/LeadNotes'

// Leads arrive continuously; never serve a cached copy of this table.
export const dynamic = 'force-dynamic'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tbilisi',
  })
}

/** Collapse paid click IDs to a readable channel; the raw IDs are unusable. */
function channel(row: LeadRow): string {
  if (row.gclid || row.last_gclid) return 'Google Ads'
  if (row.fbclid || row.last_fbclid) return 'Meta'
  if (row.last_utm_source || row.utm_source) return row.last_utm_source ?? row.utm_source ?? ''
  return ''
}

function queryString(filters: LeadFilters, overrides: Partial<LeadFilters> = {}): string {
  const merged = { ...filters, ...overrides }
  const params = new URLSearchParams()
  if (merged.from && merged.to) {
    params.set('from', merged.from)
    params.set('to', merged.to)
  } else {
    params.set('range', merged.range)
  }
  params.set('form', merged.form)
  params.set('status', merged.status)
  return `?${params.toString()}`
}

const RANGE_LABELS: Record<string, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  all: 'All time',
}

const FORM_LABELS: Record<string, string> = {
  all: 'All forms',
  lead_form: 'Call request',
  contact_form: 'Contact form',
}

const STATUS_FILTER_LABELS: Record<string, string> = {
  all: 'Any status',
  ...STATUS_LABELS,
}

/** Turn a submission path into something readable in a table cell. */
function pageLabel(path: string | null): string | null {
  if (!path) return null
  const clean = path.replace(/^\/en/, '').replace(/\/$/, '')
  return clean === '' ? 'Home' : clean
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  // Re-verify server-side rather than trusting the middleware alone: this is
  // where the data is actually read.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAllowedAdmin(user.email)) {
    redirect('/admin/login')
  }

  const filters = parseFilters(await searchParams)
  const { rows, error } = await fetchLeads(filters)
  const stats = summarise(rows)

  const cell = 'px-3 py-3 align-top text-sm text-dark-brown/80 whitespace-nowrap'
  const head =
    'px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-dark-brown/50 whitespace-nowrap'
  const chip =
    'px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] border transition-colors'
  const chipOn = 'bg-dark-brown text-bone-white border-dark-brown'
  const chipOff = 'border-dark-brown/25 text-dark-brown/70 hover:border-dark-brown'

  return (
    <main className="px-6 py-12 md:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-burnt-orange">
            Longevity One
          </p>
          <h1 className="text-2xl font-black text-dark-brown">Leads</h1>
          <p className="mt-2 text-sm text-dark-brown/60">Signed in as {user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/admin/leads/export${queryString(filters)}`}
            className="border border-dark-brown/30 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] text-dark-brown transition-colors hover:bg-dark-brown hover:text-bone-white"
          >
            Download CSV
          </a>
          <form action="/admin/logout" method="post">
            <button
              type="submit"
              className="border border-dark-brown/30 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] text-dark-brown transition-colors hover:bg-dark-brown hover:text-bone-white"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {Object.entries(RANGE_LABELS).map(([value, label]) => (
          <Link
            key={value}
            href={`/admin/leads${queryString(filters, { range: value as LeadFilters['range'], from: undefined, to: undefined })}`}
            className={`${chip} ${filters.range === value && !filters.from ? chipOn : chipOff}`}
          >
            {label}
          </Link>
        ))}
        <span className="mx-2 h-5 w-px bg-dark-brown/15" />
        {Object.entries(FORM_LABELS).map(([value, label]) => (
          <Link
            key={value}
            href={`/admin/leads${queryString(filters, { form: value as LeadFilters['form'] })}`}
            className={`${chip} ${filters.form === value ? chipOn : chipOff}`}
          >
            {label}
          </Link>
        ))}
        <span className="mx-2 h-5 w-px bg-dark-brown/15" />
        {STATUS_FILTERS.map((value) => (
          <Link
            key={value}
            href={`/admin/leads${queryString(filters, { status: value })}`}
            className={`${chip} ${filters.status === value ? chipOn : chipOff}`}
          >
            {STATUS_FILTER_LABELS[value]}
          </Link>
        ))}
      </div>

      {/* Summary */}
      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Total leads', value: String(stats.total) },
          { label: 'Booked', value: `${stats.booked}  (${stats.bookedRate}%)` },
          { label: 'Awaiting first call', value: String(stats.awaitingContact) },
          { label: 'From campaigns', value: String(stats.fromCampaigns) },
        ].map((stat) => (
          <div key={stat.label} className="border border-dark-brown/15 px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-dark-brown/50">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-black text-dark-brown">{stat.value}</p>
          </div>
        ))}
      </div>

      {stats.campaignOutcomes.length > 0 && (
        <div className="mb-10">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-dark-brown/50">
            Campaigns in this period - leads, and how many became bookings
          </p>
          <div className="flex flex-wrap gap-2">
            {stats.campaignOutcomes.map((c) => (
              <span
                key={c.campaign}
                className="border border-dark-brown/15 px-4 py-2 text-sm text-dark-brown/80"
              >
                {c.campaign}
                <span className="ml-2 font-bold text-dark-brown">{c.leads}</span>
                <span className="ml-1 text-dark-brown/40">leads</span>
                <span className="ml-2 font-bold text-[#3C5729]">{c.booked}</span>
                <span className="ml-1 text-dark-brown/40">booked</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="mb-6 text-sm text-burnt-orange">
          Could not load leads. Please try again shortly.
        </p>
      )}

      {!error && rows.length === 0 && (
        <p className="text-sm text-dark-brown/60">No leads in this period.</p>
      )}

      {rows.length > 0 && (
        <p className="mb-3 text-xs text-dark-brown/50">
          Notes are for call context only - for example &ldquo;call after 18:00&rdquo; or
          &ldquo;asked about VO2 Max&rdquo;. This table is not a medical record and is
          visible to whoever manages advertising, so never record symptoms,
          diagnoses or test results here.
        </p>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto border border-dark-brown/15">
          <table className="w-full border-collapse">
            <thead className="bg-dark-brown/5">
              <tr>
                <th className={head}>Received</th>
                <th className={head}>Status</th>
                <th className={head}>Form</th>
                <th className={head}>Page</th>
                <th className={head}>Name</th>
                <th className={head}>Phone</th>
                <th className={head}>Email</th>
                <th className={head}>Lang</th>
                <th className={head}>Channel</th>
                <th className={head}>Campaign (last)</th>
                <th className={head}>Campaign (first)</th>
                <th className={head}>Visits</th>
                <th className={`${head} min-w-[220px]`}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((lead) => {
                const dash = <span className="text-dark-brown/30">-</span>
                return (
                  <tr key={lead.id} className="border-t border-dark-brown/10">
                    <td className={cell}>{formatDate(lead.created_at)}</td>
                    <td className={cell}>
                      <LeadStatusSelect leadId={lead.id} status={lead.status} />
                    </td>
                    <td className={cell}>
                      {FORM_LABELS[lead.form_type] ?? lead.form_type}
                    </td>
                    <td className={cell}>{pageLabel(lead.submitted_from) ?? dash}</td>
                    <td className={`${cell} font-medium text-dark-brown`}>{lead.name}</td>
                    <td className={cell}>
                      {lead.phone ? (
                        <a
                          href={`tel:${lead.phone.replace(/[^+\d]/g, '')}`}
                          className="hover:text-burnt-orange"
                        >
                          {lead.phone}
                        </a>
                      ) : (
                        dash
                      )}
                    </td>
                    <td className={cell}>
                      {lead.email ? (
                        <a href={`mailto:${lead.email}`} className="hover:text-burnt-orange">
                          {lead.email}
                        </a>
                      ) : (
                        dash
                      )}
                    </td>
                    <td className={cell}>{lead.lang}</td>
                    <td className={cell}>{channel(lead) || dash}</td>
                    <td className={cell}>{lead.last_utm_campaign ?? dash}</td>
                    <td className={cell}>{lead.utm_campaign ?? dash}</td>
                    <td className={cell}>{lead.touch_count ?? dash}</td>
                    <td className={`${cell} whitespace-normal`}>
                      <LeadNotes leadId={lead.id} notes={lead.notes} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
