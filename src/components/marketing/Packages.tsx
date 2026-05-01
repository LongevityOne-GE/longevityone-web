'use client'

import Link from 'next/link'
import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { FadeIn } from '@/components/motion/FadeIn'
import { formatGEL } from '@/lib/utils'

const packages = [
  {
    name: 'Foundation',
    tagline: 'Your longevity baseline',
    price: 3500,
    features: [
      'Full biomarker panel (80+ markers)',
      'Genomic risk assessment',
      'Body composition analysis',
      '60-min physician consultation',
      'Personalised 3-month protocol',
    ],
    featured: false,
  },
  {
    name: 'Optimum',
    tagline: 'Comprehensive longevity programme',
    price: 9800,
    features: [
      'Everything in Foundation',
      'Advanced epigenetic age test',
      'Cognitive performance testing',
      'Sleep architecture analysis',
      '6-month physician partnership',
      'Quarterly reassessment',
    ],
    featured: true,
  },
  {
    name: 'Apex',
    tagline: 'The complete longevity experience',
    price: null,
    features: [
      'Everything in Optimum',
      'Annual full-programme access',
      'Dedicated longevity physician',
      'Priority access to new protocols',
      'International partner network',
      'Concierge wellness coordination',
    ],
    featured: false,
  },
]

export function Packages() {
  return (
    <section
      id="programmes"
      className="bg-bone py-[clamp(5rem,12vw,12rem)]"
    >
      <Container>
        <FadeIn className="text-center mb-20">
          <Eyebrow className="mb-4">Programmes</Eyebrow>
          <Heading as="h2" className="mb-4">
            Choose your path to longevity
          </Heading>
          <Body size="lg" className="text-brown/70 max-w-xl mx-auto">
            Each programme is a starting point. We customise everything based on your biology.
          </Body>
        </FadeIn>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {packages.map(({ name, tagline, price, features, featured }, i) => (
            <FadeIn key={name} delay={i * 0.1}>
              <div
                className={`h-full flex flex-col p-10 border transition-shadow duration-300 hover:shadow-lg ${
                  featured
                    ? 'bg-brown text-bone border-brown'
                    : 'bg-bone text-brown border-brown/15'
                }`}
              >
                <div className="mb-8">
                  <p
                    className={`font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] mb-2 ${
                      featured ? 'text-orange' : 'text-orange/70'
                    }`}
                  >
                    {tagline}
                  </p>
                  <Heading as="h3" className={`text-[1.75rem]! mb-4 ${featured ? 'text-bone' : ''}`}>
                    {name}
                  </Heading>
                  <p className={`font-sans text-[1.5rem] font-light ${featured ? 'text-bone/80' : 'text-brown/70'}`}>
                    {price ? formatGEL(price) : 'Bespoke'}
                  </p>
                </div>

                <ul className="space-y-3 mb-10 flex-1">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-start gap-3 text-[0.875rem] leading-[1.6] ${
                        featured ? 'text-bone/80' : 'text-brown/70'
                      }`}
                    >
                      <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${featured ? 'bg-orange' : 'bg-orange'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  as={Link}
                  href="#contact"
                  variant={featured ? 'primary' : 'outline'}
                  className={featured ? 'bg-bone text-brown hover:bg-bone/90' : ''}
                >
                  Get Started
                </Button>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}
