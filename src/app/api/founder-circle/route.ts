import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const schema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(6).max(40),
  email: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().email().max(254).optional(),
  ),
  lang: z.enum(['ka', 'en']),
  consent: z.literal(true, {
    error: () => ({ message: 'Consent is required' }),
  }),
  source: z.string().min(1).max(100).default('founder_circle'),
})

// Best-effort in-memory rate limit: 5 submissions / 10 min / IP
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const ipHits = new Map<string, number[]>()

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return (fwd.split(',')[0] ?? '').trim() || 'unknown'
  return req.headers.get('x-real-ip') ?? 'unknown'
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

  const { name, phone, email, lang, source } = parsed.data

  // Insert lead using service role key (bypasses RLS — server only, never client-reachable)
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )
    const { error: dbError } = await supabase
      .from('founder_circle_leads')
      .insert({ name, phone, email: email ?? null, lang, consent: true, source })

    if (dbError) {
      console.error('[founder-circle] supabase insert error', dbError)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
    }
  } catch (err) {
    console.error('[founder-circle] supabase client error', err)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[founder-circle] RESEND_API_KEY not configured')
    // Lead is saved; email failure is non-fatal but we still warn
    return NextResponse.json({ success: true })
  }

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
  const emailSubject = `New lead — ${sourceLabel}`
  const emailHeading = `New Lead: ${sourceLabel}`

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
      `,
      text:
        `${emailHeading}\n\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Email: ${email ?? '—'}\n` +
        `Language: ${lang}\n` +
        `Source: ${source}\n`,
    })
  } catch (err) {
    console.error('[founder-circle] notification email failed', err)
  }

  // Auto-reply to lead (only if email was provided)
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

  return NextResponse.json({ success: true })
}
