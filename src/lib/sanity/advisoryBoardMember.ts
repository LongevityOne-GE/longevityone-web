import { defineField, defineType } from 'sanity'

export const advisoryBoardMember = defineType({
  name: 'advisoryBoardMember',
  title: 'Advisory Board Member',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'bio', title: 'Biography' },
    { name: 'affiliation', title: 'Affiliation' },
    { name: 'meta', title: 'Meta / GDPR' },
  ],
  fields: [
    defineField({
      name: 'name_ka',
      title: 'Full Name (Georgian)',
      type: 'string',
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name_en',
      title: 'Full Name (Latin script)',
      type: 'string',
      group: 'identity',
      description:
        'Latin transliteration for Georgian members; primary name for international members.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'identity',
      options: { source: 'name_en', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'credentials',
      title: 'Credentials',
      type: 'array',
      group: 'identity',
      of: [{ type: 'string' }],
      description: 'e.g. MD, PhD, MBA, MSc — displayed as tag layout',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'boardRole',
      title: 'Board Role',
      type: 'string',
      group: 'identity',
      options: {
        list: [
          { title: '👑 Chair', value: 'chair' },
          { title: '★ Vice-Chair', value: 'vice-chair' },
          { title: 'Member', value: 'member' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title_ka',
      title: 'Board Title (Georgian)',
      type: 'string',
      group: 'identity',
      description: 'Role on the advisory board.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title_en',
      title: 'Board Title (English)',
      type: 'string',
      group: 'identity',
      description: 'Role on the advisory board.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Portrait Photo',
      type: 'image',
      group: 'identity',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt_ka',
          title: 'Alt text (Georgian)',
          type: 'string',
          validation: (Rule) =>
            Rule.required().error('Alt text (Georgian) is required for accessibility'),
        }),
        defineField({
          name: 'alt_en',
          title: 'Alt text (English)',
          type: 'string',
          validation: (Rule) =>
            Rule.required().error('Alt text (English) is required for accessibility'),
        }),
      ],
    }),
    defineField({
      name: 'affiliation_ka',
      title: 'Primary Affiliation (Georgian)',
      type: 'string',
      group: 'affiliation',
    }),
    defineField({
      name: 'affiliation_en',
      title: 'Primary Affiliation (English)',
      type: 'string',
      group: 'affiliation',
    }),
    defineField({
      name: 'affiliationCountry',
      title: 'Affiliation Country (ISO 3166-1 alpha-2)',
      type: 'string',
      group: 'affiliation',
      description: 'e.g. GE, US, DE — two-letter uppercase country code',
      validation: (Rule) =>
        Rule.regex(/^[A-Z]{2}$/).error(
          'Must be a 2-letter uppercase ISO country code (e.g. GE, US)',
        ),
    }),
    defineField({
      name: 'isInternational',
      title: 'International Advisor?',
      type: 'boolean',
      group: 'affiliation',
      description: 'Controls which section group this member appears in on the page.',
      initialValue: false,
    }),
    defineField({
      name: 'expertise_ka',
      title: 'Expertise Tags (Georgian)',
      type: 'array',
      group: 'bio',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'expertise_en',
      title: 'Expertise Tags (English)',
      type: 'array',
      group: 'bio',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'bio_ka',
      title: 'Biography (Georgian)',
      type: 'array',
      group: 'bio',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio_en',
      title: 'Biography (English)',
      type: 'array',
      group: 'bio',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'profileUrl',
      title: 'External Profile URL',
      type: 'url',
      group: 'bio',
      description: 'Optional — opens in new tab (rel="noopener")',
    }),
    defineField({
      name: 'order',
      title: 'Sort Order (within role group)',
      type: 'number',
      group: 'meta',
      description: 'Lower numbers appear first within the same role group.',
    }),
    defineField({
      name: 'consentToPublicListing',
      title: 'GDPR Consent: Public Listing',
      type: 'boolean',
      group: 'meta',
      description:
        '⚠️ Must be true before this member appears publicly. Only enable after written GDPR consent is received.',
      initialValue: false,
      validation: (Rule) =>
        Rule.custom((value: boolean | undefined) => {
          if (value === false) {
            return 'GDPR consent must be confirmed before this member can be published.'
          }
          return true
        }),
    }),
  ],
  orderings: [
    {
      title: 'Chair → Vice-Chair → Member, then by order',
      name: 'roleAndOrder',
      by: [
        { field: 'boardRole', direction: 'asc' },
        { field: 'order', direction: 'asc' },
        { field: 'name_en', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      nameEn: 'name_en',
      role: 'boardRole',
      consent: 'consentToPublicListing',
      media: 'photo',
    },
    prepare(selection: Record<string, unknown>) {
      const nameEn = typeof selection.nameEn === 'string' ? selection.nameEn : ''
      const role = typeof selection.role === 'string' ? selection.role : ''
      const consent = selection.consent === true
      const prefix = role === 'chair' ? '👑 ' : role === 'vice-chair' ? '★ ' : ''
      const warning = !consent ? ' ⚠️' : ''
      return {
        title: `${prefix}${nameEn}${warning}`,
        subtitle: role,
        media: selection.media as never,
      }
    },
  },
})
