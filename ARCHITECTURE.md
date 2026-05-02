# Longevity One — Technical Architecture

---

## Request Flow

```
User (longevityone.ge)
    ↓
Cloudflare (DNS, CDN, WAF, DDoS protection, Full strict SSL/TLS 1.3)
    ↓
Vercel Edge Network (Next.js 14 App Router — renders only, no health data stored)
    ↓
    ├── Sanity CDN (content, images via cdn.sanity.io)
    ├── Supabase EU Frankfurt eu-central-1 (patient data, RLS enforced)
    ├── Resend EU (transactional email — Ireland)
    ├── Cal.com (booking embed — Atoms)
    ├── PostHog EU Cloud (analytics — consent gated)
    └── GA4 (analytics — consent gated)
```

---

## Next.js App Router Structure

### Route Groups (actual repo structure)

```
src/app/
├── layout.tsx                    # Root: LenisProvider, ConsentProvider, fonts
├── (ka)/                         # Georgian route group — no URL prefix, default
│   ├── layout.tsx                # Sets <html lang="ka">, Navbar, Footer
│   ├── template.tsx              # Framer Motion page transition wrapper
│   ├── page.tsx                  # Homepage /
│   ├── about/page.tsx
│   ├── services/
│   │   ├── longevity/page.tsx
│   │   ├── metabolic/page.tsx
│   │   └── performance/page.tsx
│   ├── technologies/
│   │   └── [slug]/page.tsx       # /technologies/pnoe etc.
│   ├── packages/page.tsx
│   ├── team/page.tsx
│   ├── journey/page.tsx          # 8-stage patient journey
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── book/page.tsx             # Cal.com Atoms embed
│   ├── faq/page.tsx
│   ├── corporate/page.tsx
│   ├── contact/page.tsx
│   └── legal/
│       ├── privacy/page.tsx
│       ├── terms/page.tsx
│       ├── cookies/page.tsx
│       └── disclaimer/page.tsx
├── en/                           # English route group — /en/* prefix
│   ├── layout.tsx                # Sets <html lang="en">
│   ├── template.tsx
│   └── [...slug]/page.tsx        # Mirrors (ka) structure
├── api/
│   ├── intake/route.ts           # POST → Supabase patients + consent_log
│   ├── contact/route.ts          # POST → Resend
│   └── revalidate/route.ts       # Sanity webhook → revalidatePath/Tag
├── studio/[[...tool]]/page.tsx   # Sanity Studio
├── monitoring/route.ts           # Sentry tunnel — DO NOT CHANGE THIS PATH
├── sitemap.ts                    # Dynamic sitemap including all blog posts
└── robots.ts
```

### Language routing — middleware.ts

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'  // correct import

const SUPPORTED_LANGS = ['ka', 'en'] as const
const DEFAULT_LANG = 'ka'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip API routes, static files, Sanity Studio, Sentry tunnel
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/studio') ||
    pathname.startsWith('/monitoring') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if path already has a supported lang prefix
  const pathnameHasLang = SUPPORTED_LANGS.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  )

  // Redirect to default language if no lang prefix
  if (!pathnameHasLang) {
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LANG}${pathname}`, request.url)
    )
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

---

## Data Layer

### Sanity Client

```typescript
// src/lib/sanity/client.ts
import { createClient } from '@sanity/client'

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2025-01-01',  // always use latest stable
  useCdn: true,
}

// Public client — for read-only queries in Server Components
export const sanityClient = createClient(config)

// Server-only write client — never import this in Client Components
export const sanityWriteClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Preview client — for draft content in Sanity Studio preview
export const previewClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'previewDrafts',
})
```

```typescript
// src/lib/sanity/queries.ts
import { groq } from 'next-sanity'

export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    hero_title_ka, hero_title_en,
    hero_subtitle_ka, hero_subtitle_en,
    hero_image { asset->{ url, metadata } },
    intro_ka, intro_en
  }
`

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id, slug,
    title_ka, title_en,
    summary_ka, summary_en,
    icon, order,
    "technologies": technologies[]-> { name, slug }
  }
`

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    clinicName_ka, clinicName_en,
    address_ka, address_en,
    phone, email,
    socialFacebook, socialInstagram,
    openingHours_ka, openingHours_en
  }
`

export const blogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id, slug, publishedAt,
    title_ka, title_en,
    excerpt_ka, excerpt_en,
    coverImage { asset->{ url } },
    "author": author->{ name, "photo": photo.asset->url }
  }
`
```

### Supabase Clients

```typescript
// src/lib/supabase/server.ts — server-side ONLY, never import in Client Components
import { createClient } from '@supabase/supabase-js'

