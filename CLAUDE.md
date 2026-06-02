# Longevity One — Claude Code Master Configuration

> Read this file completely before writing any code, modifying any file, or making any architectural decision.
> This is the single source of truth for the entire project.
> Display name: **Longevity One** (two words). Domain/code/URLs: `longevityone.ge` (no space — never change).

---

## Project Identity

**Display name:** Longevity One
**Georgian logo name:** Longevity One (logo assets only — never in body copy)
**Domain:** www.longevityone.ge
**Location:** Tbilisi, Georgia
**Tagline (en):** The Art of Living Longer
**Tagline (ka):** დღეგრძელობის ხელოვნება
**Category:** Preventive Medicine Center
**Design reference:** https://www.cliniquelaprairie.com — match this level exactly
**Phone:** +995 511 70 88 88
**Email:** info@longevityone.ge
**Address (ka):** თამარაშვილის 4ა, თბილისი
**Address (en):** 4a Tamarashvili St, Tbilisi, Georgia
**Hours:** ყოველდღე 09:00–21:00 / Daily 09:00–21:00

---

## Tech Stack (strict — do not deviate)

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14 App Router | No Pages Router patterns ever |
| Language | TypeScript strict | No `any` — ever |
| Styling | Tailwind CSS | No inline styles, no CSS modules unless unavoidable |
| Smooth scroll | Lenis (`@studio-freight/lenis`) | Wrap entire app — foundational luxury feel |
| Scroll animation | GSAP + ScrollTrigger | Hero parallax, pinned sections, scroll-driven reveals |
| Component animation | Framer Motion | Entrances, hover states, page transitions |
| CMS | Sanity (project: `icuuryo0`, dataset: `production`) | All copy from Sanity — nothing hardcoded |
| Database | Supabase EU Frankfurt (`xnhsbktgahausldzrkoo`) | Patient data only |
| Auth | Supabase Magic Link | No passwords |
| Email | Resend | All transactional email |
| Booking | Cal.com Atoms embed | Embed inline — do not redirect |
| Analytics | GA4 + PostHog EU | Both gated behind cookie consent |
| Error tracking | Sentry | Tunnel at `/monitoring` — never change |
| Deployment | Vercel Pro | |
| DNS/CDN | Cloudflare | Full strict SSL |

---

## How to Use Claude Code Tools

### At session start — always do this first:
Read CLAUDE.md, BRAND.md, MOTION.md before writing any code.

### MCP tools — when to use each:

| Tool | When to use | How to invoke |
|---|---|---|
| **context7** | Every time you use a library API | Auto-invoked via ~/.claude.json rules |
| **21st-magic** | Need a production-ready animated component | `/ui [describe component]` |
| **sequential-thinking** | Complex architecture or debugging | Say "use sequential-thinking" |
| **supabase MCP** | Before any Supabase query | "use supabase MCP to show current schema" |
| **sanity MCP** | Before writing GROQ queries | "use sanity MCP to list document types" |
| **github MCP** | Commit, push, branches, PRs | "use github MCP to commit to dev" |
| **playwright** | After building any page | "use playwright to screenshot at 375px, 768px, 1440px" |
| **memory** | Store cross-session decisions | `/mem store: [decision]` |
| **seo** | Any page — JSON-LD, meta audit | "use seo MCP to generate schema for this page" |

### Skills in .claude/skills/ (Claude Code reads these automatically):
- `brand/` — colour system, typography, component patterns
- `motion/` + `motion-principles/` — animation spec
- `project-context/` — project rules (this file)
- `frontend-design/` — luxury web design patterns
- `ui-ux-pro-max/` — premium UI decision-making
- `everything-claude-code/` — Claude Code workflow best practices

---

## Critical Architecture Rules

