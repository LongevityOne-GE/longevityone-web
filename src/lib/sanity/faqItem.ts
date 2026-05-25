import { defineField, defineType } from 'sanity'

// FAQ items - reusable across /faq page and service page accordions
export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  fields: [
    defineField({
      name: 'question_ka',
      title: 'Question (Georgian)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'question_en',
      title: 'Question (English)',
      type: 'string',
    }),
    defineField({
      name: 'answer_ka',
      title: 'Answer (Georgian)',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer_en',
      title: 'Answer (English)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Longevity', value: 'longevity' },
          { title: 'Metabolic Health', value: 'metabolic' },
          { title: 'Elite Performance', value: 'performance' },
          { title: 'Technologies', value: 'technologies' },
          { title: 'Packages & Pricing', value: 'packages' },
          { title: 'Patient Journey', value: 'journey' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'question_en',
      subtitle: 'category',
    },
    prepare: ({ title, subtitle }) => ({
      title: title ?? '-',
      subtitle: subtitle ?? '',
    }),
  },
})

// FAQ page singleton for the heading
export const faqPage = defineType({
  name: 'faqPage',
  title: 'FAQ Page',
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
  preview: {
    prepare: () => ({ title: 'FAQ Page' }),
  },
})
