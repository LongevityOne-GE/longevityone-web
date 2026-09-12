'use client'

import { useState, useTransition } from 'react'
import { updateLeadNotes } from '@/app/admin/leads/actions'

interface LeadNotesProps {
  leadId: string
  notes: string | null
}

/**
 * Free-text notes, saved when the field loses focus.
 *
 * Saving on blur rather than behind a button keeps this to one action per lead:
 * type, click away, done. A save button in every row of a table is noise, and a
 * row people will not use is a row that never gets filled in.
 */
export function LeadNotes({ leadId, notes }: LeadNotesProps) {
  const [value, setValue] = useState(notes ?? '')
  const [saved, setSaved] = useState<string>(notes ?? '')
  const [failed, setFailed] = useState(false)
  const [pending, startTransition] = useTransition()

  function commit() {
    const next = value.trim()
    if (next === saved) return // nothing changed
    setFailed(false)
    startTransition(async () => {
      const result = await updateLeadNotes(leadId, next)
      if (result.ok) setSaved(next)
      else setFailed(true)
    })
  }

  return (
    <span className="inline-flex w-full min-w-[200px] flex-col gap-1">
      <textarea
        value={value}
        rows={2}
        maxLength={2000}
        disabled={pending}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        placeholder="Add a note"
        aria-label="Lead notes"
        className="w-full resize-y border border-dark-brown/20 bg-transparent px-2.5 py-2 text-[13px] leading-snug text-dark-brown placeholder:text-dark-brown/30 transition-colors focus:border-dark-brown focus:outline-none disabled:opacity-50"
      />
      {pending && <span className="text-[10px] text-dark-brown/40">Saving...</span>}
      {failed && (
        <span className="text-[10px] text-burnt-orange" role="alert">
          Not saved. Try again.
        </span>
      )}
    </span>
  )
}
