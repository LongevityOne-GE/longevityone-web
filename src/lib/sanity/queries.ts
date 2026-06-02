import { groq } from 'next-sanity'

// ─── Site Settings ────────────────────────────────────────────────────────────
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    clinicName_ka, clinicName_en,
    tagline_ka, tagline_en,
    address_ka, address_en, maps_url,
    phone, email,
    openingHours_ka, openingHours_en,
    socialFacebook, socialInstagram, socialLinkedIn,
    nav_cta_ka, nav_cta_en,
    cookie_title_ka, cookie_title_en,
    cookie_body_ka, cookie_body_en,
    cookie_accept_ka, cookie_accept_en,
    cookie_reject_ka, cookie_reject_en,
    cookie_manage_ka, cookie_manage_en,
    notFound_h1_ka, notFound_h1_en,
    notFound_body_ka, notFound_body_en,
    notFound_cta_ka, notFound_cta_en,
    footer_copyright_ka, footer_copyright_en,
    default_seo_title_ka, default_seo_title_en,
    default_seo_description_ka, default_seo_description_en,
    og_image { asset->{ url } },
  }
`

// ─── Homepage ─────────────────────────────────────────────────────────────────
export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    hero_slogan_ka, hero_slogan_en,
    hero_h1_ka, hero_h1_en,
    hero_h2_ka, hero_h2_en,
    hero_body_ka, hero_body_en,
    hero_cta_primary_ka, hero_cta_primary_en,
    hero_cta_secondary_ka, hero_cta_secondary_en,
    hero_image { asset->{ url, metadata { lqip, dimensions } } },
    journey_heading_ka, journey_heading_en,
    journey_stages[] {
      number, title_ka, title_en, body_ka, body_en
    },
    pillars_heading_ka, pillars_heading_en,
    tech_heading_ka, tech_heading_en,
    tech_intro_ka, tech_intro_en,
    packages_heading_ka, packages_heading_en,
    packages_subtext_ka, packages_subtext_en,
    membership_heading_ka, membership_heading_en,
    team_heading_ka, team_heading_en,
    team_subtext_ka, team_subtext_en,
    cta_heading_ka, cta_heading_en,
    cta_subtext_ka, cta_subtext_en,
    cta_button_ka, cta_button_en,
    seo_title_ka, seo_title_en,
    seo_description_ka, seo_description_en,
  }
`

// ─── About Page ───────────────────────────────────────────────────────────────
export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0] {
    h1_ka, h1_en,
    philosophy_ka, philosophy_en,
    why_pillars[] { title_ka, title_en, body_ka, body_en },
    founding_story_heading_ka, founding_story_heading_en,
    founding_story_ka, founding_story_en,
    hero_image { asset->{ url, metadata { lqip, dimensions } } },
    seo_title_ka, seo_title_en,
    seo_description_ka, seo_description_en,
  }
`

// ─── Services ─────────────────────────────────────────────────────────────────
export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id, "slug": slug.current,
    title_ka, title_en,
    summary_ka, summary_en,
    icon,
  }
`

export const servicesFullQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id, "slug": slug.current,
    title_ka, title_en,
    summary_ka, summary_en,
    intro_ka, intro_en,
    body_ka, body_en,
    differentiator_ka, differentiator_en,
    targetAudience_ka, targetAudience_en,
    heroImage { asset->{ url, metadata { lqip, dimensions } } },
    icon,
    technologies[]-> {
      name, name_ka, name_en, "slug": slug.current,
      tagline_ka, tagline_en,
      heroImage { asset->{ url } },
    },
    relatedPackages[]-> {
      _id, name_ka, name_en,
      price, priceLabel_ka, priceLabel_en,
      category,
    },
    seo_title_ka, seo_title_en,
    seo_description_ka, seo_description_en,
  }
`

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id, "slug": slug.current,
    title_ka, title_en,
    summary_ka, summary_en,
    intro_ka, intro_en,
    body_ka, body_en,
    differentiator_ka, differentiator_en,
    targetAudience_ka, targetAudience_en,
    heroImage { asset->{ url, metadata { lqip, dimensions } } },
    icon,
    technologies[]-> {
      name, name_ka, name_en, "slug": slug.current,
      tagline_ka, tagline_en,
      heroImage { asset->{ url } },
    },
    relatedPackages[]-> {
      _id, name_ka, name_en,
      price, priceLabel_ka, priceLabel_en,
      category,
    },
    seo_title_ka, seo_title_en,
    seo_description_ka, seo_description_en,
  }
`

