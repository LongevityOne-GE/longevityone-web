import type { Metadata } from 'next'
import { sanityClient, blogIndexQuery } from '@/lib/sanity'
import type { BlogPost } from '@/lib/sanity/types'
import { BlogIndexPage } from '@/components/pages/BlogIndexPage'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  locale: 'ka',
  path: '/blog',
  title: 'სტატიები',
})

export default async function KaBlogIndexPage() {
  const posts = await sanityClient.fetch<BlogPost[]>(
    blogIndexQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  return <BlogIndexPage locale="ka" posts={posts ?? []} />
}
