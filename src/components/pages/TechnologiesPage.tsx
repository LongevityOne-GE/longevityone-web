'use client'

import type { Locale } from '@/lib/utils'
import type { Technology } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'
import { TechSideNav } from '@/components/sections/TechSideNav'
import { TechSection } from '@/components/sections/TechSection'

interface TechnologiesPageProps {
  locale: Locale
  technologies: Technology[]
}

export function TechnologiesPage({ locale, technologies }: TechnologiesPageProps) {
  const title = locale === 'ka' ? 'მეცნიერება და ტექნოლოგია' : 'Science & Technology'
  const subtitle =
    locale === 'ka'
      ? 'მოწინავე დიაგნოსტიკური ტექნოლოგიები, რომლებიც გვეხმარება თქვენი ჯანმრთელობის სრული სურათის შექმნაში.'
      : 'Advanced diagnostic technologies that help us create a complete picture of your health.'

  return (
    <main className="flex flex-col">
      <PageHero locale={locale} title={title} subtitle={subtitle} />
      <TechSideNav technologies={technologies} />
      {technologies.map((tech, idx) => (
        <TechSection key={tech._id} locale={locale} tech={tech} index={idx} />
      ))}
    </main>
  )
}
