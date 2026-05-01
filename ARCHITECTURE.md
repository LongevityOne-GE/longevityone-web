# LongevityOne — Technical Architecture

---

## Request Flow

```
User (longevityone.ge)
    ↓
Cloudflare (DNS, CDN, WAF, DDoS protection, Full strict SSL)
    ↓
Vercel Edge Network (Next.js 14 App Router)
    ↓ (renders pages, never stores health data)
    ├── Sanity CDN (content, images)
    ├── Supabase EU Frankfurt (patient data, RLS enforced)
    ├── Resend (transactional email)
    ├── Cal.com (booking embed)
    ├── PostHog EU (analytics — consent gated)
    └── GA4 (analytics — consent gated)
```

---

## Next.js App Router Structure

### Routing

```
app/
├── layout.tsx                    # Root layout: fonts, Lenis, consent provider
├── [lang]/                       # Dynamic language segment: 'ka' | 'en'
│   ├── layout.tsx                # Lang layout: sets <html lang>, nav, footer
│   ├── page.tsx                  # Homepage
│   ├── services/
│   │   ├── longevity/page.tsx
│   │   ├── metabolic/page.tsx
│   │   └── performance/page.tsx
│   ├── packages/page.tsx
│   ├── technologies/
│   │   └── [slug]/page.tsx       # Dynamic: pnoe, visbody, ihht, etc.
│   ├── team/page.tsx
│   ├── journey/page.tsx          # 8-stage patient journey
│   ├── book/page.tsx             # Cal.com embed
│   ├── blog/
│   │   ├── page.tsx              # Blog index
│   │   └── [slug]/page.tsx       # Individual post
│   ├── contact/page.tsx
│   └── legal/
│       ├── privacy/page.tsx
│       ├── terms/page.tsx
│       ├── cookies/page.tsx
│       └── disclaimer/page.tsx
├── api/
│   ├── intake/route.ts           # POST — intake form → Supabase
│   ├── contact/route.ts          # POST — contact form → Resend
│   └── revalidate/route.ts       # POST — Sanity webhook → ISR revalidation
├── studio/[[...tool]]/page.tsx   # Sanity Studio
├── monitoring/route.ts           # Sentry tunnel (DO NOT CHANGE)
├── sitemap.ts                    # Dynamic sitemap
└── robots.ts
```

### Language routing

The `[lang]` segment accepts `ka` or `en`. Georgian (`ka`) is the default.
- `/` → redirect to `/ka`
- `/ka/*` → Georgian pages
- `/en/*` → English pages
- `middleware.ts` handles detection and redirect

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/Middleware'

const SUPPORTED_LANGS = ['ka', 'en']
const DEFAULT_LANG = 'ka'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const pathnameHasLang = SUPPORTED_LANGS.some(
    lang => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  )
  if (!pathnameHasLang) {
    return NextResponse.redirect(new URL(`/${DEFAULT_LANG}${pathname}`, request.url))
  }
}
```

---

## Data Layer

### Sanity (Content)

```typescript
// lib/sanity/client.ts
import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true, // CDN for public content
  token: process.env.SANITY_API_TOKEN, // server-side only for mutations
})

// For draft preview (server-only)
export const previewClient = createClient({
  ...
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'previewDrafts',
})
```

```typescript
// lib/sanity/queries.ts — GROQ queries
export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    hero_title_ka, hero_title_en,
    hero_subtitle_ka, hero_subtitle_en,
    hero_image { asset->{ url, metadata } }
  }
`

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id, slug,
    title_ka, title_en,
    summary_ka, summary_en,
    icon, color
  }
`
```

### Supabase (Patient Data)

```typescript
// lib/supabase/server.ts — server-side only
import { createClient } from '@supabase/supabase-js'

export function createServerClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-only, bypasses RLS for admin
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// lib/supabase/client.ts — client-side (anon key + RLS)
import { createBrowserClient } from '@supabase/ssr'

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## Database Schema (Supabase)

```sql
-- Migration: 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PATIENTS
CREATE TABLE patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  date_of_birth DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients see own record" ON patients
  FOR ALL USING (auth.uid() = auth_user_id);

-- CONSENT_LOG
CREATE TABLE consent_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_email TEXT NOT NULL,
  consent_version TEXT NOT NULL DEFAULT 'v1.0',
  consent_given BOOLEAN NOT NULL DEFAULT FALSE,
  ip_hash TEXT, -- hashed IP, never plain IP
  user_agent TEXT,
  consented_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE consent_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON consent_log
  FOR ALL USING (FALSE); -- only service role (server) can access

-- ASSESSMENTS
CREATE TABLE assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL, -- 'pnoe' | 'visbody' | 'vo2max' | 'intake'
  data JSONB NOT NULL DEFAULT '{}',
  assessed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients see own assessments" ON assessments
  FOR ALL USING (
    patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid())
  );

-- BIOMARKER_READINGS
CREATE TABLE biomarker_readings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  marker_name TEXT NOT NULL,
  value NUMERIC,
  unit TEXT,
  reference_range TEXT,
  measured_at TIMESTAMPTZ DEFAULT NOW()
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
// Zod validation → Supabase insert → Resend confirmation
// Rate limit: 5 req/min per IP (Vercel Edge Middleware)
// Required fields: firstName, lastName, email, consentGiven (must be true)
// Stores in: patients table + consent_log table
// Sends: confirmation email via Resend
```

