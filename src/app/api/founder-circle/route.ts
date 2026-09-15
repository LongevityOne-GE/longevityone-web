import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'node:crypto'
import { attributionSchema, attributionToColumns } from '@/lib/attribution'
import { attributionHtml, attributionText } from '@/lib/attribution-email'
import { reportLeadConversion } from '@/lib/server-conversions'
import { randomUUID } from 'node:crypto'

export const runtime = 'nodejs'

/** Nominal lead value for smart bidding. Mirrors NEXT_PUBLIC_LEAD_VALUE. */
const LEAD_VALUE = Number(process.env.NEXT_PUBLIC_LEAD_VALUE ?? '0')
const LEAD_CURRENCY = process.env.NEXT_PUBLIC_LEAD_CURRENCY ?? 'GEL'

const schema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(6).max(40),
  // Optional. The `.optional()` inside the preprocess only covers the value
  // AFTER the transform runs; the preprocess wrapper itself is still required,
  // so omitting the key entirely was rejected with a 422. The browser form
  // always sends a string (possibly empty) so this never bit a real visitor,
  // but any other client posting a lead without the key would be turned away.
  email: z
    .preprocess(
      (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
      z.string().email().max(254).optional(),
    )
    .optional(),
  lang: z.enum(['ka', 'en']),
  consent: z.literal(true, {
    error: () => ({ message: 'Consent is required' }),
  }),
  source: z.string().min(1).max(100).default('founder_circle'),
  // Honeypot: real users never fill this hidden field. Bots often do.
  company: z.string().max(200).optional(),
  // Cloudflare Turnstile token. Required in production; optional in dev.
  turnstileToken: z.string().optional(),
  // Page the form was submitted from. Attacker-controllable, so length capped.
  submitted_from: z.string().max(500).optional(),
  // Marketing consent from the cookie banner. Meta is only told about the lead
  // when this is true, matching the browser Pixel's own consent gate.
  marketing_consent: z.boolean().optional(),
  // Campaign attribution replayed by the browser from sessionStorage. All
  // fields optional - organic visitors carry none, and a lead must never be
  // rejected for lacking attribution.
  ...attributionSchema.shape,
})

// Best-effort in-memory rate limit: 5 submissions / 10 min / IP
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const ipHits = new Map<string, number[]>()

function getClientIp(req: NextRequest): string {
  // Cloudflare sets cf-connecting-ip to the real client IP and overwrites any
  // client-supplied value, so it cannot be spoofed. Prefer it over the
  // client-controllable x-forwarded-for chain.
  const cf = req.headers.get('cf-connecting-ip')
  if (cf) return cf.trim()
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return (fwd.split(',')[0] ?? '').trim() || 'unknown'
  return req.headers.get('x-real-ip') ?? 'unknown'
}

// One-way hash so logs can correlate abuse by IP without storing the raw IP.
function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 16)
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const cutoff = now - RATE_LIMIT_WINDOW_MS
  const hits = (ipHits.get(ip) ?? []).filter((t) => t > cutoff)
  if (hits.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, hits)
    return true
  }
  hits.push(now)
  ipHits.set(ip, hits)
  if (ipHits.size > 5000) {
    for (const [key, value] of ipHits) {
      const fresh = value.filter((t) => t > cutoff)
      if (fresh.length === 0) ipHits.delete(key)
      else ipHits.set(key, fresh)
    }
  }
  return false
}


