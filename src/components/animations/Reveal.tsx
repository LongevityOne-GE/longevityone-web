'use client'

import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}

const fromTransforms: Record<string, string> = {
  up: 'translateY(16px)',
  down: 'translateY(-16px)',
  left: 'translateX(16px)',
  right: 'translateX(-16px)',
}

/**
 * Pure-CSS reveal: every mount triggers the animation,
 * so back-navigation, hard refresh, and initial load all behave identically.
 * No IntersectionObserver, no client state, no useEffect timing surprises.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: RevealProps) {
  return (
    <div
      className={`reveal-anim ${className}`}
      style={{
        animationDelay: `${delay}s`,
        // CSS custom prop the keyframe reads
        ['--reveal-from' as string]: fromTransforms[direction],
      }}
    >
      {children}
    </div>
  )
}
