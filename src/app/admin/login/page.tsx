'use client'

import { useActionState } from 'react'
import { requestMagicLink, type LoginState } from './actions'

const initialState: LoginState = { status: 'idle' }

/**
 * Passwordless admin sign-in, matching the project's "Supabase Magic Link, no
 * passwords" rule. The allowlist check happens server-side in the action, so
 * this form cannot be used to enumerate who has access.
 */
export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(requestMagicLink, initialState)

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-burnt-orange">
          Longevity One
        </p>
        <h1 className="mb-8 text-2xl font-black text-dark-brown">Leads dashboard</h1>

        {state.status === 'sent' ? (
          <p className="text-sm leading-relaxed text-dark-brown/70">{state.message}</p>
        ) : (
          <form action={formAction} className="space-y-6">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-[11px] font-medium uppercase tracking-[0.15em] text-dark-brown/60"
              >
                Email
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full border-b border-dark-brown/40 bg-transparent pb-2 font-light text-dark-brown focus:border-dark-brown focus:outline-none"
              />
            </div>

            {state.status === 'error' && (
              <p className="text-xs text-burnt-orange" role="alert">
                {state.message}
              </p>
            )}

            <button type="submit" disabled={pending} className="btn-primary disabled:opacity-50">
              {pending ? 'Sending...' : 'Send sign-in link'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