// ─── Technologies ─────────────────────────────────────────────────────────────
export const technologiesQuery = groq`
  *[_type == "technology"] | order(order asc) {
    _id, name, name_ka, name_en, "anchor": slug.current,
    order,
    tagline_ka, tagline_en,
    whatItIs_ka, whatItIs_en,
    howItWorks_ka, howItWorks_en,
    whatItShows_ka, whatItShows_en,
    benefits_ka, benefits_en,
    yourBenefit_ka, yourBenefit_en,
    clinicalNote_ka, clinicalNote_en,
    heroImage { alt_ka, alt_en, asset->{ url, metadata { lqip, dimensions } } },
    gallery[] { alt_ka, alt_en, caption_ka, caption_en, layout, asset->{ url, metadata { lqip, dimensions } } },
    specifications[] { label_ka, label_en, value },
    seo_title_ka, seo_title_en,
    seo_description_ka, seo_description_en,
  }
`

// ─── Packages & Pricing ───────────────────────────────────────────────────────
export const packagesQuery = groq`
  {
    "diagnostic": *[_type == "package" && category == "diagnostic"] | order(order asc) {
      _id, name_ka, name_en,
      tier, price, priceLabel_ka, priceLabel_en,
      tagline_ka, tagline_en,
      includes_ka, includes_en,
      isFeatured,
      cta_label_ka, cta_label_en,
    },
    "memberships": *[_type == "package" && category == "membership"] | order(order asc) {
      _id, name_ka, name_en,
      price, priceLabel_ka, priceLabel_en,
      priceSuffix_ka, priceSuffix_en,
      tagline_ka, tagline_en,
      goal_ka, goal_en,
      includes_ka, includes_en,
      isFeatured,
      cta_label_ka, cta_label_en,
    },
    "addons": *[_type == "package" && category == "addon"] | order(order asc) {
      _id, name_ka, name_en,
      tagline_ka, tagline_en,
      price, priceLabel_ka, priceLabel_en,
    },
    "sessions": *[_type == "package" && category == "session"] | order(order asc) {
      _id, name_ka, name_en,
      tagline_ka, tagline_en,
      price, priceLabel_ka, priceLabel_en,
    },
  }
`

// ─── Corporate Page ───────────────────────────────────────────────────────────
export const corporatePageQuery = groq`
  *[_type == "corporatePage"][0] {
    h1_ka, h1_en,
    intro_ka, intro_en,
    programmes[] { number, title_ka, title_en, body_ka, body_en, icon },
    cta_label_ka, cta_label_en,
    hero_image { asset->{ url, metadata { lqip, dimensions } } },
    seo_title_ka, seo_title_en,
    seo_description_ka, seo_description_en,
  }
`

// ─── Patient Journey ──────────────────────────────────────────────────────────
// Singleton heading + intro + CTA block + SEO.
export const JOURNEY_PAGE_QUERY = groq`
  *[_type == "journeyPage"] | order(_createdAt asc)[0] {
    eyebrow_ka, eyebrow_en,
    h1_ka, h1_en,
    intro_ka, intro_en,
    hero_image {
      alt_ka, alt_en,
      asset->{ url, metadata { lqip, dimensions } }
    },
    ctaHeading_ka, ctaHeading_en,
    ctaBody_ka, ctaBody_en,
    primaryCtaLabel_ka, primaryCtaLabel_en,
    secondaryCtaLabel_ka, secondaryCtaLabel_en,
    seo_title_ka, seo_title_en,
    seo_description_ka, seo_description_en,
  }
`

