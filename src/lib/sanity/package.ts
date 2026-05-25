import { defineField, defineType } from 'sanity'

export const packageDoc = defineType({
  name: 'package',
  title: 'Package / Membership',
  type: 'document',
  fields: [
    defineField({
      name: 'name_ka',
      title: 'Name (Georgian)',
      type: 'string',
      description: 'e.g. STARTER, Silver, TrueAge ეპიგენეტიკური ტესტი',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name_en',
      title: 'Name (English)',
      type: 'string',
      description: 'e.g. STARTER, Silver, TrueAge Epigenetic Test',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Diagnostic Package (one-time)', value: 'diagnostic' },
          { title: 'Membership (monthly)', value: 'membership' },
          { title: 'Add-On Test', value: 'addon' },
          { title: 'Therapy Session Pack', value: 'session' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tier',
      title: 'Tier (for Diagnostic packages)',
      type: 'number',
      description: '1 = STARTER, 2 = PERFORMANCE, 3 = ELITE. Leave blank for memberships/add-ons.',
    }),
    defineField({
      name: 'price',
      title: 'Price (GEL)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'priceLabel_ka',
      title: 'Price Label (Georgian)',
      type: 'string',
      description: 'Display string - e.g. "550 ₾" or "650 ₾/თვე"',
    }),
    defineField({
      name: 'priceLabel_en',
      title: 'Price Label (English)',
      type: 'string',
      description: 'Display string - e.g. "550 GEL" or "650 GEL/mo"',
    }),
    defineField({
      name: 'priceSuffix_ka',
      title: 'Price Suffix (Georgian)',
      type: 'string',
      description: 'e.g. "/თვე" for memberships. Leave blank for one-time packages.',
    }),
    defineField({
      name: 'priceSuffix_en',
      title: 'Price Suffix (English)',
      type: 'string',
      description: 'e.g. "/mo" for memberships.',
    }),
    defineField({
      name: 'tagline_ka',
      title: 'Tagline (Georgian)',
      type: 'string',
      description: 'e.g. ფორმის შენარჩუნება for Silver',
    }),
    defineField({
      name: 'tagline_en',
      title: 'Tagline (English)',
      type: 'string',
      description: 'e.g. The Maintenance Pass for Silver',
    }),
    defineField({
      name: 'goal_ka',
      title: 'Goal / Description (Georgian)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'goal_en',
      title: 'Goal / Description (English)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'includes_ka',
      title: 'Includes - Feature List (Georgian)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Each item becomes one line in the feature list.',
    }),
    defineField({
      name: 'includes_en',
      title: 'Includes - Feature List (English)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured / Most Popular',
      type: 'boolean',
      description: 'Highlights this card (e.g. PERFORMANCE tier, Gold membership).',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Controls order within its category group.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cta_label_ka',
      title: 'CTA Button Label (Georgian)',
      type: 'string',
      description: 'e.g. "დაჯავშნა" - override per package if needed',
    }),
    defineField({
      name: 'cta_label_en',
      title: 'CTA Button Label (English)',
      type: 'string',
      description: 'e.g. "Book Now"',
    }),
  ],
  orderings: [
    {
      title: 'Category + Order',
      name: 'categoryOrderAsc',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name_en',
      subtitle: 'category',
      price: 'price',
    },
    prepare: ({ title, subtitle, price }) => ({
      title: title ?? '-',
      subtitle: `${subtitle ?? ''} · ${price ?? 0} GEL`,
    }),
  },
})
