import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { sanityClient, legalPageBySlugQuery } from '@/lib/sanity'
import type { LegalPage } from '@/lib/sanity/types'
import type { Locale } from '@/lib/utils'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.longevityone.ge'

type LegalSlug = 'privacy' | 'terms' | 'cookies' | 'medical-disclaimer'

interface LegalPageLayoutProps {
  slug: LegalSlug
  lang: Locale
}

function localizedDate(iso: string | null, lang: Locale): string {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat(lang === 'ka' ? 'ka-GE' : 'en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

interface PortableTextLinkValue {
  href?: string
  external?: boolean
}

interface PortableTextLinkProps {
  value?: PortableTextLinkValue
  children?: React.ReactNode
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-5 first:mt-0">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-14 mb-5 text-2xl md:text-[28px] font-semibold leading-tight text-dark-brown">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 mb-4 text-xl md:text-[22px] font-semibold leading-tight text-dark-brown">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 mb-6 border-l-2 border-burnt-orange/40 pl-5 italic text-dark-brown/80">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 mb-2 space-y-2 pl-6 list-disc marker:text-burnt-orange/70">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 mb-2 space-y-2 pl-6 list-decimal marker:text-burnt-orange/70">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-[1.7]">{children}</li>,
    number: ({ children }) => <li className="leading-[1.7]">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-dark-brown">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }: PortableTextLinkProps) => {
      const href = value?.href ?? '#'
      const external = value?.external === true
      const baseClass =
        'text-burnt-orange underline underline-offset-2 decoration-burnt-orange/40 hover:decoration-burnt-orange transition-colors'
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={baseClass}
          >
            {children}
          </a>
        )
      }
      return (
        <Link href={href} className={baseClass}>
          {children}
        </Link>
      )
    },
  },
}

/**
 * Generates Next.js Metadata for a legal page. Used by each route's
 * `generateMetadata` export.
 */
export async function generateLegalMetadata({
  slug,
  lang,
}: LegalPageLayoutProps): Promise<Metadata> {
  const page = await sanityClient.fetch<LegalPage | null>(
    legalPageBySlugQuery,
    { pageType: slug },
    { next: { revalidate: 300, tags: ['legalPage'] } },
  )
  if (!page) return {}

  const title = lang === 'ka' ? page.title_ka : page.title_en
  const description = lang === 'ka' ? page.seoDescription_ka : page.seoDescription_en
  const path = `/legal/${slug}`

  return {
    title: title ? `${title} | Longevity One` : undefined,
    description: description ?? undefined,
    alternates: {
      canonical: `${SITE_URL}${lang === 'en' ? '/en' : ''}${path}`,
      languages: {
        ka: `${SITE_URL}${path}`,
        en: `${SITE_URL}/en${path}`,
      },
    },
  }
}

/**
 * Server Component. Fetches a legal page document from Sanity and renders it
 * inside an editorial article layout. Calls `notFound()` if the document is
 * missing.
 */
export async function LegalPageLayout({
  slug,
  lang,
}: LegalPageLayoutProps): Promise<React.ReactElement> {
  const page = await sanityClient.fetch<LegalPage | null>(
    legalPageBySlugQuery,
    { pageType: slug },
    { next: { revalidate: 300, tags: ['legalPage'] } },
  )

  if (!page) notFound()

  const title = lang === 'ka' ? page.title_ka : page.title_en
  const intro = lang === 'ka' ? page.intro_ka : page.intro_en
  const body = lang === 'ka' ? page.body_ka : page.body_en
  const lastUpdatedLabel =
    lang === 'ka' ? 'ბოლო განახლება' : 'Last updated'
  const formattedDate = localizedDate(page.lastUpdated, lang)

  return (
    <main className="flex flex-col bg-bone-white text-dark-brown">
      {/* Hero strip */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-14 border-b border-dark-brown/10">
        <div className="section-container max-w-3xl mx-auto">
          {formattedDate && (
            <p className="text-[11px] uppercase tracking-[0.22em] text-burnt-orange font-medium mb-4">
              {lastUpdatedLabel} · {formattedDate}
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.15] text-dark-brown">
            {title}
          </h1>
          {intro && (
            <p className="mt-5 text-[16px] md:text-[17px] leading-[1.7] text-dark-brown/80">
              {intro}
            </p>
          )}
        </div>
      </section>

      {/* Body */}
      <article className="section-container max-w-3xl mx-auto py-12 md:py-16 text-[15px] md:text-base leading-[1.75] text-dark-brown/90">
        {body && (
          <PortableText
            value={body as PortableTextBlock[]}
            components={portableTextComponents}
          />
        )}
      </article>
    </main>
  )
}
