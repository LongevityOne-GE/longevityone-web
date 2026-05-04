# LongevityOne — Remaining Pages Design Spec

**Date:** 2026-05-04  
**Status:** Approved  
**Scope:** All pages beyond the homepage — 18 routes across 13 page types  

---

## Context

The homepage is complete. It establishes the full design system:
- **Colors:** `bone-white` (#E7DECC) / `dark-brown` (#422922) / `burnt-orange` (#D45800)
- **Fonts:** Mersad (sans) + Playfair Display (serif)
- **Utilities:** `.section-container`, `.btn-primary`, `.btn-secondary`, `.eyebrow`, `.card-ornamental`
- **Shared components:** `SectionHeader`, `Reveal`
- **Section rhythm:** alternate `bg-bone-white` ↔ `bg-dark-brown`
- **Bilingual:** Georgian (`ka`) primary, English (`en`) secondary

All remaining pages must follow these patterns exactly.

---

## Architecture

### Route Pattern

Every page has two route files (same as homepage):

```
src/app/(ka)/[route]/page.tsx          ← Georgian locale
src/app/en/[route]/page.tsx            ← English locale
src/components/pages/[Name]Page.tsx    ← Shared UI component
src/components/sections/[Name].tsx     ← Section-level components
```

- Route files are async Server Components — they fetch Sanity data and pass it as props
- All Sanity fetches use `{ next: { tags: ['sanity'] } }` for ISR cache tagging
- Dynamic routes (`/services/[slug]`, `/blog/[slug]`, `/legal/[pageType]`) implement `generateStaticParams()` for static pre-rendering

### New Shared Components

Three shared components are created on the About page and reused everywhere:

**`PageHero`** (`src/components/shared/PageHero.tsx`)  
Inner-page hero used by every non-homepage page. Props: `eyebrow`, `title`, `subtitle`, `locale`. Layout: bone-white background, logo-mark watermark at 6% opacity (centred), eyebrow in burnt-orange small-caps, H1 in large Playfair serif, optional subtitle paragraph. No video — clean and typographic.

**`PortableTextRenderer`** (`src/components/shared/PortableTextRenderer.tsx`)  
Renders Sanity Portable Text arrays. Styled to brand:
- `h2` — Playfair serif, large, with `border-t border-dark-brown/20` rule above
- `h3` — Playfair serif, medium weight
- `p` — generous line-height, `text-dark-brown/85`
- `strong` — `font-bold text-dark-brown`
- `ul` — bullet list with burnt-orange `•` markers
- `a` — burnt-orange underline on hover
Uses `@portabletext/react` package.

**`PageHero`** is used by: About, Technologies, Services, Packages, Journey, Corporate, Team, FAQ, Blog Index, Blog Post, Legal, Contact.  
**`PortableTextRenderer`** is used by: Blog Post, Legal pages, (optionally) Service detail body.

---

## Build Order (Approach B — Component Dependency)

| Phase | Pages | New components introduced |
|-------|-------|--------------------------|
| 1 | About, Technologies | `PageHero`, `PortableTextRenderer`, `WhyPillars`, `FoundingStory`, `TechSection`, `TechSideNav` |
| 2 | Services ×3, Packages | `ServiceBody`, `ServiceDifferentiator`, `RelatedPackages`, `DiagnosticTiers`, `AddOns`, `MembershipPlans`, `SessionPacks` |
| 3 | Journey, Corporate, Team | `JourneyTimeline`, `Programmes`, `CorporateCTA`, `FoundersGrid`, `ClinicTeam` |
| 4 | FAQ, Blog Index, Blog Post | `FaqAccordion`, `BlogGrid`, `PostBody`, `PostCTA` |
| 5 | Legal ×4, Contact, 404 | `LegalBody`, `ContactForm`, `/api/contact` route, `NotFoundPage` |

---

## Phase 1 — About & Technologies

### About (`/about`)

**Route files:** `(ka)/about/page.tsx`, `en/about/page.tsx`  
**Page component:** `AboutPage.tsx`  
**Sanity query:** `aboutPageQuery`

**Sections:**

1. **`PageHero`** — H1 from `h1_ka`/`h1_en`, subtitle from `philosophy_ka`/`philosophy_en`

2. **`WhyPillars`** — bone-white background. 3-column grid. Each of the 3 `why_pillars[]` items: burnt-orange number (01/02/03), bold title, body text. Top border rule on each column. `Reveal` on scroll.

3. **`FoundingStory`** — dark-brown background (mirrors homepage Pillars section). Two columns: left has section heading (`founding_story_heading_ka/en`) in large serif; right has founding story body text in Playfair italic, generous line-height. Uses the same `columns-bg_boomerang` video background already loaded on the homepage Pillars section, at low opacity (`bg-dark-brown/60` overlay).

---

### Technologies (`/technologies`)

**Route files:** `(ka)/technologies/page.tsx`, `en/technologies/page.tsx`  
**Page component:** `TechnologiesPage.tsx`  
**Sanity query:** `technologiesQuery`

**Sections:**

1. **`PageHero`** — H1 "Science & Technology" / "მეცნიერება და ტექნოლოგია"

2. **`TechSideNav`** (desktop only) — sticky left/right rail showing 6 dots with tech names. Active dot fills burnt-orange as section enters viewport. Built with `IntersectionObserver`.

3. **`TechSection`** ×6 — one per technology, each with `id` matching slug anchor (`pnoe`, `visbody`, `ihht`, `red-light`, `truediagnostic`, `enbiosis`). Alternating layout:
   - Odd (1, 3, 5): text left, decorative right
   - Even (2, 4, 6): text right, decorative left
   - Content: eyebrow (tech name), H2 tagline, three-column detail grid (What It Is / How It Works or What It Shows / Your Benefit), benefits list with burnt-orange bullets
   - Sections separated by `border-t border-dark-brown/10`
   - Full viewport height on desktop, natural height on mobile

---

## Phase 2 — Services & Packages

### Services (`/services/[slug]`)

**Route files:** `(ka)/services/[slug]/page.tsx`, `en/services/[slug]/page.tsx`  
**Page component:** `ServicePage.tsx`  
**Sanity query:** `serviceBySlugQuery` with `$slug` param  
**Static params:** `servicesQuery` → slugs: `longevity`, `metabolic`, `performance`

**Sections:**

1. **`PageHero`** — title as H1, intro as subtitle

2. **`ServiceBody`** — bone-white, two columns:
   - Left (65%): full body text as plain string paragraphs
   - Right (35%): `card-ornamental` box listing `technologies[]` — each tech name + tagline, linked to `/technologies#[anchor]`

3. **`ServiceDifferentiator`** — dark-brown background, full-width centred. `differentiator_ka`/`en` text rendered large in Playfair serif italic. Visual weight matches homepage CTA section.

4. **`RelatedPackages`** — bone-white. Heading "Recommended Packages" / "რეკომენდებული პაკეტები". Shows 2–3 package cards from `relatedPackages[]`. Reuses existing `Pricing` card component markup directly (card-ornamental shape, hover pattern).

---

### Packages (`/packages`)

**Route files:** `(ka)/packages/page.tsx`, `en/packages/page.tsx`  
**Page component:** `PackagesPage.tsx`  
**Sanity query:** `packagesQuery` (returns `diagnostic`, `memberships`, `addons`, `sessions`)

**Sections:**

1. **`PageHero`** — H1 from `packages_heading_ka/en`, subtitle from `packages_subtext_ka/en`. The packages route files fetch `homePageQuery` in parallel with `packagesQuery` — the heading lives in the `homePage` Sanity document.

2. **`DiagnosticTiers`** — three `card-ornamental` cards (STARTER / PERFORMANCE / ELITE). Identical to homepage Pricing section but full-page width with expanded includes list. Reuses existing card markup.

3. **`AddOns`** — bone-white. Two-column ruled table: Enbiosis row and TrueAge row. Each row: name, description, price right-aligned. Clean `border-b border-dark-brown/10` separators. No cards.

4. **`MembershipPlans`** — dark-brown background. Three `card-ornamental` cards (Silver / Gold / Elite Platinum). Monthly price, goal text, includes list. Same hover pattern as diagnostic cards (card darkens further, button turns burnt-orange). Price displays with `/თვე` or `/mo` suffix.

5. **`SessionPacks`** — bone-white. Simple 3-row pricing table: IHHT / Red Light / Combo. Three price columns (1 session / 5 sessions / 10 sessions). Styled as a clean ruled grid, not cards.

---

## Phase 3 — Journey, Corporate & Team

### Patient Journey (`/journey`)

**Route files:** `(ka)/journey/page.tsx`, `en/journey/page.tsx`  
**Page component:** `JourneyPage.tsx`  
**Sanity query:** `journeyPageQuery`

**Sections:**

1. **`PageHero`** — H1 from `h1_ka/en`, subtitle from `intro_ka/en`

2. **`JourneyTimeline`** — bone-white. Vertical timeline on mobile, two-column offset grid on desktop. Each of 8 stages:
   - Burnt-orange serif stage number (01–08)
   - Bold title
   - Duration badge (pill-shaped, `border border-burnt-orange/40 text-burnt-orange text-[10px] uppercase tracking-widest`)
   - Body text
   - Alternates left/right columns on desktop with a thin vertical connecting line
   - Each stage `Reveal`s on scroll entry

---

### Corporate (`/corporate`)

**Route files:** `(ka)/corporate/page.tsx`, `en/corporate/page.tsx`  
**Page component:** `CorporatePage.tsx`  
**Sanity query:** `corporatePageQuery`

**Sections:**

1. **`PageHero`** — H1 + intro subtitle

2. **`Programmes`** — bone-white. Three `card-ornamental` cards from `programmes[]`. No price — just programme number, title, body text. Same card shape and hover as Pricing.

3. **`CorporateCTA`** — dark-brown full-width section. Centred `cta_label_ka/en` heading + single `btn-primary` linking to `/contact` (or `/en/contact`).

---

### Team (`/team`)

**Route files:** `(ka)/team/page.tsx`, `en/team/page.tsx`  
**Page component:** `TeamPage.tsx`  
**Sanity query:** `teamPageQuery`

**Sections:**

1. **`PageHero`** — H1 + founders subtext

2. **`FoundersGrid`** — bone-white. Group photo full-width at top (if present, else omitted). Below: 5-column grid of founder cards. Each card: circular photo crop, name in serif bold, role, specialty. Cards have subtle `border border-dark-brown/10` outline and `Reveal` on scroll. Gracefully renders placeholder silhouette when photo is null.

3. **`ClinicTeam`** — dark-brown background. Section heading + 2-column grid for the 2 remaining team members. Same card pattern as founders but inverted colors (bone-white text on dark-brown bg).

---

## Phase 4 — FAQ & Blog

### FAQ (`/faq`)

**Route files:** `(ka)/faq/page.tsx`, `en/faq/page.tsx`  
**Page component:** `FaqPage.tsx`  
**Sanity query:** `faqQuery`

**Sections:**

1. **`PageHero`** — H1 from `page.h1_ka/en`

2. **`FaqAccordion`** — bone-white. Single column, `max-w-3xl mx-auto`. Each of 8 items:
   - Clickable row: question text + `+` / `−` icon in burnt-orange (right-aligned)
   - Answer expands with CSS `max-height` transition (smooth, no layout shift)
   - `border-b border-dark-brown/10` between items
   - Only one item open at a time
   - `Reveal` on initial scroll entry

---

### Blog Index (`/blog`)

**Route files:** `(ka)/blog/page.tsx`, `en/blog/page.tsx`  
**Page component:** `BlogIndexPage.tsx`  
**Sanity query:** `blogIndexQuery`

**Sections:**

1. **`PageHero`** — H1 "Journal" (hardcoded — no blogPage singleton needed)

2. **`BlogGrid`** — bone-white. 3-column `card-ornamental` grid. Each post card:
   - Cover image (if present) or decorative bone-white/dark-brown gradient placeholder
   - Category eyebrow in burnt-orange
   - Post title in Playfair serif
   - Excerpt text
   - Published date
   - "Read more →" link in burnt-orange
   - Hover: card lifts with `drop-shadow-lg`, title underlines

---

### Blog Post (`/blog/[slug]`)

**Route files:** `(ka)/blog/[slug]/page.tsx`, `en/blog/[slug]/page.tsx`  
**Page component:** `BlogPostPage.tsx`  
**Sanity query:** `blogPostBySlugQuery` with `$slug` param  
**Static params:** `blogPostSlugsQuery`

**Sections:**

1. **`PageHero`** — post title as H1, category as eyebrow, published date below subtitle

2. **`PostBody`** — bone-white. Two columns on desktop:
   - Left (65%): `PortableTextRenderer` rendering `body_ka` or `body_en`
   - Right (35%): sticky sidebar — "Related Technologies" heading, list of `relatedTechnologies[]` each linking to `/technologies#[anchor]`

3. **Reuses homepage `CTA` section** directly as the post footer CTA

---

## Phase 5 — Legal, Contact & 404

### Legal Pages (`/legal/[pageType]`)

**Route files:** `(ka)/legal/[pageType]/page.tsx`, `en/legal/[pageType]/page.tsx`  
**Page component:** `LegalPage.tsx`  
**Sanity query:** `legalPageByTypeQuery` with `$pageType` param  
**Static params:** fixed array `['privacy', 'terms', 'cookies', 'medical-disclaimer']`

**Sections:**

1. **`PageHero`** — `title_ka/en` as H1, `lastUpdated` date as subtitle

2. **`LegalBody`** — bone-white. Single column `max-w-2xl mx-auto`. `PortableTextRenderer` renders full Portable Text body. `h2` gets `border-t border-dark-brown/20 pt-8 mt-12` for visual section breaks. Clean, minimal — no decorative elements.

---

### Contact (`/contact`)

**Route files:** `(ka)/contact/page.tsx`, `en/contact/page.tsx`  
**Page component:** `ContactPage.tsx`  
**Sanity data:** `siteSettings` fetched explicitly in the contact route files (parallel fetch alongside any other needed queries — do not rely on the layout fetch since Page components don't receive layout-level props)

**Sections:**

1. **`PageHero`** — H1 "Contact Us" / "დაგვიკავშირდით"

2. **`ContactSection`** — bone-white. Two columns on desktop:
   - **Left** — contact details from `siteSettings`: address, phone, email, opening hours. Each with a small burnt-orange icon (map pin, phone, email, clock from `lucide-react`).
   - **Right** — `ContactForm` client component

**`ContactForm`** (`'use client'`):
- Fields: Name (required), Email (required), Phone (optional), Message (required, textarea), GDPR consent checkbox (required)
- Validation: `react-hook-form` + `zod`
- On submit: POST to `/api/contact`
- States: idle → submitting (button disabled + spinner) → success (confirmation message ka/en) → error (inline error message ka/en)
- Bilingual: field labels and error messages rendered in active locale

**API Route** (`src/app/api/contact/route.ts`):
- Validates request body server-side (same zod schema)
- Checks `RESEND_API_KEY` env var
- Sends email via Resend SDK to `info@longevityone.ge`
- Email template: plain structured HTML — sender name, email, phone, message
- Returns `{ success: true }` on 200, appropriate error on 4xx/5xx
- Rate limiting: not in scope for initial build (can be added later)

**Environment variables needed:**
```
RESEND_API_KEY=re_...
CONTACT_EMAIL=info@longevityone.ge
```

---

### 404 (`src/app/not-found.tsx`)

Standalone page (no Nav/Footer). Centred layout:
- Logo mark SVG watermark at low opacity
- H1 from `siteSettings.notFound_h1_ka/en`
- Body text from `siteSettings.notFound_body_ka/en`
- Single `btn-primary` → `/` (or `/en/` depending on locale detection)
- Locale: detected from `headers()` or defaults to Georgian

---

## Component Inventory (new files)

```
src/components/shared/
  PageHero.tsx
  PortableTextRenderer.tsx

src/components/pages/
  AboutPage.tsx
  TechnologiesPage.tsx
  ServicePage.tsx
  PackagesPage.tsx
  JourneyPage.tsx
  CorporatePage.tsx
  TeamPage.tsx
  FaqPage.tsx
  BlogIndexPage.tsx
  BlogPostPage.tsx
  LegalPage.tsx
  ContactPage.tsx

src/components/sections/
  WhyPillars.tsx
  FoundingStory.tsx
  TechSection.tsx
  TechSideNav.tsx
  ServiceBody.tsx
  ServiceDifferentiator.tsx
  DiagnosticTiers.tsx
  AddOns.tsx
  MembershipPlans.tsx
  SessionPacks.tsx
  JourneyTimeline.tsx
  Programmes.tsx
  CorporateCTA.tsx
  FoundersGrid.tsx
  ClinicTeam.tsx
  FaqAccordion.tsx
  BlogGrid.tsx
  PostBody.tsx
  LegalBody.tsx
  ContactSection.tsx
  ContactForm.tsx

src/app/api/contact/route.ts
src/app/not-found.tsx
```

---

## Dependencies to Install

```bash
@portabletext/react     # Portable Text renderer
react-hook-form         # Contact form state
zod                     # Validation (server + client)
@hookform/resolvers     # zod adapter for react-hook-form
resend                  # Email API
```

---

## Out of Scope

- Booking integration (Cal.com embed) — separate feature
- Cookie consent banner — separate feature  
- Search functionality
- Pagination on blog (only 3 posts)
- Rate limiting on contact API
- Team member bios/photos (pending from clinic — components render gracefully without them)
