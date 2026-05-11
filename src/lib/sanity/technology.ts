import { defineField, defineType } from 'sanity'

export const technology = defineType({
  name: 'technology',
  title: 'Technology',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Technology Name',
      type: 'string',
      description: 'e.g. PNOE, IHHT, Red Light',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug / Anchor',
      type: 'slug',
      options: { source: 'name' },
      description: 'Used as #anchor on /technologies page. e.g. pnoe, ihht, red-light',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline_ka',
      title: 'Tagline (Georgian)',
      type: 'string',
      description: 'Short one-line hook — used in homepage tech showcase grid.',
    }),
    defineField({
      name: 'tagline_en',
      title: 'Tagline (English)',
      type: 'string',
    }),

    // ─── What It Is ───────────────────────────────────────────────────────────
    defineField({
      name: 'whatItIs_ka',
      title: 'What It Is (Georgian)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'whatItIs_en',
      title: 'What It Is (English)',
      type: 'text',
      rows: 3,
    }),

    // ─── How It Works ─────────────────────────────────────────────────────────
    defineField({
      name: 'howItWorks_ka',
      title: 'How It Works (Georgian)',
      type: 'text',
      rows: 3,
      description: 'Optional — not all technologies have a "how it works" section.',
    }),
    defineField({
      name: 'howItWorks_en',
      title: 'How It Works (English)',
      type: 'text',
      rows: 3,
    }),

    // ─── What It Shows / What You Discover ───────────────────────────────────
    defineField({
      name: 'whatItShows_ka',
      title: 'What It Shows / What You Discover (Georgian)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'whatItShows_en',
      title: 'What It Shows / What You Discover (English)',
      type: 'text',
      rows: 2,
    }),

    // ─── Benefits (list) ─────────────────────────────────────────────────────
    defineField({
      name: 'benefits_ka',
      title: 'Benefits (Georgian)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Used for IHHT, Red Light — rendered as bullet list.',
    }),
    defineField({
      name: 'benefits_en',
      title: 'Benefits (English)',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    // ─── Your Benefit (single paragraph) ────────────────────────────────────
    defineField({
      name: 'yourBenefit_ka',
      title: 'Your Benefit / Patient Value (Georgian)',
      type: 'text',
      rows: 2,
      description: 'Used for PNOE, TrueDiagnostic, Enbiosis.',
    }),
    defineField({
      name: 'yourBenefit_en',
      title: 'Your Benefit / Patient Value (English)',
      type: 'text',
      rows: 2,
    }),

    // ─── Clinical Note / Partnership Note ────────────────────────────────────
    defineField({
      name: 'clinicalNote_ka',
      title: 'Clinical / Partnership Note (Georgian)',
      type: 'string',
      description: 'e.g. "Exclusive partnership in Georgia." Optional.',
    }),
    defineField({
      name: 'clinicalNote_en',
      title: 'Clinical / Partnership Note (English)',
      type: 'string',
    }),

    // ─── Naming Standard Warning ─────────────────────────────────────────────
    defineField({
      name: 'namingNote',
      title: 'Naming / Editorial Note (internal)',
      type: 'string',
      description: 'Internal reminder for editors — e.g. "Always use full name on first mention."',
    }),

    // ─── Hero Image ───────────────────────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Technology Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),

    // ─── Technical Specs (optional key-value pairs) ──────────────────────────
    defineField({
      name: 'specifications',
      title: 'Technical Specifications',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label_ka', title: 'Label (Georgian)', type: 'string' }),
            defineField({ name: 'label_en', title: 'Label (English)', type: 'string' }),
            defineField({ name: 'value', title: 'Value', type: 'string' }),
          ],
          preview: {
            select: { title: 'label_en', subtitle: 'value' },
          },
        },
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
      title: 'name',
      subtitle: 'tagline_en',
      media: 'heroImage',
    },
  },
})