export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,  // bypasses RLS — server only
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
```

```typescript
// src/lib/supabase/client.ts — browser-safe, uses RLS
import { createBrowserClient } from '@supabase/ssr'

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  // RLS enforces access control
  )
}
```

---

## Database Schema (Supabase)

Full SQL in `supabase/migrations/`. All tables have RLS enabled before any data query.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PATIENTS
CREATE TABLE patients (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  auth_user_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name     TEXT NOT NULL,
  last_name      TEXT NOT NULL,
  email          TEXT NOT NULL UNIQUE,
  phone          TEXT,
  date_of_birth  DATE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients see own record" ON patients
  FOR ALL USING (auth.uid() = auth_user_id);

-- CONSENT_LOG
CREATE TABLE consent_log (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_email    TEXT NOT NULL,
  consent_version  TEXT NOT NULL DEFAULT 'v1.0',
  consent_given    BOOLEAN NOT NULL DEFAULT FALSE,
  ip_hash          TEXT,    -- SHA-256 of IP, never plain IP
  user_agent       TEXT,
  consented_at     TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE consent_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON consent_log
  FOR ALL USING (FALSE);    -- only service_role key (server) can access

-- ASSESSMENTS
CREATE TABLE assessments (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id       UUID REFERENCES patients(id) ON DELETE CASCADE,
  assessment_type  TEXT NOT NULL CHECK (assessment_type IN ('pnoe','visbody','vo2max','intake','truediagnostic','enbiosis')),
  data             JSONB NOT NULL DEFAULT '{}',
  assessed_at      TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients see own assessments" ON assessments
  FOR ALL USING (
    patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid())
  );

-- BIOMARKER_READINGS
CREATE TABLE biomarker_readings (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id       UUID REFERENCES patients(id) ON DELETE CASCADE,
  marker_name      TEXT NOT NULL,
  value            NUMERIC,
  unit             TEXT,
  reference_range  TEXT,
  measured_at      TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE biomarker_readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients see own biomarkers" ON biomarker_readings
  FOR ALL USING (
    patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid())
  );
```

---

## API Routes

### POST /api/intake
```typescript
// Zod validation → hash IP → insert patients + consent_log → Resend confirmation email
// Rate limit: 5 req/min per IP (Vercel Edge Middleware)
// Required: firstName, lastName, email, consentGiven=true
// Never log any health field values to console or Sentry
```

### POST /api/contact
```typescript
// Zod validation → Resend to info@longevityone.ge + auto-reply to sender
// Rate limit: 3 req/min per IP
// No data stored in database
```

### POST /api/revalidate
```typescript
// Validates Sanity WEBHOOK_SECRET header
// Calls revalidatePath() or revalidateTag() for affected document type
// Returns 200 on success, 401 on invalid secret
```

---

## Sanity Schemas

### siteSettings (singleton)
```typescript
{
  name: 'siteSettings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],  // singleton — no create/delete
  fields: [
    { name: 'clinicName_ka', type: 'string', validation: Rule => Rule.required() },
    { name: 'clinicName_en', type: 'string' },
    { name: 'address_ka', type: 'text' },
    { name: 'address_en', type: 'text' },
    { name: 'phone', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'socialFacebook', type: 'url' },
    { name: 'socialInstagram', type: 'url' },
    { name: 'openingHours_ka', type: 'string' },
    { name: 'openingHours_en', type: 'string' },
  ]
}
```

### service
```typescript
{
  name: 'service',
  type: 'document',
  fields: [
    { name: 'title_ka',   type: 'string',  validation: Rule => Rule.required() },
    { name: 'title_en',   type: 'string' },
    { name: 'slug',       type: 'slug',    options: { source: 'title_en' } },
    { name: 'summary_ka', type: 'text' },
    { name: 'summary_en', type: 'text' },
    { name: 'body_ka',    type: 'array', of: [{ type: 'block' }] },
    { name: 'body_en',    type: 'array', of: [{ type: 'block' }] },
    { name: 'heroImage',  type: 'image' },
    { name: 'order',      type: 'number' },
    { name: 'technologies', type: 'array', of: [{ type: 'reference', to: [{ type: 'technology' }] }] },
  ]
}
```

