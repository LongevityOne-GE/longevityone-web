import { defineField, defineType } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title_ka',
      title: 'Title (Georgian)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title_en',
      title: 'Title (English)',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title_en' },
      description: 'Used as the URL: /services/[slug]',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary_ka',
      title: 'Summary (Georgian)',
      type: 'text',
      rows: 2,
      description: 'Short tagline used on homepage pillar cards.',
    }),
    defineField({
      name: 'summary_en',
      title: 'Summary (English)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'intro_ka',
      title: 'Intro (Georgian)',
      type: 'text',
      rows: 3,
      description: 'First paragraph below the H1 on the service page.',
    }),
    defineField({
      name: 'intro_en',
      title: 'Intro (English)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body_ka',
      title: 'Body (Georgian)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'body_en',
      title: 'Body (English)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    // Metabolic and other pages have a differentiator section
    defineField({
      name: 'differentiator_ka',
      title: 'Differentiator / What Makes Us Different (Georgian)',
      type: 'text',
      rows: 3,
      description: 'Optional — used on Metabolic page specifically.',
    }),
    defineField({
      name: 'differentiator_en',
      title: 'Differentiator / What Makes Us Different (English)',
      type: 'text',
      rows: 3,
    }),
    // Performance page has explicit target audience
    defineField({
      name: 'targetAudience_ka',
      title: 'Target Audience (Georgian)',
      type: 'text',
      rows: 2,
      description: 'Optional — used on Performance page.',
    }),
    defineField({
      name: 'targetAudience_en',
      title: 'Target Audience (English)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'icon',
      title: 'Icon name (Lucide)',
      type: 'string',
      description: 'e.g. "dna", "activity", "zap"',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'technology' }] }],
      description: 'Technologies featured on this service page.',
    }),
    defineField({
      name: 'relatedPackages',
      title: 'Related Packages',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'package' }] }],
      description: 'Packages recommended for this service.',
    }),
    // SEO
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
  groups: [{ name: 'seo', title: 'SEO' }],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title_en',
      subtitle: 'summary_en',
      media: 'heroImage',
    },
  },
})
