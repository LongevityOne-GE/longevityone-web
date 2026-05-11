'use client'

import { useRef } from 'react'
import { useInView } from '@/lib/motion'

interface JourneyConnectorProps {
  /** Number of stages the connector bridges. Determines dot positions. */
  count: number
  className?: string
}

/**
 * Horizontal stroke-drawn connector for the Journey stages.
 * - Hidden below `lg` (grid stacks, connector would look wrong).
 * - Animates its stroke-dashoffset from 1 → 0 when the section enters view.
 * - Small burnt-orange dots mark each stage's centre.
 */
export function JourneyConnector({ count, className = '' }: JourneyConnectorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { threshold: 0.25 })

  // Dot centre positions as percentages for a grid of `count` columns.
  // Each column's centre at (i + 0.5) / count.
  const dots = Array.from({ length: count }, (_, i) => ((i + 0.5) / count) * 100)

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none hidden lg:block absolute inset-x-0 top-6 h-6 ${className}`}
    >
      <svg
        viewBox="0 0 100 6"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        <line
          x1={dots[0]}
          y1="3"
          x2={dots[dots.length - 1]}
          y2="3"
          stroke="var(--color-burnt-orange)"
          strokeOpacity="0.35"
          strokeWidth="0.4"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={inView ? 0 : 1}
          style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s' }}
        />
        {dots.map((cx, i) => (
          <circle
            key={i}
            cx={cx}
            cy={3}
            r={0.9}
            fill="var(--color-burnt-orange)"
            opacity={inView ? 1 : 0}
            style={{
              transition: `opacity 0.4s ease-out ${0.3 + i * 0.18}s`,
            }}
          />
        ))}
      </svg>
    </div>
  )
}
