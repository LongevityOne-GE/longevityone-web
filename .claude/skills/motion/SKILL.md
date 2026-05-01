# LongevityOne — Motion & Animation Specification

> Reference: https://www.cliniquelaprairie.com
> Goal: Match cinematic, scroll-driven luxury feel. Every interaction should feel intentional and premium.

---

## Philosophy

Motion at LongevityOne is not decoration — it is storytelling. The site should feel like turning the pages of a premium art book: unhurried, deliberate, and deeply satisfying. Nothing snaps. Nothing bounces. Everything breathes.

**Three principles:**
1. **Reveal, don't distract** — animation draws attention to content, never away from it
2. **Gravity matters** — elements enter as if settling into place, not flying in
3. **Continuity** — the page feels like one connected experience, not a series of sections

---

## Library Stack

### Lenis (smooth scroll)
Install: `npm install @studio-freight/lenis`
Wrap the entire application. This is the foundation — without it nothing feels luxury.

```typescript
// app/providers/LenisProvider.tsx
'use client'
import Lenis from '@studio-freight/lenis'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
```

### Framer Motion
Install: `npm install framer-motion`
Use for: component entrance animations, hover states, page transitions, micro-interactions.

```typescript
// hooks/useReducedMotion.ts
'use client'
import { useReducedMotion } from 'framer-motion'

// Always check this — wrap all animations
export function useMotionSafe() {
  const reduced = useReducedMotion()
  return !reduced
}
```

### GSAP + ScrollTrigger
Install: `npm install gsap`
Use for: hero parallax, pinned sections, split text reveals, scroll-driven progress.
Register once in a root client component.

```typescript
// lib/gsap.ts
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText' // requires GSAP Club membership or use alternative

gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }
```

---

## Page Transition

Every route change: content fades out (200ms), new content fades in and rises (600ms).

```typescript
// components/animations/PageTransition.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

const variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} variants={variants} initial="initial" animate="animate" exit="exit">
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

---

## Hero Section (Homepage)

The most important animation on the site. Full-screen. Cinematic.

**Sequence (timed):**
1. Full-screen image loads (already visible, no fade-in — instant presence)
2. 0ms: Image begins slow parallax upward on scroll (GSAP ScrollTrigger)
3. 200ms after load: Eyebrow text fades in ("PREVENTIVE MEDICINE CENTER")
4. 500ms: Main headline reveals word by word with stagger (not letter by letter)
5. 900ms: Subheadline fades up
6. 1200ms: CTA button fades in with subtle upward movement

```typescript
// components/sections/Hero.tsx (client component)
'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { motion } from 'framer-motion'

export function Hero({ headline_ka, headline_en, lang }: HeroProps) {
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Parallax: image moves up at 40% of scroll speed
    gsap.to(imageRef.current, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: imageRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  }, [])

  return (
    <section className="relative h-screen overflow-hidden">
      <div ref={imageRef} className="absolute inset-0 scale-110">
        {/* Hero image — scale-110 gives room for parallax movement */}
      </div>
      {/* Content overlaid */}
    </section>
  )
}
```

---

## Section Entrances

Reusable animation wrapper for all content sections.

```typescript
// components/animations/FadeIn.tsx
'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
}

export function FadeIn({ children, delay = 0, direction = 'up', className }: FadeInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const directionMap = {
    up: { y: 32, x: 0 },
    down: { y: -32, x: 0 },
    left: { y: 0, x: 32 },
    right: { y: 0, x: -32 },
    none: { y: 0, x: 0 },
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

---

## Text Reveal Animation

For hero headlines and section titles. Words reveal with stagger.

```typescript
// components/animations/TextReveal.tsx
'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function TextReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const words = text.split(' ')

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : {}}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </p>
  )
}
```

---

## Hover States

All interactive elements respond to hover with subtle motion:

```typescript
// Standard card hover
const cardVariants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.3, ease: 'easeOut' } },
}

// Image hover: subtle zoom
// Use CSS: transition: transform 600ms cubic-bezier(0.25, 0.1, 0.25, 1)
// img: hover -> scale(1.05)

// Link hover: underline draws from left
// CSS: after pseudo-element, width: 0 -> width: 100%
```

---

## Pinned Scroll Section (Service Pillars)

Three service cards revealed as you scroll through a pinned section. Like Clinique La Prairie's program section.

```typescript
// GSAP pin + stagger reveal
useEffect(() => {
  const cards = gsap.utils.toArray('.service-card')

  ScrollTrigger.create({
    trigger: '.services-section',
    start: 'top top',
    end: `+=${cards.length * 100}%`,
    pin: true,
    scrub: 1,
    onUpdate: (self) => {
      const activeIndex = Math.floor(self.progress * cards.length)
      // Reveal each card as scroll progresses
    }
  })
}, [])
```

---

## Loading State

No spinners. The page loads with a fullscreen bone-white overlay that slides up.

```typescript
// components/layout/PageLoader.tsx
const loaderVariants = {
  initial: { scaleY: 1 },
  animate: { scaleY: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 } },
}
// Transform origin: top
// Behind everything (z-50), slides up to reveal the page
```

---

## Number Counter Animation

For statistics and metrics (VO2 Max improvements, patient numbers, etc.):

```typescript
// Use Framer Motion's useMotionValue + animate
// Count from 0 to target over 1.5s when in view
// Format with locale-aware number formatting
```

---

## Timing Reference

| Animation | Duration | Easing |
|---|---|---|
| Page transition in | 600ms | [0.25, 0.1, 0.25, 1] |
| Page transition out | 200ms | ease-in |
| Section fade-in | 800ms | [0.25, 0.1, 0.25, 1] |
| Word reveal stagger | 70ms per word | [0.25, 0.1, 0.25, 1] |
| Card hover | 300ms | ease-out |
| Image hover zoom | 600ms | [0.25, 0.1, 0.25, 1] |
| Page loader slide | 800ms | [0.76, 0, 0.24, 1] |
| Smooth scroll | 1200ms | custom (Lenis) |
| Parallax | scrub | linear (GSAP scrub) |

---

## Reduced Motion

All animations must respect the OS accessibility setting:

```typescript
// In every animated component:
const shouldAnimate = !useReducedMotion()

// Provide static fallback for all GSAP animations:
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Skip GSAP setup, show content immediately
  return
}
```

---

## Performance Rules

- Never animate `width`, `height`, `top`, `left`, `margin`, `padding` — use `transform` and `opacity` only
- Use `will-change: transform` sparingly and only on actively animating elements
- GSAP ScrollTrigger: always `kill()` on component unmount
- Lenis: always `destroy()` on unmount
- Test animations on mid-range Android (60fps target)
- No more than 3 elements animating simultaneously in any viewport
