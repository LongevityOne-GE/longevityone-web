import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityClient, blogPostBySlugQuery, blogPostSlugsQuery, homePageQuery } from '@/lib/sanity'
import type { BlogPostDetail, HomePageData } from '@/lib/sanity/types'
import { BlogPostPage } from '@/components/pages/BlogPostPage'
import { buildMetadata, toOgImage } from '@/lib/seo/metadata'
import { JsonLd } from '@/components/seo/JsonLd'
import { articleSchema, breadcrumbSchema } from '@/lib/seo/schema'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<{ slug: string }[]>(
    blogPostSlugsQuery,
    {},
    { next: { tags: ['sanity'] } }
  )
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await sanityClient.fetch<BlogPostDetail>(
    blogPostBySlugQuery,
    { slug },
    { next: { tags: ['sanity'] } }
  )
  return buildMetadata({
    locale: 'ka',
    path: `/blog/${slug}`,
    title: post?.seoTitle_ka || post?.title_ka,
    description: post?.seoDescription_ka || post?.excerpt_ka,
    type: 'article',
    image: toOgImage(post?.coverImage?.asset?.url),
    publishedTime: post?.publishedAt,
  })
}

export default async function KaBlogPostPage({ params }: Props) {
  const { slug } = await params
  const [post, ctaData] = await Promise.all([
    sanityClient.fetch<BlogPostDetail>(blogPostBySlugQuery, { slug }, { next: { tags: ['sanity'] } }),
    sanityClient.fetch<HomePageData>(homePageQuery, {}, { next: { tags: ['sanity'] } }),
  ])
  if (!post) notFound()
  return (
    <>
      <JsonLd
        data={[
          articleSchema(post, 'ka'),
          breadcrumbSchema(
            [
              { name: 'მთავარი', path: '/' },
              { name: 'სტატიები', path: '/blog' },
              { name: post.title_ka || '', path: `/blog/${slug}` },
            ],
            'ka',
          ),
        ]}
      />
      <BlogPostPage locale="ka" post={post} ctaData={ctaData} />
    </>
  )
}
