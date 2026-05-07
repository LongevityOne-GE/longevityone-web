# LongevityOne — Remaining Pages Implementation Plan

**Date:** 2026-05-04  
**Spec:** `docs/superpowers/specs/2026-05-04-remaining-pages-design.md`  
**Estimated effort:** 5 phases, ~40 files

---

## Pre-flight

```bash
pnpm add @portabletext/react
```

---

## Phase 0 — Shared Components

Create reusable components before any page work.

### 0.1 `PageHero`
**File:** `src/components/shared/PageHero.tsx`

```
Props: { locale, eyebrow?, title, subtitle? }
Layout:
  - bone-white bg, py-24 md:py-32
  - Logo watermark SVG at 6% opacity, centered absolute
  - eyebrow in burnt-orange small-caps (optional)
  - H1 in large Playfair serif
  - subtitle paragraph (optional)
  - Reveal animations
```

### 0.2 `PortableTextRenderer`
**File:** `src/components/shared/PortableTextRenderer.tsx`

```
Uses @portabletext/react
Custom components:
  - h2: Playfair serif, border-t border-dark-brown/20 pt-8 mt-12
  - h3: Playfair serif medium
  - p: text-dark-brown/85, generous line-height
  - strong: font-bold text-dark-brown
  - ul: burnt-orange bullet markers
  - a: burnt-orange, underline on hover
```

### 0.3 `PackageCard`
**File:** `src/components/shared/PackageCard.tsx`

Extract from existing `Pricing.tsx`:
```
Props: { locale, name, price?, priceLabel?, priceSuffix?, includes?, ctaLabel?, isFeatured?, variant?: 'light' | 'dark' }
Reuses card-ornamental shape, hover inversion pattern
```

Update `Pricing.tsx` to import and use `PackageCard`.

---

## Phase 1 — About & Technologies

### 1.1 About Page

| File | Type | Notes |
|------|------|-------|
| `src/app/(ka)/about/page.tsx` | Route | Fetch `aboutPageQuery`, render `AboutPage` |
| `src/app/en/about/page.tsx` | Route | Same, locale="en" |
| `src/components/pages/AboutPage.tsx` | Page | Compose sections |
| `src/components/sections/WhyPillars.tsx` | Section | 3-column grid, numbered pillars |
| `src/components/sections/FoundingStory.tsx` | Section | Dark bg, video background, two-column layout |

**Sections flow:**
1. `PageHero` — h1 + philosophy subtitle
2. `WhyPillars` — bone-white, 3 pillars with 01/02/03 numbers
3. `FoundingStory` — dark-brown, columns-bg video, italic story text

### 1.2 Technologies Page

| File | Type | Notes |
|------|------|-------|
| `src/app/(ka)/technologies/page.tsx` | Route | Fetch `technologiesQuery` |
| `src/app/en/technologies/page.tsx` | Route | Same |
| `src/components/pages/TechnologiesPage.tsx` | Page | Compose sections |
| `src/components/sections/TechSideNav.tsx` | Section | `'use client'`, sticky dots, IntersectionObserver |
| `src/components/sections/TechSection.tsx` | Section | Single tech, alternating layout |

**Sections flow:**
1. `PageHero` — "Science & Technology"
2. `TechSideNav` (desktop sticky rail)
3. `TechSection` ×6 — alternating left/right, anchored by slug

---

## Phase 2 — Services & Packages

### 2.1 Service Pages (dynamic)

| File | Type | Notes |
|------|------|-------|
| `src/app/(ka)/services/[slug]/page.tsx` | Route | Fetch `serviceBySlugQuery`, `generateStaticParams` |
| `src/app/en/services/[slug]/page.tsx` | Route | Same |
| `src/components/pages/ServicePage.tsx` | Page | Compose sections |
| `src/components/sections/ServiceBody.tsx` | Section | Two-column: body + tech sidebar |
| `src/components/sections/ServiceDifferentiator.tsx` | Section | Dark bg, large italic quote |
| `src/components/sections/RelatedPackages.tsx` | Section | Uses `PackageCard` |

**Static params:** `['longevity', 'metabolic', 'performance']`

### 2.2 Services Index (optional redirect)

| File | Type | Notes |
|------|------|-------|
| `src/app/(ka)/services/page.tsx` | Route | Redirect to `/services/longevity` or list view |
| `src/app/en/services/page.tsx` | Route | Same |

### 2.3 Packages Page

| File | Type | Notes |
|------|------|-------|
| `src/app/(ka)/packages/page.tsx` | Route | Fetch `packagesQuery` + `homePageQuery` (for heading) |
| `src/app/en/packages/page.tsx` | Route | Same |
| `src/components/pages/PackagesPage.tsx` | Page | Compose sections |
| `src/components/sections/DiagnosticTiers.tsx` | Section | 3 `PackageCard` cards |
| `src/components/sections/AddOns.tsx` | Section | Two-row ruled table |
| `src/components/sections/MembershipPlans.tsx` | Section | Dark bg, 3 `PackageCard` cards |
| `src/components/sections/SessionPacks.tsx` | Section | 3-row pricing grid |

---

## Phase 3 — Journey, Corporate & Team

### 3.1 Journey Page

| File | Type | Notes |
|------|------|-------|
| `src/app/(ka)/journey/page.tsx` | Route | Fetch `journeyPageQuery` |
| `src/app/en/journey/page.tsx` | Route | Same |
| `src/components/pages/JourneyPage.tsx` | Page | Compose sections |
| `src/components/sections/JourneyTimeline.tsx` | Section | 8 stages, vertical mobile / offset grid desktop |

### 3.2 Corporate Page

