import { defineField, defineType } from 'sanity'

// Patient reviews — shown on the homepage. `consented` gates publishing: the
// validation rule below blocks Studio publish unless it is explicitly checked
// true, and the GROQ query (reviewsQuery) filters on it too, so an unconsented
// review can never reach the site even via a stale cache or draft leak.
export const review = defineType({
  name: 'review',
  title: 'Patient Review',
  type: 'document',
  fields: [
    defineField({
      name: 'name_ka',
      title: 'Client Name (Georgian)',
      type: 'string',
      description: 'The client’s real name, exactly as they consented to have it shown. Use "ანონიმური მომხმარებელი" for an anonymised client.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name_en',
      title: 'Client Name (English)',
      type: 'string',
      description: 'Latin transliteration for the English site. Falls back to the Georgian name if left blank.',
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1–5)',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1).max(5),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'Leave blank if the real date is unknown — no date is shown rather than a guessed one.',
    }),
    defineField({
      name: 'service_ka',
      title: 'Service (Georgian)',
      type: 'string',
      description: 'Must match a real service/package/technology name — never invented.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'service_en',
      title: 'Service (English)',
      type: 'string',
      description: 'Falls back to the Georgian service name if left blank.',
    }),
    defineField({
      name: 'text_ka',
      title: 'Review Text (Georgian)',
      type: 'text',
      rows: 4,
      description: 'Verbatim from the client.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text_en',
      title: 'Review Text (English)',
      type: 'text',
      rows: 4,
      description: 'Human-checked translation only — never machine-translated. Leave blank to show the original Georgian on the English site instead.',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          { title: 'Google', value: 'google' },
          { title: 'Direct (in person / WhatsApp / etc.)', value: 'direct' },
        ],
        layout: 'radio',
      },
      initialValue: 'direct',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'consented',
      title: 'Client has consented to publish this review',
      type: 'boolean',
      description: 'Required. The review will not appear on the site until this is checked.',
      initialValue: false,
      validation: (Rule) =>
        Rule.custom((value) =>
          value === true ? true : 'Cannot publish without documented client consent.',
        ),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers show first. Leave blank to sort by newest.',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' },
        { field: '_createdAt', direction: 'desc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name_ka',
      subtitle: 'service_ka',
      rating: 'rating',
      consented: 'consented',
    },
    prepare: ({ title, subtitle, rating, consented }) => ({
      title: title ?? '—',
      subtitle: `${'★'.repeat(rating ?? 0)} · ${subtitle ?? ''}${consented ? '' : '  ⚠️ NOT CONSENTED'}`,
    }),
  },
})
