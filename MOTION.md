# Longevity One — Motion & Animation Specification

> Reference: https://www.cliniquelaprairie.com
> Goal: Match cinematic, scroll-driven luxury feel. Every interaction feels intentional and premium.
> Rule: If an animation could be removed and the content still communicates clearly — remove it.

---

## Philosophy

Motion at Longevity One is storytelling, not decoration. The site should feel like turning pages of a premium art book: unhurried, deliberate, deeply satisfying. Nothing snaps. Nothing bounces. Everything breathes.

**Three principles:**
1. **Reveal, don't distract** — animation draws attention to content, never away from it
2. **Gravity matters** — elements enter as if settling into place, not flying in
3. **Continuity** — the page feels like one connected experience, not a series of sections

---

## Library Stack

### 1. Lenis — smooth scroll (foundational)
```bash
npm install @studio-freight/lenis
```

This is the most impactful single change. Without Lenis the site will never feel luxury.

```typescript
// src/providers/LenisProvider.tsx
'use client'
import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // Required: connect Lenis to GSAP so ScrollTrigger pinning works correctly
    lenis.on('scroll', ScrollTrigger.update)
    const rafCallback = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(rafCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(rafCallback)  // critical: prevent memory leak
    }
  }, [])

  return <>{children}</>
}
```

Wrap in `src/app/layout.tsx`:
```typescript
import { LenisProvider } from '@/providers/LenisProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka">
      <body className="bg-bone text-brown font-sans">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
```

### 2. GSAP + ScrollTrigger — scroll-driven animation
```bash
npm install gsap
```

Register once, import everywhere from this single file:

```typescript
// src/lib/gsap.ts
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Note: SplitText requires GSAP Club — use split-type (free) instead for text splitting
// npm install split-type

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }
```

**Always import from `@/lib/gsap` — never re-register plugins.**

### 3. Framer Motion — component animations
```bash
npm install framer-motion
```

```typescript
// hooks/useMotionSafe.ts — always wrap animations in this check
'use client'
import { useReducedMotion } from 'framer-motion'

export function useMotionSafe(): boolean {
  const prefersReduced = useReducedMotion()
  return !prefersReduced
}
```

---

## Page Transitions

Next.js 14 App Router requires a `template.tsx` file (not `layout.tsx`) for exit animations:

```typescript
// src/app/(ka)/template.tsx  and  src/app/en/template.tsx
'use client'
import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

---

## Page Loader (no spinners)

Fullscreen bone overlay slides up to reveal the page:

```typescript
// src/components/layout/PageLoader.tsx
'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function PageLoader() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 bg-bone z-[100] origin-top"
      initial={{ scaleY: 1 }}
      animate={loaded ? { scaleY: 0 } : { scaleY: 1 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      style={{ transformOrigin: 'top' }}
    />
  )
}
```

---

## Hero Section

The most important animation. Full-screen. Cinematic. Instant presence.

```typescript
// src/components/sections/Hero.tsx
'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useMotionSafe } from '@/hooks/useMotionSafe'

export function Hero({ headline_ka, headline_en, lang }: HeroProps) {
  const imageRef = useRef<HTMLDivElement>(null)
  const shouldAnimate = useMotionSafe()

  useEffect(() => {
    if (!shouldAnimate || !imageRef.current) return

    // Parallax: image moves up at 20% of scroll speed
    const tween = gsap.to(imageRef.current, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: imageRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [shouldAnimate])

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* Hero image — scale-110 gives room for parallax travel */}
      <div ref={imageRef} className="absolute inset-0 scale-110">
        {/* next/image here with priority */}
      </div>

      {/* Dark overlay — cinematic */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full max-w-site mx-auto px-6 md:px-12 pb-section-lg">
        
        {/* Eyebrow — fades in first */}
        <motion.p
          className="text-caption text-bone/70 uppercase tracking-widest font-thin mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {lang === 'ka' ? 'პრევენციული მედიცინის ცენტრი' : 'Preventive Medicine Center'}
        </motion.p>

        {/* Headline — word-by-word reveal */}
        <TextReveal
          text={lang === 'ka' ? headline_ka : headline_en}
          className="text-display font-black text-bone leading-[1.05]"
        />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-10"
        >
          {/* Book button */}
        </motion.div>
      </div>
    </section>
  )
}
```

**Hero animation sequence:**
1. Image already visible — no fade-in (instant cinematic presence)
2. 200ms: Eyebrow text fades in
3. 500ms: Headline reveals word by word
4. 1200ms: CTA button fades up
5. On scroll: image parallaxes upward at 20% scroll speed (GSAP scrub)

---

## FadeIn — Reusable Section Entrance

```typescript
// src/components/animations/FadeIn.tsx
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useMotionSafe } from '@/hooks/useMotionSafe'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  direction?: Direction
  className?: string
}

const offsets: Record<Direction, { x: number; y: number }> = {
  up:    { y: 32,  x: 0  },
  down:  { y: -32, x: 0  },
  left:  { y: 0,   x: 32 },
  right: { y: 0,   x: -32 },
  none:  { y: 0,   x: 0  },
}

