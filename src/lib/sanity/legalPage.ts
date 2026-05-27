import { defineField, defineType } from 'sanity'

/**
 * Legal page document.
 *
 * Note: the slug-style field is named `pageType` (not `slug`) for historical
 * reasons — it maps directly to the `/legal/[pageType]` dynamic route segment.
 * The four allowed values are: `privacy`, `terms`, `cookies`,
 * `medical-disclaimer`.
 */
export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'pageType',
      title: 'Page Type (slug / route segment)',
      type: 'string',
      group: 'identity',
      options: {
        list: [
          { title: 'Privacy Policy', value: 'privacy' },
          { title: 'Terms of Service', value: 'terms' },
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
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title_en',
      title: 'Page Title (English)',
      type: 'string',
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro_ka',
      title: 'Intro Paragraph (Georgian)',
      type: 'text',
      rows: 4,
      group: 'content',
      description: 'Short lead paragraph rendered under the H1.',
    }),
    defineField({
      name: 'intro_en',
      title: 'Intro Paragraph (English)',
      type: 'text',
      rows: 4,
      group: 'content',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
      group: 'content',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body_ka',
      title: 'Body Content (Georgian)',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.required().uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                  {
                    name: 'external',
                    type: 'boolean',
                    title: 'External link (opens in new tab)',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body_en',
      title: 'Body Content (English)',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.required().uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                  {
                    name: 'external',
                    type: 'boolean',
                    title: 'External link (opens in new tab)',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seoDescription_ka',
      title: 'SEO Description (Georgian)',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'seoDescription_en',
      title: 'SEO Description (English)',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (Rule) => Rule.max(160),
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
      title: 'title_ka',
      subtitle: 'pageType',
    },
    prepare: ({ title, subtitle }: { title?: string; subtitle?: string }) => ({
      title: title ?? 'Untitled',
      subtitle: subtitle ? `/legal/${subtitle}` : '',
    }),
  },
})