1. **Vercel never stores health data** — only renders and proxies to Supabase
2. **Supabase EU Frankfurt** (`eu-central-1`) stores all patient data
3. **RLS must be enabled** on every Supabase table before writing any query
4. **Cookie consent fires before** GA4 or PostHog initialise
5. **SUPABASE_SERVICE_ROLE_KEY** is server-only — never in `NEXT_PUBLIC_` vars
6. **All text content from Sanity** — no hardcoded strings in components
7. **Server Components by default** — Client Components only when needed
8. **Sentry tunnel at `/monitoring`** — do not change this route ever
9. **Never expose secrets** — `grep -r "SERVICE_ROLE\|RESEND_API\|CALCOM" .next/` after every build
10. **Georgian (ka) first** — always implement Georgian before English

---

## Environment Variables

### Client-safe (`NEXT_PUBLIC_`)
```
NEXT_PUBLIC_SUPABASE_URL=https://xnhsbktgahausldzrkoo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[set in Vercel]
NEXT_PUBLIC_SANITY_PROJECT_ID=icuuryo0
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-HKPCD01DS6
NEXT_PUBLIC_POSTHOG_KEY=phc_BYDP46ZzKcNnP7gRDCqLFYjxjpm8BXpLkwjR9jRr6R7d
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com
NEXT_PUBLIC_SENTRY_DSN=https://cc6c932f47d17b0715c74504bf51d496@o4511303700709376.ingest.de.sentry.io/4511303701889104
```

### Server-only (never expose to client)
```
SUPABASE_SERVICE_ROLE_KEY=[set in Vercel — NEVER client side]
RESEND_API_KEY=[set in Vercel]
SANITY_API_TOKEN=[set in Vercel]
CALCOM_API_KEY=[set in Vercel]
SENTRY_AUTH_TOKEN=[set in Vercel]
```

---

## Folder Structure (matches actual repo)

```
longevityone-web/
├── src/
│   ├── app/
│   │   ├── (ka)/                      # Georgian route group — primary/default
│   │   │   ├── page.tsx               # Homepage /
│   │   │   ├── about/page.tsx
│   │   │   ├── services/
│   │   │   │   ├── longevity/page.tsx
│   │   │   │   ├── metabolic/page.tsx
│   │   │   │   └── performance/page.tsx
│   │   │   ├── technologies/
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── packages/page.tsx
│   │   │   ├── team/page.tsx
│   │   │   ├── journey/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── book/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   ├── corporate/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── legal/
│   │   │       ├── privacy/page.tsx
│   │   │       ├── terms/page.tsx
│   │   │       ├── cookies/page.tsx
│   │   │       └── disclaimer/page.tsx
│   │   ├── en/                        # English route group
│   │   │   └── [...slug]/page.tsx
│   │   ├── api/
│   │   │   ├── intake/route.ts
│   │   │   ├── contact/route.ts
│   │   │   └── revalidate/route.ts
│   │   ├── studio/[[...tool]]/page.tsx
│   │   ├── monitoring/route.ts        # Sentry tunnel — DO NOT CHANGE
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── sections/
│   │   ├── animations/
│   │   └── sanity/
│   ├── lib/
│   │   ├── sanity/client.ts
│   │   ├── sanity/queries.ts
│   │   ├── sanity/image.ts
│   │   ├── supabase/server.ts
│   │   ├── supabase/client.ts
│   │   ├── resend/emails.ts
│   │   ├── gsap.ts
│   │   └── utils.ts
│   ├── hooks/
│   ├── types/
│   └── providers/
│       └── LenisProvider.tsx
├── sanity/
│   ├── schemaTypes/
│   ├── structure.ts
│   └── sanity.config.ts
├── supabase/migrations/
├── public/
│   ├── fonts/mersad/               # 9 .woff2 files — see BRAND.md for paths
│   └── images/
├── .claude/
│   ├── settings.json
│   └── skills/
├── CLAUDE.md
├── ARCHITECTURE.md
├── BRAND.md
├── MOTION.md
└── CONTENT.md
```

---

## Language & i18n

- **Georgian (ka)** is primary — always implement ka first, en second
- Route groups: `(ka)` is default (no URL prefix), `en/` adds `/en` prefix
- All Sanity schemas: `_ka` fields are required, `_en` optional but always filled
- Georgian text runs ~30% longer than English — every layout must accommodate this
- Never machine-translate — all content from CONTENT.md / Sanity
- In Georgian body text, brand name stays as `Longevity One` in Latin script

