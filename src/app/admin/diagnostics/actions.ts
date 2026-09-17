'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { isAllowedAdmin } from '@/lib/admin/allowlist'
import { sendMetaTestEvent, type MetaSendResult } from '@/lib/admin/meta-diagnostics'

export interface TestState {
  status: 'idle' | 'done'
  result?: MetaSendResult
}

/** Re-verifies the admin session itself: a server action is its own endpoint. */
export async function runMetaTest(_prev: TestState, formData: FormData): Promise<TestState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !isAllowedAdmin(user.email)) {
    return { status: 'done', result: { ok: false, error: 'Not authorised' } }
  }
  const code = String(formData.get('code') ?? '').trim()
  const h = await headers()
  const ip =
    h.get('cf-connecting-ip')?.trim() || (h.get('x-forwarded-for') ?? '').split(',')[0]?.trim()
  return {
    status: 'done',
    result: await sendMetaTestEvent(code, { ip, userAgent: h.get('user-agent') }),
  }
}
