import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { createHash } from 'node:crypto'
import { attributionSchema, attributionToColumns } from '@/lib/attribution'
import { createClient } from '@supabase/supabase-js'
import { reportLeadConversion } from '@/lib/server-conversions'
import { randomUUID } from 'node:crypto'
import { attributionHtml, attributionText } from '@/lib/attribution-email'

export const runtime = 'nodejs'

/** Nominal lead value for smart bidding. Mirrors NEXT_PUBLIC_LEAD_VALUE. */
const LEAD_VALUE = Number(process.env.NEXT_PUBLIC_LEAD_VALUE ?? '0')
const LEAD_CURRENCY = process.env.NEXT_PUBLIC_LEAD_CURRENCY ?? 'GEL'

/**
 * GA4 client ID, read from the _ga cookie the browser already set, so the
 * server-reported conversion joins the same GA4 session rather than counting a
 * second, unrelated user.
 */
function ga4ClientId(req: NextRequest): string {
  const raw = req.cookies.get('_ga')?.value
  const match = raw?.match(/^GA\d\.\d\.(\d+\.\d+)$/)
  return match?.[1] ?? `${Math.floor(Math.random() * 1e10)}.${Math.floor(Date.now() / 1000)}`
}

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(254),
  phone: z.string().max(40).optional(),
  message: z.string().min(10).max(5000),
  locale: z.enum(['ka', 'en']),
  // Honeypot: must be empty. Real users never fill this hidden field.
  company: z.string().max(0).optional(),
  // Cloudflare Turnstile token. Required in production; optional in dev.
  turnstileToken: z.string().optional(),
  // Page the form was submitted from. Attacker-controllable, so length capped.
  submitted_from: z.string().max(500).optional(),
  // Explicit consent to process personal data. Required because this route now
  // persists the enquirer's contact details, not just emails them.
  consent: z.literal(true, { error: () => ({ message: 'Consent is required' }) }),
  // Campaign attribution replayed by the browser from sessionStorage. Surfaced
  // in the notification email only - this route intentionally writes no DB row.
  ...attributionSchema.shape,
})

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[contact] TURNSTILE_SECRET_KEY missing in production')
      return false
    }
    console.warn('[contact] TURNSTILE_SECRET_KEY not set; skipping verification (dev only)')
    return true
  }
  if (!token) return false
  try {
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      },
    )
    const data = (await res.json()) as {
      success: boolean
      'error-codes'?: string[]
    }
    if (!data.success) {
      console.warn('[contact] turnstile verification failed', data['error-codes'])
    }
    return data.success
  } catch (err) {
    console.error('[contact] turnstile verify error', err)
    return false
  }
}

