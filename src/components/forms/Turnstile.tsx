'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string
          callback: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
          theme?: 'auto' | 'light' | 'dark'
          size?: 'normal' | 'compact' | 'flexible'
        },
      ) => string
      reset: (id?: string) => void
      remove: (id?: string) => void
    }
    __turnstileOnload?: () => void
  }
}

export interface TurnstileHandle {
  reset: () => void
}

interface TurnstileProps {
  siteKey: string
  onToken: (token: string) => void
  theme?: 'auto' | 'light' | 'dark'
}

const SCRIPT_ID = 'cf-turnstile-script'
const SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=__turnstileOnload&render=explicit'

/**
 * Callbacks waiting for the Turnstile API to become available.
 *
 * The script's `onload=` parameter fires exactly once, globally. A single
 * `window.__turnstileOnload = render` assignment therefore breaks as soon as
 * more than one widget can exist, or when a widget mounts while the script is
 * already in flight: the second assignment overwrites the first, or the one
 * shot fires against a component that has since unmounted, and the widget
 * silently never renders. That is what happened to the widget inside the lead
 * capture modal, which mounts long after page load.
 *
 * Instead every instance registers here and the single global callback drains
 * the queue.
 */
const pending = new Set<() => void>()

function flushPending() {
  for (const cb of [...pending]) {
    pending.delete(cb)
    cb()
  }
}

export const Turnstile = forwardRef<TurnstileHandle, TurnstileProps>(
  function Turnstile({ siteKey, onToken, theme = 'auto' }, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | null>(null)
    const onTokenRef = useRef(onToken)
    onTokenRef.current = onToken

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current)
          onTokenRef.current('')
        }
      },
    }))

    useEffect(() => {
      function render() {
        if (!containerRef.current || !window.turnstile) return
        if (widgetIdRef.current) return
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(''),
          'error-callback': () => onTokenRef.current(''),
          theme,
        })
      }

      if (window.turnstile) {
        render()
        return () => {
          if (widgetIdRef.current && window.turnstile) {
            window.turnstile.remove(widgetIdRef.current)
            widgetIdRef.current = null
          }
        }
      }

      pending.add(render)
      window.__turnstileOnload = flushPending

      if (!document.getElementById(SCRIPT_ID)) {
        const script = document.createElement('script')
        script.id = SCRIPT_ID
        script.src = SCRIPT_SRC
        script.async = true
        script.defer = true
        document.head.appendChild(script)
      }

      // Fallback: if the one-shot onload already fired before this instance
      // registered (a widget mounting while the script was in flight), poll
      // briefly for the API rather than leaving the form permanently unusable.
      const poll = window.setInterval(() => {
        if (window.turnstile) {
          window.clearInterval(poll)
          pending.delete(render)
          render()
        }
      }, 150)
      const stopPolling = window.setTimeout(() => window.clearInterval(poll), 15000)

      return () => {
        window.clearInterval(poll)
        window.clearTimeout(stopPolling)
        pending.delete(render)
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current)
          widgetIdRef.current = null
        }
      }
    }, [siteKey, theme])

    return <div ref={containerRef} />
  },
)
