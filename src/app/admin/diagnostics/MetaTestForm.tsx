'use client'

import { useActionState } from 'react'
import { runMetaTest, type TestState } from './actions'

const initial: TestState = { status: 'idle' }

export function MetaTestForm() {
  const [state, action, pending] = useActionState(runMetaTest, initial)
  const result = state.result

  return (
    <div className="max-w-2xl">
      <form action={action} className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-dark-brown/60">
            Test event code
          </span>
          <input
            name="code"
            required
            placeholder="TEST12345"
            autoComplete="off"
            className="w-56 border-b border-dark-brown/40 bg-transparent pb-2 font-mono text-dark-brown focus:border-dark-brown focus:outline-none"
          />
        </label>
        <button type="submit" disabled={pending} className="btn-primary disabled:opacity-50">
          {pending ? 'Sending...' : 'Send test events'}
        </button>
      </form>

      {result && (
        <div
          role="status"
          className={`mt-6 border px-5 py-4 text-sm ${
            result.ok
              ? 'border-[#4A6B33]/40 bg-[#4A6B33]/10 text-[#3C5729]'
              : 'border-burnt-orange/40 bg-burnt-orange/10 text-burnt-orange'
          }`}
        >
          {result.ok ? (
            <>
              <strong>Working.</strong> Meta accepted a PageView and a PhoneClick
              from the server. Both appear in the Test events tab within a few
              seconds, marked Server.
            </>
          ) : (
            <>
              <strong>Not working.</strong> Meta said: {result.error}
            </>
          )}
        </div>
      )}
    </div>
  )
}