---

## Design System — Quick Reference (full spec in BRAND.md)

```css
/* Brand colours */
bone:   #E7DECC   /* primary background */
brown:  #422922   /* all text and headings */
orange: #D45800   /* CTAs, accent — use sparingly */
blue:   #AFD1E6   /* secondary accent — very sparingly */
black:  #000000   /* dark overlays only */
```

Font: Mersad, 9 weights, `/public/fonts/mersad/mersad-[weight].woff2`
- thin(100), extralight(200), light(300), regular(400), medium(500)
- semibold(600), bold(700), extrabold(800), black(900)

---

## Animation — Quick Reference (full spec in MOTION.md)

- Lenis wraps app in `src/app/layout.tsx` via `LenisProvider`
- GSAP registered once in `src/lib/gsap.ts` — always import from there
- All animations respect `prefers-reduced-motion`
- Only animate `transform` and `opacity` — never width/height/top/left
- Always `kill()` GSAP ScrollTrigger instances on unmount

---

## Coding Standards

```typescript
// Utility
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

// Server Component (default)
export default async function ServicePage({ params }: { params: { slug: string } }) {
  const data = await getServiceFromSanity(params.slug)
  return <ServiceView data={data} />
}

// Client Component (only when needed)
'use client'
export function AnimatedHero({ headline }: { headline: string }) { ... }

// API route
export async function POST(request: Request) {
  try {
    const validated = IntakeSchema.parse(await request.json())
    return Response.json({ success: true }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: error.errors }, { status: 400 })
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

---

## Sanity Schema Conventions

```typescript
// _ka required, _en always filled
{ name: 'title_ka', type: 'string', validation: (Rule) => Rule.required() }
{ name: 'title_en', type: 'string' }
```

Build schemas in this order: siteSettings → homePage → service → technology → package → teamMember → blogPost → legalPage

---

## Security Checklist (every PR)

- [ ] No `NEXT_PUBLIC_` vars contain secrets
- [ ] All API routes have Zod validation
- [ ] All Supabase tables have RLS enabled
- [ ] Health data never in console or Sentry logs
- [ ] Cookie consent before GA4/PostHog
- [ ] CSP headers in `next.config.ts`
- [ ] Rate limiting on `/api/intake` (5/min) and `/api/contact` (3/min)

---

## Forbidden — Claude Code must never do these

- Hardcode Georgian or English copy in components
- Use `any` in TypeScript
- Write to Supabase from a Client Component
- Expose `SUPABASE_SERVICE_ROLE_KEY`
- Disable RLS on any table
- Store full medical records in Supabase
- Change the `/monitoring` Sentry tunnel route
- Use Pages Router patterns
- Use inline styles (Tailwind only)
- Commit secrets to the repo
- Skip error handling on API routes
- Skip GDPR consent checkbox on health data forms
- Animate `width`, `height`, `top`, `left`, `margin`, `padding`
- Use `rounded-full` on buttons
- Use box shadows
- Use gradients
- Hardcode prices (always from Sanity)

---

## Session Starter Prompt

```
You are building Longevity One (longevityone.ge) — a luxury longevity medical clinic in Tbilisi, Georgia.

Before writing any code, read:
1. CLAUDE.md — all project rules, stack, folder structure
2. BRAND.md — colours, Mersad 9-weight typography, component patterns
3. MOTION.md — Lenis + GSAP + Framer Motion animation spec

Rules: TypeScript strict · Georgian (ka) first · all copy from Sanity · 
Lenis+GSAP+FramerMotion · bone/brown/orange palette · Mersad font ·
Server Components default · RLS on all tables · consent before analytics ·
/monitoring never changes · target: cliniquelaprairie.com quality

Tools: context7 auto (library docs) · /ui for components (21st-magic) ·
sequential-thinking for architecture · playwright to verify ·
/mem for cross-session decisions · seo MCP for JSON-LD

Current task: [DESCRIBE EXACTLY WHAT YOU ARE BUILDING]
```
