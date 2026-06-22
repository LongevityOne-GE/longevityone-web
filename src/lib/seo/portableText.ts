interface PortableTextSpan {
  _type?: string
  text?: string
}
interface PortableTextBlockLike {
  _type?: string
  children?: PortableTextSpan[]
}

/**
 * Flattens Sanity Portable Text blocks to a plain string for use in JSON-LD
 * (e.g. FAQ answer text). Ignores non-block content and joins paragraphs.
 */
export function blocksToPlainText(value: unknown[] | null | undefined): string {
  if (!value) return ''
  return value
    .map((b) => {
      const block = b as PortableTextBlockLike
      if (!block || block._type !== 'block' || !Array.isArray(block.children)) return ''
      return block.children
        .map((c) => (typeof c?.text === 'string' ? c.text : ''))
        .join('')
    })
    .filter(Boolean)
    .join('\n\n')
}
