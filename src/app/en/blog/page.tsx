import type { Metadata } from 'next'
import { sanityClient, blogIndexQuery } from '@/lib/sanity'
import type { BlogPost } from '@/lib/sanity/types'
import { BlogIndexPage } from '@/components/pages/BlogIndexPage'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  locale: 'en',
  path: '/blog',
  title: 'Articles',
})

export default async function EnBlogIndexPage() {
  const posts = await sanityClient.fetch<BlogPost[]>(
    blogIndexQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  return <BlogIndexPage locale="en" posts={posts ?? []} />
}
