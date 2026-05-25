import Image from 'next/image'
import type { Locale } from '@/lib/utils'
import type { JourneyStage as JourneyStageData } from '@/lib/sanity/types'
import { JourneyStage } from './JourneyStage'

interface JourneyTimelineProps {
  locale: Locale
  stages: JourneyStageData[]
}

export function JourneyTimeline({ locale, stages }: JourneyTimelineProps) {
  if (!stages.length) return null

  return (
    <section className="relative bg-bone-white pb-24 md:pb-32 overflow-hidden">
      <div className="section-container relative">
        {/* Anatomy images scattered along the timeline - desktop only */}
        <div
          aria-hidden="true"
          className="absolute -left-1 sm:-left-2 lg:-left-4 xl:-left-12 top-[2%] w-20 sm:w-28 lg:w-36 xl:w-44 opacity-75 pointer-events-none"
        >
          <Image src="/images/journey/body-head-apollo.png" alt="" width={176} height={260} className="rounded-sm" />
        </div>

        <div
          aria-hidden="true"
          className="absolute -right-2 sm:-right-4 lg:-right-6 xl:-right-16 top-[12%] w-20 sm:w-28 lg:w-36 xl:w-44 opacity-70 pointer-events-none"
        >
          <Image src="/images/journey/body-head-female.png" alt="" width={176} height={260} className="rounded-sm" />
        </div>

        <div
          aria-hidden="true"
          className="absolute -left-1 sm:-left-2 lg:-left-2 xl:-left-10 top-[24%] w-24 sm:w-32 lg:w-44 xl:w-56 opacity-75 pointer-events-none"
        >
          <Image src="/images/journey/body-shoulder-hair.png" alt="" width={224} height={160} className="rounded-sm" />
        </div>

        <div
          aria-hidden="true"
          className="absolute -right-1 sm:-right-2 lg:-right-4 xl:-right-12 top-[34%] w-24 sm:w-32 lg:w-40 xl:w-48 opacity-70 pointer-events-none"
        >
          <Image src="/images/journey/body-torso-male.png" alt="" width={192} height={280} className="rounded-sm" />
        </div>

        <div
          aria-hidden="true"
          className="absolute -left-1 sm:-left-2 lg:-left-4 xl:-left-12 top-[46%] w-24 sm:w-32 lg:w-40 xl:w-48 opacity-75 pointer-events-none"
        >
          <Image src="/images/journey/body-torso-female.png" alt="" width={192} height={280} className="rounded-sm" />
        </div>

        <div
          aria-hidden="true"
          className="absolute -right-2 sm:-right-4 lg:-right-6 xl:-right-14 top-[56%] w-20 sm:w-28 lg:w-36 xl:w-44 opacity-70 pointer-events-none"
        >
          <Image src="/images/journey/body-winged-drape.png" alt="" width={176} height={260} className="rounded-sm" />
        </div>

        <div
          aria-hidden="true"
          className="absolute -left-1 sm:-left-2 lg:-left-2 xl:-left-10 top-[68%] w-24 sm:w-32 lg:w-40 xl:w-48 opacity-75 pointer-events-none"
        >
          <Image src="/images/journey/body-legs-motion.png" alt="" width={192} height={280} className="rounded-sm" />
        </div>

        <div
          aria-hidden="true"
          className="absolute -right-1 sm:-right-2 lg:-right-4 xl:-right-12 top-[82%] w-24 sm:w-32 lg:w-40 xl:w-48 opacity-70 pointer-events-none"
        >
          <Image src="/images/journey/body-seated-drape.png" alt="" width={192} height={280} className="rounded-sm" />
        </div>

        <div className="relative mx-auto max-w-4xl px-16 sm:px-20 md:px-28 lg:px-32">
          {/* Central vertical spine - desktop only. */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-dark-brown/20"
          />
          <div className="space-y-12 md:space-y-16">
            {stages.map((stage, index) => (
              <JourneyStage
                key={stage._id}
                locale={locale}
                stage={stage}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
