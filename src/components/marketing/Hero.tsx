'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { SplitWords } from '@/components/motion/SplitWords'
import { Button } from '@/components/primitives/Button'
import { ScriptAccent } from '@/components/primitives/ScriptAccent'
import Link from 'next/link'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} className="relative flex min-h-svh items-end overflow-hidden bg-brown pb-[clamp(4rem,8vw,8rem)]">
      <motion.div
        className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-center"
        style={{ y }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brown/80 via-brown/20 to-transparent" />

      <motion.div style={{ opacity }} className="relative z-10 w-full">
        <Container>
          <Eyebrow className="text-bone/60 mb-6">
            Longevity · Tbilisi, Georgia
          </Eyebrow>

          <h1 className="font-sans font-thin text-bone mb-8 max-w-4xl">
            <SplitWords
              text="Live longer."
              className="block text-[clamp(4.5rem,12vw,9rem)] leading-[1.0] tracking-[-0.03em]"
            />
            <SplitWords
              text="Live better."
              delay={0.15}
              className="block text-[clamp(4.5rem,12vw,9rem)] leading-[1.0] tracking-[-0.03em]"
            />
            <span className="block mt-3">
              <ScriptAccent className="text-[clamp(3rem,7vw,6rem)]">
                Live well.
              </ScriptAccent>
            </span>
          </h1>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Button as={Link} href="#contact" size="lg" variant="primary">
              Book Consultation
            </Button>
            <Button as={Link} href="#programmes" size="lg" variant="outline"
              className="border-bone/40 text-bone hover:bg-bone hover:text-brown">
              Explore Programmes
            </Button>
          </motion.div>
        </Container>
      </motion.div>
    </section>
  )
}
