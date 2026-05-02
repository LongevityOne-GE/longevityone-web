import { Nav } from './Nav'
import { Footer } from './Footer'
import type { Lang } from '@/lib/utils'

interface SiteLayoutProps {
  lang: Lang
  children: React.ReactNode
}

export function SiteLayout({ lang, children }: SiteLayoutProps) {
  return (
    <>
      <Nav lang={lang} />
      <main>{children}</main>
      <Footer lang={lang} />
    </>
  )
}
