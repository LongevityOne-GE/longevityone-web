'use client'

import type { Locale } from '@/lib/utils'
import { Reveal } from '@/components/animations/Reveal'

interface ServiceDifferentiatorProps {
  locale: Locale
  differentiator: string | null | undefined
}

export function ServiceDifferentiator({ differentiator }: ServiceDifferentiatorProps) {
  if (!differentiator) return null

  return (
    <section className="py-20 md:py-32 bg-dark-brown text-bone-white relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/logos/logo-mark.svg"
          alt=""
          className="w-96 md:w-[600px] h-auto opacity-[0.04]"
        />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <span className="text-burnt-orange text-4xl font-serif leading-none select-none">"</span>
            <p className="text-2xl md:text-3xl lg:text-4xl font-serif italic leading-snug text-bone-white/90 mt-2">
              {differentiator}
            </p>
            <span className="text-burnt-orange text-4xl font-serif leading-none select-none">"</span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
