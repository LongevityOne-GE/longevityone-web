import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAllowedAdmin } from '@/lib/admin/allowlist'
import { checkMetaConversionsApi } from '@/lib/admin/meta-diagnostics'

// Always run the check fresh; a cached answer is worse than none.
export const dynamic = 'force-dynamic'

function Row({ label, ok, detail }: { label: string; ok: boolean; detail?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-dark-brown/10 py-4 last:border-b-0">
      <span className="text-sm font-medium text-dark-brown">{label}</span>
      <span className="flex items-baseline gap-3">
        {detail && <span className="text-sm text-dark-brown/55">{detail}</span>}
        <span
          className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
            ok ? 'bg-[#4A6B33]/15 text-[#3C5729]' : 'bg-burnt-orange/15 text-burnt-orange'
          }`}
        >
          {ok ? 'Working' : 'Not working'}
        </span>
      </span>
    </div>
  )
}

export default async function AdminDiagnosticsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !isAllowedAdmin(user.email)) redirect('/admin/login')

  const meta = await checkMetaConversionsApi()

  const lastFired = meta.lastFiredTime
    ? new Date(meta.lastFiredTime).toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Tbilisi',
      })
    : undefined

  return (
    <main className="px-6 py-12 md:px-10">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-burnt-orange">
        Longevity One
      </p>
      <h1 className="text-2xl font-black text-dark-brown">Tracking check</h1>
      <p className="mt-2 max-w-2xl text-sm text-dark-brown/60">
        Asks Meta directly whether the Conversions API credentials on this site
        work. It only reads, so running it never creates fake leads. Reload the
        page to run it again.
      </p>

      <div className="mt-8 max-w-2xl border border-dark-brown/15 px-6">
        <Row
          label="Conversions API credentials are configured"
          ok={meta.configured}
          detail={
            meta.configured
              ? undefined
              : `missing ${[
                  !meta.pixelIdPresent && 'dataset ID',
                  !meta.tokenPresent && 'access token',
                ]
                  .filter(Boolean)
                  .join(' and ')}`
          }
        />
        <Row
          label="Meta accepts the access token"
          ok={meta.credentialsValid}
          detail={meta.error}
        />
        <Row
          label="Meta is receiving events for this dataset"
          ok={Boolean(meta.lastFiredTime)}
          detail={lastFired ? `last event ${lastFired}` : undefined}
        />
      </div>

      {meta.credentialsValid && (
        <p className="mt-6 max-w-2xl text-sm text-dark-brown/60">
          Dataset {meta.datasetName ?? meta.datasetId}
          {meta.datasetId ? ` (${meta.datasetId})` : ''}.
        </p>
      )}

      {!meta.credentialsValid && meta.configured && (
        <p className="mt-6 max-w-2xl text-sm text-burnt-orange">
          Meta rejected the credentials. The message above is Meta&rsquo;s own.
          The usual causes are a token copied with a space in it, a token from a
          different dataset, or one that has been revoked.
        </p>
      )}

      <Link
        href="/admin/leads"
        className="mt-10 inline-block border border-dark-brown/30 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] text-dark-brown transition-colors hover:bg-dark-brown hover:text-bone-white"
      >
        Back to leads
      </Link>
    </main>
  )
}
