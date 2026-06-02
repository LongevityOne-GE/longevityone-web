'use client'

import type { Locale } from '@/lib/utils'
import type { BlogPost } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'
import { BlogGrid } from '@/components/sections/BlogGrid'

interface BlogIndexPageProps {
  locale: Locale
  posts: BlogPost[]
}

export function BlogIndexPage({ locale, posts }: BlogIndexPageProps) {
  const title = locale === 'ka' ? 'სტატიები' : 'Articles'

  return (
    <main className="flex flex-col">
      <PageHero locale={locale} title={title} />
      <BlogGrid locale={locale} posts={posts} />
    </main>
  )
}
