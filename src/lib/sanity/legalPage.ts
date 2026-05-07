import { defineField, defineType } from 'sanity'

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  fields: [
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'Privacy Policy', value: 'privacy' },
          { title: 'Terms & Conditions', value: 'terms' },
          { title: 'Cookie Policy', value: 'cookies' },
          { title: 'Medical Disclaimer', value: 'medical-disclaimer' },
        ],
      },
      validation: (Rule) => Rule.required(),
      description: 'Maps to /legal/[pageType] route.',
    }),
    defineField({
      name: 'title_ka',
      title: 'Page Title (Georgian)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title_en',
      title: 'Page Title (English)',
      type: 'string',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
    }),
    defineField({
      name: 'body_ka',
      title: 'Body Content (Georgian)',
      type: 'array',
      of: [
        { type: 'block' },
        // Allow basic tables for cookie policy if needed
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body_en',
      title: 'Body Content (English)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  orderings: [
    {
      title: 'Page Type',
      name: 'pageTypeAsc',
      by: [{ field: 'pageType', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title_en',
      subtitle: 'pageType',
    },
    prepare: ({ title, subtitle }) => ({
      title: title ?? subtitle,
      subtitle: `/legal/${subtitle}`,
    }),
  },
})
