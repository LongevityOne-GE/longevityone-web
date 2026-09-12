'use client'

import { useState, useTransition } from 'react'
import { updateLeadStatus } from '@/app/admin/leads/actions'
import { LEAD_STATUSES, STATUS_LABELS, type LeadStatus } from '@/lib/admin/lead-status'

interface LeadStatusSelectProps {
  leadId: string
  status: string
}

/**
 * Colour carries the state as well as the word, so the table can be scanned
 * rather than read: what still needs calling should be findable at a glance.
 */
const STATUS_STYLE: Record<LeadStatus, string> = {
  new: 'bg-burnt-orange/15 text-burnt-orange border-burnt-orange/40',
  contacted: 'bg-light-blue/25 text-dark-brown border-dark-brown/25',
  booked: 'bg-[#4A6B33]/15 text-[#3C5729] border-[#4A6B33]/40',
  not_interested: 'bg-dark-brown/5 text-dark-brown/45 border-dark-brown/15',
}

export function LeadStatusSelect({ leadId, status }: LeadStatusSelectProps) {
  // Held locally so the change shows immediately; the server action revalidates
  // the page behind it. Reverted if the save fails.
  const [value, setValue] = useState(status)
  const [failed, setFailed] = useState(false)
  const [pending, startTransition] = useTransition()

  const style = STATUS_STYLE[value as LeadStatus] ?? STATUS_STYLE.new

  function onChange(next: string) {
    const previous = value
    setValue(next)
    setFailed(false)
    startTransition(async () => {
      const result = await updateLeadStatus(leadId, next)
      if (!result.ok) {
        setValue(previous)
        setFailed(true)
      }
    })
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <select
        value={value}
        disabled={pending}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Lead status"
        className={`border px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-burnt-orange ${style}`}
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {failed && (
        <span className="text-[10px] text-burnt-orange" role="alert">
          Not saved
        </span>
      )}
    </span>
  )
}
