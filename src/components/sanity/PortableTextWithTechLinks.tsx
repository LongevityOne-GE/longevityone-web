import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Locale } from '@/lib/utils'
import type { JourneyStageTechRef } from '@/lib/sanity/types'

interface PortableTextWithTechLinksProps {
  value: PortableTextBlock[] | unknown[] | null | undefined
  locale: Locale
  technologies: JourneyStageTechRef[] | null
}

interface TechMatcher {
  pattern: RegExp | null
  bySource: Map<string, JourneyStageTechRef>
}

function buildMatcher(techs: JourneyStageTechRef[]): TechMatcher {
  const bySource = new Map<string, JourneyStageTechRef>()
  const sources: string[] = []
  for (const tech of techs) {
    if (tech.name) {
      bySource.set(tech.name.toLowerCase(), tech)
      sources.push(tech.name)
    }
    if (tech.slug) {
      const fromSlug = tech.slug.replace(/-/g, ' ')
      bySource.set(fromSlug.toLowerCase(), tech)
      sources.push(fromSlug)
    }
  }
  if (!sources.length) return { pattern: null, bySource }
  const escaped = Array.from(new Set(sources))
    .sort((a, b) => b.length - a.length)
    .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return {
    pattern: new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi'),
    bySource,
  }
}

function injectTechLinks(
  text: string,
  matcher: TechMatcher,
  locale: Locale,
  keyPrefix: string,
): ReactNode[] {
  if (!matcher.pattern) return [text]
  const href = (slug: string) =>
    locale === 'en' ? `/en/technologies#${slug}` : `/technologies#${slug}`

  const result: ReactNode[] = []
  let cursor = 0
  let count = 0
  const re = new RegExp(matcher.pattern.source, matcher.pattern.flags)
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const matched = m[1] ?? ''
    if (m.index > cursor) result.push(text.slice(cursor, m.index))
    const tech = matcher.bySource.get(matched.toLowerCase())
    if (tech) {
      result.push(
        <Link
          key={`${keyPrefix}-${count++}`}
          href={href(tech.slug)}
          className="text-burnt-orange underline-offset-2 hover:underline"
        >
          {matched}
        </Link>,
      )
    } else {
      result.push(matched)
    }
    cursor = m.index + matched.length
  }
  if (cursor < text.length) result.push(text.slice(cursor))
  return result
}

function linkifyChildren(
  children: ReactNode,
  matcher: TechMatcher,
  locale: Locale,
): ReactNode {
  const arr = Array.isArray(children) ? children : [children]
  return arr.flatMap((child, idx) => {
    if (typeof child === 'string') {
      return injectTechLinks(child, matcher, locale, `t-${idx}`)
    }
    return child
  })
}

export function PortableTextWithTechLinks({
  value,
  locale,
  technologies,
}: PortableTextWithTechLinksProps) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  const matcher = buildMatcher(technologies ?? [])

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className="text-dark-brown/85 leading-relaxed mb-4 last:mb-0">
          {linkifyChildren(children, matcher, locale)}
        </p>
      ),
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-bold text-dark-brown">{children}</strong>
      ),
      em: ({ children }) => <em className="italic">{children}</em>,
      link: ({ value: mark, children }) => {
        const href = (mark as { href?: string } | undefined)?.href ?? ''
        const isExternal = href.startsWith('http')
        return (
          <a
            href={href}
            className="text-burnt-orange underline-offset-2 hover:underline"
            {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {children}
          </a>
        )
      },
    },
    list: {
      bullet: ({ children }) => <ul className="space-y-2 my-4 ml-1">{children}</ul>,
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="flex items-start gap-3 text-dark-brown/85 leading-relaxed">
          <span className="text-burnt-orange mt-1.5 text-xs">●</span>
          <span>{linkifyChildren(children, matcher, locale)}</span>
        </li>
      ),
    },
  }

  return <PortableText value={value as PortableTextBlock[]} components={components} />
}