export function FadeIn({ children, delay = 0, direction = 'up', className }: FadeInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const shouldAnimate = useMotionSafe()
  const { x, y } = offsets[direction]

  return (
    <motion.div
      ref={ref}
      initial={shouldAnimate ? { opacity: 0, x, y } : false}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

---

## TextReveal — Word-by-Word Headline Animation

```typescript
// src/components/animations/TextReveal.tsx
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useMotionSafe } from '@/hooks/useMotionSafe'

interface TextRevealProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  staggerDelay?: number
}

export function TextReveal({
  text,
  className,
  as: Tag = 'p',
  staggerDelay = 0.08,
}: TextRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const shouldAnimate = useMotionSafe()
  const words = text.split(' ')

  if (!shouldAnimate) {
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: i * staggerDelay,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
```

---

## Pinned Scroll Section — Services Reveal

Three service pillars revealed as user scrolls through a pinned section:

```typescript
// src/components/sections/Services.tsx (partial)
'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useMotionSafe } from '@/hooks/useMotionSafe'

export function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const shouldAnimate = useMotionSafe()

  useEffect(() => {
    if (!shouldAnimate || !sectionRef.current) return

    const cards = gsap.utils.toArray<HTMLElement>('.service-card')

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${cards.length * 100}%`,
        pin: true,
        scrub: 1,
      })

      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `${i * 33}% top`,
              end: `${(i + 1) * 33}% top`,
              scrub: true,
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert() // cleans up all ScrollTriggers in this context
  }, [shouldAnimate])

  return <div ref={sectionRef}>...</div>
}
```

---

## Hover States

```typescript
// Card hover — subtle lift
const cardVariants = {
  rest:  { scale: 1,    y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.3, ease: 'easeOut' } },
}

// Image hover — slow zoom (CSS is better for this)
// className="overflow-hidden"
// img className="transition-transform duration-[600ms] ease-luxury group-hover:scale-105"

// Link underline — draws from left
// className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-orange after:transition-[width] after:duration-300 after:ease-luxury hover:after:w-full"
```

---

## Navbar Scroll Behaviour

```typescript
// Background transitions from transparent to bone on scroll
useEffect(() => {
  if (!shouldAnimate) return

  const ctx = gsap.context(() => {
    ScrollTrigger.create({
      start: 'top -80px',
      end: 99999,
      toggleClass: { targets: '.navbar', className: 'scrolled' },
    })
  })

  return () => ctx.revert()
}, [shouldAnimate])

// CSS:
// .navbar { background: transparent; transition: background 400ms ease-luxury; }
// .navbar.scrolled { background: #E7DECC; border-bottom: 1px solid rgba(66,41,34,0.1); }
```

---

## Number Counter Animation

```typescript
// src/components/animations/CountUp.tsx
'use client'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'

export function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)

  useEffect(() => {
    if (isInView) {
      animate(count, to, { duration: 1.5, ease: 'easeOut' })
    }
  }, [isInView, count, to])

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  )
}
```

---

## Timing Reference

| Animation | Duration | Easing |
|---|---|---|
| Page transition enter | 600ms | [0.25, 0.1, 0.25, 1] |
| Page transition exit | 200ms | ease-in |
| Page loader slide | 800ms | [0.76, 0, 0.24, 1] |
| Section fade-in | 800ms | [0.25, 0.1, 0.25, 1] |
| Word reveal stagger | 70ms per word | [0.25, 0.1, 0.25, 1] |
| Card hover | 300ms | ease-out |
| Image hover zoom | 600ms | [0.25, 0.1, 0.25, 1] |
| Link underline draw | 300ms | [0.25, 0.1, 0.25, 1] |
| Navbar bg transition | 400ms | [0.25, 0.1, 0.25, 1] |
| Smooth scroll | 1200ms | Lenis custom |
| Parallax | scrub | GSAP linear scrub |
| Count up | 1500ms | ease-out |

---

## Reduced Motion — Non-Negotiable

```typescript
// Every component that animates must use useMotionSafe()
const shouldAnimate = useMotionSafe()

// GSAP: always check before setting up
if (!shouldAnimate) return

// Framer Motion: use 'false' as initial to skip animation entirely  
initial={shouldAnimate ? { opacity: 0, y: 32 } : false}

// CSS: always include this in globals.css
// @media (prefers-reduced-motion: reduce) {
//   *, *::before, *::after {
//     animation-duration: 0.01ms !important;
//     transition-duration: 0.01ms !important;
//   }
// }
```

---

## Performance Rules

- Only animate `transform` and `opacity` — never width, height, top, left, margin, padding
- Use `will-change: transform` only on actively animating hero elements — remove after animation
- Always use `gsap.context()` and call `ctx.revert()` on unmount — cleans all ScrollTriggers
- Lenis: always call `lenis.destroy()` and remove RAF callback on unmount
- Test on mid-range Android at 60fps — use Chrome DevTools throttling (4x CPU slowdown)
- Maximum 3 elements animating simultaneously in any viewport
- No animations on initial page load above the fold — content must appear instantly
