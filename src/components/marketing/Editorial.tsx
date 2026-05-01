'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { FadeIn } from '@/components/motion/FadeIn'

export function Editorial() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section
      ref={ref}
      id="science"
      className="bg-brown py-[clamp(5rem,12vw,12rem)] overflow-hidden"
    >
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24 items-center">
          <FadeIn className="order-2 lg:order-1">
            <Eyebrow className="text-bone/40 mb-6">The Science</Eyebrow>
            <Heading as="h2" className="text-bone mb-8">
              Ageing is a process — and processes can be optimised.
            </Heading>
            <Body size="lg" className="text-bone/70 mb-6">
              Our medical team translates cutting-edge longevity research — from hallmarks of ageing to epigenetic clocks — into practical, evidence-backed protocols for each patient.
            </Body>
            <Body className="text-bone/60">
              We partner with leading research institutions and continuously update our protocols as the science evolves. Because the goal is not to add years to life, but life to years.
            </Body>
          </FadeIn>

          <div className="order-1 lg:order-2 relative h-[500px] lg:h-[640px] overflow-hidden rounded-sm">
            <motion.div
              className="absolute inset-0 bg-[url('/images/science.jpg')] bg-cover bg-center"
              style={{ y: imageY, scale: 1.15 }}
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
