interface JsonLdProps {
  /** One schema object or an array of them. Serialised into <script type="application/ld+json">. */
  data: Record<string, unknown> | Array<Record<string, unknown>>
}

/**
 * Renders Schema.org JSON-LD. Values originate from Sanity-stored strings /
 * constants serialised by JSON.stringify — no HTML or executable content
 * reaches the script body. (Inline ld+json is non-executable data; it is not
 * blocked by the CSP script-src.)
 */
export function JsonLd({ data }: JsonLdProps) {
  const blocks = Array.isArray(data) ? data : [data]
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  )
}
