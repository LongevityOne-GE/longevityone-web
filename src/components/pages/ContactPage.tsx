'use client'

import type { Locale } from '@/lib/utils'
import type { SiteSettings } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'
import { ContactSection } from '@/components/sections/ContactSection'

interface ContactPageProps {
  locale: Locale
  settings: SiteSettings | null
}

export function ContactPage({ locale, settings }: ContactPageProps) {
  const title = locale === 'ka' ? 'კონტაქტი' : 'Contact'

  return (
    <main className="flex flex-col">
      <PageHero locale={locale} title={title} />
      <ContactSection locale={locale} settings={settings} />
    </main>
  )
}
