# Longevity One — Claude Code Master Configuration

> Read this file completely before writing any code, modifying any file, or making any architectural decision.
> This is the single source of truth for the entire project.

---

## Project Identity

**Project:** Longevity One — Longevity-focused medical clinic website
**Domain:** www.longevityone.ge
**Location:** Tbilisi, Georgia
**Design reference:** https://www.cliniquelaprairie.com (match this level of motion and luxury)
**Tagline:** The Art of Living Longer

---

## Repository

- **GitHub org:** Longevity One-GE
- **Repo:** longevityone-web (public)
- **Branch strategy:** `dev` → `staging` → `main` (production)
- **Never commit directly to `main`** — always PR from staging
- **Vercel:** auto-deploys `main` → production, `staging` → preview

---

## Tech Stack (strict — do not deviate)

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14 App Router | No Pages Router patterns ever |
| Language | TypeScript strict | No `any` — ever |
| Styling | Tailwind CSS | No inline styles, no CSS modules unless unavoidable |
| Animation | Framer Motion + GSAP ScrollTrigger | FM for component animations, GSAP for scroll-driven |
| Smooth scroll | Lenis | Wrap entire app — makes site feel luxury |
| CMS | Sanity (project: icuuryo0, dataset: production) | All copy comes from Sanity — nothing hardcoded |
| Database | Supabase EU Frankfurt | Patient data only — never health data in Vercel |
| Auth | Supabase Magic Link | No passwords |
| Email | Resend | All transactional email |
| Booking | Cal.com | Embed, do not redirect |
| Analytics | GA4 + PostHog EU | Both gated behind cookie consent |
| Error tracking | Sentry | Tunnel at /monitoring — never change this |
| Deployment | Vercel Pro | |
| DNS/CDN | Cloudflare | Full strict SSL |

---

## Critical Architecture Rules

1. **Vercel never stores health data** — only renders and proxies to Supabase
2. **Supabase EU Frankfurt** (eu-central-1) stores all patient data
3. **RLS must be enabled** on every Supabase table before writing any query
4. **Cookie consent fires before** GA4 or PostHog initialise — gate behind `window.__consentGranted`
5. **SUPABASE_SERVICE_ROLE_KEY** is server-only — never in NEXT_PUBLIC_ vars, never in client bundle
6. **All text content from Sanity** — no hardcoded Georgian or English strings in components (except fallback error states)
7. **Server Components by default** — Client Components only when you need interactivity, scroll listeners, or browser APIs
8. **Sentry tunnel at /monitoring** — do not change this route ever
9. **Never expose secrets** — run `grep -r "SERVICE_ROLE\|RESEND_API\|CALCOM" .next/` after every build

---

## Environment Variables

### Client-safe (NEXT_PUBLIC_)
```
NEXT_PUBLIC_SANITY_PROJECT_ID=icuuryo0
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-HKPCD01DS6
NEXT_PUBLIC_POSTHOG_KEY=phc_BYDP46ZzKcNnP7gRDCqLFYjxjpm8BXpLkwjR9jRr6R7d
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com
NEXT_PUBLIC_SENTRY_DSN=https://cc6c932f47d17b0715c74504bf51d496@o4511303700709376.ingest.de.sentry.io/4511303701889104
```

### Server-only (never expose to client)
```
SUPABASE_URL=https://xnhsbktgahausldzrkoo.supabase.co
SUPABASE_ANON_KEY=[set in Vercel]
SUPABASE_SERVICE_ROLE_KEY=[set in Vercel — NEVER touch client side]
RESEND_API_KEY=[set in Vercel]
SANITY_API_TOKEN=[set in Vercel]
CALCOM_API_KEY=[set in Vercel]
SENTRY_AUTH_TOKEN=[set in Vercel]
```

---

## Folder Structure