// All 8 stages, ordered by stageNumber asc, with relatedTechnologies
// projected for in-body link rendering and MedicalProcedure JSON-LD.
export const JOURNEY_STAGES_QUERY = groq`
  *[_type == "journeyStage"] | order(stageNumber asc) {
    _id, stageNumber,
    title_ka, title_en,
    subtitle_ka, subtitle_en,
    duration_ka, duration_en,
    deliveredBy_ka, deliveredBy_en,
    body_ka, body_en,
    included_ka, included_en,
    deliverable_ka, deliverable_en,
    relatedTechnologies[]-> {
      name, name_ka, name_en, "slug": slug.current,
      tagline_ka, tagline_en,
    },
    tools, icon,
  }
`

// Back-compat combined query (still used by older callers / studio previews).
export const journeyPageQuery = groq`
  {
    "page": *[_type == "journeyPage"] | order(_createdAt asc)[0] {
      eyebrow_ka, eyebrow_en,
      h1_ka, h1_en,
      intro_ka, intro_en,
      ctaHeading_ka, ctaHeading_en,
      ctaBody_ka, ctaBody_en,
      primaryCtaLabel_ka, primaryCtaLabel_en,
      secondaryCtaLabel_ka, secondaryCtaLabel_en,
      seo_title_ka, seo_title_en,
      seo_description_ka, seo_description_en,
    },
    "stages": *[_type == "journeyStage"] | order(stageNumber asc) {
      _id, stageNumber,
      title_ka, title_en,
      subtitle_ka, subtitle_en,
      duration_ka, duration_en,
      deliveredBy_ka, deliveredBy_en,
      body_ka, body_en,
      included_ka, included_en,
      deliverable_ka, deliverable_en,
      relatedTechnologies[]-> {
        name, name_ka, name_en, "slug": slug.current,
        tagline_ka, tagline_en,
      },
      tools, icon,
    },
  }
`

// ─── Team (used by About page) ────────────────────────────────────────────────
// Filter by defined(tagline_ka) so legacy placeholder docs without taglines
// are excluded - only fully populated, current team members appear here.
export const aboutTeamQuery = groq`
  *[_type == "teamMember" && defined(tagline_ka)] | order(isFounder desc, order asc) {
    _id, name, name_en,
    role_ka, role_en,
    specialty_ka, specialty_en,
    tagline_ka, tagline_en,
    pullQuote_ka, pullQuote_en,
    bio_ka, bio_en,
    fullBio_ka, fullBio_en,
    isFounder,
    photo { asset->{ url, metadata { lqip, dimensions } } },
    credentials,
  }
`

// ─── Team Page ────────────────────────────────────────────────────────────────
export const teamPageQuery = groq`
  {
    "page": *[_type == "teamPage"][0] {
      h1_ka, h1_en,
      founders_heading_ka, founders_heading_en,
      founders_subtext_ka, founders_subtext_en,
      founders_group_photo { asset->{ url, metadata { lqip, dimensions } } },
      clinic_team_heading_ka, clinic_team_heading_en,
    },
    "founders": *[_type == "teamMember" && isFounder == true] | order(order asc) {
      _id, name, name_en,
      role_ka, role_en,
      specialty_ka, specialty_en,
      tagline_ka, tagline_en,
      pullQuote_ka, pullQuote_en,
      bio_ka, bio_en,
      fullBio_ka, fullBio_en,
      isFounder,
      photo { asset->{ url, metadata { lqip, dimensions } } },
      credentials,
    },
    "team": *[_type == "teamMember" && isFounder != true] | order(order asc) {
      _id, name, name_en,
      role_ka, role_en,
      specialty_ka, specialty_en,
      tagline_ka, tagline_en,
      pullQuote_ka, pullQuote_en,
      bio_ka, bio_en,
      fullBio_ka, fullBio_en,
      isFounder,
      photo { asset->{ url, metadata { lqip, dimensions } } },
      credentials,
    },
  }
`

// ─── Blog ─────────────────────────────────────────────────────────────────────
export const blogIndexQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id, "slug": slug.current,
    title_ka, title_en,
    excerpt_ka, excerpt_en,
    category_ka, category_en,
    coverImage { asset->{ url, metadata { lqip, dimensions } } },
    publishedAt,
    author->{ name, name_en, photo { asset->{ url } } },
  }
