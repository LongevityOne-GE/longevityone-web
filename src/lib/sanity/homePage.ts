import { defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  // Singleton — enforce via access control in Sanity Studio
  // @ts-expect-error __experimental_actions is valid in Sanity Studio but not yet typed
  __experimental_actions: ['update', 'publish'],
  fields: [
    // ─── Hero ────────────────────────────────────────────────────────────────
    defineField({
      name: 'hero_slogan_ka',
      title: 'Hero Slogan (Georgian)',
      type: 'string',
      description: 'Short eyebrow line — e.g. დღეგრძელობის ხელოვნება',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hero_slogan_en',
      title: 'Hero Slogan (English)',
      type: 'string',
    }),
    defineField({
      name: 'hero_h1_ka',
      title: 'Hero H1 (Georgian)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hero_h1_en',
      title: 'Hero H1 (English)',
      type: 'string',
    }),
    defineField({
      name: 'hero_h2_ka',
      title: 'Hero H2 / Subheading (Georgian)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'hero_h2_en',
      title: 'Hero H2 / Subheading (English)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'hero_body_ka',
      title: 'Hero Body Text (Georgian)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'hero_body_en',
      title: 'Hero Body Text (English)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'hero_cta_primary_ka',
      title: 'Hero Primary CTA Label (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'hero_cta_primary_en',
      title: 'Hero Primary CTA Label (English)',
      type: 'string',
    }),
    defineField({
      name: 'hero_cta_secondary_ka',
      title: 'Hero Secondary CTA Label (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'hero_cta_secondary_en',
      title: 'Hero Secondary CTA Label (English)',
      type: 'string',
    }),
    defineField({
      name: 'hero_image',
      title: 'Hero Image',
      type: 'image',
      description: 'Classical sculpture — from brand guidelines',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),

    // ─── Journey Teaser (4-stage) ─────────────────────────────────────────────
    defineField({
      name: 'journey_heading_ka',
      title: 'Journey Section Heading (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'journey_heading_en',
      title: 'Journey Section Heading (English)',
      type: 'string',
    }),
    defineField({
      name: 'journey_stages',
      title: 'Journey Stages (4 stages)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'number', title: 'Stage Number', type: 'number' }),
            defineField({ name: 'title_ka', title: 'Title (Georgian)', type: 'string' }),
            defineField({ name: 'title_en', title: 'Title (English)', type: 'string' }),
            defineField({ name: 'body_ka', title: 'Body (Georgian)', type: 'text', rows: 3 }),
            defineField({ name: 'body_en', title: 'Body (English)', type: 'text', rows: 3 }),
          ],
          preview: {
            select: { title: 'title_en', subtitle: 'number' },
            prepare: ({ title, subtitle }) => ({ title: `${subtitle}. ${title}` }),
          },
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),

    // ─── Service Pillars ──────────────────────────────────────────────────────
    defineField({
      name: 'pillars_heading_ka',
      title: 'Service Pillars Heading (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'pillars_heading_en',
      title: 'Service Pillars Heading (English)',
      type: 'string',
    }),

    // ─── Technology Showcase ──────────────────────────────────────────────────
    defineField({
      name: 'tech_heading_ka',
      title: 'Technology Section Heading (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'tech_heading_en',
      title: 'Technology Section Heading (English)',
      type: 'string',
    }),
    defineField({
      name: 'tech_intro_ka',
      title: 'Technology Intro (Georgian)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'tech_intro_en',
      title: 'Technology Intro (English)',
      type: 'text',
      rows: 2,
    }),

    // ─── Packages Teaser ─────────────────────────────────────────────────────
    defineField({
      name: 'packages_heading_ka',
      title: 'Packages Section Heading (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'packages_heading_en',
      title: 'Packages Section Heading (English)',
      type: 'string',
    }),
    defineField({
      name: 'packages_subtext_ka',
      title: 'Packages Subtext (Georgian)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'packages_subtext_en',
      title: 'Packages Subtext (English)',
      type: 'text',
      rows: 2,
    }),

    // ─── Membership Teaser ───────────────────────────────────────────────────
    defineField({
      name: 'membership_heading_ka',
      title: 'Membership Section Heading (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'membership_heading_en',
      title: 'Membership Section Heading (English)',
      type: 'string',
    }),

    // ─── Team Intro ──────────────────────────────────────────────────────────
    defineField({
      name: 'team_heading_ka',
      title: 'Team Section Heading (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'team_heading_en',
      title: 'Team Section Heading (English)',
      type: 'string',
    }),
    defineField({
      name: 'team_subtext_ka',
      title: 'Team Subtext (Georgian)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'team_subtext_en',
      title: 'Team Subtext (English)',
      type: 'text',
      rows: 2,
    }),

    // ─── Final CTA ───────────────────────────────────────────────────────────
    defineField({
      name: 'cta_heading_ka',
      title: 'Final CTA Heading (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'cta_heading_en',
      title: 'Final CTA Heading (English)',
      type: 'string',
    }),
    defineField({
      name: 'cta_subtext_ka',
      title: 'Final CTA Subtext (Georgian)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'cta_subtext_en',
      title: 'Final CTA Subtext (English)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'cta_button_ka',
      title: 'Final CTA Button Label (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'cta_button_en',
      title: 'Final CTA Button Label (English)',
      type: 'string',
    }),

    // ─── SEO ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'seo_title_ka',
      title: 'SEO Title (Georgian)',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seo_title_en',
      title: 'SEO Title (English)',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seo_description_ka',
      title: 'SEO Meta Description (Georgian)',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(160),
      group: 'seo',
    }),
    defineField({
      name: 'seo_description_en',
      title: 'SEO Meta Description (English)',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(160),
      group: 'seo',
    }),
  ],
  groups: [
    { name: 'seo', title: 'SEO' },
  ],
  preview: {
    prepare: () => ({ title: 'Homepage' }),
  },
})
