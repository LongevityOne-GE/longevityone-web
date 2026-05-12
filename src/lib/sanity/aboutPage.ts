import { defineField, defineType } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About / Philosophy',
  type: 'document',
  // @ts-expect-error __experimental_actions is valid in Sanity Studio but not yet typed
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'h1_ka',
      title: 'H1 (Georgian)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'h1_en',
      title: 'H1 (English)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'philosophy_ka',
      title: 'Philosophy Intro (Georgian)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'philosophy_en',
      title: 'Philosophy Intro (English)',
      type: 'text',
      rows: 4,
    }),

    // ─── Why Longevity One — 3 pillars ────────────────────────────────────────
    defineField({
      name: 'why_pillars',
      title: 'Why Longevity One — 3 Pillars',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title_ka', title: 'Title (Georgian)', type: 'string' }),
            defineField({ name: 'title_en', title: 'Title (English)', type: 'string' }),
            defineField({ name: 'body_ka', title: 'Body (Georgian)', type: 'text', rows: 2 }),
            defineField({ name: 'body_en', title: 'Body (English)', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'title_en' },
          },
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),

    // ─── Founding Story ───────────────────────────────────────────────────────
    defineField({
      name: 'founding_story_heading_ka',
      title: 'Founding Story Section Heading (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'founding_story_heading_en',
      title: 'Founding Story Section Heading (English)',
      type: 'string',
    }),
    defineField({
      name: 'founding_story_ka',
      title: 'Founding Story (Georgian)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'founding_story_en',
      title: 'Founding Story (English)',
      type: 'array',
      of: [{ type: 'block' }],
    }),

    // ─── Hero / Editorial Image ───────────────────────────────────────────────
    defineField({
      name: 'hero_image',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
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
    prepare: () => ({ title: 'About / Philosophy' }),
  },
})
