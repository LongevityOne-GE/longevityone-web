'use client'

import type { Locale } from '@/lib/utils'
import type { SiteSettings } from '@/lib/sanity/types'
import { ContactHero } from '@/components/sections/ContactHero'
import { ContactSection } from '@/components/sections/ContactSection'

interface ContactPageProps {
  locale: Locale
  settings: SiteSettings | null
}

export function ContactPage({ locale, settings }: ContactPageProps) {
  return (
    <main className="flex flex-col">
      <ContactHero />
      <ContactSection locale={locale} settings={settings} />
    </main>
  )
}
