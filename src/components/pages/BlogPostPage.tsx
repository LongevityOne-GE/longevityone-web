'use client'

import type { Locale } from '@/lib/utils'
import type { BlogPostDetail, HomePageData } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'
import { PostBody } from '@/components/sections/PostBody'
import { CTA } from '@/components/sections/CTA'

interface BlogPostPageProps {
  locale: Locale
  post: BlogPostDetail | null
  ctaData?: HomePageData | null
}

export function BlogPostPage({ locale, post, ctaData }: BlogPostPageProps) {
  if (!post) {
    return (
      <main className="flex flex-col">
        <PageHero
          locale={locale}
          title={locale === 'ka' ? 'სტატია ვერ მოიძებნა' : 'Article Not Found'}
        />
      </main>
    )
  }

  const categoryLabels: Record<string, { ka: string; en: string }> = {
    'longevity-science': { ka: 'მეცნიერება დღეგრძელობაზე', en: 'Longevity Science' },
    'metabolic-health': { ka: 'მეტაბოლური ჯანმრთელობა', en: 'Metabolic Health' },
    'elite-performance': { ka: 'ელიტური პერფორმანსი', en: 'Elite Performance' },
    'technologies': { ka: 'ტექნოლოგიები', en: 'Technologies' },
  }

  const title = locale === 'ka' ? post.title_ka : post.title_en
  const rawCategory = locale === 'ka' ? post.category_ka : post.category_en
  const categoryEntry = rawCategory ? categoryLabels[rawCategory] : null
  const category = categoryEntry
    ? (locale === 'ka' ? categoryEntry.ka : categoryEntry.en)
    : rawCategory?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ?? null

  return (
    <main className="flex flex-col">
      <PageHero locale={locale} title={title || ''} subtitle={category} />
      <PostBody locale={locale} post={post} />
      <CTA locale={locale} data={ctaData} />
    </main>
  )
}
