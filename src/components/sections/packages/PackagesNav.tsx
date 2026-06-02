'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export interface PackagesNavItem {
  id: string
  label: string
}

interface PackagesNavProps {
  items: PackagesNavItem[]
  ariaLabel: string
}

/**
 * Sticky in-page navigator for the pricing sections. Tracks the section in
 * view (scroll-spy) and smooth-scrolls on click. Sits just under the global
 * fixed nav; section targets carry `scroll-mt` to land below both bars.
 */
export function PackagesNav({ items, ariaLabel }: PackagesNavProps) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.2, 0.5, 1] },
    )
    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [items])

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    event.preventDefault()
    setActive(id)
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${id}`)
  }

  return (
    <div className="sticky top-[64px] z-30 border-y border-dark-brown/10 bg-bone-white/85 backdrop-blur-md">
      <nav
        aria-label={ariaLabel}
        className="section-container flex items-center gap-1 overflow-x-auto py-3 sm:justify-center"
      >
        {items.map((item) => {
          const isActive = active === item.id
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'relative whitespace-nowrap px-4 py-2 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors duration-200',
                isActive ? 'text-burnt-orange' : 'text-dark-brown/60 hover:text-dark-brown',
              )}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute inset-x-3 -bottom-px h-px origin-center bg-burnt-orange transition-transform duration-300',
                  isActive ? 'scale-x-100' : 'scale-x-0',
                )}
              />
            </a>
          )
        })}
      </nav>
    </div>
  )
}