### POST /api/contact

```typescript
// Zod validation → Resend to info@longevityone.ge + auto-reply
// Rate limit: 3 req/min per IP
// No data stored in database
```

### POST /api/revalidate

```typescript
// Sanity webhook → revalidate affected pages
// Validates Sanity webhook secret header
// Triggers Next.js revalidatePath() or revalidateTag()
```

---

## Sanity Schemas

### service
```typescript
{
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    { name: 'title_ka', type: 'string', validation: Rule => Rule.required() },
    { name: 'title_en', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title_en' } },
    { name: 'summary_ka', type: 'text' },
    { name: 'summary_en', type: 'text' },
    { name: 'body_ka', type: 'array', of: [{ type: 'block' }] },
    { name: 'body_en', type: 'array', of: [{ type: 'block' }] },
    { name: 'heroImage', type: 'image' },
    { name: 'icon', type: 'string' }, // SVG path or icon name
    { name: 'order', type: 'number' },
    { name: 'technologies', type: 'array', of: [{ type: 'reference', to: [{ type: 'technology' }] }] },
  ]
}
```

### package
```typescript
{
  name: 'package',
  fields: [
    { name: 'name_ka', type: 'string', validation: Rule => Rule.required() },
    { name: 'name_en', type: 'string' },
    { name: 'tier', type: 'number' }, // 1 | 2 | 3 for diagnostic, or 0 for membership
    { name: 'price', type: 'number' }, // in GEL
    { name: 'priceLabel_ka', type: 'string' }, // e.g. "550 ლარი"
    { name: 'priceSuffix_ka', type: 'string' }, // e.g. "/თვეში" for memberships
    { name: 'features_ka', type: 'array', of: [{ type: 'string' }] },
    { name: 'features_en', type: 'array', of: [{ type: 'string' }] },
    { name: 'isFeatured', type: 'boolean' }, // highlights this card
    { name: 'category', type: 'string', options: { list: ['diagnostic', 'membership', 'addon'] } },
  ]
}
```

### teamMember
```typescript
{
  name: 'teamMember',
  fields: [
    { name: 'name', type: 'string', validation: Rule => Rule.required() },
    { name: 'role_ka', type: 'string' },
    { name: 'role_en', type: 'string' },
    { name: 'bio_ka', type: 'array', of: [{ type: 'block' }] },
    { name: 'bio_en', type: 'array', of: [{ type: 'block' }] },
    { name: 'photo', type: 'image' },
    { name: 'credentials', type: 'array', of: [{ type: 'string' }] },
    { name: 'order', type: 'number' },
  ]
}
```

### technology
```typescript
{
  name: 'technology',
  fields: [
    { name: 'name', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug' },
    { name: 'tagline_ka', type: 'string' },
    { name: 'tagline_en', type: 'string' },
    { name: 'description_ka', type: 'array', of: [{ type: 'block' }] },
    { name: 'description_en', type: 'array', of: [{ type: 'block' }] },
    { name: 'heroImage', type: 'image' },
    { name: 'specifications', type: 'array', of: [{ type: 'object', fields: [
      { name: 'label_ka', type: 'string' },
      { name: 'label_en', type: 'string' },
      { name: 'value', type: 'string' },
    ]}]},
  ]
}
```

### blogPost
```typescript
{
  name: 'blogPost',
  fields: [
    { name: 'title_ka', type: 'string', validation: Rule => Rule.required() },
    { name: 'title_en', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title_en' } },
    { name: 'excerpt_ka', type: 'text' },
    { name: 'excerpt_en', type: 'text' },
    { name: 'body_ka', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
    { name: 'body_en', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
    { name: 'coverImage', type: 'image' },
    { name: 'author', type: 'reference', to: [{ type: 'teamMember' }] },
    { name: 'publishedAt', type: 'datetime' },
    { name: 'tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'seoTitle_ka', type: 'string' },
    { name: 'seoTitle_en', type: 'string' },
    { name: 'seoDescription_ka', type: 'text' },
    { name: 'seoDescription_en', type: 'text' },
  ]
}
```

### siteSettings (singleton)
```typescript
{
  name: 'siteSettings',
  fields: [
    { name: 'clinicName_ka', type: 'string' },
    { name: 'clinicName_en', type: 'string' },
    { name: 'address_ka', type: 'text' },
    { name: 'address_en', type: 'text' },
    { name: 'phone', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'socialFacebook', type: 'url' },
    { name: 'socialInstagram', type: 'url' },
    { name: 'openingHours_ka', type: 'array', of: [{ type: 'string' }] },
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
      "frame-src https://cal.com https://cal.eu",
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
  "name": "LongevityOne",
  "alternateName": "Longevity One Preventive Medicine Center",
  "url": "https://www.longevityone.ge",
  "telephone": "+995-XXX-XXXXXX",
  "email": "info@longevityone.ge",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Clinic address]",
    "addressLocality": "Tbilisi",
    "addressCountry": "GE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[lat]",
    "longitude": "[lng]"
  },
  "medicalSpecialty": ["PreventiveCare", "InternalMedicine"],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ]
}
```
