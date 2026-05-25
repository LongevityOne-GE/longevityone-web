'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/utils'
import type { JourneyStage } from '@/lib/sanity/types'

interface JourneyStageNavProps {
  locale: Locale
  stages: JourneyStage[]
}

export function JourneyStageNav({ locale, stages }: JourneyStageNavProps) {
  const [activeNumber, setActiveNumber] = useState<number | null>(
    stages[0]?.stageNumber ?? null,
  )
  const visibleRef = useRef<Map<number, number>>(new Map())

  useEffect(() => {
    if (typeof window === 'undefined' || !stages.length) return

    const elements = stages
      .map((s) => document.getElementById(`stage-${s.stageNumber}`))
      .filter((el): el is HTMLElement => el !== null)

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const num = Number(entry.target.getAttribute('data-stage'))
          if (!Number.isFinite(num)) continue
          if (entry.isIntersecting) {
            visibleRef.current.set(num, entry.intersectionRatio)
          } else {
            visibleRef.current.delete(num)
          }
        }
        let bestNum: number | null = null
        let bestRatio = -1
        visibleRef.current.forEach((ratio, num) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestNum = num
          }
        })
        if (bestNum !== null) setActiveNumber(bestNum)
      },
      {
        // Treat the middle 60% of the viewport as the "active" band - keeps
        // the dominant in-view stage highlighted rather than the topmost
        // intersecting one.
        rootMargin: '-20% 0px -20% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [stages])

  if (!stages.length) return null

  return (
    <nav
      aria-label={locale === 'ka' ? 'საფეხურები' : 'Stages'}
      className="hidden lg:block sticky top-32 self-start"
    >
      <ol className="space-y-3">
        {stages.map((stage) => {
          const name = locale === 'ka' ? stage.title_ka : stage.title_en
          const isActive = activeNumber === stage.stageNumber
          const num = String(stage.stageNumber).padStart(2, '0')
          return (
            <li key={stage._id}>
              <a
                href={`#stage-${stage.stageNumber}`}
                className={`group flex items-baseline gap-3 text-sm leading-tight transition-colors ${
                  isActive
                    ? 'text-burnt-orange'
                    : 'text-dark-brown/55 hover:text-dark-brown'
                }`}
              >
                <span
                  className={`font-mono text-[11px] tabular-nums ${
                    isActive ? 'text-burnt-orange' : 'text-dark-brown/40'
                  }`}
                >
                  {num}
                </span>
                <span className="font-medium">{name}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
