import type { Locale } from '@/lib/utils'
import type { JourneyData, JourneyStage } from '@/lib/sanity/types'
import { safeJsonLd } from '@/lib/text'

interface JourneyJsonLdProps {
  locale: Locale
  data: JourneyData
  baseUrl: string
}

interface PortableTextSpan {
  _type?: string
  text?: string
}
interface PortableTextBlockLike {
  _type?: string
  children?: PortableTextSpan[]
}

function blocksToPlainText(value: unknown[] | null): string {
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

function stageUrl(baseUrl: string, locale: Locale, number: number): string {
  const langPath = locale === 'en' ? '/en' : ''
  return `${baseUrl}${langPath}/journey#stage-${number}`
}

function buildStepNode(
  stage: JourneyStage,
  locale: Locale,
  baseUrl: string,
): Record<string, unknown> {
  const name = (locale === 'ka' ? stage.title_ka : stage.title_en) ?? ''
  const text = blocksToPlainText((locale === 'ka' ? stage.body_ka : stage.body_en) as unknown[])

  const node: Record<string, unknown> = {
    '@type': 'HowToStep',
    position: stage.stageNumber,
    name,
    text,
    url: stageUrl(baseUrl, locale, stage.stageNumber),
  }

  // Nest MedicalProcedure entries when the stage has related technologies -
  // this is where the SEO depth lives (Stage 2: VO₂ Max + Visbody, Stage 6:
  // IHHT + Red Light Therapy, etc.). Driven entirely by relatedTechnologies.
  if (stage.relatedTechnologies && stage.relatedTechnologies.length > 0) {
    node.itemListElement = stage.relatedTechnologies.map((tech) => ({
      '@type': 'MedicalProcedure',
      name: (locale === 'ka' ? tech.name_ka : tech.name_en) ?? tech.name,
      description: locale === 'ka' ? tech.tagline_ka : tech.tagline_en,
      procedureType: 'https://schema.org/DiagnosticProcedure',
      url: `${baseUrl}${locale === 'en' ? '/en' : ''}/technologies#${tech.slug}`,
    }))
  }

  return node
}

export function JourneyJsonLd({ locale, data, baseUrl }: JourneyJsonLdProps) {
  if (!data.stages.length) return null

  const name =
    (locale === 'ka' ? data.page?.h1_ka : data.page?.h1_en) ?? 'Patient Journey'
  const description =
    (locale === 'ka' ? data.page?.intro_ka : data.page?.intro_en) ?? ''

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    inLanguage: locale === 'ka' ? 'ka-GE' : 'en-GB',
    totalTime: 'P3M',
    step: data.stages.map((s) => buildStepNode(s, locale, baseUrl)),
  }

  return (
    <script
      type="application/ld+json"
      // safeJsonLd escapes "<" as "\u003c" so a CMS value containing
      // "</script>" cannot break out of this script element.
      dangerouslySetInnerHTML={{ __html: safeJsonLd(ld) }}
    />
  )
}
