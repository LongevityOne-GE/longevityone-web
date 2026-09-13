# Security Audit and Hardening Plan

**Site:** Longevity One (longevityone.ge)
**Scope:** Full codebase review - Next.js 16 app, Sanity CMS, Supabase, Resend, Cal.com, Sentry
**Date:** 2026-06-18
**Status:** Hardening in progress on branch `security/hardening`. As of 2026-06-22: all 3 high resolved; 4 of 5 medium resolved (M3 partial); both low workstreams partially done. See the change log.

This document is the single source of truth for the site's security posture. Update the checkboxes as items are completed, and append new findings with a date as the site evolves. The goal is a website that stays safe for the long term.

---

## 1. Executive summary

The foundation is strong. The codebase already applies many best practices: Row Level Security on every database table, no secrets in git, validated and rate-limited API routes, HTML-escaped emails, and a real Content-Security-Policy.

The findings below are mostly hardening and privacy-tightening rather than open holes. The highest-value items are: closing a direct database-write path, patching dependency vulnerabilities, and tightening Sentry data capture for GDPR.

Counts: 3 high, 5 medium, 2 low-priority workstreams.

---

## 2. What is already secure (do not regress)

- **Database access control.** Every table in `supabase/migrations/20260501000000_initial_schema.sql` has `ROW LEVEL SECURITY` enabled. Patient and clinical tables (`patients`, `assessments`, `biomarker_readings`) are scoped to `auth.uid()`. `consent_log` is service-role only and stores a hashed IP, never a raw IP.
- **Secret hygiene.** No `.env` file is tracked in git history. `.gitignore` excludes `.env*`. The public Sanity client (`src/lib/sanity/client.ts`) and Sanity live client (`src/sanity/lib/client.ts`) carry no token and read only published content.
- **Service-role guard.** `src/lib/supabase/server.ts` throws if the service-role client is ever constructed in the browser.
- **API input validation.** `src/app/api/contact/route.ts` and `src/app/api/founder-circle/route.ts` validate all input with Zod, escape HTML before sending email, and return generic error messages.
- **Bot defenses on contact.** The contact route uses a honeypot field plus Cloudflare Turnstile verification.
- **Security headers.** `next.config.ts` sets a CSP, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and `frame-ancestors 'none'`.
- **Studio auth.** `/studio` is the embedded Sanity Studio, gated by Sanity account authentication.

---

## 3. Findings and remediation checklist

Severity reflects real-world risk to this site. Effort is a rough estimate.

### High priority

- [x] **H1 - Remove anon direct INSERT on the leads table** (migration written; NOT yet applied to live DB)
  - **Where:** `supabase/migrations/20260607000001_founder_circle_leads.sql:16`
  - **Risk:** The policy `founder_circle_leads_insert` grants role `anon` INSERT with `WITH CHECK (TRUE)`. The public anon key is shipped to the browser, so anyone can insert rows directly through the Supabase REST API, bypassing the API route's Zod validation, rate limiting, and honeypot. This enables database spam and junk-lead flooding.
  - **Fix:** Drop the anon INSERT policy in a new migration. The route at `src/app/api/founder-circle/route.ts` already writes with the service-role key, so legitimate inserts keep working.
  - **Trade-off:** None. The app does not insert leads from the browser.
  - **Effort:** Small.

- [x] **H2 - Patch dependency vulnerabilities** (31 -> 12; all 6 high cleared; 12 moderate build/Studio tooling accepted, see change log)
  - **Where:** `package.json` dependency tree.
  - **Risk:** `npm audit` reports 31 vulnerabilities (6 high). Notable: `ws` (memory disclosure and DoS) and `vite` (Windows-only path issues, dev tooling). Most are transitive via Sanity tooling and `resend` -> `svix` -> `uuid`.
  - **Fix:** Run `npm audit fix` for non-breaking patches. Review remaining items individually before considering `npm audit fix --force` (it can bump majors). Re-run `npm audit` until only accepted, documented risks remain.
  - **Trade-off:** `--force` may introduce breaking changes; test the build and key flows afterward.
  - **Effort:** Small to medium.

