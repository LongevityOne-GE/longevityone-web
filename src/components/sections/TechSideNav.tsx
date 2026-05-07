'use client'

import { useEffect, useState } from 'react'
import type { Technology } from '@/lib/sanity/types'

interface TechSideNavProps {
  technologies: Technology[]
}

export function TechSideNav({ technologies }: TechSideNavProps) {
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    technologies.forEach((tech) => {
      const el = document.getElementById(tech.anchor)
      if (!el) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveAnchor(tech.anchor)
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
  }, [technologies])

  const handleClick = (anchor: string) => {
    const el = document.getElementById(anchor)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-4">
      {technologies.map((tech) => {
        const isActive = activeAnchor === tech.anchor
        return (
          <button
            key={tech.anchor}
            onClick={() => handleClick(tech.anchor)}
            className="group flex items-center gap-3 text-left"
            aria-label={`Navigate to ${tech.name}`}
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
              {tech.name}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
