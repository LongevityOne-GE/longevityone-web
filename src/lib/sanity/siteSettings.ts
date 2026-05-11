import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // @ts-expect-error __experimental_actions is valid in Sanity Studio but not yet typed
  __experimental_actions: ['update', 'publish'],
  fields: [
    // ─── Clinic Identity ──────────────────────────────────────────────────────
    defineField({
      name: 'clinicName_ka',
      title: 'Clinic Name (Georgian)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clinicName_en',
      title: 'Clinic Name (English)',
      type: 'string',
    }),
    defineField({
      name: 'tagline_ka',
      title: 'Tagline (Georgian)',
      type: 'string',
      description: 'e.g. დღეგრძელობის ხელოვნება',
    }),
    defineField({
      name: 'tagline_en',
      title: 'Tagline (English)',
      type: 'string',
      description: 'e.g. The Art of Living Longer',
    }),

    // ─── Contact ──────────────────────────────────────────────────────────────
    defineField({
      name: 'address_ka',
      title: 'Address (Georgian)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'address_en',
      title: 'Address (English)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'maps_url',
      title: 'Google Maps URL',
      type: 'url',
      description: 'Paste the Google Maps link for the clinic location. Use google.com/maps/search/?api=1&query=LAT,LNG format for best cross-platform support.',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      description: 'e.g. +995 577 26 05 57',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'e.g. info@longevityone.ge',
    }),

    // ─── Opening Hours ────────────────────────────────────────────────────────
    defineField({
      name: 'openingHours_ka',
      title: 'Opening Hours (Georgian)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. ["ყოველდღე 09:00 – 21:00"]',
    }),
    defineField({
      name: 'openingHours_en',
      title: 'Opening Hours (English)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. ["Every day 09:00 – 21:00"]',
    }),

    // ─── Social Links ─────────────────────────────────────────────────────────
    defineField({
      name: 'socialFacebook',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'socialInstagram',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'socialLinkedIn',
      title: 'LinkedIn URL',
      type: 'url',
    }),

    // ─── Navigation CTA ───────────────────────────────────────────────────────
    defineField({
      name: 'nav_cta_ka',
      title: 'Navigation CTA Label (Georgian)',
      type: 'string',
      description: 'e.g. დაჯავშნეთ',
    }),
    defineField({
      name: 'nav_cta_en',
      title: 'Navigation CTA Label (English)',
      type: 'string',
      description: 'e.g. Book a Consultation',
    }),

    // ─── Cookie Banner ────────────────────────────────────────────────────────
    defineField({
      name: 'cookie_title_ka',
      title: 'Cookie Banner Title (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'cookie_title_en',
      title: 'Cookie Banner Title (English)',
      type: 'string',
    }),
    defineField({
      name: 'cookie_body_ka',
      title: 'Cookie Banner Body (Georgian)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'cookie_body_en',
      title: 'Cookie Banner Body (English)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'cookie_accept_ka',
      title: 'Cookie Accept All Label (Georgian)',
      type: 'string',
      description: 'e.g. ყველას მიღება',
    }),
    defineField({
      name: 'cookie_accept_en',
      title: 'Cookie Accept All Label (English)',
      type: 'string',
    }),
    defineField({
      name: 'cookie_reject_ka',
      title: 'Cookie Reject Label (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'cookie_reject_en',
      title: 'Cookie Reject Label (English)',
      type: 'string',
    }),
    defineField({
      name: 'cookie_manage_ka',
      title: 'Cookie Manage Preferences Label (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'cookie_manage_en',
      title: 'Cookie Manage Preferences Label (English)',
      type: 'string',
    }),

    // ─── 404 Page ─────────────────────────────────────────────────────────────
    defineField({
      name: 'notFound_h1_ka',
      title: '404 H1 (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'notFound_h1_en',
      title: '404 H1 (English)',
      type: 'string',
    }),
    defineField({
      name: 'notFound_body_ka',
      title: '404 Body (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'notFound_body_en',
      title: '404 Body (English)',
      type: 'string',
    }),
    defineField({
      name: 'notFound_cta_ka',
      title: '404 CTA Label (Georgian)',
      type: 'string',
    }),
    defineField({
      name: 'notFound_cta_en',
      title: '404 CTA Label (English)',
      type: 'string',
    }),

    // ─── Footer ───────────────────────────────────────────────────────────────
    defineField({
      name: 'footer_copyright_ka',
      title: 'Footer Copyright Text (Georgian)',
      type: 'string',
      description: 'e.g. © 2026 Longevity One. ყველა უფლება დაცულია.',
    }),
    defineField({
      name: 'footer_copyright_en',
      title: 'Footer Copyright Text (English)',
      type: 'string',
    }),

    // ─── Global SEO Defaults ──────────────────────────────────────────────────
    defineField({
      name: 'default_seo_title_ka',
      title: 'Default SEO Title (Georgian)',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'default_seo_title_en',
      title: 'Default SEO Title (English)',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'default_seo_description_ka',
      title: 'Default SEO Meta Description (Georgian)',
      type: 'text',
      rows: 2,
      group: 'seo',
    }),
    defineField({
      name: 'default_seo_description_en',
      title: 'Default SEO Meta Description (English)',
      type: 'text',
      rows: 2,
      group: 'seo',
    }),
    defineField({
      name: 'og_image',
      title: 'Default OG / Social Share Image',
      type: 'image',
      group: 'seo',
    }),
  ],
  groups: [{ name: 'seo', title: 'SEO Defaults' }],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