```
longevityone-web/
├── app/
│   ├── [lang]/                    # (ka) and (en) routing
│   │   ├── page.tsx               # Homepage
│   │   ├── services/
│   │   │   ├── longevity/
│   │   │   ├── metabolic/
│   │   │   └── performance/
│   │   ├── packages/
│   │   ├── team/
│   │   ├── technologies/
│   │   ├── journey/
│   │   ├── blog/
│   │   │   └── [slug]/
│   │   ├── book/
│   │   ├── contact/
│   │   └── legal/
│   │       ├── privacy/
│   │       ├── terms/
│   │       ├── cookies/
│   │       └── disclaimer/
│   ├── api/
│   │   ├── intake/route.ts        # Intake form → Supabase
│   │   ├── contact/route.ts       # Contact form → Resend
│   │   └── revalidate/route.ts    # Sanity webhook revalidation
│   ├── studio/[[...tool]]/        # Sanity Studio embedded
│   ├── monitoring/route.ts        # Sentry tunnel — DO NOT CHANGE
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                        # Reusable primitives (Button, Input, etc.)
│   ├── layout/                    # Navbar, Footer, CookieBanner
│   ├── sections/                  # Page sections (Hero, Services, etc.)
│   ├── animations/                # Reusable animation wrappers
│   └── sanity/                    # Sanity-specific components (PortableText, etc.)
├── lib/
│   ├── sanity/
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── image.ts
│   ├── supabase/
│   │   ├── server.ts              # Server-side client (service role)
│   │   └── client.ts              # Client-side (anon key + RLS)
│   ├── resend/
│   │   └── emails.ts
│   └── utils.ts
├── sanity/
│   ├── schemaTypes/               # All Sanity schemas
│   ├── structure.ts
│   └── sanity.config.ts
├── supabase/
│   └── migrations/                # All SQL migrations with RLS policies
├── hooks/                         # Custom React hooks
├── types/                         # Shared TypeScript types
├── public/
│   ├── fonts/                     # Self-hosted Mersad font files
│   └── images/
├── CLAUDE.md                      # This file
├── ARCHITECTURE.md
├── CONTENT.md
├── MOTION.md
└── BRAND.md
```

---

## Language & i18n

- **Georgian (ka)** is the primary language — always implement ka first
- **English (en)** is secondary
- Route structure: `/` defaults to Georgian, `/en/...` for English
- All Sanity schemas have `title_ka`, `title_en`, `body_ka`, `body_en` fields
- Georgian text runs approximately 30% longer than English — design must accommodate this
- Never use machine translation — all content comes from the client
- `<html lang="ka">` / `<html lang="en">` must switch correctly

---

## Design System (from Brand Guidelines)

### Colours
```css
--color-bone-white: #E7DECC;    /* Primary background */
--color-dark-brown: #422922;    /* Primary text, headings */
--color-burnt-orange: #D45800;  /* Accent, CTAs, highlights */
--color-light-blue: #AFD1E6;    /* Secondary accent */
--color-black: #000000;         /* High contrast elements */
```

### Typography
- **Primary font:** Mersad (Thin, Regular, Semi-bold, Black) — self-hosted in /public/fonts/
- **Georgian script:** Mersad Georgian weights (same family)
- **Usage:** Headings in Mersad Black/Semi-bold, body in Mersad Regular, captions in Mersad Thin
- **Letter-spacing:** generous tracking on headings (0.05em to 0.1em) — luxury feel
- **Line-height:** 1.1 to 1.2 on large headings, 1.6 to 1.7 on body

### Visual Language
- Classical Greek/Roman sculpture imagery — the brand uses these as hero visuals
- High contrast: bone white backgrounds with dark brown typography
- Burnt orange used sparingly as accent — not for backgrounds of large areas
- Light blue used for subtle UI states and secondary elements
- No gradients — flat, editorial, typographic
- Generous whitespace — luxury brands breathe
- Cinematic crop on images — tight, dramatic

---

## Animation Principles (see MOTION.md for full spec)

**Target:** Match Clinique La Prairie — cinematic scroll experience, no jarring transitions.

### Stack
- **Lenis** — smooth scrolling, wrap the entire app
- **Framer Motion** — component entrance animations, hover states, page transitions
- **GSAP + ScrollTrigger** — hero parallax, pinned scroll sequences, text reveals
- **Intersection Observer** — lightweight trigger for simple fade-ins

### Rules
- Every page transition: 600ms ease fade + subtle upward shift (8px)
- Hero section: full-screen, image parallax on scroll (GSAP), headline splits and animates in
- Text reveals: words or lines, not letters (too slow at luxury scale)
- Never animate more than 3 elements simultaneously
- All animations respect `prefers-reduced-motion` — wrap in `useReducedMotion()` check
- Performance budget: animations must not cause CLS or drop below 60fps on mid-range Android

---

## Coding Standards

