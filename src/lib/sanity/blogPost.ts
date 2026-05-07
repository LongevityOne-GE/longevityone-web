import { defineField, defineType } from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
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
      description: 'Used as /blog/[slug]. Use English slug always.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category_ka',
      title: 'Category (Georgian)',
      type: 'string',
      options: {
        list: [
          { title: 'მეცნიერება დღეგრძელობაზე', value: 'longevity-science' },
          { title: 'მეტაბოლური ჯანმრთელობა', value: 'metabolic-health' },
          { title: 'ელიტური პერფორმანსი', value: 'elite-performance' },
          { title: 'ტექნოლოგიები', value: 'technologies' },
        ],
      },
    }),
    defineField({
      name: 'category_en',
      title: 'Category (English)',
      type: 'string',
      options: {
        list: [
          { title: 'Longevity Science', value: 'longevity-science' },
          { title: 'Metabolic Health', value: 'metabolic-health' },
          { title: 'Elite Performance', value: 'elite-performance' },
          { title: 'Technologies', value: 'technologies' },
        ],
      },
    }),
    defineField({
      name: 'excerpt_ka',
      title: 'Excerpt / Summary (Georgian)',
      type: 'text',
      rows: 2,
      description: 'Used on blog index card and SEO description.',
    }),
    defineField({
      name: 'excerpt_en',
      title: 'Excerpt / Summary (English)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'body_ka',
      title: 'Body (Georgian)',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          fields: [
            defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: 'body_en',
      title: 'Body (English)',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          fields: [
            defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'teamMember' }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    // Links blog post to related technology anchors (#pnoe, #truediagnostic, etc.)
    defineField({
      name: 'relatedTechnologies',
      title: 'Related Technologies',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'technology' }] }],
      description: 'Shown as "Related Technology" chips at the bottom of the post.',
    }),
    // SEO
    defineField({
      name: 'seoTitle_ka',
      title: 'SEO Title (Georgian)',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoTitle_en',
      title: 'SEO Title (English)',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription_ka',
      title: 'SEO Meta Description (Georgian)',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(160),
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription_en',
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
      title: 'Newest First',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title_en',
      subtitle: 'publishedAt',
      media: 'coverImage',
    },
    prepare: ({ title, subtitle, media }) => ({
      title: title ?? '—',
      subtitle: subtitle ? new Date(subtitle).toLocaleDateString('en-GB') : 'Draft',
      media,
    }),
  },
})
