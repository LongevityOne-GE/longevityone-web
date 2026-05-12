'use client'

import { useEffect, useState } from 'react'
import type { Locale } from '@/lib/utils'
import type { ServiceDetail } from '@/lib/sanity/types'

interface ServiceSideNavProps {
  locale: Locale
  services: ServiceDetail[]
}

export function ServiceSideNav({ locale, services }: ServiceSideNavProps) {
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    services.forEach((service) => {
      const el = document.getElementById(service.slug)
      if (!el) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveAnchor(service.slug)
            }
          })
        },
        { threshold: 0.3, rootMargin: '-20% 0px -60% 0px' }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [services])

  const handleClick = (anchor: string) => {
    const el = document.getElementById(anchor)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-4">
      {services.map((service) => {
        const isActive = activeAnchor === service.slug
        const label = locale === 'ka' ? service.title_ka : service.title_en
        return (
          <button
            key={service.slug}
            onClick={() => handleClick(service.slug)}
            className="group flex items-center gap-3 text-left"
            aria-label={`Navigate to ${label}`}
          >
            <span
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                isActive
                  ? 'bg-burnt-orange border-burnt-orange scale-125'
                  : 'border-dark-brown/30 group-hover:border-burnt-orange'
              }`}
            />
            <span
              className={`text-[10px] uppercase tracking-widest font-bold transition-all duration-300 ${
                isActive
                  ? 'text-burnt-orange opacity-100'
                  : 'text-dark-brown/40 opacity-0 group-hover:opacity-100'
              }`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