| File | Type | Notes |
|------|------|-------|
| `src/app/(ka)/corporate/page.tsx` | Route | Fetch `corporatePageQuery` |
| `src/app/en/corporate/page.tsx` | Route | Same |
| `src/components/pages/CorporatePage.tsx` | Page | Compose sections |
| `src/components/sections/Programmes.tsx` | Section | 3 `PackageCard`-style cards (no price) |
| `src/components/sections/CorporateCTA.tsx` | Section | Dark bg, centered CTA |

### 3.3 Team Page

| File | Type | Notes |
|------|------|-------|
| `src/app/(ka)/team/page.tsx` | Route | Fetch `teamPageQuery` |
| `src/app/en/team/page.tsx` | Route | Same |
| `src/components/pages/TeamPage.tsx` | Page | Compose sections |
| `src/components/sections/FoundersGrid.tsx` | Section | Group photo + 5-col grid |
| `src/components/sections/ClinicTeam.tsx` | Section | Dark bg, 2-col grid |

---

## Phase 4 — FAQ & Blog

### 4.1 FAQ Page

| File | Type | Notes |
|------|------|-------|
| `src/app/(ka)/faq/page.tsx` | Route | Fetch `faqQuery` |
| `src/app/en/faq/page.tsx` | Route | Same |
| `src/components/pages/FaqPage.tsx` | Page | Compose sections |
| `src/components/sections/FaqAccordion.tsx` | Section | `'use client'`, single-open accordion |

### 4.2 Blog Index

| File | Type | Notes |
|------|------|-------|
| `src/app/(ka)/blog/page.tsx` | Route | Fetch `blogIndexQuery` |
| `src/app/en/blog/page.tsx` | Route | Same |
| `src/components/pages/BlogIndexPage.tsx` | Page | Compose sections |
| `src/components/sections/BlogGrid.tsx` | Section | 3-col card grid |

### 4.3 Blog Post (dynamic)

| File | Type | Notes |
|------|------|-------|
| `src/app/(ka)/blog/[slug]/page.tsx` | Route | Fetch `blogPostBySlugQuery`, `generateStaticParams` |
| `src/app/en/blog/[slug]/page.tsx` | Route | Same |
| `src/components/pages/BlogPostPage.tsx` | Page | Compose sections |
| `src/components/sections/PostBody.tsx` | Section | `PortableTextRenderer` + sticky sidebar |

**Footer:** Reuse existing `CTA` section directly.

---

## Phase 5 — Legal, Contact & 404

### 5.1 Legal Pages (dynamic)

| File | Type | Notes |
|------|------|-------|
| `src/app/(ka)/legal/[pageType]/page.tsx` | Route | Fetch `legalPageByTypeQuery`, `generateStaticParams` |
| `src/app/en/legal/[pageType]/page.tsx` | Route | Same |
| `src/components/pages/LegalPage.tsx` | Page | Compose sections |
| `src/components/sections/LegalBody.tsx` | Section | `PortableTextRenderer`, max-w-2xl |

**Static params:** `['privacy', 'terms', 'cookies', 'medical-disclaimer']`

### 5.2 Contact Page

| File | Type | Notes |
|------|------|-------|
| `src/app/(ka)/contact/page.tsx` | Route | Fetch `siteSettingsQuery` |
| `src/app/en/contact/page.tsx` | Route | Same |
| `src/components/pages/ContactPage.tsx` | Page | Compose sections |
| `src/components/sections/ContactSection.tsx` | Section | Two-column: details + form |
| `src/components/sections/ContactForm.tsx` | Section | `'use client'`, react-hook-form + zod |
| `src/app/api/contact/route.ts` | API | Zod validation, Resend email |

**Environment variables:**
```
RESEND_API_KEY=re_...
CONTACT_EMAIL=info@longevityone.ge
```

### 5.3 404 Page

| File | Type | Notes |
|------|------|-------|
| `src/app/not-found.tsx` | Page | Standalone, no Nav/Footer, locale detection |

---

## File Count Summary

| Phase | Routes | Pages | Sections | Other | Total |
|-------|--------|-------|----------|-------|-------|
| 0 | 0 | 0 | 0 | 3 shared | 3 |
| 1 | 4 | 2 | 4 | 0 | 10 |
| 2 | 6 | 2 | 5 | 0 | 13 |
| 3 | 6 | 3 | 5 | 0 | 14 |
| 4 | 6 | 3 | 3 | 0 | 12 |
| 5 | 5 | 3 | 3 | 2 (API + 404) | 13 |
| **Total** | **27** | **13** | **20** | **5** | **65** |

---

## Execution Order

1. **Phase 0** — shared components (blocks everything else)
2. **Phase 1** — About + Technologies (introduces `PageHero`, `PortableTextRenderer` usage)
3. **Phase 2** — Services + Packages (introduces `PackageCard` reuse, dynamic routes)
4. **Phase 3** — Journey + Corporate + Team (straightforward sections)
5. **Phase 4** — FAQ + Blog (accordion, Portable Text body)
6. **Phase 5** — Legal + Contact + 404 (form, API, error page)

---

## Verification Checklist (per phase)

- [ ] `pnpm build` passes
- [ ] All routes render at `/` and `/en/` prefixes
- [ ] Sanity data displays correctly
- [ ] Responsive: mobile (375px), tablet (768px), desktop (1440px)
- [ ] Reveal animations trigger on scroll
- [ ] No TypeScript errors
- [ ] No console errors

---

## Notes

- **No new Sanity schemas needed** — all queries and types exist
- **`@portabletext/react`** is the only new dependency
- **Footer links** already point to `/privacy`, `/terms`, `/faq` — these will work once pages exist
- **Services index** (`/services`) can redirect to first service or show a list — decide during implementation