`

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id, "slug": slug.current,
    title_ka, title_en,
    excerpt_ka, excerpt_en,
    category_ka, category_en,
    body_ka, body_en,
    coverImage { asset->{ url, metadata { lqip, dimensions } } },
    publishedAt,
    author->{ name, name_en, photo { asset->{ url } } },
    relatedTechnologies[]-> {
      name, name_ka, name_en, "anchor": slug.current,
      tagline_ka, tagline_en,
    },
    seoTitle_ka, seoTitle_en,
    seoDescription_ka, seoDescription_en,
  }
`

// Slugs for static generation
export const blogPostSlugsQuery = groq`
  *[_type == "blogPost" && defined(slug.current)] {
    "slug": slug.current
  }
`

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export const faqQuery = groq`
  {
    "page": *[_type == "faqPage"][0] {
      h1_ka, h1_en,
      seo_title_ka, seo_title_en,
      seo_description_ka, seo_description_en,
    },
    "items": *[_type == "faqItem"] | order(category asc, order asc) {
      _id, category,
      question_ka, question_en,
      answer_ka, answer_en,
    },
  }
`

// ─── Legal Page ───────────────────────────────────────────────────────────────
export const legalPageByTypeQuery = groq`
  *[_type == "legalPage" && pageType == $pageType][0] {
    pageType,
    title_ka, title_en,
    intro_ka, intro_en,
    lastUpdated,
    body_ka, body_en,
    seoDescription_ka, seoDescription_en,
  }
`

// Alias — semantically clearer for the new LegalPageLayout.
export const legalPageBySlugQuery = legalPageByTypeQuery

// ─── Homepage: services + technologies teaser (fetched alongside homePageQuery)
export const homeServicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id, "slug": slug.current,
    title_ka, title_en,
    summary_ka, summary_en,
    icon,
  }
`

export const homeTechQuery = groq`
  *[_type == "technology"] | order(order asc) {
    name, "anchor": slug.current,
    tagline_ka, tagline_en,
    heroImage { asset->{ url, metadata { lqip } } },
  }
`

export const homePackagesTeaserQuery = groq`
  *[_type == "package" && category == "diagnostic"] | order(order asc) {
    _id, name_ka, name_en,
    tier, price, priceLabel_ka, priceLabel_en,
    includes_ka, includes_en,
    isFeatured,
  }
`

export const homeMembershipsTeaserQuery = groq`
  *[_type == "package" && category == "membership"] | order(order asc) {
    _id, name_ka, name_en,
    priceLabel_ka, priceLabel_en,
    priceSuffix_ka, priceSuffix_en,
    tagline_ka, tagline_en,
  }
`

// Team teaser for the homepage Team section (all members)
export const homeFoundersQuery = groq`
  *[_type == "teamMember"] | order(isFounder desc, order asc) {
    _id, name, name_en,
    role_ka, role_en,
    isFounder,
    photo { asset->{ url, metadata { lqip } } },
  }
`

// ─── Advisory Board ───────────────────────────────────────────────────────────

export const ADVISORY_BOARD_PAGE_QUERY = groq`
  *[_type == "advisoryBoardPage"] | order(_createdAt asc)[0] {
    eyebrow_ka, eyebrow_en,
    heading_ka, heading_en,
    intro_ka, intro_en,
    sectionGeorgianHeading_ka, sectionGeorgianHeading_en,
    sectionInternationalHeading_ka, sectionInternationalHeading_en,
    seoTitle_ka, seoTitle_en,
    seoDescription_ka, seoDescription_en,
  }
`

// Only members with GDPR consent are returned.
// Sorted: chair first, then vice-chair, then members — then by order, then name_en.
// Note: boardRole sort order (chair < member < vice-chair alphabetically) is handled
// in application code after fetch via sortAdvisoryMembers().
export const ADVISORY_BOARD_MEMBERS_QUERY = groq`
  *[_type == "advisoryBoardMember" && consentToPublicListing == true]
    | order(order asc, name_en asc) {
    _id,
    name_ka, name_en,
    "slug": slug.current,
    credentials,
    boardRole,
    title_ka, title_en,
    affiliation_ka, affiliation_en,
    affiliationCountry,
    isInternational,
    expertise_ka, expertise_en,
    bio_ka, bio_en,
    photo {
      asset->{ url, metadata { lqip, dimensions } },
      hotspot,
      alt_ka, alt_en,
    },
    profileUrl,
    order,
  }
`