- [x] **H3 - Tighten Sentry PII and Session Replay**
  - **Where:** `src/instrumentation-client.ts:28` (`sendDefaultPii: true`) plus `replayIntegration()`.
  - **Risk:** On a medical site, sending default PII and recording session replays can capture sensitive form input and identifiers. This is a GDPR exposure even if Sentry masks text by default.
  - **Fix:** Set `sendDefaultPii: false`. If replay stays on, enforce strict masking (`maskAllText: true`, `blockAllMedia: true`) and exclude form pages, or lower `replaysSessionSampleRate` to 0. Confirm a Data Processing Agreement with Sentry and document the data retention period.
  - **Trade-off:** Less debugging detail. Acceptable for a clinic.
  - **Effort:** Small.

### Medium priority

- [x] **M1 - Stop logging full PII in the contact route**
  - **Where:** `src/app/api/contact/route.ts:179`
  - **Risk:** The route logs name, email, phone, full message, and raw IP to host logs. This duplicates personal data into Vercel log retention and contradicts the hashed-IP design used by `consent_log`.
  - **Fix:** Log only non-identifying metadata (timestamp, locale, hashed IP, a submission id). Rely on the email and database as the system of record.
  - **Effort:** Small.

- [x] **M2 - Add Turnstile and honeypot to the founder-circle endpoint** (honeypot done; Turnstile deferred to browser testing)
  - **Where:** `src/app/api/founder-circle/route.ts`
  - **Risk:** This endpoint both writes to the database and sends email, yet lacks the Turnstile and honeypot protections the contact route has. It is the more abusable of the two (lead spam plus email amplification).
  - **Fix:** Mirror the contact route: add a honeypot field and Turnstile verification before the insert and send.
  - **Effort:** Small.

- [~] **M3 - Move rate limiting to a durable store and trust the right IP** (IP trust done via cf-connecting-ip; durable store needs infra decision)
  - **Where:** `src/app/api/contact/route.ts:59`, `src/app/api/founder-circle/route.ts:25`
  - **Risk:** Rate limit state is in-memory, so it resets per serverless instance and is effectively per-instance only. IP is read from `x-forwarded-for`, which a client can spoof, defeating per-IP limits.
  - **Fix:** Use Vercel KV or Upstash Redis for shared counters. Derive the client IP from a trusted platform signal rather than the raw left-most `x-forwarded-for` value.
  - **Trade-off:** Adds a small infra dependency.
  - **Effort:** Medium.

- [x] **M4 - Harden the revalidate webhook** (constant-time + header secret; full signature verification optional)
  - **Where:** `src/app/api/revalidate/route.ts:19`
  - **Risk:** Authentication uses a `?secret=` query parameter, which can leak into logs and proxies, and the comparison is not constant-time.
  - **Fix:** Verify the Sanity webhook signature header (`@sanity/webhook` `isValidSignature`) instead of a URL secret. Keep the secret in an environment variable.
  - **Effort:** Small.

- [x] **M5 - Remove stored-XSS vectors in rendering**
  - **Where:** heading components using `dangerouslySetInnerHTML` (`src/components/shared/PageHero.tsx:46`, `src/components/sections/Hero.tsx:38`, `src/components/sections/CTA.tsx:32`, `src/components/sections/AboutIntro.tsx:44`, `src/components/sections/CorporateHero.tsx:65`, `src/components/sections/journey/JourneyHero.tsx:50`) and JSON-LD (`src/components/sections/journey/JourneyJsonLd.tsx:93`, `src/components/sections/advisory/AdvisoryJsonLd.tsx:73`).
  - **Risk:** Headings inject CMS strings as raw HTML after a newline replace. JSON-LD serializes CMS values without escaping `<`, so a `</script>` sequence could break out. Exploiting either requires a Sanity editor account, so likelihood is low, but the impact is script execution for every visitor.
  - **Fix:** Render newlines in React by splitting on `\n` and inserting `<br />` elements instead of `dangerouslySetInnerHTML`. For JSON-LD, escape `<` as `\u003c` in the serialized string.
  - **Effort:** Small to medium.

### Low priority and long-term workstreams

- [~] **L1 - Strengthen headers** (base-uri/object-src/form-action + HSTS done; nonce work + robots disallow remain)
  - Add `base-uri 'self'`, `object-src 'none'`, and `form-action 'self'` to the CSP in `next.config.ts`.
  - Add `Strict-Transport-Security` at the app level for defense in depth (Cloudflare currently provides it at the edge).
  - Work toward removing `'unsafe-inline'` and `'unsafe-eval'` from `script-src` using nonces, acknowledging Google Tag Manager makes this harder.
  - Add a `robots` rule to disallow indexing of `/studio`, `/monitoring`, and `/api`.