### TypeScript
```typescript
// Always strict — no any
interface Service {
  id: string
  title_ka: string
  title_en: string
  slug: { current: string }
}

// Use Zod for runtime validation on all API routes
import { z } from 'zod'
const IntakeSchema = z.object({
  firstName: z.string().min(2).max(100),
  email: z.string().email(),
  consentGiven: z.literal(true), // Must be explicitly true
})
```

### Components
```typescript
// Server Component (default)
export default async function ServicePage({ params }: { params: { lang: string; slug: string } }) {
  const data = await getServiceFromSanity(params.slug, params.lang)
  return <ServiceView data={data} />
}

// Client Component (only when necessary)
'use client'
export function AnimatedHero({ title }: { title: string }) {
  // Framer Motion, scroll listeners, browser APIs only here
}
```

### API Routes
```typescript
// Always validate input with Zod
// Always handle errors explicitly
// Always return typed responses
// Rate limit with Vercel Edge middleware
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = IntakeSchema.parse(body) // throws if invalid
    // ... process
    return Response.json({ success: true }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 })
    }
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

### Supabase queries (server-side only)
```typescript
import { createServerClient } from '@/lib/supabase/server'

// Always check RLS is enabled before querying
// Always use server client for sensitive operations
const supabase = createServerClient()
const { data, error } = await supabase
  .from('patients')
  .insert({ ... })
  .select()
```

---

## Sanity Schema Conventions

All schemas must follow this bilingual pattern:
```typescript
// Every text field has _ka and _en variants
// Georgian (_ka) is always required
// English (_en) is optional but should always be filled
{
  name: 'title_ka',
  title: 'Title (Georgian)',
  type: 'string',
  validation: Rule => Rule.required(),
},
{
  name: 'title_en',
  title: 'Title (English)',
  type: 'string',
},
```

### Schema list to build
- `service` — the 3 service pillars
- `package` — pricing tiers and memberships
- `teamMember` — physicians and staff
- `technology` — PNOE, IHHT, Red Light, TrueDiagnostic, Enbiosis
- `blogPost` — bilingual articles
- `legalPage` — privacy, terms, cookies, disclaimer
- `homePage` — singleton for homepage content
- `siteSettings` — global settings (clinic name, address, phone, social links)

---

## Supabase Schema

### Tables (all with RLS)
```sql
-- patients: intake form submissions
-- assessments: PNOE, VO2 Max results
-- biomarker_readings: lab results
-- consent_log: GDPR consent timestamps with version

-- RLS rule pattern:
-- Patients see only their own rows (auth.uid() = patient_id)
-- Service role (server-only) can read all
```

---

## Security Checklist (enforce on every PR)

- [ ] No NEXT_PUBLIC_ vars contain secrets
- [ ] All API routes have Zod validation
- [ ] All Supabase tables queried have RLS enabled
- [ ] Health data never logged to console or Sentry
- [ ] Cookie consent checked before analytics fire
- [ ] CSP headers present in next.config.ts
- [ ] Rate limiting on /api/intake and /api/contact

---

## Cal.com Integration

```
Event types:
- Initial Consultation: cal.eu/longevityone/consultation (60min)
- Follow-up: cal.eu/longevityone/followup (30min)
- PNOE Assessment: cal.eu/longevityone/pnoe (45min)

Embed as inline widget on /book page — do not redirect to cal.com
Use Cal.com Atoms (React embed) for seamless UI integration
```

---

## Performance Targets

- Lighthouse Performance ≥ 90 on all key pages
- LCP < 2.5s, CLS < 0.1, INP < 200ms
- Animations must not cause CLS
- All images: WebP, next/image, lazy below fold, priority on hero
- Fonts: self-hosted, font-display: swap, preloaded in <head>
- Third-party scripts: strategy="afterInteractive" via next/script

---

## What Claude Code must never do

- Never hardcode Georgian or English copy in components
- Never use `any` in TypeScript
- Never write to Supabase from a Client Component
- Never expose SUPABASE_SERVICE_ROLE_KEY
- Never disable RLS on a table
- Never store full medical records in Supabase
- Never change the /monitoring Sentry tunnel route
- Never use Pages Router patterns
- Never use inline styles (Tailwind only)
- Never commit secrets to the repo
- Never skip error handling on API routes
- Never skip the GDPR consent checkbox on forms that collect health data
