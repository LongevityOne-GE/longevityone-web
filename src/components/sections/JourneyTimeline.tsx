'use client'

import type { Locale } from '@/lib/utils'
import type { JourneyStage } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { PortableTextRenderer } from '@/components/shared/PortableTextRenderer'

interface JourneyTimelineProps {
  locale: Locale
  stages: JourneyStage[]
}

export function JourneyTimeline({ locale, stages }: JourneyTimelineProps) {
  if (!stages.length) return null

  return (
    <section className="py-20 md:py-32 bg-bone-white">
      <div className="section-container">
        <div className="relative">
          {/* vertical line — desktop only */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-dark-brown/10" />

          <div className="space-y-0">
            {stages.map((stage, idx) => {
              const isLeft = idx % 2 === 0
              const title = locale === 'ka' ? stage.title_ka : stage.title_en
              const duration = locale === 'ka' ? stage.duration_ka : stage.duration_en
              const body = locale === 'ka' ? stage.body_ka : stage.body_en

              return (
                <Reveal key={stage._id} delay={0.08 * idx}>
                  <div
                    className={`relative grid grid-cols-1 lg:grid-cols-2 gap-0 py-12 md:py-16 border-b border-dark-brown/8 last:border-b-0 ${
                      isLeft ? '' : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* dot on the timeline — desktop */}
                    <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-bone-white border-2 border-burnt-orange z-10" />

                    {/* number + title block */}
                    <div className={`flex flex-col justify-center ${isLeft ? 'lg:pr-16 xl:pr-24' : 'lg:order-2 lg:pl-16 xl:pl-24'}`}>
                      <span className="text-7xl font-black text-dark-brown/8 font-serif leading-none mb-2 select-none">
                        {stage.stageNumber != null
                          ? String(stage.stageNumber).padStart(2, '0')
                          : String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-xl md:text-2xl font-black font-serif text-dark-brown leading-tight">
                        {title}
                      </h3>
                      {duration && (
                        <p className="text-xs uppercase tracking-widest font-bold text-burnt-orange mt-3">
                          {duration}
                        </p>
                      )}
                    </div>

                    {/* body + tools block */}
                    <div className={`flex flex-col justify-center mt-6 lg:mt-0 ${isLeft ? 'lg:pl-16 xl:pl-24' : 'lg:order-1 lg:pr-16 xl:pr-24'}`}>
                      {body && body.length > 0 && (
                        <div className="text-sm md:text-base text-dark-brown/75 [&_p]:mb-3 [&_p:last-child]:mb-0">
                          <PortableTextRenderer value={body} />
                        </div>
                      )}
                      {stage.tools && stage.tools.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-5">
                          {stage.tools.map((tool, i) => (
                            <span
                              key={i}
                              className="text-xs font-bold uppercase tracking-widest text-dark-brown/60 border border-dark-brown/15 rounded-sm px-3 py-1"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
