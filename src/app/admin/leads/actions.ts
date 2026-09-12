'use server'

import { revalidatePath } from 'next/cache'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAllowedAdmin } from '@/lib/admin/allowlist'
import { LEAD_STATUSES, type LeadStatus } from '@/lib/admin/lead-status'

/**
 * Mutations for the leads dashboard.
 *
 * Every action re-verifies the session and the allowlist itself. The middleware
 * guards navigation, but a server action is its own HTTP endpoint and must not
 * rely on the page that rendered the form having checked anything.
 */

export interface UpdateResult {
  ok: boolean
  error?: string
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Longest note we store. Generous for context, short of an essay. */
const MAX_NOTES_LENGTH = 2000

async function requireAdmin(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !isAllowedAdmin(user.email)) return null
  return user.email ?? null
}

export async function updateLeadStatus(leadId: string, status: string): Promise<UpdateResult> {
  if (!(await requireAdmin())) return { ok: false, error: 'Not authorised' }
  if (!UUID.test(leadId)) return { ok: false, error: 'Invalid lead' }
  if (!(LEAD_STATUSES as readonly string[]).includes(status)) {
    return { ok: false, error: 'Invalid status' }
  }

  const { error } = await createServiceClient()
    .from('founder_circle_leads')
    .update({ status: status as LeadStatus, status_updated_at: new Date().toISOString() })
    .eq('id', leadId)

  if (error) {
    // Log the failure, never the row - it holds enquiry PII.
    console.error('[admin] status update failed', error.message)
    return { ok: false, error: 'Could not save' }
  }

  revalidatePath('/admin/leads')
  return { ok: true }
}

export async function updateLeadNotes(leadId: string, notes: string): Promise<UpdateResult> {
  if (!(await requireAdmin())) return { ok: false, error: 'Not authorised' }
  if (!UUID.test(leadId)) return { ok: false, error: 'Invalid lead' }

  const trimmed = notes.trim().slice(0, MAX_NOTES_LENGTH)

  const { error } = await createServiceClient()
    .from('founder_circle_leads')
    .update({ notes: trimmed || null })
    .eq('id', leadId)

  if (error) {
    console.error('[admin] notes update failed', error.message)
    return { ok: false, error: 'Could not save' }
  }

  revalidatePath('/admin/leads')
  return { ok: true }
}
