'use client'

import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

interface PortableTextRendererProps {
  value: PortableTextBlock[] | unknown[] | null | undefined
  className?: string
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-bold text-dark-brown border-t border-dark-brown/20 pt-8 mt-12 first:mt-0 first:border-t-0 first:pt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-semibold text-dark-brown mt-8 mb-4">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold text-dark-brown mt-6 mb-3">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-dark-brown/85 leading-relaxed mb-6 last:mb-0">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-burnt-orange pl-6 my-8 italic text-dark-brown/80 text-lg">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-dark-brown">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = value?.href || ''
      const isExternal = href.startsWith('http')
      return (
        <a
          href={href}
          className="text-burnt-orange underline-offset-2 hover:underline transition-colors"
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      )
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="space-y-3 my-6 ml-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="space-y-3 my-6 ml-1 list-decimal list-inside">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-3 text-dark-brown/85 leading-relaxed">
        <span className="text-burnt-orange mt-1.5 text-xs">●</span>
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="text-dark-brown/85 leading-relaxed">{children}</li>
    ),
  },
}

export function PortableTextRenderer({ value, className = '' }: PortableTextRendererProps) {
  if (!value || value.length === 0) return null

  return (
    <div className={`prose-brand ${className}`}>
      <PortableText value={value as PortableTextBlock[]} components={components} />
    </div>
  )
}
