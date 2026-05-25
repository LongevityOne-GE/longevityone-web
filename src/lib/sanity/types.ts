// TypeScript types derived from GROQ query projections.
// Each type matches exactly what the query returns - not the full schema document.

// ─── Shared ───────────────────────────────────────────────────────────────────

interface SanityImageAsset {
  url: string
  metadata?: {
    lqip?: string
    dimensions?: { width: number; height: number; aspectRatio: number }
  }
}

export interface SanityImage {
  asset: SanityImageAsset
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface SiteSettings {
  clinicName_ka: string | null
  clinicName_en: string | null
  tagline_ka: string | null
  tagline_en: string | null
  address_ka: string | null
  address_en: string | null
  maps_url: string | null
  phone: string | null
  email: string | null
  openingHours_ka: string[] | null
  openingHours_en: string[] | null
  socialFacebook: string | null
  socialInstagram: string | null
  socialLinkedIn: string | null
  nav_cta_ka: string | null
  nav_cta_en: string | null
  cookie_title_ka: string | null
  cookie_title_en: string | null
  cookie_body_ka: string | null
  cookie_body_en: string | null
  cookie_accept_ka: string | null
  cookie_accept_en: string | null
  cookie_reject_ka: string | null
  cookie_reject_en: string | null
  cookie_manage_ka: string | null
  cookie_manage_en: string | null
  notFound_h1_ka: string | null
  notFound_h1_en: string | null
  notFound_body_ka: string | null
  notFound_body_en: string | null
  notFound_cta_ka: string | null
  notFound_cta_en: string | null
  footer_copyright_ka: string | null
  footer_copyright_en: string | null
  default_seo_title_ka: string | null
  default_seo_title_en: string | null
  default_seo_description_ka: string | null
  default_seo_description_en: string | null
  og_image: { asset: { url: string } } | null
}

// ─── Homepage ─────────────────────────────────────────────────────────────────

export interface HomeJourneyStage {
  number: number
  title_ka: string
  title_en: string
  body_ka: string
  body_en: string
}

export interface HomePageData {
  hero_slogan_ka: string | null
  hero_slogan_en: string | null
  hero_h1_ka: string | null
  hero_h1_en: string | null
  hero_h2_ka: string | null
  hero_h2_en: string | null
  hero_body_ka: string | null
  hero_body_en: string | null
  hero_cta_primary_ka: string | null
  hero_cta_primary_en: string | null
  hero_cta_secondary_ka: string | null
  hero_cta_secondary_en: string | null
  hero_image: SanityImage | null
  journey_heading_ka: string | null
  journey_heading_en: string | null
  journey_stages: HomeJourneyStage[] | null
  pillars_heading_ka: string | null
  pillars_heading_en: string | null
  tech_heading_ka: string | null
  tech_heading_en: string | null
  tech_intro_ka: string | null
  tech_intro_en: string | null
  packages_heading_ka: string | null
  packages_heading_en: string | null
  packages_subtext_ka: string | null
  packages_subtext_en: string | null
  membership_heading_ka: string | null
  membership_heading_en: string | null
  team_heading_ka: string | null
  team_heading_en: string | null
  team_subtext_ka: string | null
  team_subtext_en: string | null
  cta_heading_ka: string | null
  cta_heading_en: string | null
  cta_subtext_ka: string | null
  cta_subtext_en: string | null
  cta_button_ka: string | null
  cta_button_en: string | null
  seo_title_ka: string | null
  seo_title_en: string | null
  seo_description_ka: string | null
  seo_description_en: string | null
}

export interface HomeService {
  _id: string
  slug: string
  title_ka: string | null
  title_en: string | null
  summary_ka: string | null
  summary_en: string | null
  icon: string | null
}

export interface HomeTech {
  name: string
  anchor: string
  tagline_ka: string | null
  tagline_en: string | null
  heroImage: { asset: { url: string; metadata: { lqip: string } } } | null
}

export interface HomePackage {
  _id: string
  name_ka: string | null
  name_en: string | null
  tier: string | null
  price: number | null
  priceLabel_ka: string | null
  priceLabel_en: string | null
  includes_ka: string[] | null
  includes_en: string[] | null
  isFeatured: boolean | null
}

export interface HomeMembership {
  _id: string
  name_ka: string | null
  name_en: string | null
  priceLabel_ka: string | null
  priceLabel_en: string | null
  priceSuffix_ka: string | null
  priceSuffix_en: string | null
  tagline_ka: string | null
  tagline_en: string | null
}

// ─── About Page ───────────────────────────────────────────────────────────────

export interface AboutWhyPillar {
  title_ka: string
  title_en: string
  body_ka: string
  body_en: string
}

export interface AboutPage {
  h1_ka: string | null
  h1_en: string | null
  philosophy_ka: string | null
  philosophy_en: string | null
  why_pillars: AboutWhyPillar[] | null
  founding_story_heading_ka: string | null
  founding_story_heading_en: string | null
  founding_story_ka: unknown[] | null
  founding_story_en: unknown[] | null
  hero_image: SanityImage | null
  seo_title_ka: string | null
  seo_title_en: string | null
  seo_description_ka: string | null
  seo_description_en: string | null
}

// ─── Services ─────────────────────────────────────────────────────────────────

export interface Service {
  _id: string
  slug: string
  title_ka: string | null
  title_en: string | null
  summary_ka: string | null
  summary_en: string | null
  icon: string | null
}

export interface ServiceDetail extends Service {
  intro_ka: string | null
  intro_en: string | null
  body_ka: unknown[] | null
  body_en: unknown[] | null
  differentiator_ka: string | null
  differentiator_en: string | null
  targetAudience_ka: string | null
  targetAudience_en: string | null
  heroImage: SanityImage | null
  technologies: Array<{
    name: string
    slug: string
    tagline_ka: string | null
    tagline_en: string | null
    heroImage: { asset: { url: string } } | null
  }> | null
  relatedPackages: Array<{
    _id: string
    name_ka: string | null
    name_en: string | null
    price: number | null
    priceLabel_ka: string | null
    priceLabel_en: string | null
    category: string
  }> | null
  seo_title_ka: string | null
  seo_title_en: string | null
  seo_description_ka: string | null
  seo_description_en: string | null
}

// ─── Technologies ─────────────────────────────────────────────────────────────

export interface TechnologySpec {
  label_ka: string
  label_en: string
  value: string
}

export interface Technology {
  _id: string
  name: string
  anchor: string
  order: number
  tagline_ka: string | null
  tagline_en: string | null
  whatItIs_ka: string | null
  whatItIs_en: string | null
  howItWorks_ka: string | null
  howItWorks_en: string | null
  whatItShows_ka: string | null
  whatItShows_en: string | null
  benefits_ka: string[] | null
  benefits_en: string[] | null
  yourBenefit_ka: string | null
  yourBenefit_en: string | null
  clinicalNote_ka: string | null
  clinicalNote_en: string | null
  heroImage: SanityImage | null
  specifications: TechnologySpec[] | null
  seo_title_ka: string | null
  seo_title_en: string | null
  seo_description_ka: string | null
  seo_description_en: string | null
}

// ─── Packages & Pricing ───────────────────────────────────────────────────────

export interface DiagnosticPackage {
  _id: string
  name_ka: string | null
  name_en: string | null
  tier: string | null
  price: number | null
  priceLabel_ka: string | null
  priceLabel_en: string | null
  tagline_ka: string | null
  tagline_en: string | null
  includes_ka: string[] | null
  includes_en: string[] | null
  isFeatured: boolean | null
  cta_label_ka: string | null
  cta_label_en: string | null
}

export interface MembershipPackage {
  _id: string
  name_ka: string | null
  name_en: string | null
  price: number | null
  priceLabel_ka: string | null
  priceLabel_en: string | null
  priceSuffix_ka: string | null
  priceSuffix_en: string | null
  tagline_ka: string | null
  tagline_en: string | null
  goal_ka: string | null
  goal_en: string | null
  includes_ka: string[] | null
  includes_en: string[] | null
  isFeatured: boolean | null
  cta_label_ka: string | null
  cta_label_en: string | null
}

export interface SimplePackage {
  _id: string
  name_ka: string | null
  name_en: string | null
  price: number | null
  priceLabel_ka: string | null
  priceLabel_en: string | null
}

export interface PackagesData {
  diagnostic: DiagnosticPackage[]
  memberships: MembershipPackage[]
  addons: SimplePackage[]
  sessions: SimplePackage[]
}

// ─── Corporate Page ───────────────────────────────────────────────────────────

export interface CorporateProgramme {
  number: number
  title_ka: string
  title_en: string
  body_ka: string
  body_en: string
  icon: string | null
}

export interface CorporatePage {
  h1_ka: string | null
  h1_en: string | null
  intro_ka: string | null
  intro_en: string | null
  programmes: CorporateProgramme[] | null
  cta_label_ka: string | null
  cta_label_en: string | null
  hero_image: SanityImage | null
  seo_title_ka: string | null
  seo_title_en: string | null
  seo_description_ka: string | null
  seo_description_en: string | null
}

// ─── Patient Journey ──────────────────────────────────────────────────────────

export interface JourneyStageTechRef {
  name: string
  slug: string
  tagline_ka: string | null
  tagline_en: string | null
}

export interface JourneyStage {
  _id: string
  stageNumber: number
  title_ka: string | null
  title_en: string | null
  subtitle_ka: string | null
  subtitle_en: string | null
  duration_ka: string | null
  duration_en: string | null
  deliveredBy_ka: string | null
  deliveredBy_en: string | null
  body_ka: unknown[] | null
  body_en: unknown[] | null
  included_ka: string[] | null
  included_en: string[] | null
  deliverable_ka: string | null
  deliverable_en: string | null
  relatedTechnologies: JourneyStageTechRef[] | null
  tools: string[] | null
  icon: string | null
}

export interface JourneyPage {
  eyebrow_ka: string | null
  eyebrow_en: string | null
  h1_ka: string | null
  h1_en: string | null
  intro_ka: string | null
  intro_en: string | null
  hero_image: {
    alt_ka: string | null
    alt_en: string | null
    asset: SanityImageAsset
  } | null
  ctaHeading_ka: string | null
  ctaHeading_en: string | null
  ctaBody_ka: string | null
  ctaBody_en: string | null
  primaryCtaLabel_ka: string | null
  primaryCtaLabel_en: string | null
  secondaryCtaLabel_ka: string | null
  secondaryCtaLabel_en: string | null
  seo_title_ka: string | null
  seo_title_en: string | null
  seo_description_ka: string | null
  seo_description_en: string | null
}

export interface JourneyData {
  page: JourneyPage | null
  stages: JourneyStage[]
}

// ─── Team Page ────────────────────────────────────────────────────────────────

export interface TeamMember {
  _id: string
  name: string
  name_en: string | null
  role_ka: string | null
  role_en: string | null
  specialty_ka: string | null
  specialty_en: string | null
  tagline_ka: string | null
  tagline_en: string | null
  pullQuote_ka: string | null
  pullQuote_en: string | null
  bio_ka: string | null
  bio_en: string | null
  fullBio_ka: unknown[] | null
  fullBio_en: unknown[] | null
  isFounder?: boolean | null
  photo: SanityImage | null
  credentials: string[] | null
}

export type HomeFounder = Pick<
  TeamMember,
  '_id' | 'name' | 'name_en' | 'role_ka' | 'role_en' | 'photo' | 'isFounder'
>

export interface TeamData {
  page: {
    h1_ka: string | null
    h1_en: string | null
    founders_heading_ka: string | null
    founders_heading_en: string | null
    founders_subtext_ka: string | null
    founders_subtext_en: string | null
    founders_group_photo: SanityImage | null
    clinic_team_heading_ka: string | null
    clinic_team_heading_en: string | null
  } | null
  founders: TeamMember[]
  team: TeamMember[]
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export interface BlogAuthor {
  name: string
  name_en: string | null
  photo: { asset: { url: string } } | null
}

export interface BlogPost {
  _id: string
  slug: string
  title_ka: string | null
  title_en: string | null
  excerpt_ka: string | null
  excerpt_en: string | null
  category_ka: string | null
  category_en: string | null
  coverImage: SanityImage | null
  publishedAt: string | null
  author: BlogAuthor | null
}

export interface BlogPostDetail extends BlogPost {
  body_ka: unknown[] | null
  body_en: unknown[] | null
  relatedTechnologies: Array<{
    name: string
    anchor: string
    tagline_ka: string | null
    tagline_en: string | null
  }> | null
  seoTitle_ka: string | null
  seoTitle_en: string | null
  seoDescription_ka: string | null
  seoDescription_en: string | null
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export interface FaqItem {
  _id: string
  category: string
  question_ka: string | null
  question_en: string | null
  answer_ka: unknown[] | null
  answer_en: unknown[] | null
}

export interface FaqData {
  page: {
    h1_ka: string | null
    h1_en: string | null
    seo_title_ka: string | null
    seo_title_en: string | null
    seo_description_ka: string | null
    seo_description_en: string | null
  } | null
  items: FaqItem[]
}

// ─── Legal Page ───────────────────────────────────────────────────────────────

export interface LegalPage {
  pageType: string
  title_ka: string | null
  title_en: string | null
  lastUpdated: string | null
  body_ka: unknown[] | null
  body_en: unknown[] | null
}

// ─── Advisory Board ───────────────────────────────────────────────────────────

export type BoardRole = 'chair' | 'vice-chair' | 'member'

export interface AdvisoryBoardMember {
  _id: string
  name_ka: string
  name_en: string
  slug: string
  credentials: string[] | null
  boardRole: BoardRole
  title_ka: string
  title_en: string
  affiliation_ka: string | null
  affiliation_en: string | null
  affiliationCountry: string | null
  isInternational: boolean
  expertise_ka: string[] | null
  expertise_en: string[] | null
  bio_ka: unknown[]
  bio_en: unknown[]
  photo: {
    asset: SanityImageAsset
    hotspot?: { x: number; y: number; height: number; width: number }
    alt_ka: string
    alt_en: string
  } | null
  profileUrl: string | null
  order: number | null
}

export interface AdvisoryBoardPage {
  eyebrow_ka: string | null
  eyebrow_en: string | null
  heading_ka: string
  heading_en: string
  intro_ka: string | null
  intro_en: string | null
  sectionGeorgianHeading_ka: string | null
  sectionGeorgianHeading_en: string | null
  sectionInternationalHeading_ka: string | null
  sectionInternationalHeading_en: string | null
  seoTitle_ka: string | null
  seoTitle_en: string | null
  seoDescription_ka: string | null
  seoDescription_en: string | null
}