/**
 * Verify the Turnstile token.
 *
 * This is the endpoint the ads drive traffic to, so it is the one bots will
 * find. The honeypot alone is not enough: this repository is public, so the
 * hidden field's name is public too. Spam leads would corrupt the cost-per-lead
 * the ad manager optimises against, so they are stopped at the door.
 *
 * Fails closed in production: a missing secret rejects rather than waves through.
 */
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[founder-circle] TURNSTILE_SECRET_KEY missing in production')
      return false
    }
    console.warn('[founder-circle] TURNSTILE_SECRET_KEY not set; skipping (dev only)')
    return true
  }
  if (!token) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    })
    const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] }
    if (!data.success) {
      console.warn('[founder-circle] turnstile verification failed', data['error-codes'])
    }
    return data.success
  } catch (err) {
    console.error('[founder-circle] turnstile verify error', err)
    return false
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': '600' } },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 422 })
  }

  const { name, phone, email, lang, source, company, turnstileToken } = parsed.data
  // Shared between the server-side conversion and the browser event so the ad
  // platforms deduplicate the two into one conversion.
  const eventId = randomUUID()
  const attribution = attributionSchema.parse(parsed.data)

  // Honeypot tripped: respond with a generic success so bots do not learn.
  if (company && company.trim().length > 0) {
    console.warn('[founder-circle] honeypot triggered', { ipHash: hashIp(ip) })
    return NextResponse.json({ success: true })
  }

  const captchaOk = await verifyTurnstile(turnstileToken ?? '', ip)
  if (!captchaOk) {
    return NextResponse.json({ error: 'Captcha verification failed' }, { status: 403 })
  }

  // Persist the lead using the service role key (bypasses RLS — server only,
  // never client-reachable). A failure here (e.g. the Supabase project paused or
  // unreachable) must NOT silently drop the lead — the notification email below
  // acts as a durable fallback record, so we track success instead of bailing out.
  let leadSaved = false
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )
    const { error: dbError } = await supabase
      .from('founder_circle_leads')
      .insert({
        name,
        phone,
        email: email ?? null,
        lang,
        consent: true,
        source,
        form_type: 'lead_form',
        submitted_from: parsed.data.submitted_from ?? null,
        ...attributionToColumns(attribution),
      })

    if (dbError) {
      console.error('[founder-circle] supabase insert error', dbError)
    } else {
      leadSaved = true
    }
  } catch (err) {
    console.error('[founder-circle] supabase client error', err)
  }

  // Email is both the staff notification AND the fallback capture channel: as
  // long as the clinic receives it, the lead is not lost even if the DB write
  // failed. We only treat the submission as failed if BOTH channels fail.
  const apiKey = process.env.RESEND_API_KEY
  let leadEmailed = false

  if (apiKey) {
    const resend = new Resend(apiKey)
    const safeName = escapeHtml(name)
    const safePhone = escapeHtml(phone)
    const safeEmail = email ? escapeHtml(email) : ''

    const SOURCE_LABELS: Record<string, string> = {
      founder_circle: 'Founder Circle 50',
      packages:       'Packages page',
      final_cta:      'Packages — closing CTA',
    }
    const sourceLabel = SOURCE_LABELS[source] ?? source

    // Flag the email when the DB write failed so staff know to record the lead
    // manually (the row is not in Supabase).
    const dbWarning = leadSaved ? '' : ' [⚠ DB SAVE FAILED — enter this lead manually]'
    const emailSubject = `New lead — ${sourceLabel}${dbWarning}`
    const emailHeading = `New Lead: ${sourceLabel}${dbWarning}`

    // Notification to clinic
    try {
      await resend.emails.send({
        from: 'Longevity One <noreply@longevityone.ge>',
        to: 'info@longevityone.ge',
        subject: emailSubject,
        html: `
          <h2>${escapeHtml(emailHeading)}</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          ${safeEmail ? `<p><strong>Email:</strong> ${safeEmail}</p>` : '<p><strong>Email:</strong> —</p>'}
          <p><strong>Language:</strong> ${lang}</p>
          <p><strong>Source:</strong> ${escapeHtml(source)}</p>
          ${attributionHtml(attribution, escapeHtml)}
        `,
        text:
          `${emailHeading}\n\n` +
          `Name: ${name}\n` +
          `Phone: ${phone}\n` +
          `Email: ${email ?? '—'}\n` +
          `Language: ${lang}\n` +
          `Source: ${source}\n` +
          attributionText(attribution),
      })
      leadEmailed = true
    } catch (err) {
      console.error('[founder-circle] notification email failed', err)
    }

    // Auto-reply to lead (only if email was provided; best-effort, non-fatal)
    if (email) {
      try {
        const isKa = lang === 'ka'
        const replySubject = isKa
          ? 'მოთხოვნა მიღებულია - Longevity One'
          : 'Request received - Longevity One'
        const replyHtml = isKa
          ? `<p>გამარჯობა ${safeName},</p>
             <p>მივიღეთ თქვენი განაცხადი. ჩვენი კონსიერჟი 24 საათის განმავლობაში დაგიკავშირდებათ.</p>
             <p>— Longevity One-ის გუნდი</p>`
          : `<p>Hello ${safeName},</p>
             <p>We received your request. Our concierge will call you within 24 hours.</p>
             <p>— The Longevity One team</p>`
        const replyText = isKa
          ? `გამარჯობა ${name},\n\nმივიღეთ თქვენი განაცხადი. ჩვენი კონსიერჟი 24 საათის განმავლობაში დაგიკავშირდებათ.\n\n— Longevity One-ის გუნდი`
          : `Hello ${name},\n\nWe received your request. Our concierge will call you within 24 hours.\n\n— The Longevity One team`

        await resend.emails.send({
          from: 'Longevity One <noreply@longevityone.ge>',
          to: email,
          replyTo: 'info@longevityone.ge',
          subject: replySubject,
          html: replyHtml,
          text: replyText,
        })
      } catch (err) {
        console.warn('[founder-circle] auto-reply failed (non-fatal)', err)
      }
    }
  } else {
    console.error('[founder-circle] RESEND_API_KEY not configured')
  }

  // The lead is captured if it reached Supabase OR the clinic inbox. Only report
  // failure when both channels failed — otherwise the visitor sees a false error
  // and re-submits a lead we already have.
  if (!leadSaved && !leadEmailed) {
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }

  // Report the conversion from the server as well. Ad blockers and tracking
  // prevention stop a real share of browser tags from firing; the platforms
  // deduplicate against the browser event using this shared eventId, so nothing
  // is counted twice. No-ops entirely until the ad manager supplies credentials.
  //
  // Awaited but fully guarded: reportLeadConversion swallows every failure, so a
  // slow or broken ad platform cannot fail a lead that is already saved.
  await reportLeadConversion({
    marketingConsent: parsed.data.marketing_consent === true,
    eventId,
    email,
    phone,
    fbclid: attribution.fbclid ?? attribution.last_fbclid ?? null,
    // The page the form was actually submitted on is the most accurate source
    // URL; fall back to where the campaign landed them.
    sourceUrl:
      parsed.data.submitted_from ??
      attribution.last_landing_page ??
      attribution.landing_page ??
      '/',
    clientIp: ip,
    userAgent: req.headers.get('user-agent') ?? undefined,
    value: LEAD_VALUE > 0 ? LEAD_VALUE : undefined,
    currency: LEAD_CURRENCY,
  })

  // eventId goes back to the browser so the client-side lead_submitted event
  // can carry the same ID and the platforms can match the two.
  return NextResponse.json({ success: true, eventId })
}
