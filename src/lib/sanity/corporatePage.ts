import { defineField, defineType } from 'sanity'

export const corporatePage = defineType({
  name: 'corporatePage',
  title: 'Corporate',
  type: 'document',
  // @ts-expect-error __experimental_actions is valid in Sanity Studio but not yet typed
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'h1_ka',
      title: 'H1 (Georgian)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'h1_en',
      title: 'H1 (English)',
      type: 'string',
    }),
    defineField({
      name: 'intro_ka',
      title: 'Intro (Georgian)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'intro_en',
      title: 'Intro (English)',
      type: 'text',
      rows: 3,
    }),

    // ─── Programmes ───────────────────────────────────────────────────────────
    defineField({
      name: 'programmes',
      title: 'Corporate Programmes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'number', title: 'Programme Number', type: 'number' }),
            defineField({ name: 'title_ka', title: 'Title (Georgian)', type: 'string' }),
            defineField({ name: 'title_en', title: 'Title (English)', type: 'string' }),
            defineField({ name: 'body_ka', title: 'Body (Georgian)', type: 'text', rows: 2 }),
            defineField({ name: 'body_en', title: 'Body (English)', type: 'text', rows: 2 }),
            defineField({
              name: 'icon',
              title: 'Icon name (Lucide)',
              type: 'string',
              description: 'e.g. "briefcase", "users", "handshake"',
            }),
          ],
          preview: {
            select: { title: 'title_en', subtitle: 'number' },
            prepare: ({ title, subtitle }) => ({ title: `${subtitle}. ${title}` }),
          },
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),

    // ─── CTA ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'cta_label_ka',
      title: 'CTA Button Label (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'cta_label_en',
      title: 'CTA Button Label (English)',
      type: 'string',
    }),

    // ─── Hero Image ───────────────────────────────────────────────────────────
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
    prepare: () => ({ title: 'Corporate' }),
  },
})
