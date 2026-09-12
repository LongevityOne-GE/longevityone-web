import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAllowedAdmin } from '@/lib/admin/allowlist'

// Leads are written continuously; never serve a cached copy of this table.
export const dynamic = 'force-dynamic'

/** Most recent leads shown. Keeps the page bounded as the table grows. */
const PAGE_SIZE = 200

interface LeadRow {
  id: string
  name: string
  phone: string
  email: string | null
  lang: string
  source: string | null
  created_at: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  gclid: string | null
  fbclid: string | null
}

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

/** Paid click IDs collapse to a channel label - the raw IDs are long and unreadable. */
function clickChannel(row: LeadRow): string {
  if (row.gclid) return 'Google Ads'
  if (row.fbclid) return 'Meta'
  return ''
}

export default async function AdminLeadsPage() {
  // Re-verify server-side rather than trusting the middleware alone: middleware
  // guards navigation, but this is where the data is actually read.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAllowedAdmin(user.email)) {
    redirect('/admin/login')
  }

  // Service client: RLS grants nobody access to this table, so the read has to
  // happen with the service role. It stays server-side and is never serialised
  // into the page.
  const service = createServiceClient()
  const { data, error } = await service
    .from('founder_circle_leads')
    .select(
      'id, name, phone, email, lang, source, created_at, utm_source, utm_medium, utm_campaign, gclid, fbclid',
    )
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE)

  if (error) {
    // Log the failure, never the rows - these contain patient enquiry PII.
    console.error('[admin] leads query failed', error.message)
  }

  const leads: LeadRow[] = data ?? []

  const cell = 'px-3 py-3 align-top text-sm text-dark-brown/80 whitespace-nowrap'
  const head =
    'px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-dark-brown/50 whitespace-nowrap'

  return (
    <main className="px-6 py-12 md:px-10">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-burnt-orange">
            Longevity One
          </p>
          <h1 className="text-2xl font-black text-dark-brown">Leads</h1>
          <p className="mt-2 text-sm text-dark-brown/60">
            {leads.length === PAGE_SIZE
              ? `Showing the ${PAGE_SIZE} most recent`
              : `${leads.length} total`}
            {' · signed in as '}
            {user.email}
          </p>
        </div>
        <form action="/admin/logout" method="post">
          <button
            type="submit"
            className="border border-dark-brown/30 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] text-dark-brown transition-colors hover:bg-dark-brown hover:text-bone-white"
          >
            Sign out
          </button>
        </form>
      </div>

      {error && (
        <p className="mb-6 text-sm text-burnt-orange">
          Could not load leads. Please try again shortly.
        </p>
      )}

      {!error && leads.length === 0 && (
        <p className="text-sm text-dark-brown/60">No leads yet.</p>
      )}

      {leads.length > 0 && (
        <div className="overflow-x-auto border border-dark-brown/15">
          <table className="w-full border-collapse">
            <thead className="bg-dark-brown/5">
              <tr>
                <th className={head}>Received</th>
                <th className={head}>Name</th>
                <th className={head}>Phone</th>
                <th className={head}>Email</th>
                <th className={head}>Lang</th>
                <th className={head}>Form</th>
                <th className={head}>Channel</th>
                <th className={head}>utm_source</th>
                <th className={head}>utm_medium</th>
                <th className={head}>utm_campaign</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-dark-brown/10">
                  <td className={cell}>{formatDate(lead.created_at)}</td>
                  <td className={`${cell} font-medium text-dark-brown`}>{lead.name}</td>
                  <td className={cell}>
                    <a href={`tel:${lead.phone.replace(/[^+\d]/g, '')}`} className="hover:text-burnt-orange">
                      {lead.phone}
                    </a>
                  </td>
                  <td className={cell}>
                    {lead.email ? (
                      <a href={`mailto:${lead.email}`} className="hover:text-burnt-orange">
                        {lead.email}
                      </a>
                    ) : (
                      <span className="text-dark-brown/30">-</span>
                    )}
                  </td>
                  <td className={cell}>{lead.lang}</td>
                  <td className={cell}>{lead.source ?? <span className="text-dark-brown/30">-</span>}</td>
                  <td className={cell}>
                    {clickChannel(lead) || <span className="text-dark-brown/30">-</span>}
                  </td>
                  <td className={cell}>
                    {lead.utm_source ?? <span className="text-dark-brown/30">-</span>}
                  </td>
                  <td className={cell}>
                    {lead.utm_medium ?? <span className="text-dark-brown/30">-</span>}
                  </td>
                  <td className={cell}>
                    {lead.utm_campaign ?? <span className="text-dark-brown/30">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