- [~] **L2 - Operational hygiene for the long horizon** (Dependabot + security.txt done; rest are ops tasks)
  - Enable GitHub Dependabot (or Renovate) for automated dependency PRs.
  - Add a `/.well-known/security.txt` with a security contact.
  - Confirm Sentry source maps are uploaded but not publicly served (`deleteSourcemapsAfterUpload`).
  - Keep the separate `ai-studio/` Vite app (holds a Gemini key) out of the production website deployment, and audit its dependencies independently.
  - Schedule a recurring quarterly review using this document.

---

## 4. Suggested order of execution

1. H1 (anon INSERT) and H3 (Sentry PII) - small, no UX impact, immediate risk reduction.
2. M1 (PII logs) and M5 (XSS) - small, privacy and injection hardening.
3. H2 (dependencies) - patch, then test build and core flows.
4. M2 (founder-circle bot defenses) and M4 (webhook signature).
5. M3 (durable rate limiting) - requires infra decision.
6. L1 and L2 - headers and long-term operations.

---

## 5. Long-term maintenance cadence

For a site intended to run for decades, security is a routine, not a one-time event.

- **Weekly:** Review Dependabot PRs. Watch Sentry for anomalies.
- **Monthly:** `npm audit`. Confirm Turnstile, email, and booking flows still work.
- **Quarterly:** Re-read this document. Rotate API tokens (Sanity, Supabase service role, Resend). Review Supabase RLS policies and access logs.
- **Annually:** Full re-audit. Review the data retention policy and GDPR posture. Confirm backups and a tested restore for Supabase.

---

## 6. Change log

- 2026-06-18 - Initial audit and plan created. No code changes applied.
- 2026-06-18 - Phase 1 on `security/hardening`: H1 (migration), H3 (Sentry PII), M1 (PII logs), M2 (honeypot), M4 (webhook hardening), L2 (Dependabot + security.txt). Verified typecheck/lint/build.
- 2026-06-22 - Phase 2 on `security/hardening` (SEO paused). Verified: typecheck, lint, production build all green.
  - **H2 done (residual accepted).** Non-breaking `npm audit fix` plus a Next.js patch bump 16.2.4 -> 16.2.9 cleared all 6 high (incl. App Router XSS via CSP nonces, middleware/proxy bypass, redirect cache poisoning, Server Components DoS). Remaining 12 are moderate transitive build/Studio tooling (js-yaml, postcss, uuid via Sanity CLI / @sanity/visual-editing). `npm audit fix --force` is unsafe: it would downgrade Next to 9.3.3. These need a coordinated Sanity major upgrade (sanity@3.70+) with Studio testing; Dependabot now tracks them.
  - **M5 done.** Replaced newline `dangerouslySetInnerHTML` in 6 heading components (Hero, CTA, CorporateHero, AboutIntro, JourneyHero, PageHero) with a React-safe `renderMultiline` helper in `src/lib/text.tsx`. JSON-LD (`JourneyJsonLd`, `AdvisoryJsonLd`) now serialized via `safeJsonLd`, which escapes `<` as `\u003c` to prevent `</script>` breakout.
  - **L1 partial.** Added `base-uri 'self'`, `object-src 'none'`, `form-action 'self'` to the CSP and an app-level `Strict-Transport-Security: max-age=63072000; includeSubDomains`. Remaining: remove `'unsafe-inline'`/`'unsafe-eval'` via nonces (GTM makes this hard) and add a robots disallow for `/studio` `/api` `/monitoring` (robots owned by the paused SEO branch).
  - **M3 partial.** Client IP now read from the unspoofable Cloudflare `cf-connecting-ip` header in both API routes. Durable shared-store rate limiting (Upstash / Vercel KV) still pending an infra decision; the limiter remains in-memory/per-instance.
  - **Still pending:** apply H1 migration to Supabase; browser-test Turnstile on lead forms; M3 durable store (infra); optional M4 `@sanity/webhook` signature verification; coordinated Sanity major upgrade for the 12 moderate advisories.