### technology
```typescript
{
  name: 'technology',
  type: 'document',
  fields: [
    { name: 'name',           type: 'string', validation: Rule => Rule.required() },
    { name: 'slug',           type: 'slug' },
    { name: 'tagline_ka',     type: 'string' },
    { name: 'tagline_en',     type: 'string' },
    { name: 'description_ka', type: 'array', of: [{ type: 'block' }] },
    { name: 'description_en', type: 'array', of: [{ type: 'block' }] },
    { name: 'heroImage',      type: 'image' },
    { name: 'scientificNote', type: 'text' }, // scientific accuracy notes for Claude to follow
    { name: 'specifications', type: 'array', of: [{
      type: 'object',
      fields: [
        { name: 'label_ka', type: 'string' },
        { name: 'label_en', type: 'string' },
        { name: 'value', type: 'string' },
      ]
    }]},
  ]
}
```

### package
```typescript
{
  name: 'package',
  type: 'document',
  fields: [
    { name: 'name_ka',      type: 'string', validation: Rule => Rule.required() },
    { name: 'name_en',      type: 'string' },
    { name: 'tier',         type: 'number' },
    { name: 'price',        type: 'number' },  // in GEL — never hardcode
    { name: 'priceLabel_ka', type: 'string' },
    { name: 'priceSuffix_ka', type: 'string' }, // "/თვეში" for memberships
    { name: 'features_ka',  type: 'array', of: [{ type: 'string' }] },
    { name: 'features_en',  type: 'array', of: [{ type: 'string' }] },
    { name: 'isFeatured',   type: 'boolean' },
    { name: 'category',     type: 'string', options: { list: ['diagnostic', 'membership', 'addon'] } },
  ]
}
```

### teamMember
```typescript
{
  name: 'teamMember',
  type: 'document',
  fields: [
    { name: 'name',        type: 'string', validation: Rule => Rule.required() },
    { name: 'role_ka',     type: 'string' },
    { name: 'role_en',     type: 'string' },
    { name: 'bio_ka',      type: 'array', of: [{ type: 'block' }] },
    { name: 'bio_en',      type: 'array', of: [{ type: 'block' }] },
    { name: 'photo',       type: 'image' },
    { name: 'credentials', type: 'array', of: [{ type: 'string' }] },
    { name: 'order',       type: 'number' },
  ]
}
```

### blogPost
```typescript
{
  name: 'blogPost',
  type: 'document',
  fields: [
    { name: 'title_ka',          type: 'string', validation: Rule => Rule.required() },
    { name: 'title_en',          type: 'string' },
    { name: 'slug',              type: 'slug', options: { source: 'title_en' } },
    { name: 'excerpt_ka',        type: 'text' },
    { name: 'excerpt_en',        type: 'text' },
    { name: 'body_ka',           type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
    { name: 'body_en',           type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
    { name: 'coverImage',        type: 'image' },
    { name: 'author',            type: 'reference', to: [{ type: 'teamMember' }] },
    { name: 'publishedAt',       type: 'datetime' },
    { name: 'tags',              type: 'array', of: [{ type: 'string' }] },
    { name: 'seoTitle_ka',       type: 'string' },
    { name: 'seoTitle_en',       type: 'string' },
    { name: 'seoDescription_ka', type: 'text' },
    { name: 'seoDescription_en', type: 'text' },
  ]
}
```

---

## Security Headers (next.config.ts)

```typescript
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' https://www.googletagmanager.com https://eu.posthog.com https://cdnjs.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://cdn.sanity.io https://www.google-analytics.com",
      "connect-src 'self' https://*.supabase.co https://eu.posthog.com https://www.google-analytics.com https://api.resend.com",
      "frame-src https://cal.com https://cal.eu https://app.cal.com",
      "font-src 'self'",
    ].join('; '),
  },
]
```

---

## JSON-LD Schema (Homepage)

```typescript
const clinicSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "name": "Longevity One",
  "alternateName": "Longevity One Preventive Medicine Center",
  "url": "https://www.longevityone.ge",
  "telephone": "+995577260557",
  "email": "info@longevityone.ge",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "თამარაშვილის 4ა",
    "addressLocality": "თბილისი",
    "addressCountry": "GE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[confirm from Google Maps]",
    "longitude": "[confirm from Google Maps]"
  },
  "medicalSpecialty": ["PreventiveCare", "InternalMedicine"],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "09:00",
      "closes": "21:00"
    }
  ]
}
```

> Action needed: confirm exact geo coordinates from Google Maps before launch and update above.

---

## Cal.com Integration

```
Event types:
- Initial Consultation: 60min
- Follow-up: 30min
- PNOE Assessment: 45min

Implementation:
- Use Cal.com Atoms React embed on /book page
- Do NOT redirect to cal.com
- Cal.com sets functional session cookies only — load regardless of cookie consent
- Cal.com is GDPR-compliant: ISO 27001, SOC 2 Type II certified

CSP: frame-src must include https://app.cal.com in addition to https://cal.com
```
