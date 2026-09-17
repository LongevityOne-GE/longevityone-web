import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAllowedAdmin } from '@/lib/admin/allowlist'
import { metaConfig } from '@/lib/admin/meta-diagnostics'
import { MetaTestForm } from './MetaTestForm'

export const dynamic = 'force-dynamic'

export default async function AdminDiagnosticsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !isAllowedAdmin(user.email)) redirect('/admin/login')

  const config = metaConfig()
  const configured = config.pixelIdPresent && config.tokenPresent

  return (
    <main className="px-6 py-12 md:px-10">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-burnt-orange">
        Longevity One
      </p>
      <h1 className="text-2xl font-black text-dark-brown">Tracking check</h1>
      <p className="mt-2 max-w-2xl text-sm text-dark-brown/60">
        Sends Meta a test event through the Conversions API, the same way real
        leads are sent. Test events show only in Events Manager&rsquo;s Test events
        tab and are never counted as leads.
      </p>

      <p className={`mt-8 text-sm ${configured ? 'text-[#3C5729]' : 'text-burnt-orange'}`}>
        {configured
          ? 'Dataset ID and access token are configured on the server.'
          : `Missing on the server: ${[
              !config.pixelIdPresent && 'META_PIXEL_ID',
              !config.tokenPresent && 'META_CONVERSIONS_API_TOKEN',
            ]
              .filter(Boolean)
              .join(', ')}`}
      </p>

      <ol className="mt-6 mb-8 max-w-2xl list-decimal space-y-2 pl-5 text-sm text-dark-brown/75">
        <li>In Meta Events Manager, open the Longevityone dataset and click the Test events tab.</li>
        <li>Copy the test code shown there (it looks like TEST12345).</li>
        <li>Paste it below and send. Keep the Test events tab open to watch it arrive.</li>
      </ol>

      <MetaTestForm />

      <Link
        href="/admin/leads"
        className="mt-10 inline-block border border-dark-brown/30 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] text-dark-brown transition-colors hover:bg-dark-brown hover:text-bone-white"
      >
        Back to leads
      </Link>
    </main>
  )
}
