import { defineField, defineType } from 'sanity'

// Singleton — only one document of this type should exist.
// __experimental_actions: disables 'create' and 'delete' in Studio.
export const advisoryBoardPage = defineType({
  name: 'advisoryBoardPage',
  title: 'Advisory Board Page',
  type: 'document',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore — __experimental_actions is not yet in the public type defs
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'eyebrow_ka',
      title: 'Eyebrow (Georgian)',
      type: 'string',
      description:
        'Caption-size, burnt-orange, tracked uppercase — e.g. სამეცნიერო ზედამხედველობა',
    }),
    defineField({
      name: 'eyebrow_en',
      title: 'Eyebrow (English)',
      type: 'string',
      description: 'e.g. Scientific Oversight',
    }),
    defineField({
      name: 'heading_ka',
      title: 'Page Heading (Georgian)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading_en',
      title: 'Page Heading (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro_ka',
      title: 'Intro Paragraph (Georgian)',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.min(80).max(600),
    }),
    defineField({
      name: 'intro_en',
      title: 'Intro Paragraph (English)',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.min(60).max(500),
    }),
    defineField({
      name: 'sectionGeorgianHeading_ka',
      title: 'Georgian Advisors Section Heading (ka)',
      type: 'string',
      description: 'Optional. If empty, section grouping is suppressed.',
    }),
    defineField({
      name: 'sectionGeorgianHeading_en',
      title: 'Georgian Advisors Section Heading (en)',
      type: 'string',
    }),
    defineField({
      name: 'sectionInternationalHeading_ka',
      title: 'International Advisors Section Heading (ka)',
      type: 'string',
    }),
    defineField({
      name: 'sectionInternationalHeading_en',
      title: 'International Advisors Section Heading (en)',
      type: 'string',
    }),
    defineField({
      name: 'seoTitle_ka',
      title: 'SEO Title (Georgian)',
      type: 'string',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'seoTitle_en',
      title: 'SEO Title (English)',
      type: 'string',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'seoDescription_ka',
      title: 'SEO Description (Georgian)',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'seoDescription_en',
      title: 'SEO Description (English)',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: { title: 'heading_en' },
    prepare({ title }: { title?: string }) {
      return { title: title ?? 'Advisory Board Page' }
    },
  },
})
