import type { Metadata } from 'next'
import { sanityClient, blogIndexQuery } from '@/lib/sanity'
import type { BlogPost } from '@/lib/sanity/types'
import { BlogIndexPage } from '@/components/pages/BlogIndexPage'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  locale: 'en',
  path: '/blog',
  title: 'Longevity and Preventive Medicine Articles',
  description:
    'Read Longevity One articles on longevity, biological age, preventive medicine, metabolic health, diagnostics, and personalized health programs in Georgia.',
  keywords: [
    'longevity articles Georgia',
    'preventive medicine blog Georgia',
    'biological age research Georgia',
    'health optimization Tbilisi',
  ],
})

export default async function EnBlogIndexPage() {
  const posts = await sanityClient.fetch<BlogPost[]>(
    blogIndexQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  return <BlogIndexPage locale="en" posts={posts ?? []} />
}
