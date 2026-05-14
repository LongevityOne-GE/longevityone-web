'use client'

import type { Locale } from '@/lib/utils'
import type { SiteSettings } from '@/lib/sanity/types'
import { PageHero } from '@/components/shared/PageHero'
import { ContactHero } from '@/components/sections/ContactHero'
import { ContactSection } from '@/components/sections/ContactSection'

interface ContactPageProps {
  locale: Locale
  settings: SiteSettings | null
}

export function ContactPage({ locale, settings }: ContactPageProps) {
  const title = locale === 'ka' ? 'დაგვიკავშირდით' : 'Get in Touch'
  const subtitle =
    locale === 'ka'
      ? 'ჩვენ მზად ვართ ვუპასუხოთ თქვენს კითხვებს და დავგეგმოთ თქვენი ვიზიტი.'
      : 'We\'re happy to answer your questions and help schedule your visit.'

  return (
    <main className="flex flex-col">
      <PageHero locale={locale} title={title} subtitle={subtitle} />
      <ContactSection locale={locale} settings={settings} />
      <ContactHero />
    </main>
  )
}
