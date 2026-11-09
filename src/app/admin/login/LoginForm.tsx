'use client'

import { useActionState } from 'react'
import { requestMagicLink, type LoginState } from './actions'
import { LOGIN_COPY, type BilingualText } from './copy'

const initialState: LoginState = { status: 'idle' }

interface LoginFormProps {
  /** The magic link failed, or a session exists without admin access. */
  linkFailed: boolean
}

function Bilingual({ text, className }: { text: BilingualText; className: string }) {
  return (
    <div className={className}>
      <p lang="ka">{text.ka}</p>
      <p lang="en" className="mt-2">
        {text.en}
      </p>
    </div>
  )
}

/**
 * Passwordless admin sign-in, matching the project's "Supabase Magic Link, no
 * passwords" rule. The allowlist check happens server-side in the action, so
 * this form cannot be used to enumerate who has access.
 */
export function LoginForm({ linkFailed }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(requestMagicLink, initialState)
  const sameBrowserNote = (
    <Bilingual
      text={LOGIN_COPY.sameBrowser}
      className="mt-6 border-t border-dark-brown/15 pt-4 text-xs leading-relaxed text-dark-brown/60"
    />
  )

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-burnt-orange">
          Longevity One
        </p>
        <h1 className="mb-8 text-2xl font-black text-dark-brown">Leads dashboard</h1>

        {linkFailed && state.status === 'idle' && (
          <div role="alert">
            <Bilingual
              text={LOGIN_COPY.linkFailed}
              className="mb-8 border-l-2 border-burnt-orange pl-4 text-sm leading-relaxed text-dark-brown/80"
            />
          </div>
        )}

        {state.status === 'sent' ? (
          <>
            <p className="text-sm leading-relaxed text-dark-brown/70">{state.message}</p>
            {sameBrowserNote}
          </>
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

            {sameBrowserNote}
          </form>
        )}
      </div>
    </main>
  )
}
