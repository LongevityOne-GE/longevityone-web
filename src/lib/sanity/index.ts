// ─── Next.js data-layer barrel ───────────────────────────────────────────────
export { sanityClient } from './client'
export { urlFor } from './image'
export * from './queries'
export * from './types'

// ─── Schema registry (imported by sanity.config.ts) ──────────────────────────
/**
 * Longevity One — Sanity Schema Index
 *
 * Register all schemas here. Import this in sanity.config.ts:
 *
 *   import { schemaTypes } from './sanity/schemas'
 *
 *   export default defineConfig({
 *     schema: { types: schemaTypes },
 *     ...
 *   })
 *
 * Singleton documents (homePage, aboutPage, etc.) use __experimental_actions
 * to disable "Create" in Studio — editors can only update the single document.
 * To create the singletons for the first time, temporarily remove that
 * restriction or create them via the Sanity CLI / import script.
 */

// ─── Singleton page documents ─────────────────────────────────────────────────
export { homePage } from './homePage'
export { aboutPage } from './aboutPage'
export { corporatePage } from './corporatePage'
export { journeyPage, journeyStage } from './journeyStage'
export { faqPage, faqItem } from './faqItem'
export { teamPage, teamMember } from './teamMember'

// ─── Repeatable documents ─────────────────────────────────────────────────────
export { service } from './service'
export { technology } from './technology'
export { packageDoc as package } from './package'
export { blogPost } from './blogPost'
export { legalPage } from './legalPage'

// ─── Global settings singleton ───────────────────────────────────────────────
export { siteSettings } from './siteSettings'

// ─── Collected array for Sanity config ───────────────────────────────────────
import { homePage } from './homePage'
import { aboutPage } from './aboutPage'
import { corporatePage } from './corporatePage'
import { journeyPage, journeyStage } from './journeyStage'
import { faqPage, faqItem } from './faqItem'
import { teamPage, teamMember } from './teamMember'
import { service } from './service'
import { technology } from './technology'
import { packageDoc } from './package'
import { blogPost } from './blogPost'
import { legalPage } from './legalPage'
import { siteSettings } from './siteSettings'

export const schemaTypes = [
  // Singletons first — appear at top of Studio sidebar
  siteSettings,
  homePage,
  aboutPage,
  corporatePage,
  journeyPage,
  teamPage,
  faqPage,
  // Repeatable collections
  service,
  technology,
  packageDoc,
  blogPost,
  // Repeatable documents under singletons
  journeyStage,
  faqItem,
  teamMember,
  legalPage,
]
