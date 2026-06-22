import { defineField, defineType } from 'sanity'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      description: 'Georgian script - e.g. ნინო განუგრავა',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name_en',
      title: 'Full Name (Latin script)',
      type: 'string',
      description: 'e.g. Nino Ganugrava - for English version',
    }),
    defineField({
      name: 'role_ka',
      title: 'Role / Title (Georgian)',
      type: 'string',
      description: 'e.g. თანადამფუძნებელი, ექიმი, კონსიერჟ მენეჯერი',
    }),
    defineField({
      name: 'role_en',
      title: 'Role / Title (English)',
      type: 'string',
      description: 'e.g. Co-Founder, Physician, Concierge Manager',
    }),
    defineField({
      name: 'specialty_ka',
      title: 'Medical Specialty (Georgian)',
      type: 'string',
      description: 'e.g. პროფილაქტიკური მედიცინა',
    }),
    defineField({
      name: 'specialty_en',
      title: 'Medical Specialty (English)',
      type: 'string',
      description: 'e.g. Preventive Medicine',
    }),
    defineField({
      name: 'tagline_ka',
      title: 'Tagline (Georgian)',
      type: 'text',
      rows: 2,
      description: 'Short editorial line, shown large in italic serif.',
    }),
    defineField({
      name: 'tagline_en',
      title: 'Tagline (English)',
      type: 'text',
      rows: 2,
      description: 'Short editorial line, shown large in italic serif.',
    }),
    defineField({
      name: 'bio_ka',
      title: 'Bio (Georgian)',
      type: 'text',
      rows: 6,
      description: '80 to 120 words. Short bio visible on the card.',
    }),
    defineField({
      name: 'bio_en',
      title: 'Bio (English)',
      type: 'text',
      rows: 6,
      description: 'Short bio visible on the card.',
    }),
    defineField({
      name: 'pullQuote_ka',
      title: 'Pull Quote (Georgian)',
      type: 'string',
      description: 'Italic pull-quote shown above the card. If empty, falls back to legacy tagline_ka.',
    }),
    defineField({
      name: 'pullQuote_en',
      title: 'Pull Quote (English)',
      type: 'string',
      description: 'Italic pull-quote shown above the card. If empty, falls back to legacy tagline_en.',
    }),
    defineField({
      name: 'fullBio_ka',
      title: 'Full Biography (Georgian)',
      type: 'array',
      of: [{ type: 'block' }],
      description: '150-300 words, long-form. Shown in the "Full biography" modal. Leave empty to hide the modal trigger.',
    }),
    defineField({
      name: 'fullBio_en',
      title: 'Full Biography (English)',
      type: 'array',
      of: [{ type: 'block' }],
      description: '150-300 words, long-form. Shown in the "Full biography" modal. Leave empty to hide the modal trigger.',
    }),
    defineField({
      name: 'photo',
      title: 'Individual Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'isFounder',
      title: 'Is Founder',
      type: 'boolean',
      description: 'Founders appear in the top "Founders" section; others in "Clinic Team".',
      initialValue: false,
    }),
    defineField({
      name: 'credentials',
      title: 'Credentials / Degrees',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. ["MD", "PhD", "FESC"]',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower = appears earlier. Separate numbering for founders vs clinic team is fine.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Founders First, then by Order',
      name: 'founderOrderAsc',
      by: [
        { field: 'isFounder', direction: 'desc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role_en',
      media: 'photo',
      isFounder: 'isFounder',
    },
    prepare: ({ title, subtitle, media, isFounder }) => ({
      title: title ?? '-',
      subtitle: `${isFounder ? '⭐ Founder · ' : ''}${subtitle ?? ''}`,
      media,
    }),
  },
})

// Team page singleton for headings and the founders group photo
export const teamPage = defineType({
  name: 'teamPage',
  title: 'Team Page',
  type: 'document',
  // @ts-expect-error __experimental_actions is valid in Sanity Studio but not yet typed
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'h1_ka',
      title: 'H1 (Georgian)',
      type: 'string',
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
    }),
    defineField({
      name: 'seo_title_en',
      title: 'SEO Title (English)',
      type: 'string',
    }),
    defineField({
      name: 'seo_description_ka',
      title: 'SEO Meta Description (Georgian)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'seo_description_en',
      title: 'SEO Meta Description (English)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'founders_heading_ka',
      title: 'Founders Section Heading (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'founders_heading_en',
      title: 'Founders Section Heading (English)',
      type: 'string',
    }),
    defineField({
      name: 'founders_subtext_ka',
      title: 'Founders Section Subtext (Georgian)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'founders_subtext_en',
      title: 'Founders Section Subtext (English)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'founders_group_photo',
      title: 'Founders Group Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'clinic_team_heading_ka',
      title: 'Clinic Team Section Heading (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'clinic_team_heading_en',
      title: 'Clinic Team Section Heading (English)',
      type: 'string',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Team Page' }),
  },
})
