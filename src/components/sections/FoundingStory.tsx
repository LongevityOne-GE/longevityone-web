'use client'

import type { Locale } from '@/lib/utils'
import { Reveal } from '@/components/animations/Reveal'
import { PortableTextRenderer } from '@/components/shared/PortableTextRenderer'

interface FoundingStoryProps {
  locale: Locale
  heading: string | null | undefined
  story: unknown[] | null | undefined
}

export function FoundingStory({ heading, story }: FoundingStoryProps) {
  if (!heading && (!story || story.length === 0)) return null

  return (
    <section className="py-20 md:py-40 bg-dark-brown text-bone-white relative overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/videos/columns-bg_boomerang.webm" type="video/webm" />
        <source src="/videos/columns-bg_boomerang.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-dark-brown/60 pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {heading && (
            <Reveal>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight font-serif">
                {heading}
              </h2>
            </Reveal>
          )}

          {story && story.length > 0 && (
            <Reveal delay={0.15}>
              <div className="text-lg md:text-xl font-serif italic leading-relaxed text-bone-white/90 [&_p]:text-bone-white/90 [&_strong]:text-bone-white [&_a]:text-burnt-orange [&_h2]:text-bone-white [&_h3]:text-bone-white">
                <PortableTextRenderer value={story} />
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
