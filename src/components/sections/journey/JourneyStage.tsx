import type { Locale } from '@/lib/utils'
import type { JourneyStage as JourneyStageData } from '@/lib/sanity/types'
import { PortableTextWithTechLinks } from '@/components/sanity/PortableTextWithTechLinks'
import { Reveal } from '@/components/animations/Reveal'

interface JourneyStageProps {
  locale: Locale
  stage: JourneyStageData
  index: number
}

const COPY = {
  stage: { ka: 'ეტაპი', en: 'Stage' },
} as const

/**
 * Single timeline row. Layout - text on one side of the central spine,
 * numbered square medallion on the opposite side, connected by a short
 * horizontal hairline. Odd stages: text LEFT, medallion RIGHT. Even
 * stages: medallion LEFT, text RIGHT.
 */
export function JourneyStage({ locale, stage, index }: JourneyStageProps) {
  const title = locale === 'ka' ? stage.title_ka : stage.title_en
  const body = locale === 'ka' ? stage.body_ka : stage.body_en

  // Fall back to 1-based position if Sanity stageNumber is missing.
  const stageNum = stage.stageNumber ?? index + 1
  const isOdd = stageNum % 2 === 1
  const eyebrowNum = String(stageNum).padStart(2, '0')

  const textBlock = (
    <>
      <p className="text-[11px] uppercase tracking-[0.22em] text-dark-brown/55 font-medium mb-3">
        {COPY.stage[locale]} {eyebrowNum}
      </p>
      <h2 className="text-2xl md:text-[30px] font-serif font-semibold text-dark-brown leading-snug">
        {title}
      </h2>
      {body && (body as unknown[]).length > 0 && (
        <div
          className={`mt-4 text-[15px] text-dark-brown/75 leading-relaxed max-w-sm ${
            isOdd ? 'lg:ml-auto' : ''
          }`}
        >
          <PortableTextWithTechLinks
            value={body as unknown[]}
            locale={locale}
            technologies={stage.relatedTechnologies}
          />
        </div>
      )}
    </>
  )

  // Common medallion + hairline pair, positioned absolutely against the row.
  // Hairline starts at the spine (left-1/2) and runs into the medallion's edge.
  const medallion = (
    <div
      aria-hidden="true"
      className="hidden lg:flex h-12 w-12 items-center justify-center rounded-lg border border-dark-brown/15 bg-bone-white text-dark-brown font-serif text-lg shadow-[0_1px_3px_rgba(66,41,34,0.08)]"
    >
      {stageNum}
    </div>
  )

  return (
    <div
      id={`stage-${stageNum}`}
      data-stage={stageNum}
      className="scroll-mt-28 relative grid grid-cols-1 lg:grid-cols-2 items-start"
    >
      {isOdd ? (
        <>
          {/* Text on the LEFT, right-aligned */}
          <Reveal className="lg:pr-12 xl:pr-16 lg:text-right">{textBlock}</Reveal>

          {/* Medallion on the RIGHT side of the spine, with hairline */}
          <div className="hidden lg:flex items-center pt-7">
            <span
              aria-hidden="true"
              className="h-px w-6 bg-dark-brown/25"
            />
            {medallion}
          </div>
        </>
      ) : (
        <>
          {/* Medallion on the LEFT side of the spine, with hairline */}
          <div className="hidden lg:flex items-center justify-end pt-7">
            {medallion}
            <span
              aria-hidden="true"
              className="h-px w-6 bg-dark-brown/25"
            />
          </div>

          {/* Text on the RIGHT, left-aligned */}
          <Reveal className="lg:pl-12 xl:pl-16 lg:text-left">{textBlock}</Reveal>
        </>
      )}
    </div>
  )
}