// Best-effort in-memory rate limit: 5 submissions / 10 min / IP.
// Note: in serverless multi-instance deployments this is per-instance only;
// it still raises the cost bar for casual abuse. Use a shared store (Redis,
// Upstash) for stronger guarantees.
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
  // Opportunistic cleanup so the map doesn't grow unbounded.
  if (ipHits.size > 5000) {
    for (const [key, value] of ipHits) {
      const fresh = value.filter((t) => t > cutoff)
      if (fresh.length === 0) ipHits.delete(key)
      else ipHits.set(key, fresh)
    }
  }
  return false
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

  const { name, email, phone, message, locale, company, turnstileToken } =
    parsed.data
  const attribution = attributionSchema.parse(parsed.data)
  // Shared with the browser event so the ad platforms deduplicate the two.
  const eventId = randomUUID()

  // Honeypot tripped: respond with a generic success so bots don't learn.
  if (company && company.length > 0) {
    console.warn('[contact] honeypot triggered', { ipHash: hashIp(ip) })
    return NextResponse.json({ ok: true })
  }

  const captchaOk = await verifyTurnstile(turnstileToken ?? '', ip)
  if (!captchaOk) {
    return NextResponse.json(
      { error: 'Captcha verification failed' },
      { status: 403 },
    )
  }

  // Persist the enquiry as a lead so it appears in the admin dashboard next to
  // lead-form submissions - otherwise half the leads are invisible there.
  //
  // The MESSAGE BODY IS DELIBERATELY NOT STORED. Free text on a medical site can
  // contain health information, and this table is not the place for it. Only who
  // enquired and which campaign brought them is persisted; the message stays in
  // the inbox. Never add a `message` column here.
  //
  // Best effort: the email below is the system of record, so a DB failure must
  // not fail the request or lose the enquiry.
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )
    const { error: dbError } = await supabase.from('founder_circle_leads').insert({
      name,
      phone: phone ?? '',
      email,
      lang: locale,
      consent: true,
      source: 'contact_form',
      form_type: 'contact_form',
      submitted_from: parsed.data.submitted_from ?? null,
      ...attributionToColumns(attribution),
    })
    if (dbError) {
      console.error('[contact] supabase insert error', dbError.message)
    }
  } catch (err) {
    console.error('[contact] supabase client error', err)
  }

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_EMAIL

  if (!apiKey || !toEmail) {
    console.error('[contact] missing env: RESEND_API_KEY or CONTACT_EMAIL')
    return NextResponse.json({ error: 'Email not configured' }, { status: 503 })
  }

  const resend = new Resend(apiKey)

  const subject =
    locale === 'ka' ? `ახალი შეტყობინება: ${name}` : `New enquiry from ${name}`

  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safePhone = phone ? escapeHtml(phone) : ''
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />')


  const html = `
    <p><strong>Name:</strong> ${safeName}</p>
    <p><strong>Email:</strong> ${safeEmail}</p>
    ${safePhone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${safeMessage}</p>
    ${attributionHtml(attribution, escapeHtml)}
  `

  const text =
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    (phone ? `Phone: ${phone}\n` : '') +
    `\nMessage:\n${message}\n` +
    attributionText(attribution)

  try {
    await resend.emails.send({
      from: 'Longevity One <noreply@longevityone.ge>',
      to: toEmail,
      replyTo: email,
      subject,
      html,
      text,
    })
    // Privacy: never log PII (name/email/phone/message) or the raw IP to host
    // logs. The staff inbox and the Resend dashboard are the system of record.
    // Only non-identifying metadata is logged, for monitoring and abuse triage.
    console.info('[contact] submission', {
      ts: new Date().toISOString(),
      ipHash: hashIp(ip),
      locale,
      messageLength: message.length,
    })
  } catch (err) {
    console.error('[contact] resend send failed', err)
    return NextResponse.json({ error: 'Send failed' }, { status: 500 })
  }

  // Best-effort auto-reply confirmation to the submitter. Failure here
  // must NOT fail the request - the staff already received the message.
  try {
    const replySubject =
      locale === 'ka'
        ? 'მივიღეთ თქვენი შეტყობინება - Longevity One'
        : 'We received your message - Longevity One'
    const replyHtml =
      locale === 'ka'
        ? `<p>პატივცემულო ${safeName},</p>
           <p>გმადლობთ დაკავშირებისთვის. მივიღეთ თქვენი შეტყობინება და მალე დაგიკავშირდებით.</p>
           <p>- Longevity One-ის გუნდი</p>`
        : `<p>Hi ${safeName},</p>
           <p>Thank you for contacting Longevity One. We have received your message and will be in touch shortly.</p>
           <p>- The Longevity One team</p>`
    const replyText =
      locale === 'ka'
        ? `პატივცემულო ${name},\n\nგმადლობთ დაკავშირებისთვის. მივიღეთ თქვენი შეტყობინება და მალე დაგიკავშირდებით.\n\n- Longevity One-ის გუნდი`
        : `Hi ${name},\n\nThank you for contacting Longevity One. We have received your message and will be in touch shortly.\n\n- The Longevity One team`

    await resend.emails.send({
      from: 'Longevity One <noreply@longevityone.ge>',
      to: email,
      replyTo: toEmail,
      subject: replySubject,
      html: replyHtml,
      text: replyText,
    })
  } catch (err) {
    console.warn('[contact] auto-reply failed (non-fatal)', err)
  }

  // Report the conversion server-side too, so ad-blocked visitors are still
  // counted. Deduplicated against the browser event via eventId. No-ops until
  // the ad manager supplies credentials.
  await reportLeadConversion({
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
      '/contact',
    clientIp: ip,
    userAgent: req.headers.get('user-agent') ?? undefined,
    clientId: ga4ClientId(req),
    leadSource: 'contact_form',
    value: LEAD_VALUE > 0 ? LEAD_VALUE : undefined,
    currency: LEAD_CURRENCY,
  })

  return NextResponse.json({ ok: true, eventId })
}
