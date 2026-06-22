import { Fragment, type ReactNode } from 'react'

// Renders a possibly multi-line string as React nodes, turning each "\n" into a
// <br />. Unlike dangerouslySetInnerHTML, React escapes the text content, so
// CMS-authored strings cannot inject markup or scripts (stored-XSS safe).
export function renderMultiline(text: string): ReactNode {
  return text.split('\n').map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ))
}

// Serializes data for a JSON-LD <script> tag, escaping "<" as "\u003c" so a CMS
// value containing "</script>" cannot break out of the script element.
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
