'use client'

import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { FadeIn } from '@/components/motion/FadeIn'

const pillars = [
  {
    number: '01',
    title: 'Precision Diagnostics',
    body: 'Comprehensive biomarker profiling, genomic analysis, and advanced imaging to map your unique biology.',
  },
  {
    number: '02',
    title: 'Personalised Protocols',
    body: 'Evidence-based interventions tailored to your biology — nutrition, movement, recovery, and supplementation.',
  },
  {
    number: '03',
    title: 'Ongoing Optimisation',
    body: 'Continuous tracking and adjustment by our multidisciplinary longevity physicians.',
  },
  {
    number: '04',
    title: 'Mind & Resilience',
    body: 'Cognitive enhancement, stress physiology, and sleep architecture — the often-overlooked pillars of longevity.',
  },
]

export function Pillars() {
  return (
    <section
      id="about"
      className="bg-bone py-[clamp(5rem,12vw,12rem)]"
    >
      <Container>
        <FadeIn>
          <Eyebrow className="mb-4">Our Approach</Eyebrow>
          <Heading as="h2" className="mb-6 max-w-2xl">
            The four pillars of lasting vitality
          </Heading>
          <Body size="lg" className="max-w-xl mb-20 text-brown/70">
            We combine frontier science with deeply personalised care — because longevity is not a programme, it is a practice.
          </Body>
        </FadeIn>

        <div className="grid grid-cols-1 gap-px bg-brown/10 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ number, title, body }, i) => (
            <FadeIn key={number} delay={i * 0.1}>
              <div className="bg-bone p-10 h-full">
                <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-orange/60 mb-6">
                  {number}
                </p>
                <Heading as="h3" className="text-[1.25rem]! mb-4">
                  {title}
                </Heading>
                <Body className="text-brown/70">{body}</Body>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}
