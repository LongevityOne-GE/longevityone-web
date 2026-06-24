import type { Metadata } from 'next'
import { sanityClient, blogIndexQuery } from '@/lib/sanity'
import type { BlogPost } from '@/lib/sanity/types'
import { BlogIndexPage } from '@/components/pages/BlogIndexPage'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({
  locale: 'ka',
  path: '/blog',
  title: 'სტატიები დღეგრძელობაზე და პრევენციულ მედიცინაზე',
  description:
    'წაიკითხეთ Longevity One-ის სტატიები დღეგრძელობაზე, ბიოლოგიურ ასაკზე, პრევენციულ მედიცინაზე, მეტაბოლურ ჯანმრთელობაზე და პერსონალიზებულ ჯანმრთელობის პროგრამებზე საქართველოში.',
  keywords: [
    'დღეგრძელობის სტატიები',
    'ჯანმრთელობის ბლოგი საქართველო',
    'პრევენციული მედიცინის სტატიები',
    'ბიოლოგიური ასაკის კვლევა',
  ],
})

export default async function KaBlogIndexPage() {
  const posts = await sanityClient.fetch<BlogPost[]>(
    blogIndexQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  return <BlogIndexPage locale="ka" posts={posts ?? []} />
}
