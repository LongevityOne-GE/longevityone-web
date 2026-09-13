# Longevity One

Production website and patient-acquisition platform for a preventive medicine clinic in Tbilisi, Georgia.

**Live:** [www.longevityone.ge](https://www.longevityone.ge)

Built and maintained by [Kristine Saralidze](https://github.com/kristisaralidze).

---

## Overview

Longevity One is a bilingual (Georgian and English) marketing site and lead-management system serving a real clinic with real patients. It is not a demo. It handles live patient enquiries, booking, consent capture under GDPR, and an internal dashboard the clinic uses daily to work its leads.

| | |
|---|---|
| **Stack** | Next.js 16 (App Router), React 19, TypeScript, Tailwind |
| **Content** | Sanity CMS v5, bilingual schemas, live preview |
| **Data** | Supabase (Postgres, EU Frankfurt), Row Level Security on every table |
| **Email** | Resend (EU region) |
| **Booking** | Cal.com Atoms embed |
| **Monitoring** | Sentry |
| **Hosting** | Vercel behind Cloudflare (WAF, TLS 1.3 full strict) |
| **Scale** | ~22,500 lines of TypeScript, 36 routed pages, 100+ components |

---

## Architecture

```
User (longevityone.ge)
      │
      ▼
Cloudflare ......... DNS, CDN, WAF, DDoS, TLS 1.3
      │
      ▼
Vercel Edge ........ Next.js App Router (renders only; stores no health data)
      │
      ├── Sanity CDN ......... content and images
      ├── Supabase EU ........ leads and consent, RLS enforced
      ├── Resend EU .......... transactional email
      ├── Cal.com ............ booking
      └── PostHog / GA4 ...... analytics, consent gated
```

Full detail, including data-residency reasoning and the request lifecycle, is in [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Engineering decisions worth calling out

**Bilingual routing without a heavyweight i18n library.**
Georgian is the default locale and serves from the route group `src/app/(ka)`, so Georgian URLs carry no locale prefix while English lives under `/en`. Middleware sets an `x-lang` request header that server components read directly, which keeps locale resolution out of the client bundle entirely.

**Auth middleware that fails closed and stays off the hot path.**
Session work runs only for `/admin` routes, so public pages pay zero auth latency. If Supabase environment variables are missing, the admin area redirects to login rather than falling open. A misconfiguration locks the door instead of opening it.

**Row Level Security as the actual boundary, not a formality.**
Every table has RLS enabled. Patient and clinical tables scope to `auth.uid()`. The consent log is service-role only and stores a hashed IP, never a raw one, so consent can be proven without retaining personal data.

**Defence in depth on public write paths.**
The contact and founder-circle endpoints validate with Zod, rate limit by IP, and HTML-escape everything before it reaches an email template. A real Content-Security-Policy ships alongside HSTS, `X-Frame-Options`, and `Permissions-Policy`.

**SEO and generative-engine optimisation treated as a first-class feature.**
Dedicated pages per service and technology with keyword-led slugs, JSON-LD structured data (`Physician`, `MedicalClinic`, `FAQPage`), hreflang pairs across both locales, a generated sitemap, and an `llms.txt` describing site structure for AI crawlers.

---

## Security and privacy

The clinic handles health-adjacent personal data, so privacy drove several architectural choices: EU-only data residency, consent-gated analytics, hashed IPs, and no health data stored at the edge.

[SECURITY-AUDIT.md](./SECURITY-AUDIT.md) is a standing audit of the codebase with severity-rated findings and a change log, maintained as the site evolves rather than written once.

---

## Local development

```bash
npm install
cp .env.example .env.local   # fill in Sanity, Supabase, Resend keys
npm run dev
```

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

The Sanity Studio is embedded at `/studio`.

---

## Project structure

```
src/
├── app/
│   ├── (ka)/        Georgian pages (default locale, no prefix)
│   ├── en/          English pages
│   ├── admin/       Lead dashboard, Supabase magic-link auth
│   ├── api/         Contact, founder-circle, revalidate
│   └── studio/      Embedded Sanity Studio
├── components/      Sections, forms, layout, SEO, analytics
├── lib/             Sanity, Supabase, SEO schema, attribution
└── sanity/          Bilingual content schemas
```

Further documentation: [ARCHITECTURE.md](./ARCHITECTURE.md) · [SECURITY-AUDIT.md](./SECURITY-AUDIT.md) · [BRAND.md](./BRAND.md) · [CONTENT.md](./CONTENT.md)

---

## Authorship and licence

Authored by **Kristine Saralidze**. Source code ownership is retained by the
author under written agreement with Longevity One. Brand, clinical copy, and
media assets remain the property of Longevity One. See [LICENSE](./LICENSE).
