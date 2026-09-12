import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAllowedAdmin } from '@/lib/admin/allowlist'
import { fetchLeads, parseFilters, type LeadRow } from '@/lib/admin/leads-query'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Columns in the exported file, in the order the ad manager reads them. */
const COLUMNS: Array<{ key: keyof LeadRow; label: string }> = [
  { key: 'created_at', label: 'Received' },
  { key: 'form_type', label: 'Form' },
  { key: 'name', label: 'Name' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'lang', label: 'Language' },
  { key: 'source', label: 'Placement' },
  { key: 'last_utm_source', label: 'Last touch source' },
  { key: 'last_utm_medium', label: 'Last touch medium' },
  { key: 'last_utm_campaign', label: 'Last touch campaign' },
  { key: 'utm_source', label: 'First touch source' },
  { key: 'utm_medium', label: 'First touch medium' },
  { key: 'utm_campaign', label: 'First touch campaign' },
  { key: 'utm_content', label: 'First touch content' },
  { key: 'utm_term', label: 'First touch term' },
  { key: 'gclid', label: 'Google click ID' },
  { key: 'fbclid', label: 'Meta click ID' },
  { key: 'landing_page', label: 'Landing page' },
  { key: 'referrer', label: 'Referrer' },
  { key: 'touch_count', label: 'Visits before converting' },
]

/**
 * Escape a value for CSV.
 *
 * Also neutralises spreadsheet formula injection: a cell starting with =, +, -
 * or @ is executed as a formula by Excel and Google Sheets, and these values
 * come from attacker-controllable URLs. Prefixing with an apostrophe makes the
 * cell inert text.
 */
function csvCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  let text = String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

/**
 * CSV export of the leads table, honouring the same filters as the dashboard.
 *
 * Exists because a marketer's real work happens in a spreadsheet: pivoting
 * leads by campaign, reconciling against ad platform spend, sharing with the
 * clinic. Re-typing 200 rows out of an HTML table is not a workflow.
 */
export async function GET(req: NextRequest) {
  // Re-verify server-side rather than trusting the middleware alone: this
  // endpoint emits every lead's contact details in one file.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAllowedAdmin(user.email)) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  const params = Object.fromEntries(req.nextUrl.searchParams.entries())
  const filters = parseFilters(params)
  const { rows, error } = await fetchLeads(filters)

  if (error) {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }

  const header = COLUMNS.map((c) => csvCell(c.label)).join(',')
  const body = rows.map((row) => COLUMNS.map((c) => csvCell(row[c.key])).join(',')).join('\n')
  // BOM so Excel opens UTF-8 Georgian text correctly instead of mojibake.
  const csv = `﻿${header}\n${body}\n`

  const stamp = new Date().toISOString().slice(0, 10)
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="longevityone-leads-${stamp}.csv"`,
      // Contains personal data: never let a proxy or browser cache it.
      'Cache-Control': 'no-store, private',
    },
  })
}
