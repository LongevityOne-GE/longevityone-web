import { defineField, defineType } from 'sanity'

export const journeyStage = defineType({
  name: 'journeyStage',
  title: 'Journey Stage',
  type: 'document',
  fields: [
    defineField({
      name: 'stageNumber',
      title: 'Stage Number',
      type: 'number',
      description: '1–8. Controls display order.',
      validation: (Rule) => Rule.required().min(1).max(8),
    }),
    defineField({
      name: 'title_ka',
      title: 'Stage Title (Georgian)',
      type: 'string',
      description: 'e.g. ციფრული ონბორდინგი',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title_en',
      title: 'Stage Title (English)',
      type: 'string',
      description: 'e.g. Digital Onboarding',
    }),
    defineField({
      name: 'duration_ka',
      title: 'Duration (Georgian)',
      type: 'string',
      description: 'e.g. 15–20 წუთი',
    }),
    defineField({
      name: 'duration_en',
      title: 'Duration (English)',
      type: 'string',
      description: 'e.g. 15–20 min',
    }),
    defineField({
      name: 'body_ka',
      title: 'Stage Description (Georgian)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'body_en',
      title: 'Stage Description (English)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    // Technologies / tools used in this stage (e.g. PNOE, IHHT)
    defineField({
      name: 'tools',
      title: 'Tools / Technologies Used',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. ["VO₂ Max", "PSQI", "IPAQ", "WHO-5"]',
    }),
    defineField({
      name: 'icon',
      title: 'Icon name (Lucide)',
      type: 'string',
      description: 'e.g. "clipboard", "scan", "stethoscope", "map", "activity"',
    }),
  ],
  orderings: [
    {
      title: 'Stage Number',
      name: 'stageNumberAsc',
      by: [{ field: 'stageNumber', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      stageNumber: 'stageNumber',
      title: 'title_en',
      subtitle: 'duration_en',
    },
    prepare: ({ stageNumber, title, subtitle }) => ({
      title: `Stage ${stageNumber}: ${title ?? '—'}`,
      subtitle: subtitle ?? '',
    }),
  },
})

// Also export a journeyPage singleton for the page heading/intro
export const journeyPage = defineType({
  name: 'journeyPage',
  title: 'Patient Journey Page',
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
      title: 'Intro Text (Georgian)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'intro_en',
      title: 'Intro Text (English)',
      type: 'text',
      rows: 2,
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
    prepare: () => ({ title: 'Patient Journey Page' }),
  },
})
